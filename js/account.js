function accountShow(){
	$("body>section#account>div>article#actype>span").html(ucfirst(g.status.kind));
	$("body>section#account>div>article#acdetails>ul>li#pn>span").html("+" + g.wa.cc + " " + g.wa.pn);
	$("body>section#account>div>article#acdetails>ul>li#se>span").html(date("M j, Y", g.status.expiration));
	$("body>section#account>div>a#purchase").attr("href", "http://www.whatsapp.com/payments/pay.php?phone=" + g.wa.cc + g.wa.pn);
}
