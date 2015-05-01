var ROOT_URL = location.protocol + '//' + location.host;
var URL = ROOT_URL + '/cms';

function initAutocomplete() {
	$('input.autocomplete').live('focus', function() {
		$('div.autocomplete').hide();
		if ($(this).hasClass('ui-autocomplete-input')) {
			var parent = $(this).parent().parent();
		} else {
			var parent = $(this);
		}
		parent.next().show();
	});
	$(document).live('click', function(e) {
		var inputFocused = $('input.autocomplete').is(':focus');
		var clickedInsideAcDiv = $(e.target).closest('div.autocomplete').length > 0;
		if(!inputFocused && !clickedInsideAcDiv) {
			$('div.autocomplete').hide();
		}
	});
	var autocomplete = {};
	$('input.autocomplete').live('input', function() {
		var el = this;

		if ($(el).hasClass('ui-autocomplete-input')) {
			var auto = $(el).parent().parent().next();
		} else {
			var auto = $(el).next();
		}

		if (!autocomplete[el.id]) {
			autocomplete[el.id] = {
				value: auto.html(),
				timer: false
			};
		}
		auto.html('');
		var minLength = el.id === 'nominal' ? 3 : 2;
		if (el.value.length < minLength) {
			auto.html(autocomplete[el.id]['value']);
			return false;
		}
		clearTimeout(autocomplete[el.id]['timer']);
		var img = $(el).prev();
		img.show();

		autocomplete[el.id]['timer'] = setTimeout(function() {
			var data = 'filter' + el.id + '=1&filter=' + encodeURIComponent(el.value);

			if (location.pathname.indexOf('/drafts/') >= 0) {
				data += '&section=' + $('#elementInSection').val();
			}
			ajax.init(location.pathname, data, function(json) {
				img.hide();
				if (json.success) {
					if (json.message != '') {
						auto.html('<ul>' + json.message + '</ul>');
					}
				} else {
					auto.html(autocomplete[el.id]['value']);
				}
			}, function() {
				img.hide();
			})
		}, 300);
	});
	$('.autocomplete ul li').live('click', function(e) {
		if (e.target === this) {
			var auto = $(this).parent().parent();
			var input = auto.prev();
			if (input.is('input')) {
				input.val($(this).text());
			} else {
				var id = input.find('input').attr('id');
				$('#' + id).tagit('createTag', $(this).text());
				auto.html(autocomplete[id]['value']);
			}
			auto.hide();
		}
	});
}

$(document).ready(function() {
	if ($('div.autocomplete').length > 0) {
		initAutocomplete();
	}
});


function insertAfter(elem, refElem) {
	var parent = refElem.parentNode;
	var next = refElem.nextSibling;
	if (next) {
		return parent.insertBefore(elem, next);
	} else {
		return parent.appendChild(elem);
	}
}


var ajax = {
	modals: {},
	init: function(url, data, callback, onerror, type, dataType) {
		dataType = dataType || 'json';
		type = type || 'post';
		$.ajax({
			url: url,
			data: data,
			type: type,
			dataType: dataType,
			success: callback,
			error: function() {
				popup.show('Ошибка обработки запроса', 'error', 'topRight', 3000);
				if (typeof onerror === 'function') onerror();
			}
		});
	},
	getForm: function(formName, callback) {
		if (ajax.modals[formName]) {
			callback(ajax.modals[formName]);
		} else{
			ajax.init('/cms/getform/', 'form=' + formName, function(html) {
				ajax.modals[formName] = html;
				callback(html);
			}, false, 'post', 'html');
		}
	},
	getFormFromHTML: function(id, callback) {
		if (!ajax.modals[id]) {
			ajax.modals[id] = $(id).html();
			$(id).remove();
		}
		callback(ajax.modals[id]);
	}
};

function counterLength(obj, idOut) {
	var len = obj.getAttribute('data-length') || 255;

	if (!obj.value) return false;	
	var res = len - obj.value.length;
	var elemOut = document.getElementById(idOut);
	
	if (res < 0) {
		elemOut.innerHTML = 'Лимит превышен на ' + ( -1 * res) + ' ' + plural(res, 'символ', 'символа', 'символов');
	} else {
		elemOut.innerHTML = 'Осталось ' + res + ' ' + plural(res, 'символ', 'символа', 'символов');
	}
}
function plural(number, one, two, five) {
	number = Math.abs(number);
	number %= 100;
	if (number >= 5 && number<= 20) return five;

	number %= 10;
	if (number === 1) return one;
	if (number >= 2 && number <= 4) return two;
	return five;
}

function trimL(s) {
	return s.replace(/^\s+/,'');
}
function trimR(s) {
	return s.replace(/\s+$/,'');
}
function trim(s) {
	return trimR(trimL(s));
}
function trimS(s) {
	return s.replace(/\s{2,}/g,' ');
}

function confirmation(dialog) {
	return confirm(dialog);
}

function getDays(d, m, y) {
	var cd, store = (d.find('option').length > 0) ? d.val() : 1;
	var selected, dc = new Date(y,m,0).getDate();
	if (store > dc) store = dc;
	d.html('');
	for (var i = 1; i <= dc; i++) {
		cd = (i < 10) ? "0"+i : i;
		selected = (i === store) ? ' selected="selected"' : "";
		d.append(' <option value="'+i+'"'+selected+'>'+cd+'</option> ');
	}
}

