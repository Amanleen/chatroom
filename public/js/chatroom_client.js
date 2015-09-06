$(function(){
	var guser={};
	guser.id=getCookie('userId');
	guser.name=getCookie('userName');
	var gchatroomId="";
	var glatestMessageTimestamp=0;


	function getParameterByName(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	var formatDateTime = function(datetime){
		var result="";
		result=(datetime.getMonth()+1)+"."+datetime.getDate()+"."+datetime.getFullYear();
		var hours = datetime.getHours();
		var minutes = datetime.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		result = result+" "+strTime;
		return result;
	};

	function prepareScreen(inputData){
		chatRoomDetails=inputData[0];
		gchatroomId=chatRoomDetails.id;
		// $("#td-chatroom-name").val(chatRoomDetails.name);
		listOfMessages=inputData[1];
		$("title").text(chatRoomDetails.name);
		appendMessageList(listOfMessages);
	}

	function getCookie(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	    }
	    return "";
	}

	function appendMessageList(listOfMessages){
		var list=[];
		var content;
		var messageDetails ={};
		for(var i in listOfMessages){
			messageDetails = listOfMessages[i];
			glatestMessageTimestamp = messageDetails.activitytimestamp;
			var messageDateTime = new Date(messageDetails.activitytimestamp*1000);
			var creationTime = formatDateTime(messageDateTime);
			//content = '<table class="chatroom-list-element-table"><tr class="chatroom-list-header"><td class="chatroom-list-header-name">'+messageDetails.username+'</td><td class="chatroom-list-header-date">'+creationTime+'</td></tr><tr class="chatroom-list-body"><td colspan=2>'+messageDetails.textMessage+'</td></tr></table>';
			//$('#message-list').append('<div class="row chatroom-list-message"><div class="row col-lg-offset-2 col-lg-6 chatroom-list-message-row"><div class="text-left col-lg-6 chatroom-list-header-name"> '+messageDetails.username+' </div><div class="col-lg-6 text-left chatroom-list-header-date pull-right"> '+creationTime+'</div></div><div class="row"><div class="col-lg-6 col-lg-offset-2 text-left chatroom-list-message-row chatroom-list-body">'+messageDetails.textMessage+'</div></div></div>');
			$('#message-list').append('<div class="row col-md-offset-2 col-md-6 col-lg-offset-2 col-lg-6 chatroom-list-message-row"><div class="row"><span class="text-left chatroom-list-header-name"> '+messageDetails.username+' </span><span class="pull-right chatroom-list-header-date pull-right"> '+creationTime+'</span></div><div class="row"><span class="text-left chatroom-list-body">'+messageDetails.textMessage+'</span></div></div>');
			//$('#message-list').append('<div class="row"><div class="col-lg-offset-2 col-lg-6 text-left chatroom-list-body chatroom-list-element-table">'+messageDetails.textMessage+'</div></div>');
			//content = '<div class="row"><div class="col-lg-1"> '+messageDetails.username+' </div> <div class="col-lg-2"/><div class="col-lg-1"> '+creationTime+'</div></div><div class="row">'+messageDetails.textMessage+'</div>'
      		//list.push($('<div class="row">', { html: content }));
		}
	}

	function getMessageHistory(){
		$.get('/chatroom?latestMessageTimestamp='+glatestMessageTimestamp).done(function(reply) {
	    	prepareScreen(reply);
	    	setTimeout(getMessageHistory, 1000);
	  	})
	  	.fail(function() {
	    	alert( "error" );
	  	}, 'json');
  	}
  	getMessageHistory();

	$('#submit-message').click(function(event){
  		event.preventDefault();
  		var messageText = encodeURIComponent($('#messageText').val());
  		var messageData="message="+messageText+"&userId="+guser.id+"&chatroomId="+gchatroomId;
  		console.log(messageData)
  		// alert(messageData);
	  	$.ajax({
	  		type:'POST', url:'/chatroom', data:messageData
	  	}).done(function(reply){
	  		appendMessageList(reply);
	  		$('#messageText').val('');
		});
	});
});

