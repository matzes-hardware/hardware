void function($){var IDropDown=new Abstract({show:function(){},hide:function(){}});var config={carrier:null,trigger:"",arrUp:"&#xf0d8;",arrRight:"&#xf0da;",arrDown:"&#xf0d7;",arrLeft:"&#xf0d9;",style:{hoverCls:"hover",dropMenu:"dropmenu-hd",dropList:"dropmenu-list",arr:"icon"}};var DropDown=new Clazz(IDropDown,{config:config,inherit:Component},function(cfg){cfg=this.setConfig(cfg);if(cfg.carrier===null||!cfg.carrier.length){return}if(cfg.style.dropMenu===""||cfg.style.dropList===""){return}var that=this;var _trigger=this.trigger||"mouseover";this.elems.carrier=cfg.carrier;this.elems.menu=$(cfg.carrier).find("."+cfg.style.dropMenu);this.elems.list=$(cfg.carrier).find("."+cfg.style.dropList);this.elems.arr=this.elems.menu.find("."+cfg.style.arr);function _show(){this.elems.carrier.addClass(cfg.style.hoverCls);this.elems.arr.html(cfg.arrUp)}function _hide(){this.elems.carrier.removeClass(cfg.style.hoverCls);this.elems.arr.html(cfg.arrDown)}this.elems.menu.bind(_trigger,function(){_show.call(that)});this.elems.carrier.bind("mouseleave",function(){_hide.call(that)});this.show.implement(_show);this.hide.implement(_hide)});window.DropDown=DropDown}.call(Lass,jQuery);