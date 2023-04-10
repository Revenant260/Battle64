const { Socket } = require("socket.io");
var db = require('./db')
let Socks = Socket
module.exports.io_msg = function io_msg(socket = Socks) {
    socket.on("user_join", function(data) {
        this.username = data;
        socket.broadcast.emit("user_join", data);
        var tmp = db.conn(socket.handshake.address, data)
        console.log(tmp)
    });

    socket.on("chat_message", function(data) {
        data.username = this.username;
        socket.broadcast.emit("chat_message", data);
    });

    socket.on("disconnect", function(data) {
        socket.broadcast.emit("user_leave", this.username);
    });
}