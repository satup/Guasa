
function WhatsApp(api, cc, pn, imei){

	this.api = api;
	this.cc = cc;
	this.pn = pn;
	this.imei = imei;
	
	this.run = function(method, params){
		var id = new Object();
		var action = new Object();
		id.cc = this.cc;
		id.pn = this.pn;
		id.imei = this.imei;
		action.method = method;
		action.params = params;
		var answer = $.ajax({
			type: "POST",       
			url: this.api,
			data: { id: id, action: action },
			dataType: "json",
			async: false,
			success: function(data) {
				return data;
			}
		}).responseText;
		if(answer)return answer;
	}
	
	this.runAsync = function(method, params, callback){
		var id = new Object();
		var action = new Object();
		id.cc = this.cc;
		id.pn = this.pn;
		id.imei = this.imei;
		action.method = method;
		action.params = params;
		$.ajax({
			type: "POST",       
			url: this.api,
			data: { id: id, action: action },
			dataType: "json",
			async: true
		}).done(callback);
	}
	
}
