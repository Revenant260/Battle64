const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('http');

const app = express();
const http = createServer(app);
const io = new Server(http);
const port = process.env.PORT || 3000;
const path = require('path');
const io_msg = require('./storage/js/io_msgs.js').io_msg
app.use('/', express.static(path.join(__dirname, 'public')))

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/html/layout.html");
});

app.get("/home", function(req, res) {
    res.sendFile(__dirname + "/public/html/layout.html");
});

app.get("/news", function(req, res) {
    res.sendFile(__dirname + "/public/html/news.html");
});

app.get("/about", function(req, res) {
    res.sendFile(__dirname + "/public/html/about.html");
});

app.get("/dev", function(req, res) {
    res.sendFile(__dirname + "/public/html/index.html");
});

io.on("connection", (socket => io_msg(socket)));

http.listen(port, function() {
    console.log("Listening on *:" + port);
}); 