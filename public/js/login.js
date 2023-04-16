const socket = io();



function login() {
    const username = document.getElementsByName("usern")[0].value
    const password = document.getElementsByName("psw")[0].value
    const users = {"user": username, "pass": password}
    socket.emit("login", users);
    window.location.href = "/home"
}