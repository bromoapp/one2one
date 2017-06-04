# One2one

This is a simple **WebRTC** project, where you can publish a webcam video in one browser (caller) to another (callee).
This project is following [this](https://hashrocket.com/blog/posts/implementing-video-chat-in-a-phoenix-application-with-webrtc) article. It's a good article, but you are required to deploy your app to a separate server, then access it from 2 different laptop or PCs. And since I'm very new to **WebRTC**, I create this, so I can understand:

  * The flow of data when one browser calls another browser through our Phoenix server,
  * What functions need to be written in javascript in order one browser calls and broadcasts a video to another browser,
  * What functions need to be written in javascript in order one browser could accepts call and streams from other browser.

To start this Phoenix app:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `npm install`
  * Start Phoenix endpoint with `mix phoenix.server`

How to play:

  * Visit [`localhost:4000`](http://localhost:4000) from 2 browser instances. 
  * In **1st browser** click **"Goto Caller Page"**, and 
  * On the **2nd browser** click **"Goto Callee Page"**,
  * On **Caller Page**, click on **Connect** then **Call**, now you can see the video of your cam also appears in **Callee Page**.

<img src="https://cloud.githubusercontent.com/assets/21073705/26759236/d33f9a76-4922-11e7-93da-83a82d23d2d1.PNG" width="15%"></img> 
