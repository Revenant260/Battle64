const { Socket } = require("socket.io");
const pot = require('../vars/index.json')
var db = require('./db')
let Socks = Socket
module.exports.io_msg = function io_msg(socket = Socks) {
    socket.on("user_join", function(data) {
        socket.broadcast.emit("user__join", data);
    });

    socket.on("chat_message", function(data) {
        socket.broadcast.emit("chat_message", data);
    });

    socket.on("disconnect", function(data) {
        socket.broadcast.emit("user_leave", data);
    });

    socket.on('login', function(data,) {
        db.login(pot.loactions_db.user_loc, data, socket.handshake.address)
    })
}