var messages = {
	createDialog: function(form) {
		var f = $(form);
		var data = f.serialize();

		f.find('.errors').html('');
		f.find('.waitimg').show();
		$.ajax({
			url: f.attr('action'),
			data: data,
			type: 'post',
			dataType: 'json',
			success: function(json) {
				f.find('.waitimg').hide();
				if (json.success) {
					if (json.link) {
						location.href = json.link;
					} else {
						popup.show(json.message, 'success', 'bottomRight', 3000);
						modal.close();
					}
				} else {
					popup.show(json.message, 'error', 'topRight', 3000);
				}
			},
			error: function() {
				f.find('.errors').html('');
				f.find('.waitimg').hide();
				popup.show('Произошла ошибка при отправки ЛС #3', 'error', 'topRight', 3000);
			}
		});
		return false;
	},
	send: function(form) {
		var f = $(form);

		var data = f.serialize();
		$('#imgsendls').show();
		$.ajax({
			url: f.attr('action'),
			data: data + '&sendls=1',
			dataType: 'json',
			type: 'post',
			success: function(json) {
				if (json.success) {
					$('#dialogmessages tr:last').after(json.message);
					f.find('textarea').val('');
				} else {
					popup.show(json.message, 'error', 'topRight', 3000);
				}
				$('#imgsendls').hide();
			},
			error: function() {
				$('#imgsendls').hide();
				popup.show('Ошибка отправки сообщения', 'error', 'topRight', 3000);
			}
		});
		return false;
	},
	removeDialog: function(obj, id) {
		if (!confirm('Удалить данный диалог?')) return false;
		var data = {
			id: id,
			lsdelete: 1
		};

		ajax.init(URL + '/messages/', data, function(json) {
			if (json.success) {
				if (obj) {
					$(obj).parent().remove();
				} else {
					location.href = URL + '/messages/';
				}
			}
			popup.show(json.message, json.success ? 'success' : 'error', 'topRight', 3000);
		});
	}
}

var profile = {
	save: function(form, key) {
		var f = $(form);
		var data = f.serialize() + '&' + key + '=1';
		f.find('img.wait').show();
		ajax.init(f.attr('action') || location.pathname, data, function(json) {
			popup.show(json.message, json.success ? 'success' : 'error', 'topRight', 2500);
			f.find('img.wait').hide();
		}, function() {
			f.find('img.wait').hide();
		});
		return false;
	},
	avatarForm: function() {
		ajax.getFormFromHTML('#avatarform', function(h) {
			modal.open(h, {
				width: '360px'
			});
		})
	}
}


//CKFinder
var fmextends = {

	init: function(params) {
		var hr = window.location.href.split('/');
		var url = location.protocol + '//' + location.host + '/';
		
		if (typeof params === 'undefined') params = {};

		this.client = params.client || 'site';
		this.lang = params.lang;
		
		if (this.client === 'ckeditor') {
			
			params.target.config['filebrowserWindowWidth'] = 900;
			params.target.config['filebrowserWindowHeight'] = 600;
			params.target.config['filebrowserBrowseUrl'] = url + 'ckfinder/ckfinder.html';
			params.target.config['filebrowserUploadUrl'] = url + 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files';
			var type = ['Files', 'Image'];
			
			for (var i in type) {
				params.target.config['filebrowser' + type[i] + 'WindowWidth'] = 900;
				params.target.config['filebrowser' + type[i] + 'WindowHeight'] = 600;
				params.target.config['filebrowser' + type[i] + 'BrowseUrl'] = url + 'ckfinder/ckfinder.html?type=' + type[i] + 's';
				params.target.config['filebrowser' + type[i] + 'UploadUrl'] = url + 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=' + type[i] + 's';
			}
		}
		return true;
	}

}

function stripHTML(oldString) {
	oldString = oldString.replace(/<br \/>/g, '\r\n');
	oldString = oldString.replace(/<br>/g, '\r\n');
	var newString = "";
	var inTag = false;
	for (var i = 0; i < oldString.length; i++) {
		if (oldString.charAt(i) === '<') inTag = true;
		if (oldString.charAt(i) === '>') {
			if(oldString.charAt(i + 1) !== '<') {
				inTag = false;
				i++;
			}
		}
		if (!inTag) newString += oldString.charAt(i);
	}
	return newString;
}

