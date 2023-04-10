const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('http');

const app = express();
const http = createServer(app);
const io = new Server(http);
const port = process.env.PORT || 3001;
const path = require('path');
app.use('/', express.static(path.join(__dirname, 'public')))


app.get("/home", function(req, res) {
    res.sendFile(__dirname + "/public/html/index.html");
});

io.on("connection", function(socket) {

    socket.on("user_join", function(data) {
        this.username = data;
        socket.broadcast.emit("user_join", data);
    });

    socket.on("chat_message", function(data) {
        data.username = this.username;
        socket.broadcast.emit("chat_message", data);
    });

    socket.on("disconnect", function(data) {
        socket.broadcast.emit("user_leave", this.username);
    });
});

http.listen(port, function() {
    console.log("Listening on *:" + port);
}); 