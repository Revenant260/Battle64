const socket = io();

const logins = document.getElementById("myForm");
const input = document.getElementById("msgs")
const messages = document.getElementById("msgss");
const dms = document.querySelector(".chathistory");
const myButton = document.getElementById("myButton");

myButton.addEventListener("click", (e) => {
    e.preventDefault()
    socket.emit("chatmsg", input.value)
    input.value = "";
    return
});

socket.on("msg", data => {
    const li = document.createElement("li");
    li.innerHTML = data;
    messages.appendChild(li);
    messages.lastChild.scrollIntoView({ behavior: 'smooth', block: 'end'})
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
    socket.emit("session")
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