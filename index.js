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
const maxMessageLength = 200;
const MAX_MESSAGES_PER_SECOND = 15;
const messageCountMap = new Map();

app.use('/', express.static(path.join(__dirname, 'public')))

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/html/layout.html");
});

app.get("/home", function (req, res) {
    res.sendFile(__dirname + "/public/html/layout.html");
});

app.get("/news", function (req, res) {
    res.sendFile(__dirname + "/public/html/news.html");
});

app.get("/about", function (req, res) {
    res.sendFile(__dirname + "/public/html/about.html");
});

app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/public/html/login.html");
});

io.on("connection", (socket) => {
    socket.on('chatmsg', function (data) {
        if (!data) return
        if (!spamFilter(data)) return socket.emit("msg", `admin@system: Max 200 characters`)
        if (isRateLimited(socket.handshake.address.split("f:")[1])) return socket.emit("msg", `admin@system: Please slow down`)
        if (!data.msg) return
        var rte = db.msgs(data, socket.handshake.address.split("f:")[1])
        if (rte === "Fail") return
        io.to(rte.room).emit("msg", rte.msg)
        if (rte.trk) {
            socket.emit("msg", rte.trk)
        }
        if (rte.cmd) {
            if (Array.isArray(rte.cmd)) return socket.emit("chats", rte.cmd)
            socket.emit("msg", rte.cmd)
        }
    })

    socket.on('login', function (data) {
        var rte = db.login(data, socket.handshake.address.split("f:")[1])
        if (rte === "Fail") return
        socket.emit("gate", JSON.stringify(rte))
    });

    socket.on('session', function (data) {
        var rte = db.active(data, socket.handshake.address.split("f:")[1])
        if (rte === "Fail") return
        socket.leaveAll()
        socket.join(rte.room)
        socket.emit("chatf", rte.log)
        socket.emit("msg", `Welcome ${rte.user}`)
    });
})

http.listen(port, function () {
    console.log("Listening on *:" + port);
});

function isRateLimited(userId) {
    const messageCountObj = messageCountMap.get(userId) || { count: 0, lastMessageTime: 0 };
    const { count, lastMessageTime } = messageCountObj;
    const now = Date.now();
    if (count >= MAX_MESSAGES_PER_SECOND * (now - lastMessageTime) / 1000) {
        return true;
    }
    messageCountMap.set(userId, { count: count + 1, lastMessageTime: now });
    return false;
}
function spamFilter(message) {
    if (message.length > maxMessageLength) {
        return false;
    }
    return true
}

// pm2 start index.js -i 2 --max-memory-restart 250M --watch
// pm2 restart id --name newName