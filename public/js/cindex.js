const form = document.querySelector("form");
const input = document.querySelector(".input");
const messages = document.querySelector(".messages");
const username = prompt("Please enter a nickname: ", "");
const socket = io();

form.addEventListener("submit", function(event) {
    event.preventDefault();
    addMessage(username + ": " + input.value);
    input.value = "";
    messages.lastChild.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    return false;
}, false);

socket.on("chat_message", function(data) {
    addMessage(data.username + ": " + data.message);
});

socket.on("user_join", function(data) {
    addMessage(data + " just joined the chat!");
});

socket.on("user_leave", function(data) {
    addMessage(data + " has left the chat.");
});

addMessage("You have joined the chat as '" + username  + "'.");
socket.emit("user_join", username);

function addMessage(message) {
    const li = document.createElement("li");
    li.innerHTML = message;
    messages.appendChild(li);
    const msgs = document.querySelector('.msgs');
} 