var express = require('express');//gets the express module
var router = express.Router();//returns router instance which can be mouted as a middleware
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var messageList=[];

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./fscchatroom.db');
console.log("*****************");

router.route('/')
	.get(function(request, response){
		// console.log("********--------- IN GET --------------*********");
		var userName = request.cookies.userName;
		var userId = request.cookies.userId;
		if (userName != undefined) {
			var result = {
				redirect : '/html/chatroom.html',
			}
			response.status(201).json(result);
		}
	})
	.post(parseUrlencoded, function(request, response){
  		var userName = request.body.userName;
  		console.log("path="+request.route.path);
  		var body=request.body;
  		console.log("username="+body.userName);
  		function addUserName(error, user){
  			var result={};
  			if(error){
  				result.message="Username already exists! Please select another username.";
  				response.status(400).json(result);
  			}else{
  				response.cookie('userId', user, { maxAge: 9000000, httpOnly: true });
  				response.cookie('userName', userName, { maxAge: 9000000, httpOnly: true });
  				result.username= userName;
  				result.id=user;
  				// request.session.user = username;
  				response.status(201).json(result);
  				//db.close();
  				//response.sendfile('../public/chatroom.html');
  			}
  		};
  		checkUsernameAndCreate(userName, addUserName);
	});

var checkUsernameAndCreate = function(name, callback){ //chk 4 null also
	name = "'"+name+"'";
	var userId=0;
	var chatRoomName="'FSE CHATROOM'";	//place this in a config file
	var chatRoomId=0;
	// console.log("======== name=", name);
	db.serialize(function()
	{
        db.get("SELECT count(*) from user where name="+name, function (error, row)
        {
			if(error){
				// console.log("======== 1 ===========", error);
				callback(error, null);
			} else{
				db.serialize(function()
				{
					db.run("INSERT into user(name) VALUES ("+name+")", function(error)
					{
						if(error){
							// console.log("======== 2 ===========", error);
							callback(error, null);
						}else{
							userId=this.lastID;
							//callback(null, this.lastID);
							db.serialize(function()
							{
								db.get("SELECT id from chatroom where name="+chatRoomName, function(error,row){
									if(error){
										callback(error, null);
									}else{
										chatRoomId = row.id;
										db.serialize(function(){
											db.run("INSERT into userchatroomrelation(userid,chatroomid) values ("+userId+","+chatRoomId+")", function(error){
												if(error){
													callback(error, null);
												}else{
													callback(null, userId);
												}
											});
										});
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


function createTables(callback){
	db.serialize(function()
	{
		db.run("CREATE TABLE if not exists chatroom(id INTEGER PRIMARY KEY ASC, name TEXT UNIQUE NOT NULL, dplocation TEXT, activitytimestamp timestamp default (strftime('%s', 'now')))");
		db.run("CREATE TABLE if not exists user(id INTEGER PRIMARY KEY ASC, name TEXT UNIQUE NOT NULL, status TEXT, dplocation TEXT, activitytimestamp timestamp default (strftime('%s', 'now')))");
		db.run("CREATE TABLE if not exists message(id INTEGER PRIMARY KEY ASC, textmessage TEXT NOT NULL,userid INTEGER NOT NULL, chatroomid INTEGER NOT NULL, activitytimestamp timestamp default (strftime('%s', 'now')), medialink TEXT, FOREIGN KEY(userid) REFERENCES user(id), FOREIGN KEY(chatroomid) REFERENCES chatroom(id))");
		db.run("CREATE TABLE if not exists userchatroomrelation(userid INTEGER NOT NULL, chatroomid INTEGER NOT NULL, FOREIGN KEY(userid) REFERENCES user(id), FOREIGN KEY(chatroomid) REFERENCES chatroom(id))", function(error){
			callback();
		});
	});
}

function populateDb(callback){
	db.serialize(function()
	{
		db.run("insert or ignore into chatroom(name) values ('FSE CHATROOM')");
		callback();
	});
}
function callbackCreateTable(){
	populateDb(callbackPopulateDb);
}
function callbackPopulateDb(){

}
createTables(callbackCreateTable);

module.exports = router; // to access it from index.js