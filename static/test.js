/* eslint-disable no-console */

// eslint-disable-next-line no-undef
var socket = io(); // connect to server
socket.emit('new player');

// Canvas setup
// eslint-disable-next-line no-undef
var app = new PIXI.Application(1920, 1080, {
    //transparent: true,
    backgroundColor: 0xffffff, //#ffffff
    antialias: true
});

// Container setup
document.getElementById('pixi-canvas-container').appendChild(app.view); // append canvas to container
var myContainer = document.getElementById('pixi-canvas-container');

myContainer.setAttribute('tabindex', '0');
myContainer.focus();

console.log("Container: " + myContainer.offsetWidth + ", " + myContainer.offsetHeight)

var movement = {
    up: false,
    down: false,
    left: false,
    right: false,
}
var serverClient;
var moving = false;

// eslint-disable-next-line no-undef
var graph = new PIXI.Graphics();
app.stage.addChild(graph); // graph

// eslint-disable-next-line no-undef
var others = new PIXI.Graphics();
app.stage.addChild(others); //other players

// eslint-disable-next-line no-undef
var client = new PIXI.Graphics();
app.stage.addChild(client); // serverserverserverClient

client.lineStyle(0);
client.beginFill(0x109900, 1); //#109900
client.drawCircle(myContainer.offsetWidth / 2, myContainer.offsetHeight / 2, 60);
client.endFill();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

window.onresize = function(){ // recenter on window resize
    client.clear();
    client.lineStyle(0);
    client.beginFill(0x109900, 1); //#109900
    client.drawCircle(myContainer.offsetWidth / 2, myContainer.offsetHeight / 2, 60);
    client.endFill();
};

function drawGrid(cl) {
    try {
        if(typeof cl.x == 'undefined'){
            return console.log("Undefined");
        }
    } catch {
        return console.log("Error loading player!")
    }
    var gridSize = 100;    // define the space between each line
    var x = -myContainer.offsetWidth - cl.x;  // x start point of the field
    var y = -myContainer.offsetHeight - cl.y  // y start point of the field
    var width = 3 * myContainer.offsetWidth;
    var height = 3 * myContainer.offsetHeight;

    graph.clear();
    graph.lineStyle(1);
    graph.lineStyle(1, 0xCCC); //#CCC
    for(var i = 0; i * gridSize < height; i++) { // draw the horizontal lines
       graph.moveTo(x, i * gridSize + y);
       graph.lineTo(x + width, i * gridSize + y);
    }
    for(var i = 0; i * gridSize < width; i++) {  // draw the vertical lines
       graph.moveTo(i * gridSize + x,  y);
       graph.lineTo(i * gridSize + x, y + height);
    }
}

function predict(serverClient) {

}

app.ticker.add(function () { // animation loop
    if(moving === true) {
        socket.emit("movement", movement);
        predict(serverClient);
    }
});

myContainer.addEventListener('keydown', function (event) {
    moving = true;
    switch(event.keyCode) {
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
myContainer.addEventListener('keyup', function (event) {
    moving = false;
    switch(event.keyCode) {
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

socket.on('state', function (players) {
    others.clear();
    serverClient = players[socket.id];
    try {
        if(typeof serverClient.x == 'undefined'){
            return console.log("Undefined");
        }
    } catch {
        return console.log("Error loading player!")
    }
    for(var id in players){
        if(id === socket.id)continue;
        var current = players[id];
        others.lineStyle(0);
        others.beginFill(0x1099bb, 1); //#1099bb
        others.drawCircle((current.x - serverClient.x) + myContainer.offsetWidth / 2, (current.y - serverClient.y) + myContainer.offsetHeight / 2, 60);
        others.endFill();
    }
    drawGrid(serverClient);
});