/*
function cpos(o) {
	var area = document.getElementsByName(o).item(0);
	area.focus();
	if(area.selectionStart) return area.selectionStart;
	if (document.selection) {
		var sel = document.selection.createRange();
		var clone = sel.duplicate();
		sel.collapse(true);
		clone.moveToElementText(area);
		clone.setEndPoint('EndToEnd',sel);
		return clone.text.length;
	}
	return 0;
}


function insertTag(o,s,e) {
	var area = document.getElementsByName(o).item(0);
	if (document.getSelection) {
		area.value = area.value.substring(0,area.selectionStart)+s+
		area.value.substring(area.selectionStart,area.selectionEnd)+e+
		area.value.substring(area.selectionEnd,area.value.length);
	} else {
		var selectedText = document.selection.createRange().text;
		if (selectedText != "") {
			var newText = s+selectedText+e;
			document.selection.createRange().text=newText;
		}
	}
	area.focus();
}


var str2url = {
	ru : "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя ?!&:;ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	en : [
			'a','b','v','g','d','e','e','zh','z','i','j','k','l','m','n','o','p','r','s','t',
			'u','f','h','ts','ch','sh','sh','-','i','-','e','yu','ya',
			'a','b','v','g','d','e','e','zh','z','i','j','k','l','m','n','o','p','r','s','t',
			'u','f','h','ts','ch','sh','sh','-','i','-','e','yu','ya','-','-','-','-','-','-',
			'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
		],
	translit : function(str) {
		var tmp_str = "";
		for(var i = 0, l = str.length; i < l; i++) {
			var s = str.charAt(i), n = this.ru.indexOf(s);
			if(n >= 0) tmp_str += this.en[n];
			else tmp_str += s;
		}
		return tmp_str;
	}
}
*/
$(function(){
	/*DONATE*/
	$('span#donate').click(function(e) {
		var elem = this;
		var text = elem.innerHTML;
		elem.innerHTML = '<img src="/images/wait.gif"> Подождите...'
		$.ajax({
			url: URL + '/donate/',
			type: 'post',
			data: 'url=' + encodeURIComponent(location.href),
			dataType: 'json',
			success: function(json) {
				elem.innerHTML = text;
				if (json.success) {
					modal.open(json.message, {
						width: '500px',
						closeButton: false
					});
					_gaq.push(['_trackEvent', 'Donate', 'Article', the_draft_name]);
				} else {
					popup.show(json.message, 'error', 'topRight', '2500');
				}
			},
			error: function() {
				elem.innerHTML = text;
			}
		});
	});

	
	$('img#favArticle').click(function() {

		$.getJSON(URL + '/favorite/', 'favorite=true', function(json) {
			if (!json.success) {
				alert(json.message);
			} else {
				var myNoty = noty({
					text: json.message,
					type: json.type
				});	
			}
		});
		return false;
	});
	
	

	var dv = $("#dvotes span"),dvl = dv.length;
	dv.slice(dvl-parseInt($("#dvotes").attr("dval"),10),dvl).css({backgroundPosition:"0px center"});

	dv.hover(function(){
		dv.css({backgroundPosition:"-15px center"}).slice($(this).index(),dvl).css({backgroundPosition:"0px center"});
		},function(){
			dv.css({backgroundPosition:"-15px center"}).
			slice(dvl-parseInt($("#dvotes").attr("dval"),10),dvl).css({backgroundPosition:"0px center"});
		});

	dv.click(function(){
		var t = dvl-$(this).index();
		$.post("/vote/",{documentvote:Math.random(),action:t,document:document.location.href},function(r){
			r = eval("("+r+")");
			if (r.status == false) {
				alert(r.mess);
				}
			if (r.status == true) {
				$("#dvm").html(r.m);
				$("#dvc").html(r.c);
				$("#dvotes").attr("dval",r.v);
				dv.slice(dvl-r.v,dvl).css({backgroundPosition:"0px center"});
				}
			});
		});

	var taginput = $("#tags"),tblock = $("#liketaglist"),taglist = $("#liketaglist a"),tgs;
	taginput.parents("tr").click(function(){
		tblock.removeClass("viewed");
		});
	taginput.focus(function(){
		if (tblock.html() != "") tblock.addClass("viewed");
		});
	taginput.keyup(function(){

		var value = taginput.val();
		var curPos = document.getElementById('tags').selectionStart - 1;
		var tag = '';
		for (var n = curPos; n >= 0; n--) {
			if (value[n] == ',')
				break;
			tag = value[n] + tag;
		}
		for (var n = curPos + 1; n < value.length; n++) {
			if (value[n] == ',')
				break;
			tag += value[n];
		}

		$.post("/tags/",{symbol: tag},function(tags){
			tags = eval("("+tags+")"),tgs = "";
			for (var c = 0; c < tags.length; c++) {
				tgs += ' <a href="#">'+tags[c].tag+'</a> ';
				}
			tblock.html(tgs);
			if (tgs != "") tblock.addClass("viewed");
			else tblock.removeClass("viewed");
		});
	});

	taglist.live("click",function(){
		var value = taginput.val();
		var curPos = document.getElementById('tags').selectionStart - 1;
		for (var posStart = curPos; posStart >= 0; posStart--)
			if (value[posStart] == ',')
				break;
		for (var posEnd = curPos; posEnd < value.length; posEnd++)
			if (value[posEnd] == ',')
				break;
		var newValue = value.substr(0, posStart + 1) + $(this).text() + value.substr(posEnd)
		taginput.val(newValue)
		tblock.removeClass("viewed");
		return false;
	});

	var msp = $("span#ismoderated"),mch = $("span#ismoderated input");
	mch.click(function(){
		if ($(this).is(":checked")) msp.addClass("moderated");
		else msp.removeClass("moderated");
		});

	var size = $("#tree li").length;
	$("#tree ul a.expand").live("click",function(){
		var thread = $(this);
		var cnt = thread.parent().find("ul").eq(0).length;
		var link = thread.attr("href");
		if (cnt > 0) {
			thread.parent().find("ul").eq(0).toggle();
			}
		else {
			thread.parent().find("a.expand").eq(0).html('<img src="/views/images/wait.gif" />');
			$.get(link,function(data){
				thread.parent().append(data);
				thread.parent().find("a.expand").eq(0).html('');
				});
			}
		return false;
		});

	var selected = $("#dtype").val();
	$("#dtype").change(function(){
		if (!confirm($(this).attr("confirmation"))) {
			$(this).find("option").each(function(){
				if ($(this).attr("value") != selected) $(this).removeAttr("selected");
				else $(this).attr("selected","selected");
				});
			selected = $(this).val();
			}
		else {

			var url = document.location+"getprops/"+$("#dtype").val()+"/";
			var props = {};
			$("#dynamicprops input, #dynamicprops textarea").each(function(){
				props[$(this).attr("name")] = $(this).val();
				});

			$.post(url,props,function(data){
				$("#dynamicprops").html(data);
				});
			}
		});

	$("#docproperies").submit(function(){
		var textarea;
		$("textarea").each(function(){
			textarea = $(this);
			if (textarea.attr("id") != "")
				textarea.val(CKEDITOR.instances[textarea.attr("id")].getData());
			});
		return true;
		});

	var xscroll = false;
	$("#togglexscroll").click(function(){
		if (xscroll) {
			$(this).css("color","#2776ae");
			xscroll = false;
			}
		else {
			$(this).css("color","#ff0000");
			xscroll = true;
			}
		return false;
		});

	$("#tree").mousemove(function(e){
      		if (xscroll) $("#tree").scrollLeft(e.pageX-400);
		});

	$("#generatelink").click(function(){
		var prefix = $("#dname").attr("parent");
		var pagename = str2url.translit($("#pagename").val());
		pagename = (pagename.length != 0) ? prefix+pagename+"/" : "";
		$("#alias").val(pagename);
		return false;
		});

	$("#changeparent").click(function(){
		var plist = $("#parentlist");
		var link = $(this).attr("href");
		if (plist.html() != "") plist.html("").hide();
		else {
			$.get(link,function(data){
				plist.show().append(data);
				});
			}
		return false;
		});

	$("#parentlist ul a.expand").live("click",function(){
		var thread = $(this).parent();
		var cnt = $(this).parent().find("ul").eq(0).length;
		var link = $(this).attr("href");
		if (cnt > 0) {
			$(this).parent().find("ul").eq(0).toggle();
			}
		else {
			$(this).html('<img src="/views/images/wait.gif" />');
			$.get(link,function(data){
				thread.append(data);
				thread.parent().find("a.expand").eq(0).html('');
				});
			}
		return false;
		});

	$("#parentlist ul a.doc").live("click",function(){
		var iparent = $(this).attr("iparent");
		var myid = $("#parentname").attr("myid");

		if (myid != iparent || iparent == 0) {
			$("#parent").val(iparent);
			$("#parentname").html($(this).html());
			$("#parentlist").html("").hide();
			}

		else $(this).css("text-decoration","line-through").css("color","#d0d0d0");

		return false;
		});

	$("#pagename").bind("change",function(){
		var v = $(this).val();
		if (v == "") v = "&nbsp;";
		$("#dname").html(v);
		});



	$("div.msg").click(function(e){
	    if (e.target.nodeName == 'DIV' && e.target.className.indexOf('text') != -1 && e.target.innerHTML != '') return false;

	    else if (e.target.nodeName == 'A') {
		var href = e.target.href;
		if (href.indexOf('sendto') != -1) {
		    window.open(href, '', 'width=680,height=340');
		} else {
		    location.href=href;
		}
		return false;
	    }

	    var n = $(this);
	    var m = n.find('div.text');
	    var _url = URL + '/messages/' + this.id.replace('_', '/') + '/';
	    m.html('');
	    n.removeAttr('style');
	    if (m.hasClass("open")) {
		m.removeClass("open");
	    }
	    else {
		if (m.html() == "") {

		    $.get(_url, function(mess){
			m.html(mess);
			m.addClass("open");

		    });
		}

	    }
	    return false;
	});

	$("div.delmsg a").click(function(){
	    if (confirmation($(this).attr("confirmation"))) {
		$.get($(this).attr("href"), function(){});
		$(this).parent().parent().remove();
	    }
	    return false;
	});

	$("div.reply a,a.replay").live("click",function(){window.open($(this).attr("href"),"","width=680,height=340");return false;});
	$("#bigavatar").click(function(){window.open(URL + "/profile/0/avatar/","","width=420,height=250");return false;});
	$("a.smalldocimage").live("click",function(){window.open("/pub/","","width=400,height=200");return false;});
	$("div.pwindow a").click(function(){window.open($(this).attr("href"),"","width=500,height=600");return false;});

	$("#buildadd").click(function(){
		window.open("/cms/builds/add/", "", "width=700, height=640");
		return false;
	});

	/*Изменяем файл-менеджер на CKFinder*/
	$("#filemanager").click(function(){window.open(ROOT_URL + '/ckfinder/ckfinder.html','','width=800,height=600');return false;});



	$("#comparediff").click(function(){window.open($(this).attr("href"),"","width=850,height=600,scrollbars=yes");return false;});

	/*
	$("#showbday").click(function(){
		var d = $("#bday select");
		if ($(this).is(":checked")) d.removeAttr("disabled");
		else d.attr("disabled",true);
		});
	*/

	$(".cntr").each(function(){cntR($(this),$(this).attr("len"));});
	$("#bm").change(function(){getDays($("#bd"),$(this).val(),$("#by").val())});
	$("#by").change(function(){getDays($("#bd"),$("#bm").val(),$(this).val())});

	var f,els,mess,sign,rqd = {},mx = {};

	function placeNewComment() {
		var margin = 0;
		$("#commentsbox div.comment").each(function(){
			if ($(this).attr("cid") == mx.comm['replay_to']) {
				margin = parseInt($(this).css("margin-left"),10)+20;
				if (margin > 600) margin = 0;
				return;
				}
			});
		var nc = ' <a class="chash" name="comment'+mx.comm['cid']+'"></a> ';
		nc += ' <div class="comment" cid="'+mx.comm['cid']+'" style="margin-left: '+margin+'px;"> ';
		nc += ' <div class="cauthor"> <div class="cvotes">' +
			' <a class="cvotedown" vote="down" href="#"><img alt="down" src="'+mx.comm['imgdir']+'20x20.png" /></a> <p>0</p> ' +
			' <a class="cvoteup" vote="up" href="#"><img alt="up" src="'+mx.comm['imgdir']+'20x20.png" /></a> </div> ';

		if (mx.comm['uid'] > 0) nc += '<a href="/profile/'+mx.comm['uid']+'/">';
		nc += '<img class="cavatar" src="'+mx.comm['avatar']+'" width="30" style="border: solid 1px #b6b6b6;" />';
		if (mx.comm['uid'] > 0) nc += '</a>';

		nc += ' <p> <b class="cmuname"> ';
		if (mx.comm['uid'] > 0) nc += '<a href="/profile/'+mx.comm['uid']+'/">';
		nc += mx.comm['name'];
		if (mx.comm['uid'] > 0) nc += '</a>';
		nc += '</b> '+mx.comm['date']+' </p> </div> <div class="cmtext">'+mx.comm['comment']+'</div> ';
		nc += ' <div class="cmactions"> ';
		nc += ' <a class="crequest" replay="'+mx.comm['cid']+'" href="#commentform">[Ответить]</a> ';
		nc += ' <a class="cqrequest" replay="'+mx.comm['cid']+'" href="#commentform">[Ответить с цитатой]</a> ';
		nc += ' </div> </div> ';

		$("#commentsbox").append(nc);
		}



	$("form.dynamic").submit(function(){
		f = $(this),rqd = {},els = f.find("input,textarea,select"),
		sign = f.find("img.sign"),mess = f.find("div.mess");
		sign.show();
		mess.html("").stop(true).css({opacity:1});
		els.each(function(){
			if ($(this).is(":checkbox") && $(this).is(":checked")) rqd[$(this).attr("name")] = 1;
			else {
				rqd[$(this).attr("name")] = $(this).val();
				if ($(this).attr("after") == "clean") $(this).val("");
				}
			$(this).css({opacity:0.1}).blur();
			});
		$.post(f.attr("action"),rqd,function(m){

			if (f.attr("id") == "addnewcomm") {
				mx = eval("("+m+")");
				if (mx.mess == null) placeNewComment();
				}
			if (typeof(mx.mess) != "undefined") m = mx.mess;
			els.animate({opacity:1},800,function(){
				sign.hide();
				mess.html(m).animate({opacity:0},10000,function(){$(this).html("")});
				});
			mx = {};
			});
		return false;
		});

	$("a.cvotedown, a.cvoteup").live("click",function(){
		var a = $(this).attr("vote"),cid = $(this).parents("div.comment").attr("cid"),p = $(this).parent().find("p"),i;
		$.post("/vote/",{commentvote:Math.random(),action:a,comment:cid},function(r){
			r = eval("("+r+")");
			if (r.status == true) {
				i = (a == "down") ? -1 : 1;
				p.html(parseInt(p.html(),10)+i);
				}
			});
		return false;
		});

	$("a.crequest, a.cqrequest").live("click",function(){
		$("#replay_to").val($(this).attr("replay"));
		var cmun = trimS(trim($(this).parents("div.comment").find("b.cmuname").text())),
			cmtext = stripHTML($(this).parents("div.comment").find("div.cmtext").html());
		if ($(this).hasClass("cqrequest")) {
			insertTag("mycomment","[cite="+cmun+"]"+cmtext,"[/cite]");
			}
		else {
			insertTag("mycomment","[b]"+cmun,"[/b], ");
			}
		});

	$("#mycomment").bind("keyup",function(){
		if ($(this).val().length == 0) {
			$("#replay_to").val(0);
			}
		});

	$("#shcmsmiles").click(function(){
		$("#cmsmilebar").toggle();
		return false;
		});

	$("#addnewcomm").click(function(){
		$("#cmsmilebar").hide();
		});

	$("#pic1").click(function(){
		insertTag("mycomment","[b]","[/b]");
		return false;
		});

	$("#pic2").click(function(){
		insertTag("mycomment","[i]","[/i]");
		return false;
		});

	$("#pic8").click(function(){
		insertTag("mycomment","[strike]","[/strike]");
		return false;
		});

	$("#pic3").click(function(){
		insertTag("mycomment","[underline]","[/underline]");
		return false;
		});

	$("#pic10").click(function(){
		insertTag("mycomment","[left]","[/left]");
		return false;
		});

	$("#pic11").click(function(){
		insertTag("mycomment","[center]","[/center]");
		return false;
		});

	$("#pic12").click(function(){
		insertTag("mycomment","[right]","[/right]");
		return false;
		});

	$("#cmsmilebar img").click(function(){
		insertTag("mycomment"," "+$(this).attr("alt")," ");
		$("#cmsmilebar").toggle();
		});

	$("#pic5").click(function(){
		var link = window.prompt("URL:","http://");
		if (link) insertTag("mycomment","[img]"+link,"[/img]");
		return false;
		});

	$("#pic4").click(function(){
		var link = window.prompt("URL:","http://");
		if (link) insertTag("mycomment","[url="+link+"]"+link,"[/url]");
		return false;
		});

	$("#pic6").click(function(){
		insertTag("mycomment","[quote]","[/quote]");
		return false;
		});

	$("#toggletimer").click(function(){
		var b = $(this);
		if (b.hasClass("imon")) {
			b.removeClass("imon");
			b.html("Off");
            clearTimer();
		} else {
			b.addClass("imon");
			b.html("ON");
			display();
		}
    });

    $('#silentsave').click(function () {
        autosavedata();
    });
});

