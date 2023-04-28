const socket = io();

socket.on("gate", data => {
    sessionStorage.setItem("User", data)
    if (data !== null) window.location.href = "/home"
})

function login() {
    const users = {}
    users.user = document.getElementsByName("usern")[0].value
    users.pass = document.getElementsByName("psw")[0].value
    socket.emit("login", users);
}