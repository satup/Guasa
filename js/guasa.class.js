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
				//this.incoming.push(answer);
			}
		}
	}
	
	this.message = function(cc, pn, msg, callback){
		this.wa.runAsync("Message", new Array(new Date().getTime(), cc+pn, msg), callback);
	}
	
	this.lastseen = function(contact, callback){
		this.wa.runAsync("RequestLastSeen", new Array(contact.cc+contact.cel), callback);
	}
	
	this.incomingRead = function(){
		return this.wa.run("read", new Array());
	}
	
	this.msgProcess = function(msg){
		message = new Object();
		from = msg.from_number;
		message.id = msg.message_id;
		message.class = "from";
		message.timestamp = msg.timestamp;
		message.body = msg.body_txt;
		this.incoming.push(message);
	}
	
	this.poller = function(){
		this.wa.runAsync("read", new Array(), function(answer){
			console.log(answer);
			/*if(answer){
				g.msgProcess(answer);
			}
			g.poller();*/
		})
		setTimeout("g.poller();", 3000);
	}
}
