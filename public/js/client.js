$(function(){
	$.get('/chatroom', appendToList);

	function appendToList(entries) {
	    var list = [];
	    var content, message, name;
	    for(var i in entries) {
	    	var entry = entries[i];
	    	name = entry.name;
	    	message = entry.message;
	    	content='<table width="100%" border="1"><tr><td>'+name+'</td><td align="right">timestamp</td></tr><tr><td colspan="2">'+message+'</td></tr></table>';
	      list.push($('<li>', { html: content }));
	    }
   		$('.message-list').append(list);
  	}

  $('form').on('submit', function(event){
  	event.preventDefault();
  	var form = $(this);
  	var messageData = form.serialize();
  	$.ajax({
  		type:'POST', url:'/chatroom', data:messageData
  	}).done(function(reply){
  		appendToList([reply]);
  		form.trigger('reset');
  	});
  });

});