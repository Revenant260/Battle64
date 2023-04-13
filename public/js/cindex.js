const form = document.querySelector("form");
const input = document.getElementById("msgs")
const messages = document.querySelector(".messages");
const dms = document.querySelector(".chathistory");
const socket = io();
const myButton = document.getElementById("myButton");
document.getElementById("myForm").style.display = "grid";
input.setAttribute("disabled", "")

myButton.addEventListener("click",  (e) => {
    e.preventDefault()
    addMessage(input.value);
    input.value = "";
    messages.lastChild.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    return
});

socket.on("chat_message", function (data) {
    addMessage( data.message);
});

socket.on("user_join", function (data) {
    addMessage(data + " just joined the chat!");
});

socket.on("user_leave", function (data) {
    addMessage(data + " has left the chat.");
});
socket.emit("user_join");

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