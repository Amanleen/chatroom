var express = require('express');
var app = express(); //to use express
var cookieParser = require('cookie-parser')
app.use(cookieParser());

app.use(express.static('public'));

var chatroom = require('./routes/chatroom');
app.use('/chatroom',chatroom);

var login = require('./routes/login');
app.use('/login',login);
console.log("Going to login");

var logger = require('./logger');
app.use(logger);


// app.get('/login.html',function (request, response) {
// 	console.log('IN GET LOGIN.html');
// 	response.sendFile(__dirname + '/public/html/login.html');
// });
// app.get("./pics/btn_menu.gif", function (req, res) {
// 	res.sendFile(__dirname + "/public/pics/btn_menu.gif");
// });

app.get('/',function (request, response) {
	response.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening on 3000');
});

