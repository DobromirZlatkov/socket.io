var express = require('express'),
    app = express(),
    http = require('http'),
    port = process.env.PORT || 4000,
    server = http.createServer(app).listen(port),
    io = require('socket.io').listen(server),
    redis = require('socket.io/node_modules/redis');
    sub = redis.createClient(),
    sub.subscribe('chat');


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection', function (socket) {

    // sub.on('message', function(channel, message){
    //     socket.send(message);
    // });
});
