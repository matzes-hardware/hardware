/*
Implementation notes
----------------------------------------------------------------
The script returns a set of browser variables:

Variable.	Description
ie			Internet Explorer 4+ and IE-based third-party browsers. You can also be more specific:
ie4	... 	Internet Explorer 4 only.
ie5	... 	Internet Explorer 5 or 6.
ie6	... 	Internet Explorer 6 only.
ns4			Netscape 4.
ns6			Gecko and KDE-based browsers - which includes Nestcape 6 and 7, Mozilla, Konqueror and Safari. You can also identify smaller groups within this:
ns7	... 	Netscape 7.
mz7	... 	Any gecko browser except Netscape. This is principally designed to identify Mozilla's own builds from Version 0.6 onwards, but it also returns true for any other non-netscape gecko browser.
kde	... 	Konqueror, from KDE 2.2 onwards.
saf	... 	Safari. This variable will identify Safari irrespective of which browser it's set to identify as.
op5			Opera 5.
op6			Opera 6.
op7			Opera 7 or later. This, and the previous two variables, will identify Opera irrespective of which browser it's set to identify as.

-----------------------------------------------------------------
Underpinning these is a safety variable, for protecting legacy browsers:

Variable.	Description
exclude		Primitive javascript browsers such as Netscape 3.

-----------------------------------------------------------------
There are also three OS (Operating System) variables:

Variable.	Description
win			Windows.
mac			Macintosh.
lin			Linux, or anything else.

-----------------------------------------------------------------
and you can query a lower-case version of the user-agent string:

Variable.	Description
agt			User-agent string.
*/


var exclude=1;
var agt=navigator.userAgent.toLowerCase();
var win=0;var mac=0;var lin=1;
if(agt.indexOf('win')!=-1){win=1;lin=0;}
if(agt.indexOf('mac')!=-1){mac=1;lin=0;}
var lnx=0;if(lin){lnx=1;}
var ice=0;
var ie=0;var ie4=0;var ie5=0;var ie6=0;var com=0;var dcm;
var op5=0;var op6=0;var op7=0;
var ns4=0;var ns6=0;var ns7=0;var mz7=0;var kde=0;var saf=0;
if(typeof navigator.vendor!="undefined" && navigator.vendor=="KDE"){
	var thisKDE=agt;
	var splitKDE=thisKDE.split("konqueror/");
	var aKDE=splitKDE[1].split("; ");
	var KDEn=parseFloat(aKDE[0]);
	if(KDEn>=2.2){
		kde=1;
		ns6=1;
		exclude=0;
		}
	}
else if(agt.indexOf('webtv')!=-1){exclude=1;}
else if(typeof window.opera!="undefined"){
	exclude=0;
	if(/opera[\/ ][5]/.test(agt)){op5=1;}
	if(/opera[\/ ][6]/.test(agt)){op6=1;}
	if(/opera[\/ ][7-9]/.test(agt)){op7=1;}
	}
else if(typeof document.all!="undefined"&&!kde){
	exclude=0;
	ie=1;
	if(typeof document.getElementById!="undefined"){
		ie5=1;
		if(agt.indexOf("msie 6")!=-1){
			ie6=1;
			dcm=document.compatMode;
			if(dcm!="BackCompat"){com=1;}
			}
		}
	else{ie4=1;}
	}
else if(typeof document.getElementById!="undefined"){
	exclude=0;
	if(agt.indexOf("netscape/6")!=-1||agt.indexOf("netscape6")!=-1){ns6=1;}
	else if(agt.indexOf("netscape/7")!=-1||agt.indexOf("netscape7")!=-1){ns6=1;ns7=1;}
	else if(agt.indexOf("gecko")!=-1){ns6=1;mz7=1;}
	if(agt.indexOf("safari")!=-1 || (typeof document.childNodes!="undefined" && typeof document.all=="undefined" && typeof navigator.taintEnabled=="undefined")){mz7=0;ns6=1;saf=1;}
	}
else if((agt.indexOf('mozilla')!=-1)&&(parseInt(navigator.appVersion)>=4)){
	exclude=0;
	ns4=1;
	if(typeof navigator.mimeTypes['*']=="undefined"){
		exclude=1;
		ns4=0;
		}
	}
if(agt.indexOf('escape')!=-1){exclude=1;ns4=0;}
if(typeof navigator.__ice_version!="undefined"){exclude=1;ie4=0;}
