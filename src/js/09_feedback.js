var feedback = new Object();

$(document).ready(function() {
	feedback.init();
});

feedback.init = function () {
	$('#feedbackLink').click(function () {
		// google sidewiki bookmarklet js code
		var a=window,b=document;if(b.body){var c=a.screenLeft||a.screenX;if(c>340)c-=349;else{var d=a.screen.availWidth,e=c+a.outerWidth;c=e>d-331&&c>d-e-9?0:e}a.open("","__SWBM__","location=1,resizable=1,menubar=0,scrollbars=1,status=0,toolbar=0,width=340,height="+((a.outerHeight||768)-58)+",top="+(a.screenTop||a.screenY)+",left="+Math.max(1,c));var f=b.createElement("script");f.src="http://www.google.com/sidewiki/bookmarklet.js?hl=en";b.body.appendChild(f)};
		return false;
	});
}
