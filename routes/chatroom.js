var express = require('express');//gets the express module
var router = express.Router();//returns router instance which can be mouted as a middleware
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var messageList=[];

router.route('/')
	.get(function(request, response){
		response.json(Object.keys(messageList));
	})
	.post(parseUrlencoded, function(request, response){
  		var newBlock = createMessage(request.body.userName, request.body.message);
    	response.status(201).json(newBlock);
	});

	var createMessage = function(name, message){
		var obj = {};
		obj.name = name;
		obj.message = message;
  		messageList.push(obj);
  		return obj;
	};
module.exports = router; // to access it from index.js