var autosave = function(elem_id, draft_id) {
	var params = {
		interval: 1000,
		timeToSave: 60 * 2, //time for clocks in seconds
		currentTime: 0,
		enable: true,
		elem: document.getElementById(elem_id)
	};
	var timer, clock, control, message, _callback;

	var printTime = function() {
		var time = params.currentTime;
		var min = Math.floor(time / 60);
		var sec = Math.floor(time % 60);

		var minString = ((min < 10) ? '0' : '') + min.toString();
		var secString = ((sec < 10) ? '0' : '') + sec.toString();
		clock.innerHTML = minString + ':' + secString;
	}

	var timerStart = function() {
		printTime();
		if (params.currentTime == 0) {
			_callback(message);
			params.currentTime = params.timeToSave + 1;
		}
		params.currentTime--;
		timer = setTimeout(arguments.callee, params.interval);
	}

	var clockEnabled = function(e) {
		if (e) params.enable = !params.enable;

		var className = 'clockcontrol';
		if (params.enable) {
			control.innerHTML = 'ON';
			className += ' on';
			if (e) timerStart();
		} else {
			control.innerHTML = 'OFF';
			clearTimeout(timer);
		}
		control.setAttribute('class', className);
	}

	return {
		  init: function(callback) {
			    _callback = callback;
				clock = document.createElement('span');
				control = document.createElement('span');
				message = document.createElement('span');
				clock.setAttribute('class', 'clock');
			    clock.innerHTML = '--:--';

				control.addEventListener('click', clockEnabled, false);
			    clockEnabled();

				message.setAttribute('class', 'ajaxmessages');

			    params.elem.appendChild(clock);
			    params.elem.appendChild(control);
			    params.elem.appendChild(message);
			    params.currentTime = params.timeToSave;
			    printTime();
				timerStart();
		  }
	}
}

