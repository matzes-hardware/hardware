var NavOperator = function(){
    this.loginDisplay();
    this.seemoreDisplay();
    this.shortcutsDisplay();
    this.graphicalSearchLink();
};
NavOperator.prototype.get = function(id){
    var elem = document.getElementById(id);
    return elem ? elem : null;
};
NavOperator.prototype.getComputedStyle = function(el, style){
    var computedStyle;
    if (typeof el.currentStyle !== 'undefined') {
        computedStyle = el.currentStyle;
    } else {
        computedStyle = document.defaultView.getComputedStyle(el, null);
    }
    return computedStyle[style];
};
NavOperator.prototype.toggle = function(el) {
    var computedStyle = this.getComputedStyle(el, 'display');
    el.style.display = computedStyle !== 'none' ? 'none' : 'block';
    return this;
};
NavOperator.prototype.windowDimensions = function () {
    var viewportwidth, viewportheight;
    if (typeof window.innerWidth !== 'undefined') {
        viewportwidth = window.innerWidth,
        viewportheight = window.innerHeight
    } else if (typeof document.documentElement !== 'undefined'
             && typeof document.documentElement.clientWidth !== 'undefined'
             && document.documentElement.clientWidth !== 0) {
        viewportwidth = document.documentElement.clientWidth,
        viewportheight = document.documentElement.clientHeight
    } else {
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
        viewportheight = document.getElementsByTagName('body')[0].clientHeight
    }
    return [viewportwidth, viewportheight];
};
NavOperator.prototype.graphicalSearchLink = function(){
    var gsl = this.get("graphicalSearchLink");
    var searchInput = this.get("q");
    var handleGraphicalSearchLink = function(evt){

	    if (searchInput.value !== '') {
	        window.location = "/tag/?q=" + searchInput.value + "&sort=none";
	    } else {
	        window.location = this.href;
	    }
	    evt.preventDefault();
    };
    if (gsl && searchInput) {
	    gsl.onclick = handleGraphicalSearchLink;
    }
};
NavOperator.prototype.makeLoginByPrototype = function () {

    if (typeof Element.centerInWindow === "undefined") {
        Element.addMethods({
            centerInWindow: function (element, inWindow) {
                var elt = $(element),
                eltDims = elt.getDimensions(),
                frame = $(inWindow ? document.body : document.viewport),
                offsets = inWindow ? 0 : frame.getScrollOffsets(),
                frameDims = frame.getDimensions(),
                y = (frameDims.height - eltDims.height) / 2,
                x = (frameDims.width - eltDims.width) / 2,
                styles = {
                    position : 'absolute',
                    left : (offsets[0] + x) + 'px',
                    top : (offsets[1] + y) + 'px'
                };
                elt.setStyle(styles);
            }
        });
    }
    var mask = $("modalMask"),
	div = $("modal");
    if (mask == null) {
        mask = new Element("div", {"id": "modalMask"});
        document.body.appendChild(mask);
    }
    if (div == null) {
        div = new Element("div", {"id": "modal"});
        document.body.appendChild(div);
    }
    // set up centering and masking events and initial load
	function centerAndMask() {
		Position.clone($$("body")[0], mask);
		div.centerInWindow();
	};
	Event.observe(window, 'scroll', centerAndMask);
	Event.observe(window, 'resize', centerAndMask);
	// expose new elements
	mask.show();
    var divContent = Element.clone($("login-modal"), true);
    div.childElements().invoke('remove');
    div.insert({'bottom': divContent});
	div.show();
    if ($("username_nav")) $("username_nav").focus();
	$$('object').each(function(obj){
		obj.style.visibility = "hidden";
	});
    centerAndMask();
	var closeModal = function() {
		mask.hide();
		div.hide();
		$$('object').each(function(obj){
			obj.style.visibility = "visible";
		});
	};
    $$(".promodal-close").invoke('observe', 'click', function (evt) {
        evt.preventDefault();
        closeModal();
    });
};
NavOperator.prototype.makeLoginByJquery = function () {
    var mask, modal, maskDimensions, modalPosition, modalContent, $=jQuery;
    maskDimensions = function (mask) {
        mask.width($(window).width());
        mask.height($(window).height());
        mask.css({position: "fixed", left: "0", top: "0"});
    };
    modalPosition = function (modal) {
        modal.css({position: "fixed", left: Math.floor($(window).width() / 2) - Math.floor(modal.width() / 2) + "px", top: Math.floor($(window).height()/4) + "px"});
    };
    modal = $("#modal");
    if (modal.length < 1) {
        modal = $('<div id="modal"></div>');
        $(document.body).prepend(modal);
    }
    modalContent = $("#login-modal").clone();
    $("#modal").append(modalContent);
    modalPosition(modal);
    $("#modal").show();
    mask = $("#modalMask");
    if (mask.length < 1) {
        mask = $('<div id="modalMask"></div>');
        $(document.body).prepend(mask);
    }
    maskDimensions(mask);
    mask.show();
    $("#username_nav").focus();
    $(window).resize(function (event) {
        maskDimensions(mask);
        modalPosition(modal);
    });
    $(".promodal-close").click(function (event) {
        event.preventDefault();
        mask.remove();
        modal.remove();
    });
};
NavOperator.prototype.loginDisplay = function(){
    var _self = this;
    if (typeof $ !== "undefined" && typeof Event.observe !== "undefined") {
        if ($('logintoggle')) {
            $('logintoggle').observe('click', function (event) {
                event.preventDefault();
                _self.makeLoginByPrototype();
            });
        }
    } else if (typeof $ !== "undefined") {
        $("#logintoggle").click(function(event) {
            event.preventDefault();
            _self.makeLoginByJquery();
        });
    }
};
NavOperator.prototype.seemoreDisplay = function(){

    var seemore = this.get("see-more");
    var seeless = this.get("see-less");
    var morechannels = this.get("see-more-channels");
    var self = this;
    var timeToSlide = 20;

    if (seemore && seeless && morechannels) {

	var seemore_clickHandler = function(evt){
	    evt.preventDefault();
	    self.toggle(seemore);
	    self.toggle(seeless);
	    morechannels.style.visibility = "hidden";
	    morechannels.style.display = "block";
	    var height = morechannels.offsetHeight;
	    morechannels.style.height = "0px";
	    morechannels.style.visibility = "visible";
	    self.slideDown(morechannels, 0, height, Math.ceil(height/timeToSlide));
	};
	var seeless_clickHandler = function(evt){
	    evt.preventDefault();
	    var height = morechannels.offsetHeight;
	    self.slideUp(morechannels, Math.ceil(height / timeToSlide), height);
	    self.toggle(seemore);
	    self.toggle(seeless);
	};
	seemore.onclick = seemore_clickHandler;
	seeless.onclick = seeless_clickHandler;
    }
};
NavOperator.prototype.slideDown = function(obj,offset,full,px) {
    var self = this;
    if (offset < full){
	obj.style.height = offset + "px";
	offset = offset + px;
	setTimeout((function(){
	    self.slideDown(obj, offset, full, px);
	}),1);
    } else {
	obj.style.height = full + "px";
    }
};
NavOperator.prototype.slideUp = function(obj,px,full) {
    var self = this;
    if ((obj.offsetHeight-px) > 0){
	obj.style.height = obj.offsetHeight - px + "px";
	setTimeout((function(){
	    self.slideUp(obj, px, full);
	}),1);
    } else {
	obj.style.height = full + "px";
	obj.style.display = 'none';
    }
};

