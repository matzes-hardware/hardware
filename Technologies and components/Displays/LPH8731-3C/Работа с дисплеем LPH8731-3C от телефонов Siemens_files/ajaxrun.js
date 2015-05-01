/*
 * @author      Roman Shtogrin http://www.shtogrin.com/
 * @copyright   2007 Roman Shtogrin
 * @license     GNU
 * @version     1.0
 * @link        http://www.ajaxrun.com/
 */

//INIT
var ajaxrun_script='/ajaxrun/index.php';
var IE=(window.navigator.appName=="Microsoft Internet Explorer"?1:0);
var FF=(window.navigator.userAgent.toLowerCase().indexOf("firefox")!=-1?1:0);
var OP=(window.opera?1:0);

//LANG
var ajaxrun_lang_db={
	ajaxrun_init_error:     'Ошибка инициализации AJAX',
	er_senks:               'Спасибо за внимание к нашему сайту. Ваше сообщение успешно отправлено.',
	er_confirm:             'Отправить сообщение об ошибке?',
	er_size:                'Для отправки сообщения об ошибке необходимо выделить текст (от 10 до 200 символов)'
};

var _globText = '';

//ERROR-REPORT
function ajaxrun_error_report_hand(ajax,text)
{
	if(text=='OK')
		alert(ajaxrun_lang_db['er_senks']);
}

function ajaxrun_home_page(event)
{
	event = (event) ? event : window.event;
	if(event.keyCode == 36 && event.ctrlKey == true)
		document.location.href=document.location.protocol+'//'+document.location.host+'/';
}

function ajaxrun_error_report(event)
{
	event = (event) ? event : window.event;
	if((event.keyCode == 13 || event.keyCode == 10) && event.ctrlKey == true)
	{
		var text=jscommnad_get_selected_text();
		_globText = text;
		if(text.length<10 || text.length>200)
			alert(ajaxrun_lang_db['er_size']);
		else
		{
			window.open('/ajaxrun/report.html', 'Сообщение об ошибке', 'width=400,height=300');
			/*		
			if(confirm(ajaxrun_lang_db['er_confirm']))
			{
				var send=new ajaxrun_ajax();
				var a_data=new Array();
				a_data['comm']='ajax_text_error';
				a_data['text']=text;
				send.get(ajaxrun_script,ajaxrun_error_report_hand,a_data);
			}*/
		}
	}
}

//EVENT
function ajaxrun_setevent(element, eventName, handler)
{
	if(IE && eventName=='keypress')
	{
		element=document;
		eventName='keydown';
	}
	if(element.addEventListener)
		element.addEventListener(eventName, handler, false);
	else
		if(element.attachEvent)
			element.attachEvent('on' + eventName, handler);
}

//SELECTED TEXT
function jscommnad_get_selected_text()
{
	if(document.getSelection)
		return document.getSelection();
	if(document.selection)
		return document.selection.createRange().text;
	if(window.getSelection)
		return window.getSelection();
	return '';
}

//SIMLE AJAX
function ajaxrun_ajax()
{
	this.request=false;
	if(window.XMLHttpRequest)
		this.request = new XMLHttpRequest();
	else
		if(window.ActiveXObject)
		{
			this.request = new ActiveXObject("Microsoft.XMLHTTP");
			if(!this.request)
				this.request = new ActiveXObject("Msxml2.XMLHTTP");
		}
	if(!window.a_ajax)
		window.a_ajax=new Array();
	this.numb=a_ajax.length;
	a_ajax[this.numb]=this;
}
ajaxrun_ajax.prototype.exec = function()
{
	if(!this.hand)
		return;
	if(!this.request)
		return false;
	if(this.request.readyState == 4)
		if(this.request.status == 200 || this.request.status == 304)
			this.hand(this,this.request.responseText);
}
ajaxrun_ajax.prototype.post = function(s_url,f_hand,a_data)
{
	var s_data='';

	this.hand=f_hand;
	if(!this.request)
		return false;
	if(a_data)
		for(var name in a_data)
			s_data+=encodeURIComponent(name)+"="+encodeURIComponent(a_data[name])+"&";
	if(f_hand)
		this.hand=f_hand;
	this.request.onreadystatechange = function(){a_ajax[numb].exec();}
	this.request.open("POST",s_url,true);
	this.request.setRequestHeader("X-Referrer",document.location);
	this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	this.request.setRequestHeader("Content-length", s_data.length);
	this.request.setRequestHeader("Connection", "close");
	this.request.send(null);
	return true;
}
ajaxrun_ajax.prototype.get = function(s_url,f_hand,a_data)
{
	var s_data='';

	if(!this.request)
		return false;
	if(a_data)
		for(var name in a_data)
			s_data+=encodeURIComponent(name)+"="+encodeURIComponent(a_data[name])+"&";
	if(f_hand)
		this.hand=f_hand;
	var numb = this.numb;
	this.request.onreadystatechange = function(){a_ajax[numb].exec();}
	this.request.open("GET",s_url+'?'+s_data,true);
	this.request.setRequestHeader("X-Referrer",document.location);
	this.request.send(null);
	return true;
}

/*
if(IE)
	ajaxrun_setevent(document,'keydown',ajaxrun_error_report);
else
*/

	ajaxrun_setevent(window,'keypress',ajaxrun_error_report);
	ajaxrun_setevent(window,'keypress',ajaxrun_home_page);
