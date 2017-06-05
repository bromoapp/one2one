let channel, localVideo, btnConnect, btnCall, btnHangup
let localStream, peerConnection

let servers = {
    "iceServers" : [
        {url: "stun:stun.l.google.com:19302"}
    ]
}

let caller = {
    init(socket, element) {
        if (!element) {
            return
        } else {
            this.init_conn(socket)
            this.init_ui()
        }
    },
    init_conn(socket) {
        let user = {user: "caller"}
        socket.connect(user)
        channel = socket.channel("room")
        channel.on("message", payload => {
            let origin = payload.origin
            if (origin == "callee") {
                let message = JSON.parse(payload.body)
                if (message.sdp) {
                    let type = message.sdp.type
                    if (type == "answer") {
                        console.log(">>> RECEIVED ANSWER...")
                        caller.setLocalDescription(message.sdp)
                    }
                } else {
                    console.log(message)
                    caller.onRemoteCandidate(message)
                }
            }
        })
        channel.join()
            .receive("ok", () => { console.log("Successfully joined channel") })
            .receive("error", () => { console.log("Unable to join") })
    },
    init_ui() {
        btnConnect = document.getElementById("connect")
        btnConnect.onclick = this.connect

        btnCall = document.getElementById("call")
        btnCall.onclick = this.call
        btnCall.disabled = true
        
        btnHangup = document.getElementById("hangup")
        btnHangup.onclick = this.hangup
        btnHangup.disabled = true
        
        localVideo = document.getElementById("localVideo")
    },
    connect() {
        navigator.getUserMedia = (navigator.getUserMedia 
            || navigator.webkitGetUserMedia || navigator.mozGetUserMedia 
            || navigator.msGetUserMedia || navigator.oGetUserMedia)
        navigator.getUserMedia({video: true}, caller.onSucceed, caller.onError)
    },
    call() {
        peerConnection.createOffer(caller.getLocalDescription, caller.onError)
    },
    hangup() {
        peerConnection.close()
        localVideo.src = null
        peerConnection = null
        btnHangup.disabled = true
        btnConnect.disabled = false
        btnCall.disabled = true
    },
    onSucceed(stream) {
        localVideo.srcObject = stream
        localStream = stream
        caller.setupPeerConnection()
    },
    onError(error) {
        console.log(">>> ERROR ", error)
    },
    setupPeerConnection() {
        btnConnect.disabled = true
        btnCall.disabled = false
        btnHangup.disabled = false

        peerConnection = new RTCPeerConnection(servers)
        peerConnection.onicecandidate = caller.getLocalIceCandidate
        peerConnection.addStream(localStream)
    },
    getLocalIceCandidate(event) {
        if (event.candidate) {
            channel.push("message", {body: JSON.stringify({
                "candidate": event.candidate
            })});
        }
    },
    getLocalDescription(desc) {
        peerConnection.setLocalDescription(desc, () => {
        channel.push("message", { body: JSON.stringify({
                "sdp": peerConnection.localDescription
            })});
        }, caller.onError);
    },
    setLocalDescription(desc) {
        console.log(">>> RECEIVED ANSWER...")
        peerConnection.setRemoteDescription(new RTCSessionDescription(desc))
    },
    onRemoteCandidate(event) {
        if (event.candidate) {
            try {
                peerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
            } catch (err) {
                console.log(">>> ERR: ", err)
            }
        }
    },
}
export default caller