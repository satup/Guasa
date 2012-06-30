function contactsList(){
	if(g.contacts && g.contacts.length>0){
		$("body>section#contacts>ul#contactslist").empty();
		$("body>section#contacts>figure#vcfimport").hide();
		for(i in g.contacts){
			contact = g.contacts[i];
			$("body>section#contacts>ul#contactslist").append("<li id=\""+ i +"\" onclick=\"chatWith(" + i + ");\"><img src=\"" + contact.photo + "\" alt=\"\" /><div id=\"text\">" + contact.name + "<br /><span class=\"small\">" + contact.cel + "</span></div></li>");
				$("body>section#contacts>figure#vcfimport").show();
		
		}
	}else{
		$("body>section#contacts>ul#contactslist").html("<li id=\"none\"><div id=\"text\">No contacts yet<br /><span class=\"small\">Import from a <em>.vcf</em> file by dragging and dropping below</span></div></li>");
		$("body>section#contacts>figure#vcfimport").show();
	}
}

function dragenter(e){
	e.stopPropagation();
	e.preventDefault();
}
	
function dragover(e){
	e.stopPropagation();
	e.preventDefault();
}  
    
function drop(e){
	e.stopPropagation();
	e.preventDefault();
	$(e.target).addClass("loading");
	var dt = e.dataTransfer;
	var files = dt.files;
	handleFile(files);
}

function handleFile(files){
	file = files[0];
	var reader = new FileReader();
	reader.onload = (function(afile){
	 	return function(e){
	 		vcfParse(e.target.result);
	 	}
	})(file);
	reader.readAsText(file);
}

$("document").ready(function(){
    var dropbox;  
    dropbox = document.getElementById("vcfimport");  
    dropbox.addEventListener("dragenter", dragenter, false);  
    dropbox.addEventListener("dragover", dragover, false);  
    dropbox.addEventListener("drop", drop, false);  
});

function vcfParse(vcf){
	contacts = vcardToJSON(vcf);
	localStorage.setItem("contacts", JSON.stringify(contacts));
	g.contacts = contacts;
	load("contacts");
}

function contactFind(pn){
	contacts = g.contacts;
	for(i in contacts){
		contact = contacts[i];
		if(contact.cc+contact.cel == pn){return i;}
	}
	return -1;
}
