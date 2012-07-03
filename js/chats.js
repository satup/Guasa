$("document").ready(function(){
	$("body>section#chat>div#bottom>div#msg").keydown(function(e){
		if(e.keyCode == 13){
			e.preventDefault();
			msgSend();
		}
	});
});

function chatList(){
	if(g.chats && g.chats.length > 0){
		$("body>section#chats>ul#chatslist").empty();
		for(i=g.chats.length-1;i>=0;i--){
			chat = g.chats[i];
			contact = g.contacts[chat.contact];
			if(chat.messages){
				lastmsg = chat.messages[chat.messages.length-1];
				if(lastmsg.class=="to")sign = "→";
				else sign = "←";
				res = "<li id=\""+ i +"\" onclick=\"chatShow(" + i + ");\"><img src=\"" + contact.photo + "\" alt=\"\" id=\"photo\"/><div id=\"text\">" + contact.name + "<br /><span class=\"small\">" + sign + " " + lastmsg.body + "</span></div></li>";
			}else res = "<li id=\""+ i +"\" onclick=\"chatShow(" + i + ");\"><img src=\"" + contact.photo + "\" alt=\"\" id=\"photo\"/><div id=\"text\">" + contact.name + "</div></li>";
			$("body>section#chats>ul#chatslist").append(res);
		}
	}else{
		$("body>section#chats>ul#chatslist").html("<li id=\"none\"><div id=\"text\">No chats yet<br /><span class=\"small\">(Chats from official App are not sincronizable)</span></div></li>");
	}
}

function chatWith(contact){
	chats = g.chats;
	if(chats && chats.length > 0){
		var ci = chatFind(contact);
		if(ci<0){
			ci = chatNew(contact);
		}
	}else{
		chats = new Array();
		chats[0] = new Object();
		chats[0].contact = contact;
		var ci = 0;
	}
	localStorage.setItem("chats", JSON.stringify(chats));
	g.chats = chats;
	chatShow(ci);
}

function chatNew(contact){
	chats[chats.length] = new Object();
	chats[chats.length-1].contact = contact;
	return chats.length-1;
}

function chatShow(ci){
	chatPull(ci);
	load("chat");
	chat = g.chats[g.chats.length-1];
	contact = g.contacts[chat.contact];
	$("body>section#chat>header>figure>figcaption>h1").html(contact.name);
	$("body>section#chat>header>figure>img").attr("src", contact.photo);
	$("body>section#chat>ul#messages").empty();
	$("body>section#chat>div#bottom>div#msg").empty();
	$("body>section#chat>div#bottom>div#msg").focus();
	msgRender();
	$("body>section#chat>header>figure>figcaption>span#lastseen").hide();
	g.lastseen(contact, function(lastseen){
		if(lastseen)res = "Last seen " + date("M j, G:i", time()-lastseen.seconds_ago);
		else res = "Not in WhatsApp yet!";
		$("body>section#chat>header>figure>figcaption>span#lastseen").html(res).fadeIn(200);
	});
}

function chatFind(contact){
	for(i=0;i<g.chats.length;i++){
		if(g.chats[i].contact == contact)return i;
	}
	return -1;
}

function messageFind(id, messages){
	for(i in messages){
		if(messages[i].id == id)return i;
	}
	return -1;
}

function chatPull(ci){
	var temp = g.chats[ci];
	g.chats.splice(ci, 1);
	g.chats[g.chats.length] = temp;
	localStorage.setItem("chats", JSON.stringify(g.chats));
}

function msgSend(){
	chat = g.chats[g.chats.length-1];
	contact = g.contacts[chat.contact];
	msg = trim(str_replace("<br>", "", $("body>section#chat>div#bottom>div#msg").html()));
	if(msg.length>0){
		$("body>section#chat>div#bottom>div#msg").empty();
		if(!chat.messages || chat.messages.length<=0)chat.messages = new Array();
		chat.messages[chat.messages.length] = new Object();
		chat.messages[chat.messages.length-1].id = time();
		chat.messages[chat.messages.length-1].body = msg;
		chat.messages[chat.messages.length-1].timestamp = time();
		chat.messages[chat.messages.length-1].class = "to";
		g.message(contact.cc, contact.cel, msg, function(answer){
			if(answer){
				//Received by server (mark with one tick)
			}
		});
		g.chats[g.chats.length-1] = chat;
		localStorage.setItem("chats", JSON.stringify(g.chats));
		msgRender();
	}
}

function msgRender(){
	chat = g.chats[g.chats.length-1];
	$("body>section#chat>ul#messages").empty();
	for(i in chat.messages){
		msg = chat.messages[i];
		$("body>section#chat>ul#messages").append("<li class=\"" + msg.class + "\"><span id=\"body\">" + msg.body + "</span><span id=\"timestamp\">" + date("G:i", msg.timestamp) + "</span></li>");
	}
	$("body>section#chat>ul#messages").scrollTop($("body>section#chat>ul#messages").height());
}
