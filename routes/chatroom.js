var express = require('express');//gets the express module
var router = express.Router();//returns router instance which can be mouted as a middleware
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var cookieParser = require('cookie-parser')
var messageList=[];

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./fscchatroom.db');

router.route('/')
	.get(function(request, response){
		// IT IS NOT COMING IN CHATROOM.JS DEFINE CHATROOM>HTML REQUEST IN APP.JS
		// console.log("************* IN CHATROOM JS *********************",request);
		//response.json(Object.keys(messageList));
		// console.log(request);
		var username = request.cookies.userName;
		var userId = request.cookies.userId;
		var latestMessageTimestamp=request.query.latestMessageTimestamp;
		console.log("========= username="+username+"\n id="+userId+"\n latestMessageTimestamp="+latestMessageTimestamp);
		function prepareChatroomForUser(error, chatRoomAndMessage){
			var result={};
			// console.log(error);
			if(error){
  				result.message="Cannot find user details!";
  				response.status(400).json(error);
  			}else{
  				// result.userName= userName;
  				// result.id=user;
  				response.status(201).json(chatRoomAndMessage);
  				//db.close();
  				//response.sendfile('../public/chatroom.html');
  			}
		};
		//getChathistoryForChatroom();
		getChathistoryForChatroom(userId,latestMessageTimestamp, prepareChatroomForUser);
	})
	.post(parseUrlencoded, function(request, response){
  		//var newBlock = createMessage(request.body.userName, request.body.message);
  		// console.log("\n &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",request);
  		var chatMessageData = {};
  		chatMessageData.textMessage=request.body.message;
  		// chatMessageData.userId=request.body.userId;
  		chatMessageData.userId=request.cookies.userId;
  		chatMessageData.chatroomId=request.body.chatroomId;
  		// console.log("========== chatmsg data=",chatMessageData);
  		function prepareResponseForMessageCreation(error, message){
  			if(error){
  				response.status(400).json(error);
  			}else{
  				response.status(201).json(message);
  			}
  		};
    	enterChatMessageinDb(chatMessageData, prepareResponseForMessageCreation);
	});

	var enterChatMessageinDb = function(chatMessageData, callback){
		var list=[];
		var createdMessage = {};
		db.serialize(function(){
			db.run("INSERT into message(textmessage,userid,chatroomid) VALUES ("+"'"+chatMessageData.textMessage+"',"+"'"+chatMessageData.userId+"',"+"'"+chatMessageData.chatroomId+"')", function(error){
				if(error){
					callback(error, null);
				}else{
					//callback(null, this.lastID);
					db.get("select user.name, message.textmessage, message.activitytimestamp from user JOIN message on user.id=message.userid where message.id ="+this.lastID, function(error,row)
					{
						if(error){
							callback(error,null);
						}else{
							createdMessage.textMessage = row.textmessage;
							createdMessage.username=row.name;
							createdMessage.activitytimestamp=row.activitytimestamp;
							list.push(createdMessage);
							callback(null,list);
						}
					});
				}
			});
		});
	};

	var getChathistoryForChatroom = function(userId, latestMessageTimestamp, callback){
		db.serialize(function(){
			// db.get("SELECT (SELECT count(*) from userchatroomrelation where userid="+userId+") AS count",function(error, row){
			db.get("select DISTINCT chatroomid from userchatroomrelation where userid="+userId, function(error, row){
				if(error){
					callback(error,null);
				}else{
					var chatroom={};
					chatroom.id=row.chatroomid;
					//chatroom details==> chat details
					//console.log("row="+row, row.count);
					// var noOfApplicableChatrooms=row.count;
					// console.log("======== noOfApplicableChatrooms="+noOfApplicableChatrooms);
					db.serialize(function(){
						db.get("select * from chatroom where id="+chatroom.id, function(error, row){
							if(error){
								callback(error, null);
							}else{
								chatroom.name=row.name;
								chatroom.activitytimestamp = row.activitytimestamp;
								chatroom.dplocation = row.dplocation;
								db.serialize(function(){
									var message={};
									var listOfMessages=[];
									var result=[];
									result.push(chatroom);
									db.each("select user.name, message.textmessage, message.activitytimestamp from user JOIN message on user.id=message.userid where message.chatroomid="+chatroom.id+" and message.activitytimestamp > "+latestMessageTimestamp,function(error, row){
											if(error){
												callback(error, null);
											}else{
												message={};
												message.textMessage = row.textmessage;
												message.username=row.name;
												message.activitytimestamp=row.activitytimestamp;
											}
											listOfMessages.push(message);
										}, function complete(err, found) { //memory leak
											if(error){
												callback(error,null);
											}else{
												result.push(listOfMessages);
												callback(null, result);
											}
    									});
								});
							}
						});
					});
				}
			});
		});
	};
//4854-9806-0085-3867 valid: 07/15 - 07/18: AMANLEEN KAUR PURI: 032
	var createMessage = function(name, message){
		var obj = {};
		obj.name = name;
		obj.message = message;
  		messageList.push(obj);
  		return obj;
	};
module.exports = router; // to access it from index.js