var newChat = document.querySelector(".newChat");
var send = document.querySelector(".send");
var input = document.querySelector(".input");
var chat = document.querySelector(".chat");
var start = document.querySelector(".start");
var startChat = document.querySelector(".startChat");
var container = document.querySelector(".container");

function appendChat(type, content) {
    switch(type) {

        case "ownMsg":
            var element = document.createElement("div");
            element.classList.add("ownMsg");
            element.innerHTML = `
            <p class="ownMsgSender">You:&nbsp;</p>
            <p class="msgContent"></p>
            `;
            element.querySelector(".msgContent").innerText = content;
            chat.appendChild(element);
            input.value = "";
            chat.scrollTo(0, chat.scrollHeight);
            break;

        case "strangerMsg":
            var element = document.createElement("div");
            element.classList.add("strangerMsg");
            element.innerHTML = `
            <p class="strangerMsgSender">Stranger:&nbsp;</p>
            <p class="msgContent"></p>
            `;
            element.querySelector(".msgContent").innerText = content;
            chat.appendChild(element);
            chat.scrollTo(0, chat.scrollHeight);
            break;

        case "finding":
            chat.innerHTML = "";
            chat.innerHTML += "<b class='infoMsg'>Finding a stranger...</b>";
            input.value = "";
            input.disabled = true;
            send.disabled = true;
            break;

        case "disconnected":
            chat.innerHTML += "<b class='infoMsg'>Stranger left.</b>";
            input.disabled = true;
            send.disabled = true;
            input.value = "";
            chat.scrollTo(0, chat.scrollHeight);
            break;

        case "paired":
            chat.innerHTML = "";
            chat.innerHTML += "<b class='infoMsg'>You are now chatting with a stranger.</b>";
            input.disabled = false;
            send.disabled = false;
            chat.scrollTo(0, chat.scrollHeight);
            break;
    }
}

startChat.addEventListener("click", function() {
    start.style.display = "none";
    container.style.display = "";
    newChat.click();
});

newChat.addEventListener("click", function() {
    socket.emit("newChat");
    appendChat("finding");
});

socket.on("newMsg", (msg) => {
    appendChat("strangerMsg", msg);
});

socket.on("paired", () => {
    appendChat("paired");
});

socket.on("disconnected", () => {
    appendChat("disconnected");
});

send.addEventListener("click", function() {
    if (input.value != "") {
        socket.emit("sendMsg", input.value);
        appendChat("ownMsg", input.value);
    }
});

input.addEventListener("keydown", function(e) {
    if (e.keyCode == 13) {
        send.click();
    }
});