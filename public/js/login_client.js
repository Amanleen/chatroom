// $(document).ready(function(){
    
//         alert("Image loaded.");

// });

$(function(){
	$.ajax({
    	type: "GET",
    	url: '/login',
    	dataType: 'json',
    	success: function(data, textStatus) {
	        if (data && data.redirect) {
	            // data.redirect contains the string URL to redirect to
	            window.location.href = data.redirect;
	        }
	    }
	});
	function appendToList(entries) {
	    var list = [];
	    var content, message, name;
	    for(var i in entries) {
	    	var entry = entries[i];
	    	name = entry.name;
	    	message = entry.message;
	    	content='<table width="100%" border="1"><tr><td>'+name+'</td><td align="right">timestamp</td></tr><tr><td colspan="2">'+message+'</td></tr></table>';	      list.push($('<li>', { html: content }));
		}
	   	$('.message-list').append(list);
	}
	$('.login-form').on('submit', function(event){
		event.preventDefault();
		var userNameEntered=$('#userNameID').val();
		if(userNameEntered!=null && userNameEntered!="")
		{
			var form = $(this);
	  		var loginData = form.serialize();
		  	$.ajax({
		  		type:'POST', url:'/login', data:loginData
		  	})
		  	.fail(function(xhr, textStatus, errorThrown) {
		  		var errorMessage = JSON.parse(xhr.responseText);
				alert(errorMessage.message);
		  	})
		  	.done(function(reply){
		  		form.trigger('reset');
		  		var strWindowFeatures = "_blank, menubar=no,location=no,resizable=no,scrollbars=no,status=no, top=300, left=500, width=400, height=400";
		  		window.location.href = '/html/chatroom.html';
		  		// close();
			});
	  	}else{
	  		alert("Please enter a username!");
	  	}
	});
});