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

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function () {
    app.use(allowCrossDomain);
});
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
