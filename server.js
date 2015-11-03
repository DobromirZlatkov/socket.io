var express = require('express'),
    app = express(),
    http = require('http'),
    port = process.env.PORT || 4000,
    server = http.createServer(app).listen(port),
    io = require('socket.io').listen(server),
    url = require('url'),
    redisURL = url.parse(process.env.REDISCLOUD_URL),
    redis = require('socket.io/node_modules/redis'),
    sub = redis.createClient(redisURL.port, redisURL.hostname, {return_buffers: true});
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
