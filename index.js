const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('http');

const app = express();
const http = createServer(app);
const io = new Server(http);
const port = process.env.PORT || 3000;
const path = require('path');
const db = require('./storage/js/db')
const pot = require('./storage/vars/index.json')

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

app.get("/login", function(req, res) {
    res.sendFile(__dirname + "/public/html/login.html");
});

io.on("connection", (socket) => {
    socket.on('chatmsg', function(data) {
        if (!data) return
        var rte = db.msgs(pot.loactions_db.user_loc, data, socket.handshake.address.split("f:")[1])
        if (!rte.msg) return socket.emit("msg", rte)
        socket.emit("msg", rte.msg)
    })

    socket.on('login', function(data) {
        db.login(pot.loactions_db.user_loc, data, socket.handshake.address.split("f:")[1])
    });
    socket.on("session", function(data) {
        var rte = db.session(pot.loactions_db.user_loc, data, socket.handshake.address.split("f:")[1])
        if (!rte.msg) return socket.emit("msg", rte)
        socket.leaveAll()
        socket.join(rte.room)
        socket.emit("chatf", rte.log)
        io.to(rte.room).emit("msg", rte.msg)
    })
})
http.listen(port, function() {
    console.log("Listening on *:" + port);
}); 
//pm2 start index.js -i 2 --watch --max-memory-restart 250M
// pm2 restart id --name newName