function writeMessage(user_id) {
	$.ajax({
		url: URL + '/messages/',
		type: 'post',
		dataType: 'json',
		data: 'write=1&id=' + user_id,
		success: function(json) {
			if (json.success) {
				modal.open(json.message, {
					width: '450px',
					closeBlockScreen: false,
					closeEsc: false
				});

			} else {
				popup.show(json.message, 'error', 'topRight', 3000);
			}
		},
		error: function() {

		}
	});
	return false;
}


var draft_id = null;
var to, tm = 60000, atimer; //Было 60000



function display() {


	if (draft_id == null)
		draft_id = $('#draft_id').val();

	if (draft_id != null)
	{
		location.href = URL + '/drafts/' + draft_id + '/';
	}

    tm -= 1000;
    if (tm < 0) {
        autosavedata();
        clearTimer();
        tm = 60000;
        display();
    } else {
        var u_mins = Math.floor(tm / 60000);
        var tm_m = tm % 60000;
        var u_secs = Math.floor(tm_m / 1000);

        if (u_secs < 10 && u_secs >= 0) u_secs = '0' + u_secs;
        if (u_mins < 10 && u_secs >= 0) u_mins = '0' + u_mins;

        $("#autosavetimer").html(u_mins + ':' + u_secs);
        to = window.setTimeout("display()", 1000); //1000
    }
}

function clearTimer() {
    clearTimeout(to);
}


