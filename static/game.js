var socket = io();
socket.emit('new player');
var canvas = document.getElementById('canvas');

var client = {};
var framesToSkip = 60,
    counter = 0;
var movement = {
    up: false,
    down: false,
    left: false,
    right: false,
}
var clientMovement = {
    x: 0,
    y: 0,
    r: 30,
    name: "Unnamed"
}
var reqAnimFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;

canvas.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = true;
            break;
        case 87: // W
            movement.up = true;
            break;
        case 68: // D
            movement.right = true;
            break;
        case 83: // S
            movement.down = true;
            break;
    }
});
canvas.addEventListener('keyup', function (event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = false;
            break;
        case 87: // W
            movement.up = false;
            break;
        case 68: // D
            movement.right = false;
            break;
        case 83: // S
            movement.down = false;
            break;
    }
});

canvas.setAttribute('tabindex', '0');
canvas.focus();

function drawClient() {

    context.fillStyle = 'green';
    context.strokeStyle = '#003300'
    context.lineWidth = 4;
    context.textAlign = 'center';
    context.fillText(clientMovement.name, clientMovement.x, clientMovement.y - 50);
    context.beginPath();
    context.arc(clientMovement.x, clientMovement.y, clientMovement.r, 0, 2 * Math.PI, false);
    context.fillStyle = 'darkgreen';

    if (counter < framesToSkip) {
        counter++;
        requestAnimationFrame(drawClient);
        return;
    }


    console.log(counter);


    counter = 0;
    reqAnimFrame(drawClient);
}

setInterval(function () {
    context.clearRect(0, 0, 1920, 1080);
    context.fill();
    context.stroke();
}, 1000 / 60);

setInterval(function () {
    socket.emit('movement', movement);

    if (movement.left) {
        clientMovement.x -= 5;
    }
    if (movement.up) {
        clientMovement.y -= 5;
    }
    if (movement.right) {
        clientMovement.x += 5;
    }
    if (movement.down) {
        clientMovement.y += 5;
    }
}, 1000 / 40);

function sendChat() {
    return false; //prevent page reload
}

function setName() {
    var name = document.getElementById('username').value;
    socket.emit('username', name);
    canvas.focus();
    return false; //prevent page reload
}


canvas.width = 1920;
canvas.height = 1080;
var context = canvas.getContext('2d', {
    alpha: false
});

socket.on('state', function (players) {
    for(var id in players) {
        if(id === socket.id) {
            client = players[id];
        } else{
            var player = players[id];
            context.fillStyle = 'limegreen';
            context.strokeStyle = '#003300';
            context.lineWidth = 4;
            context.beginPath();
            context.textAlign = 'center';
            context.fillText(player.name, player.x, player.y - 50);
            context.arc(player.x, player.y, player.r, 0, 2 * Math.PI, false);
            context.fillStyle = 'darkgreen';
        }
    }
    clientMovement.x = client.x;
    clientMovement.y = client.y;
    clientMovement.r = client.r;
});

drawClient();