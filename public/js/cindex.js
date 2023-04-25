const socket = io();

const logins = document.getElementById("myForm");
const input = document.getElementById("msgs")
const messages = document.getElementById("msgss");
const dms = document.querySelector(".chathistory");
const myButton = document.getElementById("myButton");

myButton.addEventListener("click", (e) => {
    e.preventDefault()
    var use = sessionStorage.getItem("User")
    var bridge = {}
    bridge.use = use
    bridge.msg = input.value
    if (input.value.charAt(0) !== "@") socket.emit("chatmsg", bridge)
    if (input.value.charAt(0) === "@") socket.emit("cmd", bridge)
    input.value = "";
    return
});

socket.on("gate", data => {
    sessionStorage.setItem("User", data)
    window.location.href = "/home"
})

socket.on("msg", data => {
    const li = document.createElement("li");
    li.innerHTML = data;
    messages.appendChild(li);
    messages.lastChild.scrollIntoView({ behavior: 'smooth'})
})

socket.on("chatf", data => {
    messages.innerHTML = ""
    data.forEach(ele => {
        const li = document.createElement("li");
        li.innerHTML = ele.toString();
        messages.appendChild(li);
    });
})

socket.on('connect', data => {
    var tmp = sessionStorage.getItem("User")
    socket.emit("session", tmp)
})

function openNav() {
    const li = document.createElement("li");
    li.innerHTML = "Open";
    dms.appendChild(li);
    document.getElementById("mySidebar").style.width = "25%";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0%";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}