function autosavedata() {
	
    var pagetext = $.trim(CKEDITOR.instances.pagetext.getData());
    var category = $('select[name="category"]', $('#docproperies')).val();
    var name = $.trim($('input[name="name"]', $('#docproperies')).val());
    var announcement = $.trim($('textarea[name="announcement"]').val());

    var tomoderate = $('input[name="tomoderate"]').is(':checked') ? 1 : '';
	var tags = $('#tags').val();

	var pcb_data = $('input#pcb').prop('checked') ? $('input#pcb').parent().parent().find('select').val() : '';
	var cad_data = $('input#cad').prop('checked') ? $('input#cad').parent().parent().find('select').val() : '';

	var translation_url = $('input#translation').prop('checked') ? $('input#translation_url').val() : '';
	var translation = $('input#translation').prop('checked') ? 'on' : '';

	var sourcenews =$.trim($('#sourcenews').val());

	var attach = $('input[type="hidden"].hidattach').map(function(){
	    return this.value;
	}).get();

	var sources = $('input[type="hidden"].hidsource').map(function(){
	    return this.value;
	}).get();
	var picture = $('#picture_article').val();

	$.post($('#docproperies').attr('action'), {category: category, pagetext: pagetext, name: name, announcement: announcement, attach: attach, tomoderate: tomoderate, tags:tags, pcb:'on', pcb_data:pcb_data, cad:'on', cad_data:cad_data, translation:translation, translation_url: translation_url, sourcenews: sourcenews, sources:sources, picture:picture, savedraft: "fix"}, function(e) {
	  $('span.ajaxmessages', $('#docproperies')).html(e);
        window.setTimeout(function() {
			$('span.ajaxmessages', $('#docproperies')).html('');
		}, 5000);
		
		
    });
}


function checkSave() {
	var pagename = $('input#pagename').val();
	var pagetext = $.trim(CKEDITOR.instances.pagetext.getData());

	if (pagename == '' || pagetext == '') {
		$('input#savedraft').attr('class', 'edit_disabled');
		$('input#savedraft').attr('disabled', '');
		$('td.save').find('#preview').attr('class', 'edit_disabled');
		$('td.save').find('#preview').attr('disabled', '');
	} else {
		$('input#savedraft').attr('class', 'edit');
		$('input#savedraft').removeAttr('disabled');
		$('td.save').find('#preview').attr('class', 'edit');
		$('td.save').find('#preview').removeAttr('disabled', '');
	}
}

function nameTextBlur() {
	$('input#pagename').keyup(function() {
		checkSave();
	});

	CKEDITOR.instances.pagetext.on('key', (function() {
		checkSave();
	}));
}

popup = {
	noty: null,
	show: function(text, type, layout, time) {
		var params = {
			text: text,
			type: type,
			layout: layout,
			dismissQueue: true,
			force: true,
			timeout: time,
			closeWith: ['button']
		};
		this.noty = noty(params);
	}
}

