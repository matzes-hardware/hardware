/**
* tm3登陆弹出层
* @requires jquery
* @requires focusUI
*/
jQuery(function(){
	var noop = function(){};

	var addParams = function(url, params){
		if(url.indexOf('?') !== -1){
			url = url.split('?');
			if(url[1]){
				url[1] = url[1] + '&' + params.join('&');
			}else{
				url[1] = params.join('&');
			}

			url = url.join('?');
		}else if(url.indexOf('#') !== -1){
			url = url.splig('#');
			url[1] = '?' + params.join('&');
			url = url.join('#');
		}else{
			url += ('?' + params.join('&'));
		}

		return url;
	};

	var CALLBACK_NAME = 'LOGON_CALLBACK_' + new Date().valueOf();
	var config = {
		tmpl: '<div id="dialog4login" style="display:none;">' +
			'<div id="header4login">' +
				'<div id="title4login"></div>' +
				'<a href="javascript:void(\'close\')" id="close4login"></a>' +
			'</div>' +
			'<div id="content4login">' +
			'</div>' +
		'</div>',
		elems: {
			wrap: '#dialog4login',
			header: '#header4login',
			title: '#title4login',
			close: '#close4login',
			content: '#content4login'
		},
		style: {
			ifrWidth: 550,
			ifrHeight: 290,
			width: 565,
			height: 'auto'
		},
		text: {
			title: 'SIGN IN',
			close: ''
		},
		url: '',
		callback: noop
	};

	//单例模式
	var singleton = null;
	var Login = function(cfg){
		if(singleton){
			return singleton;
		}

		singleton = this;

		this._ = {};
		this.elems = {};

		this.config = jQuery.extend(true, {}, config, cfg);
		this.init();
	};

	Login.prototype = {
		init: function(){
			var elems = this.elems;
			var cfg = this.config;

			elems.$wrap = jQuery(cfg.tmpl);
			elems.$header = elems.$wrap.find(cfg.elems.header);
			elems.$title = elems.$wrap.find(cfg.elems.title);
			elems.$close = elems.$wrap.find(cfg.elems.close);
			elems.$content = elems.$wrap.find(cfg.elems.content);

			elems.$title.html(cfg.text.title);
			elems.$close.html(cfg.text.close);

			elems.$wrap.appendTo(document.body).css({
				width: this.config.style.width,
				height: this.config.style.height
			});
			this.hide();

			var that = this;
			elems.$close.click(function(e){
				e.stopPropagation();
				e.preventDefault();

				that.hide();
				that.unload();
			});
		},
		load: function(url, next){
			this.unload();

			window[CALLBACK_NAME] = this.config.callback;

			var params = [];
			if(document.domain !== window.location.hostname){
				params.push('domain=' + document.domain);
			}

			params.push('callback=' + CALLBACK_NAME);

			next = addParams(next, params);
			url = addParams(url, ['forwardPage=' + encodeURIComponent(next)]);

			this.elems.$loginFrame = jQuery('<iframe src="' + url + '" frameborder="0" style="width:' + this.config.style.ifrWidth + 'px; height:' + this.config.style.ifrHeight + 'px"></iframe>').appendTo(this.elems.$content);
		},
		unload: function(){
			if(this.elems.$loginFrame){
				this.elems.$loginFrame.remove();
			}

			window[CALLBACK_NAME] = noop;
		},
		show: function(){
			this.elems.$wrap.focusUI({
				cover: true,
				drag: false,
				center: true,
				bgIframe: true,
				bgColor: '#000',
				bgOpacity: 0.5
			});

			this.elems.$wrap.show().css('zIndex', 1000);
		},
		hide: function(){
			this.elems.$wrap.hide();
			FocusUI.cover.hide();
		}
	};
	// 导出类
	window.LoginLayer = Login;
});