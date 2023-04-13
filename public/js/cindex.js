const socket = io();

const form = document.querySelector("form");
const input = document.getElementById("msgs")
const messages = document.querySelector(".messages");
const dms = document.querySelector(".chathistory");
const myButton = document.getElementById("myButton");

document.getElementById("myForm").style.display = "grid";
input.setAttribute("disabled", "")


myButton.addEventListener("click", (e) => {
    e.preventDefault()
    addMessage(input.value);
    input.value = "";
    messages.lastChild.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    return
});

socket.on("chat_message", function (data) {
    addMessage(data.message);
});

socket.on("user__join", function (data) {
    addMessage(data.user + " just joined the chat!");
});

socket.on("user_leave", function (data) {
    addMessage(data + " has left the chat.");
});

function addMessage(message) {
    const li = document.createElement("li");
    li.innerHTML = message;
    messages.appendChild(li);

}

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

function login() {
    input.removeAttribute('disabled')
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const username = urlParams.get('usern');
    const password = urlParams.get('psw');
    const users = {"user": username, "pass": password}
    socket.emit("login", users);
}