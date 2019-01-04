/* eslint-disable no-console */
// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var port = 5000;

app.set('port', port);
app.use('/static', express.static(__dirname + '/static'));

server.on('connection', function(sock) {
    //console.log('Client connected from: ' + sock.remoteAddress);
});

// Routing
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, function () {
    console.log('Starting server on port ' + port);
});

var players = {};
io.on('connection', function (socket) {
    console.log('New connection from ' + socket.request.connection.remoteAddress);
    socket.on('new player', function () {
        players[socket.id] = {
            x: 50,
            y: 50,
            r: 30,
            name: "Unnamed"
        };
    });

    socket.on("disconnect", function () {
        delete players[socket.id];
    });

    socket.on('movement', function (data) {
        var player = players[socket.id] || {};
        if(data.left) {
            player.x -= 10;
        }
        if(data.up) {
            player.y -= 10;
        }
        if(data.right) {
            player.x += 10;
        }
        if(data.down) {
            player.y += 10;
        }
    });

    socket.on('username', function (data) {
        var player = players[socket.id] || {};
        player.name = data;
    });

    setInterval(function () {
        io.sockets.emit('state', players);
    }, 1000 / 60);
});