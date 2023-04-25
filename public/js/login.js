const socket = io();

socket.on("gate", data => {
    sessionStorage.setItem("User", data)
    window.location.href = "/home"
})

function login() {
    const username = document.getElementsByName("usern")[0].value
    const password = document.getElementsByName("psw")[0].value
    const users = {"user": username, "pass": password}
    socket.emit("login", users);
}