var express = require('express');
var app = express(); //to use express

app.use(express.static('public'));

var chatroom = require('./routes/chatroom');
app.use('/chatroom',chatroom);


var logger = require('./logger');
app.use(logger);

app.get('/',function (request, response) {
	response.sendFile(__dirname + '/public/index.html');
});
app.get("./pics/btn_menu.gif", function (req, res) {
	res.sendFile(__dirname + "/public/pics/btn_menu.gif");
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening on 3000');
}); 
