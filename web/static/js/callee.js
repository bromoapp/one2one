let channel, remoteVideo, peerConnection, remoteStream

let servers = {
    "iceServers" : [
        {url: "stun:stun.l.google.com:19302"}
    ]
}

let callee = {
    init(socket, element) {
        if (!element) {
            return
        } else {
            this.init_conn(socket)
            this.init_ui()
        }
    },
    init_conn(socket) {
        let user = {user: "callee"}
        socket.connect(user)
        channel = socket.channel("room")
        channel.on("message", payload => {
            let origin = payload.origin
            if (origin != "callee") {
                let message = JSON.parse(payload.body)
                if (message.sdp) {
                    let type = message.sdp.type
                    if (type == "offer") {
                        console.log(">>> RECEIVED OFFER: ", message.sdp)
                        peerConnection = new RTCPeerConnection(servers)
                        peerConnection.onaddstream = callee.onRemoteStream
                        callee.onRemoteDescription(message.sdp)
                    }
                } else {
                    console.log(">>> RECEIVED CANDIDATE: ", message)
                    callee.onRemoteCandidate(message)
                }
            }
        })
        channel.join()
            .receive("ok", () => { console.log("Successfully joined channel") })
            .receive("error", () => { console.log("Unable to join") })
    },
    init_ui() {
        remoteVideo = document.getElementById("remoteVideo")
    },
    onRemoteDescription(desc) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(desc))
        peerConnection.createAnswer(callee.getLocalDescription, callee.onError)
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
    onRemoteStream(event) {
        console.log(">>> REMOTE STREAM RECEIVED...")
        remoteStream = event.stream
        remoteVideo.srcObject = remoteStream
    },
    getLocalDescription(desc) {
        peerConnection.setLocalDescription(desc, () => {
        channel.push("message", { body: JSON.stringify({
                "sdp": peerConnection.localDescription
            })});
        }, callee.onError);
    },
    onError(error) {
        console.log(">>> ERROR ", error)
    }
}
export default callee