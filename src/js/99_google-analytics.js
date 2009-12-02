var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));

$(document).ready(function(){
	gPageTracker.init();
});

var gPageTracker = new Object();
gPageTracker.pageTracker = null;

gPageTracker.init = function () {
	try {
		gPageTracker.pageTracker = _gat._getTracker("UA-11734257-1");
		gPageTracker.pageTracker._trackPageview();
	} catch(err) {};
}

gPageTracker.event = function (category, action, optional_label, optional_value) {
	if (gPageTracker.pageTracker == null) {
		return;
	}
	
	gPageTracker.pageTracker._trackEvent(category, action, optional_label, optional_value);
}
