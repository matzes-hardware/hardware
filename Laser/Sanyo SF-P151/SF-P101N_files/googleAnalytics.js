if(window.jQuery){
	jQuery(document).ready(function() {
		addGa();
	});
}else{
	window.onload = function() {
		addGa();
	};
}
function addGa(){
	var _gaq = window._gaq= window._gaq || [];
	_gaq.push(['_setAccount', 'UA-37452587-1']);
	_gaq.push(['_setDomainName', 'made-in-china.com']);
	_gaq.push(['_trackPageview']);

	(function() {
		var ga = document.createElement('script');
		ga.type = 'text/javascript';
		ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('head')[0];
		s.appendChild(ga);
	})();
}