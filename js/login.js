function login(){
	var cc = $("body>section#login>form>fieldset>select#cc").val();
	var pn = $("body>section#login>form>fieldset>input#pn").val();
	var imei = $("body>section#login>form>fieldset>input#imei").val();
	var api = $("body>section#login>form>fieldset>input#api").val();
	if(cc&&pn&&imei&&api){
		if(g.login(api, cc, pn, imei)){
			if(g.status)var section = "chats";
			else var section = "login";
			load(section);
		}else alert("Logging error!");
	}
}
