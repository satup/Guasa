var g = new Guasa();

$("document") .ready(function(){
	var local = JSON.parse(localStorage.getItem("id"));
	if(local)g.login(local.api, local.cc, local.pn, local.imei);
	$("body>section#splash").fadeIn(200);
	if(g.status)var section = "chats";
	else var section = "login";
	setTimeout(function(){load(section);}, 500);
	chats = localStorage.getItem("chats");
	contacts = localStorage.getItem("contacts");
	if(chats)g.chats = JSON.parse(chats);
	if(contacts)g.contacts = JSON.parse(contacts);
});

function load(section){
	$("body>section#"+g.section).fadeOut(200);
	$("body>section#"+section).fadeIn(200);
	g.section = section;
	switch(g.section){
		case "chats":
			chatList();
			break;
		case "contacts":
			contactsList();
			break;
		case "account":
			$('body>section#chats>ul#over').hide();
			accountShow();
			break;
	}
}

function Guasa(){
	this.wa = 0;
	this.section = "splash";
	this.status = 0;
	this.chats = 0;
	this.contacts = 0;
	this.incoming = new Array();
	
	this.login = function(api, cc, pn, imei){
		this.wa = new WhatsApp(api, cc, pn, imei);
		var answer = this.wa.run("accountInfo", new Array());
		lines = new Array();
		lines = explode("}", answer);
		for(i in lines){
			answer = JSON.parse(lines[i]+"}");
			if(answer && answer.status == "active"){
				id = new Object();
				id.api = api;
				id.cc = cc;
				id.pn = pn;
				id.imei = imei;
				localStorage.setItem("id", JSON.stringify(id));
				this.status = answer;
				this.poller();
				return true;
			}else{
				//Process it as it came from polling
			}
		}
	}
	
	this.message = function(cc, pn, msg, callback){
		this.wa.runAsync("Message", new Array(new Date().getTime(), cc+pn, msg), callback);
	}
	
	this.lastseen = function(contact, callback){
		this.wa.runAsync("RequestLastSeen", new Array(contact.cc+contact.cel), callback);
	}
	
	this.msgProcess = function(msg){
		message = new Object();
		contact = contactFind(msg.from_number);
		chat = chatFind(contact);
		message.id = msg.message_id;
		message.class = "from";
		message.timestamp = msg.timestamp;
		message.body = msg.body_txt;
		console.log(chat + " " + contact + " " + msg.body_txt);
		if(chat<0)chat = chatNew(contact);
		if(message.body && messageFind(message.id, this.chats[chat].messages)<0){
			this.chats[chat].messages.push(message);
			localStorage.setItem("chats", JSON.stringify(this.chats));
			if(this.section == "chat" && contact == this.chats[this.chats.length-1].contact)msgRender();
		    if(this.section == "chats"){
					$("body>section#chats>ul#chatslist").empty();
					
					contact = g.contacts[contact];

			sign = "←";
				res = "<li id=\""+ chat +"\" onclick=\"chatShow(" + chat + ");\"><img src=\"" + contact.photo + "\" alt=\"\" id=\"photo\"/><img src=\"./img/icon.png\" alt=\"\" id=\"new\"/><div id=\"text\">" + contact.name + "<br /><span class=\"small\"><b>" + sign + " " + message.body + "</b></span></div></li>";
			$("body>section#chats>ul#chatslist").append(res);
            }
		}
	}
	
	this.poller = function(){
		this.wa.runAsync("read", new Array(), function(answer){
			if(answer){
				g.msgProcess(answer);
			}
		})
		setTimeout("g.poller();", 1000);
	}
}
