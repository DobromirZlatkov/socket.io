var express = require('express'),
    app = express(),
    http = require('http'),
    port = process.env.PORT || 4000,
    server = http.createServer(app).listen(port),
    io = require('socket.io').listen(server),
    url = require('url'),
    redisURL = url.parse(process.env.REDISCLOUD_URL);

var redis = require('redis');

var sub = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});

var sub1 = redis.createClient(process.env.REDISTOGO_URL, {no_ready_check: true});

var sub2 = redis.createClient(process.env.REDIS_URL, {no_ready_check: true});

var MultipleRedis = require('multiple-redis');

var multiClient = MultipleRedis.createClient([sub, sub1]);

multiClient.subscribe('order');
multiClient.subscribe('driver');



//port_arg, host_arg, options
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/d3', function (req, res) {
    res.sendFile(__dirname + '/d3.html');
});
app.get('/raw_data.csv', function (req, res) {
    res.sendFile(__dirname + '/raw_data.csv');
});


io.sockets.on('connection', function (socket) {

    multiClient.on('message', function(channel, message){
            socket.emit(channel, message);
        });

    socket.on("close", function() {
        console.log("websocket connection close");
    });
});

var path = require('path');
var root = path.dirname(require.main.filename);
console.log(root)
