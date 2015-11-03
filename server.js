var express = require('express'),
    app = express(),
    http = require('http'),
    port = process.env.PORT || 4000,
    server = http.createServer(app).listen(port),
    io = require('socket.io').listen(server),
    url = require('url'),
    redisURL = url.parse(process.env.REDISCLOUD_URL),

    redis = require('redis'),
    sub = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});
    sub.subscribe('chat');

//port_arg, host_arg, options
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection', function (socket) {

    sub.on('message', function(channel, message){
        socket.send(message);
    });

    socket.on("close", function() {
        console.log("websocket connection close");
    });
});
