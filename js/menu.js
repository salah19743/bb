var menu = document.querySelector(".menu");
var menuButton = document.querySelector(".menuButton");
var menuClose = document.querySelector(".menuClose");
var menuCover = document.querySelector(".menuCover");
var menuLinks = document.querySelectorAll(".links > ul > a");
var usersOnline = document.querySelector(".usersOnline");
var socket = io();

socket.on("users", (users) => {
    usersOnline.innerHTML = users + " Online";
});

for (var menuLinkI = 0; menuLinkI < menuLinks.length; menuLinkI++) {
    var menuLink = document.querySelectorAll(".links > ul > a")[menuLinkI];
    if (menuLink.href == location.href) {
        menuLink.classList.add("active");
        document.title += " - "+menuLink.innerText;
    }
}

menuButton.addEventListener("click", function() {
    menu.style.animationName = "menuOpen";
    menuCover.style.display = "";
});

menuClose.addEventListener("click", function() {
    menu.style.animationName = "menuClose";
    menuCover.style.display = "none";
});

menuCover.addEventListener("click", function() {
    menu.style.animationName = "menuClose";
    this.style.display = "none";
});