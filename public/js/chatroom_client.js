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
			content = '<table class="chatroom-list-element-table"><tr class="chatroom-list-header"><td class="chatroom-list-header-name">'+messageDetails.username+'</td><td class="chatroom-list-header-date">'+creationTime+'</td></tr><tr class="chatroom-list-body"><td colspan=2>'+messageDetails.textMessage+'</td></tr></table>';
      		list.push($('<li>', { html: content }));
		}
		$('.message-list').append(list);
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

	$('.chatmessage-form').on('submit', function(event){
  		event.preventDefault(); 
  		var form = $(this);
  		var messageData = form.serialize();
  		messageData=messageData+"&userId="+guser.id+"&chatroomId="+gchatroomId;
  		// alert(messageData);
	  	$.ajax({
	  		type:'POST', url:'/chatroom', data:messageData
	  	}).done(function(reply){
	  		appendMessageList(reply);
	  		form.trigger('reset');
		});
	});
});