var drafts = {
	/* show of hide source for news */
	toggleSourceNews: function() {
		if ($('#articledir option:selected').val() == '1') {
			$('#sourceNewsDiv').show();
		} else {
			$('#sourcenews').val('');
			$('#sourceNewsDiv').hide();
		}
	},
	browseCKFinder: function(path, callback) {
		var finder = new CKFinder();
		finder.startupPath = path;
		if (callback && typeof callback === 'function') finder.selectActionFunction = callback;
		finder.popup();
	},
	getRules: function() {
		ajax.init(location.protocol + '//' + location.host + '/cms/drafts/', 'getrules=1', function(json) {
			if (json.success) modal.open(json.text, {width: '550px'});
		});
		return false;
	},
	checkReason: function(elem) {
		var text = elem.value;
		if (text.trim().length > 10) {
			console.log(1);
			$('#sendmoder').attr('disabled', false).attr('class', 'button-ok');
		} else {
			console.log(0);
			$('#sendmoder').attr('disabled', true).attr('class', 'button-gray');
		}
	},
	init: function() {
		drafts.toggleSourceNews();
		$('#articledir').change(drafts.toggleSourceNews);

		$('input:file').live('change', drafts.fileDialogChange);
		$('input:file').live('mouseover', drafts.fileDialogMouseOver);
		$('input:file').live('mouseout', drafts.fileDialogMouseOut);
		$('div.attach img').live('click', drafts.deleteAttachment);


		$('#openYoutube').click(drafts.openVideoDialog);
		$('.addYoutube').live('click', drafts.uploadVideo);
		$('div.ytmarker').live('click', drafts.addYoutubeMarker);
		$('.yt img').live('click', drafts.removeVideo);

		$('div#additional input:checkbox').click(drafts.showAdditionalData);

		if (typeof draft == 'object') {
			if (draft.pcb && draft.pcb != '') {
				var select = $('input#pcb').parent().parent().find('select');
				select.find('option[value="' + draft.pcb + '"]').attr('selected', true);
				select.show();
			}

			if (draft.cad && draft.cad != '') {
				var select = $('input#cad').parent().parent().find('select');
				select.find('option[value="' + draft.cad + '"]').attr('selected', true);
				select.show();
			}

			if (draft.translation && draft.translation != '') {
				$('input#translation_url').show();
			}
		}
	},
	blockDraft: function() {
		ajax.init(location.pathname, 'editor=1', function(json) {
			console.log(json);
		});
	},

	browsePicture: function() {
		drafts.browseCKFinder('Images:/', function(fileUrl, data) {
			$('#picture_article').val(fileUrl);
		});
	},
	browseFile: function() {
		drafts.browseCKFinder('Files:/', function(fileUrl, data) {
			fileUrl = decodeURIComponent(fileUrl);
			var fileInfo = fileUrl.split('/');
			var fileName = fileInfo[fileInfo.length - 1];
			if (fileUrl.indexOf('/images/') > -1) {
				alert('Иллюстрации к статье необходимо прикреплять в редакторе выше (иконка "Изображение")');
			} else {
				var info = fileUrl.toString().split('.');
				var ext = info[info.length - 1].toLowerCase();
				if (ext == 'spl' || ext == 'spl7') {
					alert('Для прикрепления исходников, используйте форму ниже');
				} else {
					$('#attachment').append('<div class="attach"><div class="left"><a href="' + location.protocol + '//' + location.host + fileUrl + '">' + fileName + '</a> (' + data['fileSize'] + ' Кб)</div><input type="hidden" class="hidattach" name="attach[]" value="' + fileUrl + '"><img title="Убрать файл [' + fileName + ']" class="delimage" src="' + ROOT_URL + '/images/mode_delete_small.png"></div>');
				}
			}
		});
	},
	browseSource: function() {
		drafts.browseCKFinder('Files:/', function(fileUrl, data) {
			fileUrl = decodeURIComponent(fileUrl);
			var fileInfo = fileUrl.split('/');
			var fileName = fileInfo[fileInfo.length-1];
			if (fileUrl.indexOf('/images/') > -1) {
				alert('Иллюстрации к статье необходимо прикреплять в редакторе выше (иконка "Изображение")');
			} else {
				var info = fileUrl.toString().split('.');
				var ext = info[info.length - 1].toLowerCase();
				if (ext == 'lay' || ext == 'pdf') {
					alert('Данный файл не является исходником');
				} else {
					$('#sources').append('<div class="attach"><div class="left"><a href="' + location.protocol + '//' + location.host + fileUrl + '">' + fileName + '</a> (' + data['fileSize'] + ' Кб)</div><input type="hidden" class="hidsource" name="sources[]" value="' + fileUrl + '"><img title="Убрать файл [' + fileName + ']" class="delimage" src="' + ROOT_URL + '/images/mode_delete_small.png"></div>');
				}
			}
		});
	},
	deleteAttachment: function() {
		var text = $(this).parent().text();
		if (confirm('Убрать прикрепленный файл [' + text.trim() + ']?')) {
			$(this).parent().remove();
		}
	},

	fileDialogChange: function() {
		var t = $(this).val();
		if (t.indexOf('C:\\fakepath\\') + 1) t = t.substr(12);
		var e = $(this).next().find('input:text');
		e.val(t);
	},
	fileDialogMouseOver: function() {
		$('.upload_fake input').addClass('upload_hover');
	},
	fileDialogMouseOut: function() {
		$('.upload_fake input').removeClass('upload_hover');
	},

	openVideoDialog: function() {
		var i = parseInt(draft.id);
		if (isNaN(i) || i === 0) {
			popup.show('Вам нужно сначала сохранить статью', 'error', 'topRight', 2000);
			return false;
		}
		if (window.opera) {
			popup.show('К сожалению, через бразуер Opera видео нельзя загрузить. По возможности воспользуйтесь Chrome или Firefox', 'error', 'topRight', 4500);
			return false;
		}

		modal.open($('.video_field').html(), { closeBlockScreen: false, width: '520px' });
		$('.addYoutube').show();
	},
	uploadVideo: function() {
		var mw = $('.modalwindow');
		mw.find('.yt_error').html('');

		var inputFileId = 'yt_file_uniq';
		var data = {
			title: mw.find('#yt_name').val(),
			file: mw.find('#yt_file').val(),
			description: 'Видео к статье: http://cxem.net [статья в ближайшее время будет опубликована]',
			category: 'Tech',
			keywords: 'DIY, Electronics, Своими руками, Электроника, Радиоэлектроника, ' + $('#tags').val(),
			action: 'connect',
			inputFileId: inputFileId
		};

		var error = [];

		if (data.title == '') error.push('Не указано название видео');
		if (data.file == '') error.push('Не выбран видео-файл');
		if (error.length > 0) {
			mw.find('.yt_error').html(error.join('<br>'));
			setTimeout(function() {
				mw.find('.yt_error').html('');
			}, 3000);
			return false;
		}

		mw.find('#yt_file').attr('id', inputFileId); //for modal window

		youtube.connect(data, mw);

		/*var uploadURL = URL + '/plugins/yt_upload/connect.php';
		var uploadingInProgress = function() {
			mw.find('.panel').hide();
			mw.find('legend').text('Выполняется загрузка видео');
			mw.find('p.uploadprogress').show();
			mw.find('.addYoutube').hide();
		};
		var onUploaded = function(data) {
			if (typeof data === 'string') data = window.JSON.parse(data);
			if (!data.result) {
				mw.find('.yt_error').html(data.error);
				return false;
			}
			popup.show('Видео было загружено. Обработка данных..', 'alert', 'topRight', 2000);
			var dataDraft = 'draft_id=' + draft.id + '&youtube=' + data.id;
			$.ajax({
				url: URL + '/videoedit/',
				type: 'post',
				dataType: 'json',
				data: dataDraft,
				success: function(json) {
					popup.noty.setText(json.message)
					popup.noty.setType(json.type);
					if (json.success) {
						var youtube = json.html;
						($('.yt').length == 0) ? $('.videos').html(youtube) : $('.videos').append(youtube);
					}
					modal.close();
				}
			});
		};


		//$.uploadVideo(uploadURL, inputFileId, data, uploadingInProgress, onUploaded);*/
	},
	removeVideo: function() {
		if (!confirm('Удалить данное видео?')) return false;
		popup.show('Запрос на удаление видео...', 'alert', 'topRight', 1500);

		var div = $(this).parent();
		var id = div.find('input:hidden').attr('value');

		$.ajax({
			type: 'post',
			url: URL + '/videoedit/',
			data: 'action=delete&youtube=' + id,
			dataType: 'json',
			success: function(json) {
				popup.noty.setText(json.message)
				popup.noty.setType(json.type);
				if (json.success) {
					div.remove();
					if ($('.yt').length == 0) $('.videos').html('Нет добавленных видео файлов');
				}
			}
		});
	},
	addYoutubeMarker: function() {
		var data = $(this).data('value');
		CKEDITOR.instances["pagetext"].insertText(data);
	},

	showAdditionalData: function() {
		var elem = $(this).parent().parent().find('select, input#translation_url');
		if ($(this).prop('checked')) {
			elem.show();
		} else {
			elem.hide();
		}
	},
	autoSaveCallback: function(message) {

		var pagetext = $.trim(CKEDITOR.instances.pagetext.getData());
		var category = $('select[name="category"]', $('#docproperies')).val();
		var name = $.trim($('input[name="name"]', $('#docproperies')).val());
		var announcement = $.trim($('textarea[name="announcement"]').val());

		var tomoderate = $('input[name="tomoderate"]').is(':checked') ? 1 : '';
		var tags = $('#tags').val();

		var pcb_data = $('input#pcb').prop('checked') ? $('input#pcb').parent().parent().find('select').val() : '';
		var cad_data = $('input#cad').prop('checked') ? $('input#cad').parent().parent().find('select').val() : '';

		var translation_url = $('input#translation').prop('checked') ? $('input#translation_url').val() : '';
		var translation = $('input#translation').prop('checked') ? 'on' : '';

		var sourcenews =$.trim($('#sourcenews').val());

		var attach = $('input[type="hidden"].hidattach').map(function(){
			return this.value;
		}).get();

		var sources = $('input[type="hidden"].hidsource').map(function(){
			return this.value;
		}).get();
		var picture = $('#picture_article').val();
		var token = $('#token').val();
		
		

		var data = {
			category: category,
			pagetext: pagetext,
			name: name,
			announcement: announcement,
			attach: attach,
			tomoderate: tomoderate,
			tags:tags,
			pcb:'on',
			pcb_data:pcb_data,
			cad:'on',
			cad_data:cad_data,
			translation:translation,
			translation_url: translation_url,
			sourcenews: sourcenews,
			sources:sources,
			picture_article:picture,
			token: token,
			savedraft: "fix"
		};
		var description = $('textarea[name="description"]');
		if (description.length > 0) data.description = description.val();

		$.ajax({
			url: $('#docproperies').attr('action'),
			type: 'post',
			dataType: 'json',
			data: data,
			success: function(json) {
				if (json.isnew && json.link) {
					if (history && typeof history.replaceState == 'function') {
						history.replaceState(null, null, json.link);
						document.title = json.title;
						$('#docproperies').attr('action', json.link);
						var hidden = $('<input type="hidden" id="token" name="token" value="' + json.token + '">');
						$('#docproperies').append(hidden);
					} else {
						location.href = json.link;
					}
				} else {
					if (json.session) {
						popup.show(json.message, 'error', 'topRight', 3000);
						location.href = json.link;
					} else {
						message.innerHTML = json.message;
						setTimeout(function() {
							message.innerHTML = '';
						}, 5000);
					}
				}
			}
		});

	}
}

