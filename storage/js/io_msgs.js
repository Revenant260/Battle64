const { Socket } = require("socket.io");
var db = require('./db')
let Socks = Socket
module.exports.io_msg = function io_msg(socket = Socks) {
    socket.on("user_join", function(data) {
        socket.broadcast.emit("user_join", data);
    });

    socket.on("chat_message", function(data) {
        socket.broadcast.emit("chat_message", data);
    });

    socket.on("disconnect", function(data) {
        socket.broadcast.emit("user_leave", data);
    });
}