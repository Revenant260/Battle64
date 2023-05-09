const socket = io();

const logins = document.getElementById("myForm");
const input = document.getElementById("msgs")
const messages = document.getElementById("msgss");
const myButton = document.getElementById("myButton");

socket.on("gate", data => {
    sessionStorage.setItem("User", data)
})

myButton.addEventListener("click", (e) => {
    e.preventDefault()
    var use = sessionStorage.getItem("User")
    var bridge = {}
    bridge.use = use
    bridge.msg = input.value
    socket.emit("chatmsg", bridge)
    input.value = "";
    return
});

socket.on("msg", data => {
    const li = document.createElement("li");
    li.innerHTML = data;
    messages.appendChild(li);
    messages.lastChild.scrollIntoView({ behavior: 'smooth' })
})

socket.on("chatf", data => {
    if (data === null) return
    messages.innerHTML = ""
    data.forEach(ele => {
        const li = document.createElement("li");
        li.innerHTML = ele.toString();
        messages.appendChild(li);
    });
})
socket.on("chats", data => {
    if (data === null) return
    var index = 0
    const lis = document.createElement("li")
    data.forEach(ele => {
        index += 1
        messages.appendChild(lis);
        setTimeout(() => {
            lis.innerHTML = ""
            lis.innerHTML = ele.toString()
            messages.lastChild.scrollIntoView({ behavior: 'smooth' })
        }, index * 1000)
    });
})

socket.on('connect', data => {
    var tmp = sessionStorage.getItem("User")
    socket.emit("session", tmp)
})