youtube = {
	connect: function(data, form) {
		youtube.printMessage({success: true, message: 'Устанавливаем соединение...'}, form);
		$.ajax({
			url: '/cms/videoedit/',
			type: 'post',
			dataType: 'json',
			data: data,
			success: function (json) {
				youtube.printMessage(json, form);
				if (json.success) youtube.upload(json, data.inputFileId, form);
			}
		});
	},

	upload: function(json, fileId, modalform) {
		json.message = 'Подготовка данных для загрузки видео-файла';
		youtube.printMessage(json, modalform);

		modalform.find('.panel').hide();
		modalform.find('legend').text('Выполняется загрузка видео');
		modalform.find('p.uploadprogress').show();
		modalform.find('.addYoutube').hide();

		var form = $('<form action="' + json.url + '" method="post" enctype="multipart/form-data">');
		form.attr('id', 'iform');
		form.appendTo(document.body);
		form.css({
			'position': 'absolute',
			'top': '-50%',
			'left': '-50%'
		});

		var file = $('#' + fileId);
		file.attr('name', 'file');
		file.appendTo(form);
		var hidden = $('<input type="hidden" name="token" value="' + json.token + '">');
		hidden.appendTo(form);

		var iframe = $('<iframe>');
		iframe.css({
			'position': 'absolute',
			'top': '-50%',
			'left': '-50%'
		});
		iframe.attr('name', 'iyoutube');
		iframe.attr('id', 'iyoutube');
		iframe.attr('src', json.nexturl);
		iframe.appendTo(document.body);

		form.attr('target', 'iyoutube');
		json.message = 'Видео в процессе загрузки. Ожидайте...'
		youtube.printMessage(json, modalform);
		form.submit();

		iframe.load(function() {
			var uri = window.frames['iyoutube'].location.href;

			iframe.remove();
			form.remove();
			var status, id;

			try {
				var reg1 = new RegExp('status=([0-9]+)', 'i');
				var reg2 = new RegExp('id=(.*)', 'i');
				status = uri.match(reg1);
				id = uri.match(reg2);

				status = status[1] || 0;
				id = id[1] || '';
			} catch (ee) {
				var pos = url.lastIndexOf('?');
				url = url.substr(pos + 1);
				var status_pos = url.lastIndexOf('status=');
				var id_pos = url.lastIndexOf('id=');

				status = url.substr(7, id_pos - 8);
				id = url.substr(id_pos + 3);
			}

			var result = {
				status: status || 0,
				id: id || '',
				result: true
			};

			if (result.status != 200) {
				youtube.printMessage({success: false, message: 'Видео не было загружено'}, modalform);
			}
			else if (result.id == '') {
				youtube.printMessage({success: false, message: 'Неизвестная ошибка при загрузке видео'}, modalform);
			}
			else {
				youtube.printMessage({success: true, message: 'Видео успешно было загружено...'}, modalform);
				youtube.unloaded(result);
			}
			modal.close();

		});
	},
	unloaded: function(data) {

		popup.show('Видео было загружено. Обработка данных..', 'alert', 'topRight', 2000);
		var dataDraft = 'draft_id=' + draft.id + '&youtube=' + data.id;
		$.ajax({
			url: URL + '/videoedit/',
			type: 'post',
			dataType: 'json',
			data: dataDraft,
			success: function(json) {
				popup.noty.setText(json.message)
				popup.noty.setType(json.type);
				if (json.success) {
					var youtube = json.html;
					($('.yt').length == 0) ? $('.videos').html(youtube) : $('.videos').append(youtube);
				}
			}
		});
	},
	printMessage: function(json, form) {
		var color = (json.success) ? 'green' : '#a00';
		var text = '<span style="color: ' + color + '">' + json.message + '</span>';
		form.find('.yt_error').html(text);
	}
}

var ignorecke = function(cb, id) {
	var data = 'ignorecke=1&id=' + id + '&status=' + (cb.checked ? 1 : 0);
	ajax.init(URL + '/drafts/', data, function(json) {
		popup.show(json.message, json.success ? 'information' : 'error', 'top', 3000);
	});
}