NavOperator.prototype.shortcutsDisplay = function(){

    var opts = {};
    opts.shortcuttoggle = this.get("shortcuttoggle");
    opts.shortcuts = this.get("shortcutlinks");

    if (opts.shortcuttoggle && opts.shortcuts){
        opts.timer = null;

        opts.handleShortcutOver = function(){
            opts.shortcuts.style.display = 'block';
            clearTimeout(opts.timer);
        };

        opts.handleShortcutsOut = function(){
            opts.timer = setTimeout(function(){
                opts.shortcuts.style.display = 'none';
            }, 500);
        };

        opts.shortcuttoggle.onmouseover = opts.handleShortcutOver;
        opts.shortcuttoggle.onmouseout = opts.handleShortcutsOut;
        opts.shortcuts.onmouseover = opts.handleShortcutOver;
        opts.shortcuts.onmouseout = opts.handleShortcutsOut;
    }
    return this;
};
NavOperator.prototype.searchWatermark = function(){

  var searchInput = this.get("q");
  var footerSearchInput = this.get("q2");

  function handleInputFocus(elem){
    elem.style.backgroundImage = "none";
    return true;
  }

  function handleInputBlur(elem){
    elem.style.backgroundImage = "url(/static/img/google_custom_search_watermark.gif)";
    return true;
  }
  function handleSearchBackground(elem) {

    if (elem && elem.value === ''){

      handleInputBlur(elem);

      var handleSearchInputFocus = function(){
	return handleInputFocus(elem);
      };

      var handleSearchInputBlur = function(){
	return handleInputBlur(elem);
      };

      elem.onfocus = handleSearchInputFocus;
      elem.onblur = handleSearchInputBlur;
    }

  }

    if (searchInput) { handleSearchBackground(searchInput); }
    if (footerSearchInput) { handleSearchBackground(footerSearchInput); }

};
NavOperator.prototype.fblogout = function () {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            FB.logout(function() { window.location = '/account/logout' });
        } else {
            window.location = '/account/logout';
        }
    }, true);
    return false;
};
var navoperator = new NavOperator();