var expireDate = new Date();
	expireDate.setYear(expireDate.getFullYear()+1);
var defaultExpires = expireDate;
	
var defaultPath = "/";	
var defaultDomain = ".axis.com";	
	

function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}

function setCookie(name,value,expires,path,domain,secure) {
    if (expires==null) expires = defaultExpires;
    if (path==null) path = defaultPath;
    if (domain==null) domain = defaultDomain;
    
    document.cookie = name + "=" + escape(value) +	
        ( (expires) ? ";expires=" + expires.toGMTString() : "") +
        ( (path) ? ";path=" + path : "") + 
        ( (domain) ? ";domain=" + domain : "") +
        ( (secure) ? ";secure" : "");
}

function deleteCookie(name,path,domain) {
    if (getCookie(name)) document.cookie = name + "=" +
       ( (path) ? ";path=" + path : "") +
       ( (domain) ? ";domain=" + domain : "") +
       ";expires=Thu, 01-Jan-70 00:00:01 GMT";
}

function deleteAllCookies(path) {
        // Get cookie string and separate into individual cookie phrases:
        var cookie_string = "" + document.cookie;
        var cookie_array = cookie_string.split("; ");
		
        // Try to delete each cookie:
        for (var i = 0; i < cookie_array.length; ++ i) {
                var single_cookie = cookie_array[i].split("=");
                if (single_cookie.length != 2)
                        continue;
                var name = unescape(single_cookie[0]);
                deleteCookie(name,path);
        }
}

var today = new Date();
var zero_date = new Date(0,0,0);
today.setTime(today.getTime() - zero_date.getTime());
var cookie_expire_date = new Date(today.getTime() + (8 * 7 * 86400000));

function setVisitorID() {
    if (getCookie('VisitorID')) {
        var VisitorID = getCookie('VisitorID');
        if (!VisitorID) {
            setCookie('VisitorID',Math.random(),cookie_expire_date);
       }
    }
}

function setSessionID() {
    if (!getCookie('SessionID'))
        setCookie('SessionID',Math.random());
}

