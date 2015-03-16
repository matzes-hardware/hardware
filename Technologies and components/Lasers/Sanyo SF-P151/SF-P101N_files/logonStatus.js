;void function($){

var header = {
	athena: function(){
		$.ajax({
			url:'/head/headInfo.do',
			type:'post',
			dataType:'json',
			success: function(data){
				switchLogonStatus(data[0].status,data[0].welcomeUserName,data[0].newMailNumber);
			}
		});
	
		function switchLogonStatus(status,welName,msgNum) {
			var localPage = encodeURIComponent(window.location.href);
			var loginList = $('.state').eq(0);
			var msgCount = status[3] || 0;
			var wel = '<li class="user" id="welUser">Welcome <a href="http://membercenter.made-in-china.com"><strong>'+ (welName || '') +
				'</strong></a>!</li>';
			var msg = '<li class="message menu-item"><a href="http://membercenter.made-in-china.com/messagecenter.do?xcase=inbox" alt="'+
			msgNum +' New Message(s)" title="'+ msgNum +' New Message(s)" class="red">'+
				'<i class="icon">&#xf0e0;</i>'+ msgNum +'</a></li>';
			var signout = '<li class="sign"><a rel="nofollow" href="https://login.made-in-china.com/logon.do?xcase=doLogout&baseNextPage='+ localPage +
				'">Sign Out</a></li>';
			if (!status) {
				var html = '<li class="user">New user? <a rel="nofollow" href="http://membercenter.made-in-china.com/join/">Join Free</a></li>'+
					'<li class="sign"><a rel="nofollow" href="javascript:login();">' +
					'Sign In</a></li>';
				loginList.empty();
				loginList.html(html);
				return;
			}
			loginList.empty();
			loginList.html(wel + msg + signout);
		}
	},
	now: function(){
		var _params = '';

		// for audited supplier report cart
		if ($('#top .site-nav .inquiry a').eq(0).attr('href') === '/report-cart/') {
			_params = '&sc=1';
		}

		window.MIC_SRVRNM = document.location.protocol + '//' + document.location.host;

		var logonStatusURI = (window.MIC_SRVRNM || '') + '/ajaxfunction.do?xcase=ajaxlogonconnection'+ _params +'&t='+ new Date().getTime();
		$.get(logonStatusURI, function(data) {
			var str = data.replace(/^.*(\[.*\]).*$/g, '$1');
			switchLogonStatus(eval(str));
		});

		/**
		 * 切换登陆状态
		 * @param {Array} status [loginStatus, userName, inquiryNumber, msgNumber]
		 */
		function switchLogonStatus(status) {
			if (!status || !status.length) {
				return;
			}

			var localPage = encodeURIComponent(window.location.href);
			var loginList = $('#top .user-nav').eq(0);
			var inquiryNumber = $('#top .site-nav .inquiry a strong')[0];
			var msgCount = status[3] || 0;
			var wel = '<li class="first menu-item">Welcome <a href="http://membercenter.made-in-china.com"><strong>'+ (status[1] || '') +
				'</strong></a>!';
			var msg = '<li class="message menu-item"><a href="http://membercenter.made-in-china.com/messagecenter.do?xcase=inbox" alt="'+
				msgCount +' New Message(s)" title="'+ msgCount +' New Message(s)" class="red">'+
				'<i class="icon">&#xf0e0;</i>'+ msgCount +'</a></li>';
			var signout = '<li class="menu-item last"><a rel="nofollow" href="https://login.made-in-china.com/logon.do?xcase=doLogout&baseNextPage='+ localPage +
				'">Sign Out</a></li>';

			inquiryNumber.innerHTML = status[2] || 0;

			if (!status[0]) {
				var html = '<li class="first menu-item">New user? <a rel="nofollow" href="http://membercenter.made-in-china.com/join/">Join Free</a></li>'+
					'<li class="signin menu-item"><a rel="nofollow" href="https://login.made-in-china.com/logon.do?xcase=logon&amp;baseNextPage=' + localPage +'">' +
					'Sign In</a></li>';
				loginList.empty();
				loginList.html(html);
				return;
			}
			loginList.empty();
			loginList.html(wel + msg + signout);
		}
	},
	old: function(){
		//if(!window.requestLogonStatus){
			/** code from  /script/sr.js */
			window.MIC_SRVRNM = document.location.protocol + '//' + document.location.host;
			var requestLogonStatus = function(){
				var logonStatusTimerMax = 1700;
				var logonStatusTimer = null;
				var logonStatusURI = (window.MIC_SRVRNM || '') + '/ajaxfunction.do?xcase=ajaxlogonconnection';
				var switchLogonStatus = function(){
					if (!window.logonStatus) {
						return
					}
					//clearInterval(logonStatusTimer);
					var welcomeSpan = document.getElementById('welcome_logon_span');
					var inquirySpan = document.getElementById('inquiry_number_span');
					var joinSpan = document.getElementById('join_now_span');
					var logoutSpan = document.getElementById('logout_span');
					var logonSpan = document.getElementById('logon_span');
					var newMsgElement = document.getElementById("newMsg");
					var vohomeSpan = document.getElementById("vohome_span");
					if (parseInt(logonStatus[0]) > 0) {
						welcomeSpan && (welcomeSpan.innerHTML = 'Welcome <a href="http://membercenter.made-in-china.com">'+(logonStatus[1]?'<strong>'+document.createTextNode(logonStatus[1]).nodeValue+'</strong>':'')+'!</a> ');
						inquirySpan && (inquirySpan.innerHTML = logonStatus[2]);
						joinSpan && (joinSpan.style.display = 'none');
						logoutSpan && (logoutSpan.style.display = 'inline');
						logonSpan && (logonSpan.style.display = 'none');
						vohomeSpan && (vohomeSpan.style.display = 'inline');
						if (parseInt(logonStatus[3]) > 0) {
							if (!newMsgElement) {
								newMsgElement = document.createElement('span');
								newMsgElement.setAttribute("id", "newMsg");
								welcomeSpan.parentNode.insertBefore(newMsgElement, welcomeSpan.nextSibling)
							}
							newMsgElement.innerHTML = ' | <a href="http://membercenter.made-in-china.com/messagecenter.do?xcase=inbox"><img src="/images/new_msg.gif"  alt="#N0# New Message(s)" title="#N0# New Message(s)" /> #N0#</a>'.replace(/#N0#/g, logonStatus[3]);
							newMsgElement.style.display = 'inline'
						}
						else {
							newMsgElement && (newMsgElement.style.display = 'none')
						}
					}
					else {
						welcomeSpan && (welcomeSpan.innerHTML = '');
						inquirySpan && (inquirySpan.innerHTML = logonStatus[2]);
						joinSpan && (joinSpan.style.display = 'inline');
						logoutSpan && (logoutSpan.style.display = 'none');
						logonSpan && (logonSpan.style.display = 'inline');
						newMsgElement && (newMsgElement.style.display = 'none')
					}
				};
				
				/*var logonStatusScript = document.createElement("script");
				logonStatusScript.setAttribute("type", "text/javascript");
				logonStatusScript.setAttribute("src", logonStatusURI + '&time=' + new Date().getTime());
				document.getElementsByTagName("head").item(0).appendChild(logonStatusScript);
				logonStatusTimer = setInterval(function(){
					switchLogonStatus();
					logonStatusTimerMax -= 50;
					if (logonStatusTimerMax < 0) {
						clearInterval(logonStatusTimer)
					}
				}, 50)*/
				
				$.get(window.location.protocol + '\/\/' + window.location.host + '/ajaxfunction.do?xcase=getLoginStatus', function(rsp){
					$.get(logonStatusURI, function(data) {
						var str = data.replace(/^var\s*/, 'window.');
						eval(str);
						switchLogonStatus();
					});
				});
			};
			
			window.addMICtoFavorite = function(url_site, home_site){
				try {
					window.external.AddFavorite(url_site, home_site)
				}
				catch (e) {
				}
			}
		//}
		
		return function(){
			try {
				logonStatus = '';
				requestLogonStatus();
				
				if (document.body.outerHTML) {
					document.getElementById('welcome_fav').outerHTML = '<a id="welcome_fav" href="javascript:addMICtoFavorite(\'http://www.made-in-china.com', 'Made-in-China.com - The world of China products\');">Add Made-in-China.com to your favorites list</a>'
				}
			}
			catch (e) {}
		};
	}.call(this)
};

window.headerStatus = header;

}.call(this, window.jQuery);