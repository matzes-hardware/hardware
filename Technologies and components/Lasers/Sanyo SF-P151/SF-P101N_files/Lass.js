window.Lass=window.Lass||{version:0.1};void function(a){var e=this.util={};e.type=function(a){var e,d=/\{\s*\[native\s*code\]\s*\}/i;null===a?e="null":"undefined"===typeof a?e="undefined":(e=Object.prototype.toString.call(a).match(/\w+/g)[1].toLowerCase(),"object"===e&&d.test(a+"")&&(e="function"));return e};e.trim=function(a){return(a+"").replace(/^[\s\u00A0]+|[\s\u00A0]+$/g,"")};e.extend=function(){var c=arguments.callee,f,d;"object"!==e.type(arguments[0])?(f=1,d=!!arguments[0]):(f=0,d=!1);var b=arguments[f]||{};f=[].slice.call(arguments,f+1);for(var g,m;f.length;){if(g=f.shift(),"object"===e.type(g)){var h,i;for(i in g){if(h=g[i],"object"===e.type(h)){if(h==a||h==document||"childNodes" in h&&"nextSibling" in h&&"nodeType" in h){if(d||!(i in b)){b[i]=h}}else{if(h.jquery&&/^[\d\.]+$/.test(h.jquery)){b[i]=h}else{m=e.type(b[i]);if(!(i in b)||"undefined"===m||"null"===m){b[i]={}}"object"===e.type(b[i])&&c(d,b[i],h)}}}else{if(d||!(i in b)){b[i]=h}}}}}return b};e.console=e.console||function(a){var f=!0,d={turn:function(a){f=!!a},warn:function(){}};return !a?d:e.extend(!0,d,{warn:function(d){f&&a.warn(d)}})}.call(a,a.console);e.indexOf=function(a,f,d){for(var b=-1,d=("number"===e.type(d)?d:-1)+1,g=a.length;d<g;d++){if(a[d]===f){b=d;break}}return b};return e}.call(Lass,window);(function(){var a=this.String={};a.startWidth=function(a,c){return a.slice(0,c.length)===c};a.endWidth=function(){};a.isString=function(a){return"string"===typeof a}}).call(Lass);void function(){}.call(Lass);void function(){(this.Element={}).getElementsByClassName=function(a,e,c){var f=[];if(document.getElementsByClassName){for(var d=(e||document).getElementsByClassName(a),a=0;e=d[a++];){"*"!==c&&c.toUpperCase(),f.push(e)}return f}e=e||document;c=c||"*";d=a.split(" ");c="*"===c&&e.all?e.all:document.getElementsByTagName(c);e=[];for(a=d.length;0<--a;){e.push(RegExp("(^|\\s)"+d[a]+"(\\s|$)"))}for(a=c.length;0<=--a;){for(var a=c[a],c=!1,d=0,b=e.length;d<b&&!(c=e[d].test(a.className),!c);d++){}c&&f.push(a);return f}}}.call(Lass);var Lass=window.Lass||{};void function(){var a=this.util,e=function(){},c={impl:function(d,b){"function"===a.type(b)&&(this[d]=b)},mix:function(){a.extend.apply(null,[!0,this].concat([].slice.call(arguments)))}},f=function(d,b){var b=b||"impl super mix __getDefaultConfig __proto__ toString valueOf".split(" "),e=a.extend(!0,{},d);try{for(var c=0;c<b.length;c++){delete e[b[c]]}}catch(g){}return e},d=function(){for(var d,b,i,k=[],j=0;3>j;j++){k.push(a.type(arguments[j]))}j=a.indexOf(k,"function");i=-1===j?e:arguments[j];for(j=-1;-1!==(j=a.indexOf(k,"object",j))&&!(!d&&arguments[j].constructor===g?d=arguments[j]:b||(b=arguments[j]),d&&b);){}d||(d={});b||(b={});var p=b.config||{},o=[],n=b.inherit||e;b=b.mix||[{}];k=a.type(b);"object"===k?b=[b]:"array"!==k&&(b=[{}]);for(j=0;j<b.length;j++){"object"===a.type(b[j])&&o.push(b[j])}b=null;var l=function(){var b={},e=f(n.prototype),c;for(c in e){c in this&&"function"===a.type(this[c])&&(b[c]=this[c])}this["super"]=a.extend(!0,{},n.prototype,b);n.apply(this["super"],[].slice.call(arguments));b=f(this["super"]);a.extend(!0,this,b,{__getDefaultConfig:function(){return p}});this.mix.apply(this,o);for(var g in d){"function"===a.type(this[g])&&this[g].__IS_ABSTRACT_METHOD__&&(this[g]=function(a){var b=function(){d[a]()};b.__IS_ABSTRACT_METHOD__=d[a].__IS_ABSTRACT_METHOD__;var e=this;b.impl=b.implement=function(b){e.impl(a,b)};return b}.call(this,g))}this.constructor=arguments.callee;b=i.apply(this,[].slice.call(arguments));for(g in d){if("function"===a.type(this[g])&&this[g].__IS_ABSTRACT_METHOD__){d[g]()}}if("object"===typeof b&&null!==b){return b}};l.prototype=a.extend(!0,{},c,d);l.extend=function(b){var d=a.extend.apply(null,[!0,{}].concat([].slice.call(arguments)));a.extend.call(null,!0,l.prototype,d)};return l},b=this.Empty=new d,g=new d({inherit:b},function(b,d){var e,c;for(c in b){e=a.type(b[c]),"function"===e?(this[c]=function(b,d){return function(){d&&a.console.warn(b+" method is not implement.")}}.call(this,c,d),this[c].__IS_ABSTRACT_METHOD__=!0):this[c]="object"===e?a.extend(!0,{},b[c]):b[c]}}),d={Clazz:d,Abstract:g};a.extend(!0,this,d);a.extend(!0,window,d)}.call(Lass);void function(){var a=this.util,e=function(a,b,c){this.handle=a;this.once=!!b;this.data=c||{}},c=function(a,b){this.type=a;this.data=b},f=function(){this._||(this._={});this._.events={}};f.prototype={__initEvent:function(a){this._.events[a]||(this._.events[a]=[]);return this._.events[a]},__eventParams:function(d,b){var c=a.type(d);"function"===c?b=[d]:"array"===c?b=d:"object"!==c&&(d={});c=a.type(b);"function"===c?b=[b]:"array"!==c&&(b=[]);return{data:d,handle:b}},__bindEvent:function(d,b,c,f){d=a.trim(d);d=this.__initEvent(d);b=this.__eventParams(b,c);for(c=0;c<b.handle.length;c++){"function"===a.type(b.handle[c])&&d.push(new e(b.handle[c],!!f,a.extend(!0,{},b.data)))}},__search:function(a,b){for(var c=-1,e=0;e<a.length;e++){if(a[e].handle===b){c=e;break}}return c},on:function(a,b,c){this.__bindEvent(a,b,c,!1);return this},one:function(a,b,c){this.__bindEvent(a,b,c,!0);return this},off:function(c,b){c=a.trim(c);"function"===a.type(b)&&(b=[b]);if("array"===a.type(b)){for(var e=this.__initEvent(c),f,h=0;h<b.length;h++){"function"===a.type(b[h])&&(f=this.__search(e,b[h]),-1!==f&&e.splice(f,1))}}else{this._.events[c]=[]}return this},fire:function(d,b){for(var d=a.trim(d),b="object"===a.type(b)&&b||{},e=this.__initEvent(d),f=[],h,i=0;i<e.length;i++){h=e[i],h.handle.call(this,new c(d,a.extend(!0,{},h.data,b))),h.once&&f.push(h.handle)}this.off(d,f);return this}};this.Events=f}.call(Lass);void function(){var a=this.util,e=this.Events,c=new this.Clazz({mix:{_:{},elems:{},config:{},setConfig:function(c){return this.config=a.extend(!0,{},this.__getDefaultConfig(),this.config,c)}},inherit:this.Empty});c.extend(new e);window.Component=this.Component=c}.call(Lass);void function(){var a=this.Cookie={};a.read=function(a){return RegExp("(?:^|;)\\s*"+a+"=([^;]*)").test(document.cookie)?RegExp.$1:null};a.set=function(a,c,f){var d=new Date;d.setTime(d.getTime()+86400000*f);f=f?";expires="+d.toGMTString():"";document.cookie=a+"="+encodeURIComponent(c)+f+";path=/"};a.del=function(a){var c=new Date((new Date).getTime()-1);null!==this.read(a)&&(document.cookie=a+"=;expries="+c.toGMTString()+";path=/")};return a}.call(Lass);void function(a){var e=this.Timer={};e.requestAnimationFrame=a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame||a.msRequestAnimationFrame||function(a){setTimeout(a,1000/60)};e.isSupportRequestAnimationFrame=function(){return a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame&&a.mozCancelRequestAnimationFrame||a.oRequestAnimationFrame||a.msRequestAnimationFrame};e.RequestInterval=function(c,f){function d(){(new Date).getTime()-b>=f&&(c.call(),b=(new Date).getTime());g.value=e.requestAnimationFrame.call(a,d)}if(!e.isSupportRequestAnimationFrame()){return a.setInterval(c,f)}var b=(new Date).getTime(),g={};g.value=e.requestAnimationFrame.call(a,d);return g};e.clearRequestInterval=function(c){a.cancelRequestAnimationFrame?a.cancelRequestAnimationFrame(c.value):a.webkitCancelAnimationFrame?a.webkitCancelAnimationFrame(c.value):a.webkitCancelRequestAnimationFrame?a.webkitCancelRequestAnimationFrame(c.value):a.mozCancelRequestAnimationFrame?a.mozCancelRequestAnimationFrame(c.value):a.oCancelRequestAnimationFrame?a.oCancelRequestAnimationFrame(c.value):a.msCancelRequestAnimationFrame?a.msCancelRequestAnimationFrame(c.value):clearInterval(c)};e.RequestTimeout=function(c,f){function d(){(new Date).getTime()-b>=f?c.call():g.value=e.requestAnimationFrame.call(a,d)}if(!e.isSupportRequestAnimationFrame()){return a.setTimeout(c,f)}var b=(new Date).getTime(),g={};g.value=e.requestAnimationFrame.call(a,d);return g};e.clearRequestTimeout=function(c){a.cancelRequestAnimationFrame?a.cancelRequestAnimationFrame(c.value):a.webkitCancelAnimationFrame?a.webkitCancelAnimationFrame(c.value):a.webkitCancelRequestAnimationFrame?a.webkitCancelRequestAnimationFrame(c.value):a.mozCancelRequestAnimationFrame?a.mozCancelRequestAnimationFrame(c.value):a.oCancelRequestAnimationFrame?a.oCancelRequestAnimationFrame(c.value):a.msCancelRequestAnimationFrame?a.msCancelRequestAnimationFrame(c.value):clearTimeout(c)}}.call(Lass,window);