function vcardToJSON(vcf){
	var cards = split("END:VCARD", vcf);
	var contacts = new Array();
	var numC = 0;
	for(i in cards){
		var card = cards[i];
		if(card.length>4){
			contacts[numC] = new Object();
			tokens = split("\r\n", card);
			for(j in tokens){
				token = tokens[j];
				bits = split(":", token);
				switch(bits[0]){
					case "FN":
						contacts[numC].name = bits[1];
						break;
					case "TEL;CELL":
						contacts[numC].cel = str_replace("-", "", bits[1]);
						if(substr(bits[1], 0, 1)=="+" && substr(bits[1], 1, 2)==g.wa.cc)contacts[numC].cel = substr(bits[1], 3);
						contacts[numC].cc = g.wa.cc;
						break;
					case "PHOTO;ENCODING=BASE64;JPEG":
						contacts[numC].photo = "data:image/jpg;base64," + bits[1];
						break;
					default:
						if(substr(bits[0], 0, 1)==" ")contacts[numC].photo += bits[0];
						break;
				}
			}
			if(contacts[numC].name&&contacts[numC].cel){
				if(contacts[numC].photo=="undefined")contacts[numC].photo="img/dummy.png";
				numC++;
			}
		}
	}
	contacts.sort(compare);
	b = contacts;
	return contacts;
}

function compare(a,b) {
	var res = 0;
	if (a.name < b.name)res = -1;
	if (a.name > b.name)res = 1;
	return res;
}
