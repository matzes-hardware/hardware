;void function(){

var execute = function(){

;jQuery(function(){
	var noop = function(){};
	var tmParams;
	var $tmHolders;
	var comStatus;

	var WARN = {
		NO_RIGHT: 'TradeMessenger is currently available to Premium members and non-Chinese buyers.'
	};

	var toString = Object.prototype.toString;
	var util = {
		map: function(arr, fn){
			var ret;
			var type = toString.call(arr).match(/\w+/g)[1];
			if(type === 'Array'){
				ret = [];
				for(var i = 0; i < arr.length; i++){
					ret.push(fn(i, arr[i]));
				}
			}else if(type === 'Object'){
				ret = {};
				for(var key in arr){
					ret[key] = fn(key, arr[key]);
				}
			}

			return ret;
		},
		where: function(arr, fn){
			var ret;
			var flag;
			var type = toString.call(arr).match(/\w+/g)[1];
			if(type === 'Array'){
				ret = [];
				for(var i = 0; i < arr.length; i++){
					flag = fn(i, arr[i]);
					if(flag){
						ret.push(arr[i]);
					}
				}
			}else if(type === 'Object'){
				ret = {};
				for(var key in arr){
					flag = fn(key, arr[key]);
					if(flag){
						ret[key] = arr[key];
					}
				}
			}

			return ret;
		},
		indexOf: function(arr, val){
			var ret = -1;
			for(var i = 0; i < arr.length; i++){
				if(arr[i] === val){
					ret = i;
					break;
				}
			}

			return ret;
		}
	};

	//tm server uri base
	var getTmParams = function(callback){
		var vo = 'http:\/\/membercenter.made-in-china.com';
		var en = 'http:\/\/www.made-in-china.com';
		var tm = 'http:\/\/webim.en.trademessenger.com';
		var login = 'https:\/\/login.made-in-china.com';

		var url_params = tm + '/tm/assets_config.jsonp';

		jQuery.ajax({
			url: url_params,
			dataType: 'jsonp',
			jsonp: 'callback',
			success: function(data){
				var params = {
					tm: tm, //webTM 服务器地址
					seajsBase: tm + data.basePath,
					seajs: tm + data.seajsPath,
					seajsCfg: tm + data.basePath + data.seajsConfigPath,
					clientTM: tm + data.basePath + data.helper, //clientTM 状态对象加载地址
					webTM: tm + data.basePath + data.webtm, //webTM 加载地址
					userTMStatus: tm + '/tm/user_state.jsonp',	//用户的tm登录状态

					vo: vo,
					en: en,
					token: vo + '/tm.do?xcase=token4TMWeb&callback=?',			//mic 的token
					users: en + '/im.do?xcase=getSubAccount',
					choose2talk: en + '/im.do?xcase=chooseUserToTalk4TM3',
					audit: vo + '/tm.do?xcase=tmRightsCheck',

					login: login + '/logon.do?xcase=logonPage4TM3',
					transition: en + '/im.do?xcase=tmLogonHandle',

					holderSelector: '.tm3_chat_status',
					URL_THRESHOLD: 1500
				};

				tmParams = params;
				callback(params);
			}
		});
	};

	//////////////////

	//load seajs
	var loadSeajs = function(){
		if(!window.seajs){
			;(function(m, o, d, u, l, a, r) {
				if(m[o]) return;
				function f(n) { return function() { r.push(n, arguments); return a } }
				m[o] = a = { args: (r = []), config: f(1), use: f(2), on: f(3) }
				m.define = f(0);
				u = d.createElement("script");
				u.id = o + "node";
				u.async = true;
				u.src = tmParams.seajs;
				l = d.getElementsByTagName("head")[0];
				l.appendChild(u);
			})(window, "seajs", document);
		}

        seajs.config({
            preload: [tmParams.seajsCfg],
			vars: {
				locale: 'en'
			}
        });
	};

	//// TM
	var TM = function(api){
		this.api = api || null;
		this.isReady = false;
		this.readyEvents = [];
	};

	TM.prototype = {
		execReady: function(){
			if(this.isReady){
				for(var i = 0; i < this.readyEvents.length; i++){
					this.readyEvents[i].call(this);
				}

				this.readyEvents = [];
			}
		},
		ready: function(fn){
			typeof fn === 'function' && this.readyEvents.push(fn);
			this.execReady();
		},
		beReady: function(){
			this.isReady = true;
			this.execReady();
		},
		setApi: function(api){
			if(api){
				this.api = api;
				this.beReady();
			}
		},
		chatTo: function(data){
			this.api.startChatTo(data);
		}
	};

	var tm = new TM();
	////////////////
	// render
	var Render = function(){
		this.isReady = false;
		this.readyEvents = [];
	};

	Render.prototype = {
		execReady: function(){
			if(this.isReady){
				for(var i = 0; i < this.readyEvents.length; i++){
					this.readyEvents[i].call(this);
				}
			}
		},
		ready: function(fn){
			typeof fn === 'function' && this.readyEvents.push(fn);
			this.execReady();
		},
		beReady: function(){
			this.isReady = true;
			this.execReady();
		}
	};

	var render = new Render();
	///////////////////////
	var btnTags = {
		chat: '<a class="tm-on" href="javascript:void(\'Talk to me!\')" title="Talk to me!">Talk to me!</a>',
		online: '<a class="tm-on" href="javascript:void(\'Chat Now!\')" title="Chat Now">Online</a>',
		list: {
			wrap: '<div class="tmer-list">' +
				'<div class="tm-manager-box"><span>Sales Manager: </span><div class="inline tm-manager"></div></div>' +
				'<div class="tm-person-box"><span>Sales Person: </span><div class="inline tm-person"></div></div>' +
			'</div>',
			button: '<a class="tm-user" href="javascript:void(\'Chat Now!\')" title="Chat Now"></a>'
		},
		fixed: '<a class="tm" href="javascript:void(\'Chat Now!\')" title="Chat Now"></a>',
		teletext: '<div class="J-status"><div class="pic"><a href="#"><img src="http://img.made-in-china.com/img/athena/tm-offline.png" alt="Offline" /></a></div><a href="#" class="J-title">TM</a></div>',

		texticon: '<a href="javascript:void(\'Chat Now\')" title="Chat Now" class="tm"><i class="icon">&#xf092;</i></a>'
	};

	// 处理器分支
	var procs = {};

	//texticon
	procs.texticon = function(holder){
		this.$elem = jQuery(btnTags.texticon);
		this.$elem.insertAfter(holder);
	};

	procs.texticon.prototype = {
		online: function(callback){
			this.$elem.show();
			typeof callback === 'function' && callback();
		},
		offline: function(callback){
			this.$elem.addClass('offline').show()
			typeof callback === 'function' && callback();
		}
	};

	// fixed
	procs.fixed = function(holder){
		this.$elem = jQuery(btnTags.fixed);
		this.$elem.insertAfter(holder);
	};

	procs.fixed.prototype = {
		online: function(callback){
			this.$elem.show();
			typeof callback === 'function' && callback();
		},
		offline: function(callback){
			this.$elem.hide();
			typeof callback === 'function' && callback();
		}
	};

	// teletext
	procs.teletext = function(holder){
		this.$elem = jQuery(btnTags.teletext);
		this.$elem.insertAfter(holder);
	};

	procs.teletext.prototype = {
		online: function(callback){
			this.$elem.removeClass('offline').addClass('online');
			this.$elem.find('img').attr({alt: 'online', src: 'http://img.made-in-china.com/img/athena/tm-online.png'});
			this.$elem.find('J-title').html('Online');
			typeof callback === 'function' && callback();
		},
		offline: function(callback){
			this.$elem.removeClass('online').addClass('offline');
			this.$elem.find('img').attr({alt: 'offline', src: 'http://img.made-in-china.com/img/athena/tm-offline.png'});
			this.$elem.find('J-title').html('Offline');
			typeof callback === 'function' && callback();
		}
	};

	// chat
	procs.chat = function(holder){
		this.$elem = jQuery(btnTags.chat);
		this.$elem.insertAfter(holder);
	};

	procs.chat.prototype = {
		online: function(callback){
			this.$elem.show();
			typeof callback === 'function' && callback();
		},
		offline: function(callback){
			this.$elem.hide();
			typeof callback === 'function' && callback();
		}
	};

	// online
	procs.online = function(holder){
		this.$elem = jQuery(btnTags.online);
		this.$elem.insertAfter(holder);
	};

	procs.online.prototype = {
		online: function(callback){
			this.$elem.removeClass('tm-off');
			this.$elem.html('Online');
			typeof callback === 'function' && callback();
		},
		offline: function(callback){
			this.$elem.addClass('tm-off');
			this.$elem.html('Offline');
			typeof callback === 'function' && callback();
		}
	};

	// chat user list
	procs.list = function(holder, users){
		var $wrap = this.$wrap = jQuery(btnTags.list.wrap);
		$wrap.insertAfter(holder);
		this.$managerBox = $wrap.find('.tm-manager-box');
		this.$personBox = $wrap.find('.tm-person-box');
		var $manager = $wrap.find('.tm-manager');
		var $person = $wrap.find('.tm-person');
		var r_isManager = /00$/;

		this._ = {
			has: {
				manager: 0,
				person: 0
			}
		}

		var elems = [];
		var elem;
		var user;
		for(var i = 0; i < users.length; i++){
			user = users[i];
			elem = jQuery(btnTags.list.button).html(user.name)[0];
			elem.uid = user.id;
			if(r_isManager.test(user.id)){
				$manager.append(elem);
				this._.has.manager++;
			}else{
				$person.append(elem);
				this._.has.person++;
			}

			elems.push(elem);
		}

		this.$elem = jQuery(elems);

		!$manager.children('a.tm-user').length && $manager.hide();
		!$person.children('a.tm-user').length && $person.hide();
	};

	procs.list.prototype = {
		online: function(callback){
			//this.$elem.removeClass('tm-off');
			if(!this._.has.manager && !this._.has.person){
				this.$wrap.hide();
			}else{
				this.$wrap.show();
				this.$elem.show();

				if(!this._.has.manager){
					this.$managerBox.hide();
				}

				if(!this._.has.person){
					this.$personBox.hide();
				}
			}
			typeof callback === 'function' && callback();
		},
		offline: function(callback){
			//this.$elem.addClass('tm-off');
			this.$elem.hide();
			typeof callback === 'function' && callback();
		}
	};

	//
	var genButton = function(holder, users){
		var procName = holder.getAttribute('processor');
		if(procName in procs){
			var button = new procs[procName](holder, users);
			button.$elem.click(function(e){
				e.stopPropagation();
				e.preventDefault();
			});
			//button.$elem.insertAfter(holder);
			return button;
		}

		return null;
	};

	////
	var audit = function(callback){
		callback = typeof callback === 'function' ? callback : noop
		jQuery.ajax({
			url: tmParams.audit,
			dataType: 'jsonp',
			jsonp: 'callback',
			success: function(data){
				typeof callback === 'function' && callback(data);
			}
		});
	};

	//search cid
	var searchCID = function(arr, cid){
		for(var i = 0; i < arr.length; i++){
			if(arr[i].id === cid){
				return arr[i];
			}
		}

		return null;
	};

	//
	var Com = function(id, el){
		this.id = id;
		this.elems = el ? [el] : [];
		this.users = [];
		this.online = [];
	};

	//
	var getComStatus = function(){
		var coms = [];
		var cids4unique = [];
		var cid;
		$tmHolders.each(function(i, el){
			cid = el.getAttribute('cid');

			if(util.indexOf(cids4unique, cid) === -1){
				cids4unique.push(cid);
				coms.push(new Com(cid, el));
			}else{
				var c = searchCID(coms, cid);
				if(c){
					c.elems.push(el);
				}
			}
		});

		return {
			coms: coms,
			ids4unique: cids4unique
		};
	};

	//
	var getUsers = function(success, error){
		jQuery.ajax({
			url: tmParams.users,
			dataType: 'jsonp',
			jsonp: 'callback',
			data: {
				comIdStr: comStatus.ids4unique.join(',')
			},
			success: function(data){
				//TODO: bind data on el
				var com;
				for(var cid in data){
					com = searchCID(comStatus.coms, cid);
					if(com){
						com.users = data[cid].slice();
						com.uids = [];
						for(var i = 0; i < com.users.length; i++){
							com.uids.push(com.users[i].id);
						}
					}
				}

				typeof success === 'function' && success(data);
			},
			error: function(){
				typeof error === 'function' && error();
			}
		});
	};


	//search com by uid
	var searchComByUid = function(coms, uid){
		for(var i = 0; i < coms.length; i++){
			if(util.indexOf(coms[i].uids, uid) !== -1){
				return coms[i];
			}
		}

		return null;
	};

	// get coms with all users offline
	var getComsWithAllOffline = function(){
		var coms = comStatus.coms;
		var ret = [];
		for(var i = 0; i < coms.length; i++){
			if(!coms[i].online.length){
				ret.push(coms[i]);
			}
		}

		return ret;
	};


	var plain = function(gp, key){
		var tmp = [];

		for(var i = 0; i < gp.length; i++){
			tmp = tmp.concat(gp[i][key]);
		}

		return tmp;
	};

	// group the coms by userid
	var groupComsByUid = function(coms, userKey, join){
		join = join ? join : 'user_ids[]=';
		var ret = join;
		var T = tmParams.URL_THRESHOLD;
		var groups = [];
		var tmpGp = [];
		var com;

		for(var i = 0; i < coms.length; i++){
			com = coms[i];
			if(userKey in com && com[userKey].length){
				if((ret + plain(tmpGp, userKey).concat(com[userKey]).join('&' + join)).length <= T){
					//ret += com[userKey].join('&' + join);
					tmpGp.push(com);
				}else{
					groups.push(tmpGp);
					tmpGp = [com];
					//ret = join;
					//i--;
				}
			}
		}

		groups.push(tmpGp);

		return groups;
	};

	//
	var joinUids = function(coms, userKey, join){
		var ret = join || 'user_ids[]=';
		join = '&' + ret;
		var uids = [];

		for(var i = 0; i < coms.length; i++){
			uids = uids.concat(coms[i][userKey]);
		}

		return (ret + uids.join(join));
	};

	//choose user to talk
	var choose2Talk = function(sendData, success, complete){
		jQuery.ajax({
			url: tmParams.choose2talk,
			dataType: 'jsonp',
			jsonp: 'callback',
			data: {
				userIdStr: sendData.online.join(','),
				dataId: sendData.dataId
			},
			success: success || noop,
			complete: complete || noop
		});
	};

	// 从data id 中获取product id
	var getProductId = function(dataId){
		var r_isProduct = /1$/;
		var r_prodId = /([^_]+)_1$/;
		var prodId = '';

		if(r_isProduct.test(dataId)){
			prodId = r_prodId.exec(dataId)[1];
		}

		return prodId;
	};

	// 绑定点击聊天事件
	var bindChatTo = function(button){
		tm.ready(function(){
			var handle = function(e){
				var that = this;
				//服务器响应前，禁用点击
				unbind(this);
				var $this = jQuery(this);
				var talk2 = $this.data('talk2');
				if(!talk2){ // 没有请求过服务器，获取聊天对象
					var data = $this.data('tmData');
					var prodId = getProductId(data.dataId);
					choose2Talk(data, function(chat2Data){
						if(chat2Data){ // 有聊天对象
							if(prodId){
								jQuery.extend(true, chat2Data, { productId: prodId });
							}

							tm.chatTo(chat2Data);
							$this.data('talk2', chat2Data);
						}
					}, function(){
						bind(that);
					});
				}else{ // 已请求过聊天对象
					tm.chatTo(talk2);
					bind(this);
				}
			};

			var bind = function(el){
				(el ? jQuery(el) : button.$elem).click(handle);
			};

			var unbind = function(el){
				jQuery(el).unbind('click', handle);
			};

			bind();
		});
	};

	// 绑定所有聊天按钮
	/*var bindAllChatTo = function(){
		render.ready(function(){
			var coms = comStatus.coms;
			for(var i = 0; i < coms.length; i++){
				if(coms[i].online.length){
					$(coms[i].elems).each(function(i, el){
						el.buttonRefer && bindChatTo(el.buttonRefer);
					});
				}
			}
		});
	};*/

	// 绑定点击无权限事件
	var bindNoRight = function(button){
		render.ready(function(){
			var coms = comStatus.coms;
			for(var i = 0; i < coms.length; i++){
				jQuery(coms[i].elems).each(function(i, el){
					el.buttonRefer && el.buttonRefer.$elem.click(function(){
						alert(WARN.NO_RIGHT);
					});
				});
			}
		});
	};

	// 切换页面头部
	var changeHeader = function(){
		//TODO
		var type = 'header-type';

		if($('.athena-user-state').length){
			type = 'athena';
		}else if($('#logon_span').length){
			type = 'old';
		}else if($('#welcome_logon_span').length){
			type = 'now';
		}

		if(type in window.headerStatus){
			window.headerStatus[type]();
		}else if(typeof window.logonRefresh === 'function'){
			window.logonRefresh();
		}
	};

	var clickedButton = null;
	var webtmApi = null;

	//登陆弹出层
	var login = new LoginLayer({
		callback: function(params){
			login.hide();
			unbindUnlogon();

			//未登录情况下 弹出登陆层，实际上已经确认未安装 clientTM，故直接判断权限，登陆webtm即可
			if(webtmApi){
				if(params.tm === "true"){ //有权限
					webtmApi.init({
						token_url: tmParams.token
					});

					webtmApi.login();
					//bindAllChatTo();
					tm.setApi(webtmApi);

					webtmApi = null;
				}else{
					bindNoRight();
				}

				if(clickedButton){
					jQuery(clickedButton).click();
				}
			}

			changeHeader();
			//防止params被引用情况下移除中转页，造成报错
			setTimeout(function(){
				login.unload();
			}, 1);
		}
	});

	//未登录点击事件句柄
	var unlogonHandle = function(){
		//点击后弹出登陆框，登陆完成后，先解除未登录句柄，根据权限绑定 无权限或 有权限使用tm的句柄
		clickedButton = this;
		login.unload();
		login.load(tmParams.login, tmParams.transition);
		login.show();
	};

	// 绑定未登录点击事件
	var bindUnlogon = function(){
		render.ready(function(){
			var coms = comStatus.coms;
			for(var i = 0; i < coms.length; i++){
				jQuery(coms[i].elems).each(function(i, el){
					el.buttonRefer && el.buttonRefer.$elem.click(unlogonHandle);
				});
			}
		});
	};

	// 解除 未登录点击事件绑定
	var unbindUnlogon = function(){
		render.ready(function(){
			var coms = comStatus.coms;
			for(var i = 0; i < coms.length; i++){
				jQuery(coms[i].elems).each(function(i, el){
					el.buttonRefer && el.buttonRefer.$elem.unbind('click', unlogonHandle);
				});
			}
		});
	};

	// 获取在线用户列表
	var getOnlineUsers = function(){
		var joinStr = 'user_ids[]=';
		var coms = getComsWithAllOffline();
		var groups = groupComsByUid(coms, 'uids', joinStr);
		var complete = 0;

		for(var i = 0; i < groups.length; i++){
			var group = groups[i];

			void function(group){
				jQuery.ajax({
					url: tmParams.userTMStatus + '?' + joinUids(group, 'uids', joinStr),
					dataType: 'jsonp',
					jsonp: 'callback',
					data: {
						domain: 'micen'
					},
					success: function(data){
						var com;
						for(var uid in data){
							if(data[uid].online){
								com = searchComByUid(group, uid);
								com.online.push(uid);
							}
						}

						for(var i = 0; i < group.length; i++){
							com = group[i];
							var button;

							// choose user to chat
							for(var j = 0; j < com.elems.length; j++){
								var holder = com.elems[j];
								var procType = holder.getAttribute('processor');
								var dataId = holder.getAttribute('dataid');
								switch(procType){
									case 'list': { //online list
										//TODO
										var onlineUsers = util.where(com.users, function(i, user){
											return util.indexOf(com.online, user.id) !== -1;
										});

										//TODO: 绑定点击聊天事件
										button = genButton(holder, onlineUsers);
										holder.buttonRefer = button;

										button.$elem.each(function(i, btn){
											jQuery(btn).data('tmData', {
												online: [ btn.uid ],
												dataId: dataId
											});
										});

									}; break;
									default: {
										button = genButton(com.elems[j]);
										holder.buttonRefer = button;
										button.$elem.data('tmData', {
											online: com.online.slice(),
											dataId: dataId
										});

										if(!com.online.length){ //无人在线
											button.offline();
											bindChatTo(button);
											continue;
										}
									};
								}

								// 有人在线
								button.online();
								bindChatTo(button);
							}
						}

						/*complete++;

						if(complete === groups.length){
							render.beReady();
						}*/
					},
					error: function(){},
					complete: function(){
						complete++;
						if(complete === groups.length){
							render.beReady();
						}
					}
				});
			}.call(this, group);
		}
	};

	// TM加载流程
	var logonTM = function(){
		seajs.use(tmParams.clientTM, function(client){
			if(client && client.isInstalled){ // 已安装客户端
				tm.setApi(client);
			}else{
				seajs.use(tmParams.webTM, function(web){
					if(web){ //
						// 获取权限
						audit(function(data){
							if(data.login === 'true'){ //已登录
								if(data.tm === 'true'){ //有权限
									web.init({
										token_url: tmParams.token
									});

									//web.login();
									tm.setApi(web);
								}else{ //无权限使用tm
									bindNoRight();
								}
							}else{
								webtmApi = web;
								bindUnlogon();
							}
						});
					}else{
						//tm 服务器故障
					}
				});
			}
		});
	};
	////////////////////////////////
	//--------
	getTmParams(function(params){
		$tmHolders = jQuery(tmParams.holderSelector);
		comStatus = getComStatus();
		loadSeajs();

		// 获取用户状态流程
		getUsers(function(){
			getOnlineUsers();
		});

		logonTM();
	});

	// 阻止 ie6 下 a 链接上有 void 形式代码造成 webtm 连接断开
	if(jQuery.browser.msie && jQuery.browser.version == 6){
		var r_void = /void\s*\(?.*?\)?[;]?$/;
		var prevent = function(e){
			e.preventDefault();
		};

		jQuery('a').each(function(i, a){
			if(r_void.test(a.href)){
				jQuery(a).click(prevent);
			}
		});
	}
});


};

// require jquery
if(!window.jQuery){
	var script = document.createElement('script');
	script.async = script.defer = true;
	script.onload = function(){
		setTimeout(function(){
			execute();
		}, 1);
	};

	script.src = '/script/jquery.js';
	document.getElementsByTagName('head')[0].appendChild(script);
}else{
	execute();
}


}.call(this);