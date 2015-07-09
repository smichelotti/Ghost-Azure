"use strict";!function(){if("function"!=typeof window.getMatchedCSSRules){var ELEMENT_RE=/[\w-]+/g,ID_RE=/#[\w-]+/g,CLASS_RE=/\.[\w-]+/g,ATTR_RE=/\[[^\]]+\]/g,PSEUDO_CLASSES_RE=/\:(?!not)[\w-]+(\(.*\))?/g,PSEUDO_ELEMENTS_RE=/\:\:?(after|before|first-letter|first-line|selection)/g,toArray=function(list){var items=[];for(var i in list)items.push(list[i]);return items},getSheetRules=function(stylesheet){var sheet_media=stylesheet.media&&stylesheet.media.mediaText;return stylesheet.disabled?[]:sheet_media&&sheet_media.length&&!window.matchMedia(sheet_media).matches?[]:toArray(stylesheet.cssRules)},_find=function(string,re){string.match(re);return re?re.length:0},calculateScore=function(selector){for(var part,match,score=[0,0,0],parts=selector.split(" ");part=parts.shift(),"string"==typeof part;)match=_find(part,PSEUDO_ELEMENTS_RE),score[2]=match,match&&(part=part.replace(PSEUDO_ELEMENTS_RE,"")),match=_find(part,PSEUDO_CLASSES_RE),score[1]=match,match&&(part=part.replace(PSEUDO_CLASSES_RE,"")),match=_find(part,ATTR_RE),score[1]+=match,match&&(part=part.replace(ATTR_RE,"")),match=_find(part,ID_RE),score[0]=match,match&&(part=part.replace(ID_RE,"")),match=_find(part,CLASS_RE),score[1]+=match,match&&(part=part.replace(CLASS_RE,"")),score[2]+=_find(part,ELEMENT_RE);return parseInt(score.join(""),10)},getSpecificityScore=function(element,selector_text){for(var selector,score,selectors=selector_text.split(","),result=0;selector=selectors.shift();)(element.mozMatchesSelector&&element.mozMatchesSelector(selector)||element.msMatchesSelector&&element.msMatchesSelector(selector)||element.oMatchesSelector&&element.oMatchesSelector(selector)||element.webkitMatchesSelector&&element.webkitMatchesSelector(selector))&&(score=calculateScore(selector),result=score>result?score:result);return result},sortBySpecificity=function(element,rules){function compareSpecificity(a,b){return getSpecificityScore(element,b.selectorText)-getSpecificityScore(element,a.selectorText)}return rules.sort(compareSpecificity)};window.getMatchedCSSRules=function(element){var style_sheets,sheet,rules,rule,result=[];for(style_sheets=toArray(window.document.styleSheets);sheet=style_sheets.shift();)for(rules=getSheetRules(sheet);rule=rules.shift();)rule.styleSheet?rules=getSheetRules(rule.styleSheet).concat(rules):rule.media?rules=getSheetRules(rule).concat(rules):(element.mozMatchesSelector&&element.mozMatchesSelector(rule.selectorText)||element.msMatchesSelector&&element.msMatchesSelector(rule.selectorText)||element.oMatchesSelector&&element.oMatchesSelector(rule.selectorText)||element.webkitMatchesSelector&&element.webkitMatchesSelector(rule.selectorText))&&result.push(rule);return sortBySpecificity(element,result)}}}(),function(){for(var lastTime=0,vendors=["webkit","moz"],x=0;x<vendors.length&&!window.requestAnimationFrame;++x)window.requestAnimationFrame=window[vendors[x]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[vendors[x]+"CancelAnimationFrame"]||window[vendors[x]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(callback){var currTime=(new Date).getTime(),timeToCall=Math.max(0,16-(currTime-lastTime)),id=window.setTimeout(function(){callback(currTime+timeToCall)},timeToCall);return lastTime=currTime+timeToCall,id}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(id){clearTimeout(id)})}(),function(global){var objectFit={};objectFit._debug=!1,objectFit.observer=null,objectFit.getComputedStyle=function(element,context){return context=context||window,context.getComputedStyle?context.getComputedStyle(element,null):element.currentStyle},objectFit.getDefaultComputedStyle=function(element){var newelement=element.cloneNode(!0),styles={},iframe=document.createElement("iframe");document.body.appendChild(iframe),iframe.contentWindow.document.open(),iframe.contentWindow.document.write("<body></body>"),iframe.contentWindow.document.body.appendChild(newelement),iframe.contentWindow.document.close();var defaultElement=iframe.contentWindow.document.querySelectorAll(element.nodeName.toLowerCase())[0],defaultComputedStyle=this.getComputedStyle(defaultElement,iframe.contentWindow);for(var property in defaultComputedStyle){var value=defaultComputedStyle.getPropertyValue?defaultComputedStyle.getPropertyValue(property):defaultComputedStyle[property];if(null!==value)switch(property){default:styles[property]=value;break;case"width":case"height":case"minWidth":case"minHeight":case"maxWidth":case"maxHeight":}}return document.body.removeChild(iframe),styles},objectFit.getMatchedStyle=function(element,property){var val=null,inlineval=null;element.style.getPropertyValue?inlineval=element.style.getPropertyValue(property):element.currentStyle&&(inlineval=element.currentStyle[property]);var rules=window.getMatchedCSSRules(element);if(rules.length)for(var i=rules.length;i-->0;){var r=rules[i],important=r.style.getPropertyPriority(property);if((null===val||important)&&(val=r.style.getPropertyValue(property),important))break}return val||null===inlineval||(val=inlineval),val},objectFit.orientation=function(replacedElement){if(replacedElement.parentNode&&"x-object-fit"===replacedElement.parentNode.nodeName.toLowerCase()){var width=replacedElement.naturalWidth||replacedElement.clientWidth,height=replacedElement.naturalHeight||replacedElement.clientHeight,parentWidth=replacedElement.parentNode.clientWidth,parentHeight=replacedElement.parentNode.clientHeight;!height||width/height>parentWidth/parentHeight?"wider"!==replacedElement.getAttribute("data-x-object-relation")&&(replacedElement.setAttribute("data-x-object-relation","wider"),replacedElement.className="x-object-fit-wider",this._debug&&window.console&&console.log("x-object-fit-wider")):"taller"!==replacedElement.getAttribute("data-x-object-relation")&&(replacedElement.setAttribute("data-x-object-relation","taller"),replacedElement.className="x-object-fit-taller",this._debug&&window.console&&console.log("x-object-fit-taller"))}},objectFit.process=function(args){if(args.selector&&args.replacedElements){switch(args.fittype=args.fittype||"none",args.fittype){default:return;case"none":case"fill":case"contain":case"cover":}var replacedElements=args.replacedElements;if(replacedElements.length)for(var i=0,replacedElementsLength=replacedElements.length;replacedElementsLength>i;i++)this.processElement(replacedElements[i],args)}},objectFit.processElement=function(replacedElement,args){var property,value,replacedElementStyles=objectFit.getComputedStyle(replacedElement),replacedElementDefaultStyles=objectFit.getDefaultComputedStyle(replacedElement),wrapperElement=document.createElement("x-object-fit");objectFit._debug&&window.console&&console.log("Applying to WRAPPER-------------------------------------------------------");for(property in replacedElementStyles)switch(property){default:value=objectFit.getMatchedStyle(replacedElement,property),null!==value&&""!==value&&(objectFit._debug&&window.console&&console.log(property+": "+value),wrapperElement.style[property]=value);break;case"length":case"parentRule":}objectFit._debug&&window.console&&console.log("Applying to REPLACED ELEMENT-------------------------------------------------------");for(property in replacedElementDefaultStyles)switch(property){default:value=replacedElementDefaultStyles[property],objectFit._debug&&window.console&&""!==value&&console.log(property+": "+value),replacedElement.style[property]=value;break;case"length":case"parentRule":}wrapperElement.setAttribute("class","x-object-fit-"+args.fittype),replacedElement.parentNode.insertBefore(wrapperElement,replacedElement),wrapperElement.appendChild(replacedElement),objectFit.orientation(replacedElement);var resizeTimer=null,resizeAction=function(){null!==resizeTimer&&window.cancelAnimationFrame(resizeTimer),resizeTimer=window.requestAnimationFrame(function(){objectFit.orientation(replacedElement)})};switch(args.fittype){default:break;case"contain":case"cover":window.addEventListener?(replacedElement.addEventListener("load",resizeAction,!1),window.addEventListener("resize",resizeAction,!1),window.addEventListener("orientationchange",resizeAction,!1)):(replacedElement.attachEvent("onload",resizeAction),window.attachEvent("onresize",resizeAction))}},objectFit.listen=function(args){var domInsertedAction=function(element){for(var i=0,argsLength=args.length;argsLength>i;i++)(element.mozMatchesSelector&&element.mozMatchesSelector(args[i].selector)||element.msMatchesSelector&&element.msMatchesSelector(args[i].selector)||element.oMatchesSelector&&element.oMatchesSelector(args[i].selector)||element.webkitMatchesSelector&&element.webkitMatchesSelector(args[i].selector))&&(args[i].replacedElements=[element],objectFit.process(args[i]),objectFit._debug&&window.console&&console.log("Matching node inserted: "+element.nodeName))},domInsertedObserverFunction=function(element){objectFit.observer.disconnect(),domInsertedAction(element),objectFit.observer.observe(document.documentElement,{childList:!0,subtree:!0})},domInsertedEventFunction=function(event){window.removeEventListener("DOMNodeInserted",domInsertedEventFunction,!1),domInsertedAction(event.target),window.addEventListener("DOMNodeInserted",domInsertedEventFunction,!1)},domRemovedAction=function(element){"x-object-fit"===element.nodeName.toLowerCase()&&(element.parentNode.removeChild(element),objectFit._debug&&window.console&&console.log("Matching node removed: "+element.nodeName))},domRemovedObserverFunction=function(element){objectFit.observer.disconnect(),domRemovedAction(element),objectFit.observer.observe(document.documentElement,{childList:!0,subtree:!0})},domRemovedEventFunction=function(event){window.removeEventListener("DOMNodeRemoved",domRemovedEventFunction,!1),domRemovedAction(event.target.parentNode),window.addEventListener("DOMNodeRemoved",domRemovedEventFunction,!1)};window.MutationObserver?(objectFit._debug&&window.console&&console.log("DOM MutationObserver"),this.observer=new MutationObserver(function(mutations){mutations.forEach(function(mutation){if(mutation.addedNodes&&mutation.addedNodes.length)for(var nodes=mutation.addedNodes,i=0,nodesLength=nodes.length;nodesLength>i;i++)domInsertedObserverFunction(nodes[i]);mutation.removedNodes&&mutation.removedNodes.length&&domRemovedObserverFunction(mutation.target)})}),this.observer.observe(document.documentElement,{childList:!0,subtree:!0})):window.addEventListener&&(objectFit._debug&&window.console&&console.log("DOM Mutation Events"),window.addEventListener("DOMNodeInserted",domInsertedEventFunction,!1),window.addEventListener("DOMNodeRemoved",domRemovedEventFunction,!1))},objectFit.init=function(args){if(args){"Array"!=typeof args&&(args=[args]);for(var i=0,argsLength=args.length;argsLength>i;i++)args[i].replacedElements=document.querySelectorAll(args[i].selector),this.process(args[i]);this.listen(args)}},objectFit.polyfill=function(args){"objectFit"in document.documentElement.style==!1?(objectFit._debug&&window.console&&console.log("object-fit not natively supported"),"complete"===document.readyState?objectFit.init(args):window.addEventListener?window.addEventListener("load",function(){objectFit.init(args)},!1):window.attachEvent("onload",function(){objectFit.init(args)})):objectFit._debug&&window.console&&console.log("object-fit natively supported")},global.objectFit=objectFit}(window);
/*! UIkit 2.14.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
!function(t){if("function"==typeof define&&define.amd&&define("uikit",function(){var i=t(window,window.jQuery,window.document);return i.load=function(t,e,n,o){var s,a=t.split(","),r=[],l=(o.config&&o.config.uikit&&o.config.uikit.base?o.config.uikit.base:"").replace(/\/+$/g,"");if(!l)throw new Error("Please define base path to UIkit in the requirejs config.");for(s=0;s<a.length;s+=1){var c=a[s].replace(/\./g,"/");r.push(l+"/components/"+c)}e(r,function(){n(i)})},i}),!window.jQuery)throw new Error("UIkit requires jQuery");window&&window.jQuery&&t(window,window.jQuery,window.document)}(function(t,i,e){"use strict";var n={},o=window.UIkit;if(n.version="2.14.0",n._prefix="uk",n.noConflict=function(t){return o&&(window.UIkit=o,i.UIkit=o,i.fn.uk=o.fn),n._prefix=t,n},n.prefix=function(t){return"string"==typeof t?t.replace(/@/g,n._prefix):t},n.$=function(){arguments[0]&&"string"==typeof arguments[0]&&(arguments[0]=n.prefix(arguments[0]));var t,e=i.apply(i,arguments);return e.length?(["find","filter","closest","attr","parent","parents","children","addClass","removeClass","toggleClass","hasClass","is","on","one"].forEach(function(i){var o,s=e[i],a=["find","filter","parent","parents","children","closest"];return e[i]=function(){for(t=0;t<arguments.length;t++)"string"==typeof arguments[t]&&(arguments[t]=n.prefix(arguments[t]));return o=s.apply(this,arguments),a.indexOf(i)>-1?n.$(o):o},e}),e):e},n.$doc=n.$(document),n.$win=n.$(window),n.$html=n.$("html"),n.fn=function(t,e){var o=arguments,s=t.match(/^([a-z\-]+)(?:\.([a-z]+))?/i),a=s[1],r=s[2];return n[a]?this.each(function(){var t=i(this),s=t.data(a);s||t.data(a,s=n[a](this,r?void 0:e)),r&&s[r].apply(s,Array.prototype.slice.call(o,1))}):(i.error("UIkit component ["+a+"] does not exist."),this)},n.support={},n.support.transition=function(){var t=function(){var t,i=e.body||e.documentElement,n={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(t in n)if(void 0!==i.style[t])return n[t]}();return t&&{end:t}}(),n.support.animation=function(){var t=function(){var t,i=e.body||e.documentElement,n={WebkitAnimation:"webkitAnimationEnd",MozAnimation:"animationend",OAnimation:"oAnimationEnd oanimationend",animation:"animationend"};for(t in n)if(void 0!==i.style[t])return n[t]}();return t&&{end:t}}(),n.support.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||function(t){setTimeout(t,1e3/60)},n.support.touch="ontouchstart"in window&&navigator.userAgent.toLowerCase().match(/mobile|tablet/)||t.DocumentTouch&&document instanceof t.DocumentTouch||t.navigator.msPointerEnabled&&t.navigator.msMaxTouchPoints>0||t.navigator.pointerEnabled&&t.navigator.maxTouchPoints>0||!1,n.support.mutationobserver=t.MutationObserver||t.WebKitMutationObserver||null,n.Utils={},n.Utils.str2json=function(t){return t.replace(/([\$\w]+)\s*:/g,function(t,i){return'"'+i+'":'}).replace(/'([^']+)'/g,function(t,i){return'"'+i+'"'})},n.Utils.debounce=function(t,i,e){var n;return function(){var o=this,s=arguments,a=function(){n=null,e||t.apply(o,s)},r=e&&!n;clearTimeout(n),n=setTimeout(a,i),r&&t.apply(o,s)}},n.Utils.removeCssRules=function(t){var i,e,n,o,s,a,r,l,c,h;t&&setTimeout(function(){try{for(h=document.styleSheets,o=0,r=h.length;r>o;o++){for(n=h[o],e=[],n.cssRules=n.cssRules,i=s=0,l=n.cssRules.length;l>s;i=++s)n.cssRules[i].type===CSSRule.STYLE_RULE&&t.test(n.cssRules[i].selectorText)&&e.unshift(i);for(a=0,c=e.length;c>a;a++)n.deleteRule(e[a])}}catch(u){}},0)},n.Utils.isInView=function(t,e){var o=i(t);if(!o.is(":visible"))return!1;var s=n.$win.scrollLeft(),a=n.$win.scrollTop(),r=o.offset(),l=r.left,c=r.top;return e=i.extend({topoffset:0,leftoffset:0},e),c+o.height()>=a&&c-e.topoffset<=a+n.$win.height()&&l+o.width()>=s&&l-e.leftoffset<=s+n.$win.width()?!0:!1},n.Utils.checkDisplay=function(t,e){var o=n.$("[data-@-margin], [data-@-grid-match], [data-@-grid-margin], [data-@-check-display]",t||document);return t&&!o.length&&(o=i(t)),o.trigger("display.uk.check"),e&&("string"!=typeof e&&(e=n.prefix('[class*="@-animation-"]')),o.find(e).each(function(){var t=n.$(this),i=t.attr("class"),e=i.match(/uk\-animation\-(.+)/);t.removeClass(e[0]).width(),t.addClass(e[0])})),o},n.Utils.options=function(t){if(i.isPlainObject(t))return t;var e=t?t.indexOf("{"):-1,o={};if(-1!=e)try{o=JSON.parse(n.Utils.str2json(t.substr(e)))}catch(s){}return o},n.Utils.animate=function(t,e){var o=i.Deferred();return t=n.$(t),e=n.prefix(e),t.css("display","none").addClass(e).one(n.support.animation.end,function(){t.removeClass(e),o.resolve()}).width(),t.css("display",""),o.promise()},n.Utils.uid=function(t){return(t||"id")+(new Date).getTime()+"RAND"+Math.ceil(1e5*Math.random())},n.Utils.template=function(t,i){for(var e,n,o,s,a=t.replace(/\n/g,"\\n").replace(/\{\{\{\s*(.+?)\s*\}\}\}/g,"{{!$1}}").split(/(\{\{\s*(.+?)\s*\}\})/g),r=0,l=[],c=0;r<a.length;){if(e=a[r],e.match(/\{\{\s*(.+?)\s*\}\}/))switch(r+=1,e=a[r],n=e[0],o=e.substring(e.match(/^(\^|\#|\!|\~|\:)/)?1:0),n){case"~":l.push("for(var $i=0;$i<"+o+".length;$i++) { var $item = "+o+"[$i];"),c++;break;case":":l.push("for(var $key in "+o+") { var $val = "+o+"[$key];"),c++;break;case"#":l.push("if("+o+") {"),c++;break;case"^":l.push("if(!"+o+") {"),c++;break;case"/":l.push("}"),c--;break;case"!":l.push("__ret.push("+o+");");break;default:l.push("__ret.push(escape("+o+"));")}else l.push("__ret.push('"+e.replace(/\'/g,"\\'")+"');");r+=1}return s=new Function("$data",["var __ret = [];","try {","with($data){",c?'__ret = ["Not all blocks are closed correctly."]':l.join(""),"};","}catch(e){__ret = [e.message];}",'return __ret.join("").replace(/\\n\\n/g, "\\n");',"function escape(html) { return String(html).replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');}"].join("\n")),i?s(i):s},n.Utils.events={},n.Utils.events.click=n.support.touch?"tap":"click",window.UIkit=n,i.UIkit=n,i.fn.uk=n.fn,n.langdirection="rtl"==n.$html.attr("dir")?"right":"left",n.components={},n.component=function(t,e){var o=function(e,s){var a=this;return this.UIkit=n,this.element=e?n.$(e):null,this.options=i.extend(!0,{},this.defaults,s),this.plugins={},this.element&&this.element.data(t,this),this.init(),(this.options.plugins.length?this.options.plugins:Object.keys(o.plugins)).forEach(function(t){o.plugins[t].init&&(o.plugins[t].init(a),a.plugins[t]=!0)}),this.trigger("init.uk.component",[t,this]),this};return o.plugins={},i.extend(!0,o.prototype,{defaults:{plugins:[]},boot:function(){},init:function(){},on:function(t,i,e){return n.$(this.element||this).on(t,i,e)},one:function(t,i,e){return n.$(this.element||this).one(t,i,e)},off:function(t){return n.$(this.element||this).off(t)},trigger:function(t,i){return n.$(this.element||this).trigger(t,i)},find:function(t){return n.$(this.element?this.element:[]).find(t)},proxy:function(t,i){var e=this;i.split(" ").forEach(function(i){e[i]||(e[i]=function(){return t[i].apply(t,arguments)})})},mixin:function(t,i){var e=this;i.split(" ").forEach(function(i){e[i]||(e[i]=t[i].bind(e))})}},e),this.components[t]=o,this[t]=function(){var e,o;if(arguments.length)switch(arguments.length){case 1:"string"==typeof arguments[0]||arguments[0].nodeType||arguments[0]instanceof jQuery?e=i(arguments[0]):o=arguments[0];break;case 2:e=i(arguments[0]),o=arguments[1]}return e&&e.data(t)?e.data(t):new n.components[t](e,o)},n.domready&&n.component.boot(t),o},n.plugin=function(t,i,e){this.components[t].plugins[i]=e},n.component.boot=function(t){n.components[t].prototype&&n.components[t].prototype.boot&&!n.components[t].booted&&(n.components[t].prototype.boot.apply(n,[]),n.components[t].booted=!0)},n.component.bootComponents=function(){for(var t in n.components)n.component.boot(t)},n.domObservers=[],n.domready=!1,n.ready=function(t){n.domObservers.push(t),n.domready&&t(document)},n.on=function(t,i,e){return t&&t.indexOf("ready.uk.dom")>-1&&n.domready&&i.apply(n.$doc),n.$doc.on(t,i,e)},n.one=function(t,i,e){return t&&t.indexOf("ready.uk.dom")>-1&&n.domready?(i.apply(n.$doc),n.$doc):n.$doc.one(t,i,e)},n.trigger=function(t,i){return n.$doc.trigger(t,i)},n.domObserve=function(t,i){n.support.mutationobserver&&(i=i||function(){},n.$(t).each(function(){var t=this,e=n.$(t);if(!e.data("observer"))try{var o=new n.support.mutationobserver(n.Utils.debounce(function(){i.apply(t,[]),e.trigger("changed.uk.dom")},50));o.observe(t,{childList:!0,subtree:!0}),e.data("observer",o)}catch(s){}}))},i(function(){n.$body=n.$("body"),n.ready(function(){n.domObserve("[data-@-observe]")}),n.on("ready.uk.dom",function(){n.domObservers.forEach(function(t){t(document)}),n.domready&&n.Utils.checkDisplay(document)}),n.on("changed.uk.dom",function(t){var i=t.target;n.domObservers.forEach(function(t){t(i)}),n.Utils.checkDisplay(i)}),n.trigger("beforeready.uk.dom"),n.component.bootComponents(),setInterval(function(){var t,i={x:window.pageXOffset,y:window.pageYOffset},e=function(){(i.x!=window.pageXOffset||i.y!=window.pageYOffset)&&(t={x:0,y:0},window.pageXOffset!=i.x&&(t.x=window.pageXOffset>i.x?1:-1),window.pageYOffset!=i.y&&(t.y=window.pageYOffset>i.y?1:-1),i={dir:t,x:window.pageXOffset,y:window.pageYOffset},n.$doc.trigger("scrolling.uk.document",[i]))};return n.support.touch&&n.$html.on("touchmove touchend MSPointerMove MSPointerUp pointermove pointerup",e),(i.x||i.y)&&e(),e}(),15),n.trigger("ready.uk.dom"),n.support.touch&&navigator.userAgent.match(/(iPad|iPhone|iPod)/g)&&n.$win.on("load orientationchange resize",n.Utils.debounce(function(){var t=function(){return i(n.prefix(".@-height-viewport")).css("height",window.innerHeight),t};return t()}(),100)),n.trigger("afterready.uk.dom"),n.domready=!0}),n.$html.addClass(n.support.touch?"@-touch":"@-notouch"),n.support.touch){var s,a=!1,r=".@-overlay, .@-overlay-toggle, .@-caption-toggle, .@-animation-hover, .@-has-hover";n.$html.on("touchstart MSPointerDown pointerdown",r,function(){a&&n.$(".@-hover").removeClass("@-hover"),a=n.$(this).addClass("@-hover")}).on("touchend MSPointerUp pointerup",function(t){s=n.$(t.target).parents(r),a&&a.not(s).removeClass("@-hover")})}return n}),function(t){function i(t,i,e,n){return Math.abs(t-i)>=Math.abs(e-n)?t-i>0?"Left":"Right":e-n>0?"Up":"Down"}function e(){c=null,u.last&&(u.el.trigger("longTap"),u={})}function n(){c&&clearTimeout(c),c=null}function o(){a&&clearTimeout(a),r&&clearTimeout(r),l&&clearTimeout(l),c&&clearTimeout(c),a=r=l=c=null,u={}}function s(t){return t.pointerType==t.MSPOINTER_TYPE_TOUCH&&t.isPrimary}if(!t.fn.swipeLeft){var a,r,l,c,h,u={},d=750;t(function(){var f,p,g,m=0,v=0;"MSGesture"in window&&(h=new MSGesture,h.target=document.body),t(document).on("MSGestureEnd gestureend",function(t){var i=t.originalEvent.velocityX>1?"Right":t.originalEvent.velocityX<-1?"Left":t.originalEvent.velocityY>1?"Down":t.originalEvent.velocityY<-1?"Up":null;i&&(u.el.trigger("swipe"),u.el.trigger("swipe"+i))}).on("touchstart MSPointerDown pointerdown",function(i){("MSPointerDown"!=i.type||s(i.originalEvent))&&(g="MSPointerDown"==i.type||"pointerdown"==i.type?i:i.originalEvent.touches[0],f=Date.now(),p=f-(u.last||f),u.el=t("tagName"in g.target?g.target:g.target.parentNode),a&&clearTimeout(a),u.x1=g.pageX,u.y1=g.pageY,p>0&&250>=p&&(u.isDoubleTap=!0),u.last=f,c=setTimeout(e,d),!h||"MSPointerDown"!=i.type&&"pointerdown"!=i.type&&"touchstart"!=i.type||h.addPointer(i.originalEvent.pointerId))}).on("touchmove MSPointerMove pointermove",function(t){("MSPointerMove"!=t.type||s(t.originalEvent))&&(g="MSPointerMove"==t.type||"pointermove"==t.type?t:t.originalEvent.touches[0],n(),u.x2=g.pageX,u.y2=g.pageY,m+=Math.abs(u.x1-u.x2),v+=Math.abs(u.y1-u.y2))}).on("touchend MSPointerUp pointerup",function(e){("MSPointerUp"!=e.type||s(e.originalEvent))&&(n(),u.x2&&Math.abs(u.x1-u.x2)>30||u.y2&&Math.abs(u.y1-u.y2)>30?l=setTimeout(function(){u.el.trigger("swipe"),u.el.trigger("swipe"+i(u.x1,u.x2,u.y1,u.y2)),u={}},0):"last"in u&&(isNaN(m)||30>m&&30>v?r=setTimeout(function(){var i=t.Event("tap");i.cancelTouch=o,u.el.trigger(i),u.isDoubleTap?(u.el.trigger("doubleTap"),u={}):a=setTimeout(function(){a=null,u.el.trigger("singleTap"),u={}},250)},0):u={},m=v=0))}).on("touchcancel MSPointerCancel",o),t(window).on("scroll",o)}),["swipe","swipeLeft","swipeRight","swipeUp","swipeDown","doubleTap","tap","singleTap","longTap"].forEach(function(i){t.fn[i]=function(e){return t(this).on(i,e)}})}}(jQuery),function(t,i){"use strict";var e=[];i.component("stackMargin",{defaults:{cls:"@-margin-small-top"},boot:function(){i.ready(function(t){i.$("[data-@-margin]",t).each(function(){var t,e=i.$(this);e.data("stackMargin")||(t=i.stackMargin(e,i.Utils.options(e.attr("data-@-margin"))))})})},init:function(){var n=this;this.columns=this.element.children(),this.columns.length&&(i.$win.on("resize orientationchange",function(){var e=function(){n.process()};return t(function(){e(),i.$win.on("load",e)}),i.Utils.debounce(e,20)}()),i.$html.on("changed.uk.dom",function(){n.columns=n.element.children(),n.process()}),this.on("display.uk.check",function(){n.columns=n.element.children(),this.element.is(":visible")&&this.process()}.bind(this)),e.push(this))},process:function(){var t=this;this.revert();var e=!1,n=this.columns.filter(":visible:first"),o=n.length?n.position().top+n.outerHeight()-1:!1;if(o!==!1)return this.columns.each(function(){var n=i.$(this);n.is(":visible")&&(e?n.addClass(t.options.cls):n.position().top>=o&&(e=n.addClass(t.options.cls)))}),this},revert:function(){return this.columns.removeClass(this.options.cls),this}})}(jQuery,UIkit),function(t,i){"use strict";function e(e,n){n=t.extend({duration:1e3,transition:"easeOutExpo",offset:0,complete:function(){}},n);var o=e.offset().top-n.offset,s=i.$doc.height(),a=window.innerHeight;o+a>s&&(o=s-a),i.$("html,body").stop().animate({scrollTop:o},n.duration,n.transition).promise().done(n.complete)}i.component("smoothScroll",{boot:function(){i.$html.on("click.smooth-scroll.uikit","[data-@-smooth-scroll]",function(){var t=i.$(this);if(!t.data("smoothScroll")){{i.smoothScroll(t,i.Utils.options(t.attr("data-@-smooth-scroll")))}t.trigger("click")}return!1})},init:function(){var t=this;this.on("click",function(n){n.preventDefault(),e(i.$(this.hash).length?i.$(this.hash):i.$("body"),t.options)})}}),i.Utils.scrollToElement=e,t.easing.easeOutExpo||(t.easing.easeOutExpo=function(t,i,e,n,o){return i==o?e+n:n*(-Math.pow(2,-10*i/o)+1)+e})}(jQuery,UIkit),function(t,i){"use strict";var e=i.$win,n=i.$doc,o=[],s=function(){for(var t=0;t<o.length;t++)i.support.requestAnimationFrame.apply(window,[o[t].check])};i.component("scrollspy",{defaults:{cls:"@-scrollspy-inview",initcls:"@-scrollspy-init-inview",topoffset:0,leftoffset:0,repeat:!1,delay:0},boot:function(){n.on("scrolling.uk.document",s),e.on("resize orientationchange",i.Utils.debounce(s,50)),i.ready(function(t){i.$("[data-@-scrollspy]",t).each(function(){var t=i.$(this);if(!t.data("scrollspy")){i.scrollspy(t,i.Utils.options(t.attr("data-@-scrollspy")))}})})},init:function(){var t,e,n,s=this,a=function(){var o=i.Utils.isInView(s.element,s.options);o&&!e&&(t&&clearTimeout(t),n||(s.element.addClass(s.options.initcls),s.offset=s.element.offset(),n=!0,s.trigger("init.uk.scrollspy")),t=setTimeout(function(){o&&s.element.addClass("@-scrollspy-inview").addClass(s.options.cls).width()},s.options.delay),e=!0,s.trigger("inview.uk.scrollspy")),!o&&e&&s.options.repeat&&(s.element.removeClass("@-scrollspy-inview").removeClass(s.options.cls),e=!1,s.trigger("outview.uk.scrollspy"))};a(),this.check=a,o.push(this)}});var a=[],r=function(){for(var t=0;t<a.length;t++)i.support.requestAnimationFrame.apply(window,[a[t].check])};i.component("scrollspynav",{defaults:{cls:"@-active",closest:!1,topoffset:0,leftoffset:0,smoothscroll:!1},boot:function(){n.on("scrolling.uk.document",r),e.on("resize orientationchange",i.Utils.debounce(r,50)),i.ready(function(t){i.$("[data-@-scrollspy-nav]",t).each(function(){var t=i.$(this);if(!t.data("scrollspynav")){i.scrollspynav(t,i.Utils.options(t.attr("data-@-scrollspy-nav")))}})})},init:function(){var n,o=[],s=this.find("a[href^='#']").each(function(){o.push(t(this).attr("href"))}),r=t(o.join(",")),l=i.prefix(this.options.cls),c=i.prefix(this.options.closest||this.options.closest),h=this,u=function(){n=[];for(var t=0;t<r.length;t++)i.Utils.isInView(r.eq(t),h.options)&&n.push(r.eq(t));if(n.length){var o,a=e.scrollTop(),u=function(){for(var t=0;t<n.length;t++)if(n[t].offset().top>=a)return n[t]}();if(!u)return;h.options.closest?(s.closest(c).removeClass(l),o=s.filter("a[href='#"+u.attr("id")+"']").closest(c).addClass(l)):o=s.removeClass(l).filter("a[href='#"+u.attr("id")+"']").addClass(l),h.element.trigger("inview.uk.scrollspynav",[u,o])}};this.options.smoothscroll&&i.smoothScroll&&s.each(function(){i.smoothScroll(this,h.options.smoothscroll)}),u(),this.element.data("scrollspynav",this),this.check=u,a.push(this)}})}(jQuery,UIkit),function(t,i,e){"use strict";var n=[];e.component("toggle",{defaults:{target:!1,cls:"@-hidden",animation:!1,duration:200},boot:function(){e.ready(function(t){e.$("[data-@-toggle]",t).each(function(){var t=e.$(this);if(!t.data("toggle")){e.toggle(t,e.Utils.options(t.attr("data-@-toggle")))}}),setTimeout(function(){n.forEach(function(t){t.getTogglers()})},0)})},init:function(){var t=this;this.getTogglers(),this.on("click",function(i){t.element.is('a[href="#"]')&&i.preventDefault(),t.toggle()}),n.push(this)},toggle:function(){if(this.totoggle.length)if(this.options.animation){var t=this,n=e.prefix(this.options.animation).split(",");1==n.length&&(n[1]=n[0]),n[0]=n[0].trim(),n[1]=n[1].trim(),this.totoggle.css("animation-duration",this.options.duration+"ms"),this.totoggle.hasClass(this.options.cls)?(this.totoggle.toggleClass(this.options.cls),this.totoggle.each(function(){e.Utils.animate(this,n[0]).then(function(){i(this).css("animation-duration",""),e.Utils.checkDisplay(this)})})):this.totoggle.each(function(){e.Utils.animate(this,n[1]+" @-animation-reverse").then(function(){e.$(this).toggleClass(t.options.cls).css("animation-duration",""),e.Utils.checkDisplay(this)}.bind(this))})}else this.totoggle.toggleClass(this.options.cls),e.Utils.checkDisplay(this.totoggle)},getTogglers:function(){this.totoggle=this.options.target?e.$(this.options.target):[]}})}(this,jQuery,UIkit),function(t,i){"use strict";i.component("alert",{defaults:{fade:!0,duration:200,trigger:".@-alert-close"},boot:function(){i.$html.on("click.alert.uikit","[data-@-alert]",function(t){var e=i.$(this);if(!e.data("alert")){var n=i.alert(e,i.Utils.options(e.attr("data-@-alert")));i.$(t.target).is(n.options.trigger)&&(t.preventDefault(),n.close())}})},init:function(){var t=this;this.on("click",this.options.trigger,function(i){i.preventDefault(),t.close()})},close:function(){var t=this.trigger("close.uk.alert"),i=function(){this.trigger("closed.uk.alert").remove()}.bind(this);this.options.fade?t.css("overflow","hidden").css("max-height",t.height()).animate({height:0,opacity:0,"padding-top":0,"padding-bottom":0,"margin-top":0,"margin-bottom":0},this.options.duration,i):i()}})}(jQuery,UIkit),function(t,i){"use strict";i.component("buttonRadio",{defaults:{target:".@-button"},boot:function(){i.$html.on("click.buttonradio.uikit","[data-@-button-radio]",function(t){var e=i.$(this);if(!e.data("buttonRadio")){var n=i.buttonRadio(e,i.Utils.options(e.attr("data-@-button-radio"))),o=i.$(t.target);o.is(n.options.target)&&o.trigger("click")}})},init:function(){var t=this;this.on("click",this.options.target,function(e){var n=i.$(this);n.is('a[href="#"]')&&e.preventDefault(),t.find(t.options.target).not(n).removeClass(i.prefix("@-active")).blur(),t.trigger("change.uk.button",[n.addClass("@-active")])})},getSelected:function(){return this.find(".@-active")}}),i.component("buttonCheckbox",{defaults:{target:".@-button"},boot:function(){i.$html.on("click.buttoncheckbox.uikit","[data-@-button-checkbox]",function(t){var e=i.$(this);if(!e.data("buttonCheckbox")){var n=i.buttonCheckbox(e,i.Utils.options(e.attr("data-@-button-checkbox"))),o=i.$(t.target);o.is(n.options.target)&&e.trigger("change.uk.button",[o.toggleClass("@-active").blur()])}})},init:function(){var e=this;this.on("click",this.options.target,function(n){t(this).is('a[href="#"]')&&n.preventDefault(),e.trigger("change.uk.button",[i.$(this).toggleClass("@-active").blur()])})},getSelected:function(){return this.find(".@-active")}}),i.component("button",{defaults:{},boot:function(){i.$html.on("click.button.uikit","[data-@-button]",function(){var t=i.$(this);if(!t.data("button")){{i.button(t,i.Utils.options(t.attr("data-@-button")))}t.trigger("click")}})},init:function(){var t=this;this.on("click",function(i){t.element.is('a[href="#"]')&&i.preventDefault(),t.toggle(),t.trigger("change.uk.button",[t.element.blur().hasClass("@-active")])})},toggle:function(){this.element.toggleClass("@-active")}})}(jQuery,UIkit),function(t,i){"use strict";var e,n=!1;i.component("dropdown",{defaults:{mode:"hover",remaintime:800,justify:!1,boundary:i.$win,delay:0},remainIdle:!1,boot:function(){var t=i.support.touch?"click":"mouseenter";i.$html.on(t+".dropdown.uikit","[data-@-dropdown]",function(e){var n=i.$(this);if(!n.data("dropdown")){var o=i.dropdown(n,i.Utils.options(n.attr("data-@-dropdown")));("click"==t||"mouseenter"==t&&"hover"==o.options.mode)&&o.element.trigger(t),o.element.find(".@-dropdown").length&&e.preventDefault()}})},init:function(){var n=this;this.dropdown=this.find(".@-dropdown"),this.centered=this.dropdown.hasClass("@-dropdown-center"),this.justified=this.options.justify?i.$(this.options.justify):!1,this.boundary=i.$(this.options.boundary),this.flipped=this.dropdown.hasClass("@-dropdown-flip"),this.boundary.length||(this.boundary=i.$win),"click"==this.options.mode||i.support.touch?this.on("click",function(t){var e=i.$(t.target);e.parents(".@-dropdown").length||((e.is("a[href='#']")||e.parent().is("a[href='#']")||n.dropdown.length&&!n.dropdown.is(":visible"))&&t.preventDefault(),e.blur()),n.element.hasClass("@-open")?(e.is("a:not(.js-@-prevent)")||e.is(".@-dropdown-close")||!n.dropdown.find(t.target).length)&&n.hide():n.show()}):this.on("mouseenter",function(){n.remainIdle&&clearTimeout(n.remainIdle),e&&clearTimeout(e),e=setTimeout(n.show.bind(n),n.options.delay)}).on("mouseleave",function(){e&&clearTimeout(e),n.remainIdle=setTimeout(function(){n.hide()},n.options.remaintime)}).on("click",function(i){var e=t(i.target);n.remainIdle&&clearTimeout(n.remainIdle),(e.is("a[href='#']")||e.parent().is("a[href='#']"))&&i.preventDefault(),n.show()})},show:function(){i.$html.off("click.outer.dropdown"),n&&n[0]!=this.element[0]&&n.removeClass("@-open"),e&&clearTimeout(e),this.checkDimensions(),this.element.addClass("@-open"),this.trigger("show.uk.dropdown",[this]),i.Utils.checkDisplay(this.dropdown,!0),n=this.element,this.registerOuterClick()},hide:function(){this.element.removeClass("@-open"),this.remainIdle=!1,n&&n[0]==this.element[0]&&(n=!1)},registerOuterClick:function(){var t=this;i.$html.off("click.outer.dropdown"),setTimeout(function(){i.$html.on("click.outer.dropdown",function(o){e&&clearTimeout(e);var s=i.$(o.target);n&&n[0]==t.element[0]&&(s.is("a:not(.js-@-prevent)")||s.is(".@-dropdown-close")||!t.dropdown.find(o.target).length)&&(t.hide(),i.$html.off("click.outer.dropdown"))})},10)},checkDimensions:function(){if(this.dropdown.length){this.justified&&this.justified.length&&this.dropdown.css("min-width","");var t=this,e=this.dropdown.css("margin-"+i.langdirection,""),n=e.show().offset(),o=e.outerWidth(),s=this.boundary.width(),a=this.boundary.offset()?this.boundary.offset().left:0;if(this.centered&&(e.css("margin-"+i.langdirection,-1*(parseFloat(o)/2-e.parent().width()/2)),n=e.offset(),(o+n.left>s||n.left<0)&&(e.css("margin-"+i.langdirection,""),n=e.offset())),this.justified&&this.justified.length){var r=this.justified.outerWidth();if(e.css("min-width",r),"right"==i.langdirection){var l=s-(this.justified.offset().left+r),c=s-(e.offset().left+e.outerWidth());e.css("margin-right",l-c)}else e.css("margin-left",this.justified.offset().left-n.left);n=e.offset()}o+(n.left-a)>s&&(e.addClass("@-dropdown-flip"),n=e.offset()),n.left-a<0&&(e.addClass("@-dropdown-stack"),e.hasClass("@-dropdown-flip")&&(this.flipped||(e.removeClass("@-dropdown-flip"),n=e.offset(),e.addClass("@-dropdown-flip")),setTimeout(function(){(e.offset().left-a<0||!t.flipped&&e.outerWidth()+(n.left-a)<s)&&e.removeClass("@-dropdown-flip")},0)),this.trigger("stack.uk.dropdown",[this])),e.css("display","")}}})}(jQuery,UIkit),function(t,i){"use strict";var e=[];i.component("gridMatchHeight",{defaults:{target:!1,row:!0},boot:function(){i.ready(function(t){i.$("[data-@-grid-match]",t).each(function(){var t,e=i.$(this);e.data("gridMatchHeight")||(t=i.gridMatchHeight(e,i.Utils.options(e.attr("data-@-grid-match"))))})})},init:function(){var n=this;this.columns=this.element.children(),this.elements=this.options.target?this.find(this.options.target):this.columns,this.columns.length&&(i.$win.on("resize orientationchange",function(){var e=function(){n.match()};return t(function(){e(),i.$win.on("load",e)}),i.Utils.debounce(e,50)}()),i.$html.on("changed.uk.dom",function(){n.columns=n.element.children(),n.elements=n.options.target?n.find(n.options.target):n.columns,n.match()}),this.on("display.uk.check",function(){this.element.is(":visible")&&this.match()}.bind(this)),e.push(this))},match:function(){this.revert();var i=this.columns.filter(":visible:first");if(i.length){var e=Math.ceil(100*parseFloat(i.css("width"))/parseFloat(i.parent().css("width")))>=100?!0:!1,n=this;if(!e)return this.options.row?(this.element.width(),setTimeout(function(){var i=!1,e=[];n.elements.each(function(){var o=t(this),s=o.offset().top;s!=i&&e.length&&(n.matchHeights(t(e)),e=[],s=o.offset().top),e.push(o),i=s}),e.length&&n.matchHeights(t(e))},0)):this.matchHeights(this.elements),this}},revert:function(){return this.elements.css("min-height",""),this},matchHeights:function(i){if(!(i.length<2)){var e=0;i.each(function(){e=Math.max(e,t(this).outerHeight())}).each(function(){var i=t(this),n=e-(i.outerHeight()-i.height());i.css("min-height",n+"px")})}}}),i.component("gridMargin",{defaults:{cls:"@-grid-margin"},boot:function(){i.ready(function(t){i.$("[data-@-grid-margin]",t).each(function(){var t,e=i.$(this);e.data("gridMargin")||(t=i.gridMargin(e,i.Utils.options(e.attr("data-@-grid-margin"))))})})},init:function(){i.stackMargin(this.element,this.options)}})}(jQuery,UIkit),function(t,i){"use strict";function e(e,n){return n?("object"==typeof e?(e=e instanceof jQuery?e:i.$(e),e.parent().length&&(n.persist=e,n.persist.data("modalPersistParent",e.parent()))):e="string"==typeof e||"number"==typeof e?t("<div></div>").html(e):t("<div></div>").html("UIkit.modal Error: Unsupported data type: "+typeof e),e.appendTo(n.element.find(".@-modal-dialog")),n):void 0}var n,o=!1,s=i.$html;i.component("modal",{defaults:{keyboard:!0,bgclose:!0,minScrollHeight:150},scrollable:!1,transition:!1,init:function(){n||(n=t("body"));var e=this;this.transition=i.support.transition,this.paddingdir="padding-"+("left"==i.langdirection?"right":"left"),this.dialog=this.find(".@-modal-dialog"),this.on("click",".@-modal-close",function(t){t.preventDefault(),e.hide()}).on("click",function(i){var n=t(i.target);n[0]==e.element[0]&&e.options.bgclose&&e.hide()})},toggle:function(){return this[this.isActive()?"hide":"show"]()},show:function(){if(!this.isActive())return o&&o.hide(!0),this.element.removeClass("@-open").show(),this.resize(),o=this,s.addClass("@-modal-page").height(),this.element.addClass("@-open").trigger("show.uk.modal"),i.Utils.checkDisplay(this.dialog,!0),this},hide:function(t){if(this.isActive()){if(!t&&i.support.transition){var e=this;this.one(i.support.transition.end,function(){e._hide()}).removeClass("@-open")}else this._hide();return this}},resize:function(){var t=n.width();this.scrollbarwidth=window.innerWidth-t,n.css(this.paddingdir,this.scrollbarwidth),this.element.css("overflow-y",this.scrollbarwidth?"scroll":"auto"),this.updateScrollable()},updateScrollable:function(){var t=this.dialog.find(".@-overflow-container:visible:first");if(t){t.css("height",0);var i=Math.abs(parseInt(this.dialog.css("margin-top"),10)),e=this.dialog.outerHeight(),n=window.innerHeight,o=n-2*(20>i?20:i)-e;t.css("height",o<this.options.minScrollHeight?"":o)}},_hide:function(){this.element.hide().removeClass("@-open"),s.removeClass("@-modal-page"),n.css(this.paddingdir,""),o===this&&(o=!1),this.trigger("hide.uk.modal")},isActive:function(){return o==this}}),i.component("modalTrigger",{boot:function(){i.$html.on("click.modal.uikit","[data-@-modal]",function(t){var e=i.$(this);if(e.is("a")&&t.preventDefault(),!e.data("modalTrigger")){var n=i.modalTrigger(e,i.Utils.options(e.attr("data-@-modal")));n.show()}}),i.$html.on("keydown.modal.uikit",function(t){o&&27===t.keyCode&&o.options.keyboard&&(t.preventDefault(),o.hide())}),i.$win.on("resize orientationchange",i.Utils.debounce(function(){o&&o.resize()},150))},init:function(){var e=this;this.options=t.extend({target:e.element.is("a")?e.element.attr("href"):!1},this.options),this.modal=i.modal(this.options.target,this.options),this.on("click",function(t){t.preventDefault(),e.show()}),this.proxy(this.modal,"show hide isActive")}}),i.modal.dialog=function(t,n){var o=i.modal(i.$(i.modal.dialog.template).appendTo("body"),n);return o.on("hide.uk.modal",function(){o.persist&&(o.persist.appendTo(o.persist.data("modalPersistParent")),o.persist=!1),o.element.remove()}),e(t,o),o},i.modal.dialog.template='<div class="@-modal"><div class="@-modal-dialog"></div></div>',i.modal.alert=function(e,n){i.modal.dialog(['<div class="@-margin @-modal-content">'+String(e)+"</div>",'<div class="@-modal-buttons"><button class="@-button @-button-primary @-modal-close">Ok</button></div>'].join("").replace(/@-/g,i._prefix+"-").replace(/@-/g,i._prefix+"-"),t.extend({bgclose:!1,keyboard:!1},n)).show()},i.modal.confirm=function(e,n,o){n=t.isFunction(n)?n:function(){};var s=i.modal.dialog(['<div class="@-margin @-modal-content">'+String(e)+"</div>",'<div class="@-modal-buttons"><button class="@-button @-button-primary js-modal-confirm">Ok</button> <button class="@-button @-modal-close">Cancel</button></div>'].join("").replace(/@-/g,i._prefix+"-"),t.extend({bgclose:!1,keyboard:!1},o));s.element.find(".js-modal-confirm").on("click",function(){n(),s.hide()}),s.show()}}(jQuery,UIkit),function(t,i){"use strict";function e(t){var e=i.$(t),n="auto";if(e.is(":visible"))n=e.outerHeight();else{var o={position:e.css("position"),visibility:e.css("visibility"),display:e.css("display")};n=e.css({position:"absolute",visibility:"hidden",display:"block"}).outerHeight(),e.css(o)}return n}i.component("nav",{defaults:{toggle:">li.@-parent > a[href='#']",lists:">li.@-parent > ul",multiple:!1},boot:function(){i.ready(function(t){i.$("[data-@-nav]",t).each(function(){var t=i.$(this);if(!t.data("nav")){i.nav(t,i.Utils.options(t.attr("data-@-nav")))}})})},init:function(){var t=this;this.on("click",this.options.toggle,function(e){e.preventDefault();var n=i.$(this);t.open(n.parent()[0]==t.element[0]?n:n.parent("li"))}),this.find(this.options.lists).each(function(){var e=i.$(this),n=e.parent(),o=n.hasClass("@-active");e.wrap('<div style="overflow:hidden;height:0;position:relative;"></div>'),n.data("list-container",e.parent()),o&&t.open(n,!0)})},open:function(t,n){var o=this.element,s=i.$(t);this.options.multiple||o.children(".@-open").not(t).each(function(){var t=i.$(this);t.data("list-container")&&t.data("list-container").stop().animate({height:0},function(){i.$(this).parent().removeClass("@-open")})}),s.toggleClass("@-open"),s.data("list-container")&&(n?s.data("list-container").stop().height(s.hasClass("@-open")?"auto":0):s.data("list-container").stop().animate({height:s.hasClass("@-open")?e(s.data("list-container").find("ul:first")):0}))}})}(jQuery,UIkit),function(t,i){"use strict";
var e={x:window.scrollX,y:window.scrollY},n=(i.$win,i.$doc),o=i.$html,s={show:function(t){if(t=i.$(t),t.length){var s=i.$("body"),a=t.find(".@-offcanvas-bar:first"),r="right"==i.langdirection,l=a.hasClass("@-offcanvas-bar-flip")?-1:1,c=l*(r?-1:1);e={x:window.pageXOffset,y:window.pageYOffset},t.addClass("@-active"),s.css({width:window.innerWidth,height:window.innerHeight}).addClass("@-offcanvas-page"),s.css(r?"margin-right":"margin-left",(r?-1:1)*a.outerWidth()*c).width(),o.css("margin-top",-1*e.y),a.addClass("@-offcanvas-bar-show"),this._initElement(t),n.trigger("show.uk.offcanvas",[t,a])}},hide:function(t){var n=i.$("body"),s=i.$(".@-offcanvas.@-active"),a="right"==i.langdirection,r=s.find(".@-offcanvas-bar:first"),l=function(){n.removeClass("@-offcanvas-page").css({width:"",height:"","margin-left":"","margin-right":""}),s.removeClass("@-active"),r.removeClass("@-offcanvas-bar-show"),o.css("margin-top",""),window.scrollTo(e.x,e.y),i.$doc.trigger("hide.uk.offcanvas",[s,r])};s.length&&(i.support.transition&&!t?(n.one(i.support.transition.end,function(){l()}).css(a?"margin-right":"margin-left",""),setTimeout(function(){r.removeClass("@-offcanvas-bar-show")},0)):l())},_initElement:function(e){e.data("OffcanvasInit")||(e.on("click.uk.offcanvas swipeRight.uk.offcanvas swipeLeft.uk.offcanvas",function(t){var e=i.$(t.target);if(!t.type.match(/swipe/)&&!e.hasClass("@-offcanvas-close")){if(e.hasClass("@-offcanvas-bar"))return;if(e.parents(".@-offcanvas-bar:first").length)return}t.stopImmediatePropagation(),s.hide()}),e.on("click","a[href^='#']",function(){var e=t(this),n=e.attr("href");"#"!=n&&(i.$doc.one("hide.uk.offcanvas",function(){var e=t(n);e.length||(e=i.$('[name="'+n.replace("#","")+'"]')),i.Utils.scrollToElement&&e.length?i.Utils.scrollToElement(e):window.location.href=n}),s.hide())}),e.data("OffcanvasInit",!0))}};i.component("offcanvasTrigger",{boot:function(){o.on("click.offcanvas.uikit","[data-@-offcanvas]",function(t){t.preventDefault();var e=i.$(this);if(!e.data("offcanvasTrigger")){{i.offcanvasTrigger(e,i.Utils.options(e.attr("data-@-offcanvas")))}e.trigger("click")}}),o.on("keydown.uk.offcanvas",function(t){27===t.keyCode&&s.hide()})},init:function(){var i=this;this.options=t.extend({target:i.element.is("a")?i.element.attr("href"):!1},this.options),this.on("click",function(t){t.preventDefault(),s.show(i.options.target)})}}),i.offcanvas=s}(jQuery,UIkit),function(t,i){"use strict";function e(e,n,o){var s,a=t.Deferred(),r=i.prefix(e),l=e;return o[0]===n[0]?(a.resolve(),a.promise()):("object"==typeof e&&(r=e[0],l=e[1]||e[0]),s=function(){n&&n.hide().removeClass(i.prefix("@-active "+l+" @-animation-reverse")),o.addClass(r).one(i.support.animation.end,function(){o.removeClass(""+r).css({opacity:"",display:""}),a.resolve(),n&&n.css({opacity:"",display:""})}.bind(this)).show()},o.css("animation-duration",this.options.duration+"ms"),n&&n.length?(n.css("animation-duration",this.options.duration+"ms"),n.css("display","none").addClass(i.prefix(l+" @-animation-reverse")).one(i.support.animation.end,function(){s()}.bind(this)).css("display","")):(o.addClass("@-active"),s()),a.promise())}var n;i.component("switcher",{defaults:{connect:!1,toggle:">*",active:0,animation:!1,duration:200},animating:!1,boot:function(){i.ready(function(t){i.$("[data-@-switcher]",t).each(function(){var t=i.$(this);if(!t.data("switcher")){i.switcher(t,i.Utils.options(t.attr("data-@-switcher")))}})})},init:function(){var t=this;if(this.on("click",this.options.toggle,function(i){i.preventDefault(),t.show(this)}),this.options.connect){this.connect=i.$(this.options.connect),this.connect.find(".@-active").removeClass(".@-active"),this.connect.length&&this.connect.on("click","[data-@-switcher-item]",function(e){e.preventDefault();var n=i.$(this).data(i._prefix+"SwitcherItem");if(t.index!=n)switch(n){case"next":case"previous":t.show(t.index+("next"==n?1:-1));break;default:t.show(n)}});var e=this.find(this.options.toggle),n=e.filter(".@-active");if(n.length)this.show(n,!1);else{if(this.options.active===!1)return;n=e.eq(i.prefix(this.options.active)),this.show(n.length?n:e.eq(0),!1)}}},show:function(t,o){if(!this.animating){if(isNaN(t))t=i.$(t);else{var s=this.find(this.options.toggle);t=0>t?s.length-1:t,t=s.eq(s[t]?t:0)}var a=this,r=i.$(t),l=n[this.options.animation]||function(t,i){if(!a.options.animation)return n.none.apply(a);var o=a.options.animation.split(",");return 1==o.length&&(o[1]=o[0]),o[0]=o[0].trim(),o[1]=o[1].trim(),e.apply(a,[o,t,i])};o===!1&&(l=n.none),r.hasClass("@-disabled")||(this.find(this.options.toggle).filter(".@-active").removeClass("@-active"),r.addClass("@-active"),this.options.connect&&this.connect.length&&(this.index=this.find(this.options.toggle).index(r),-1==this.index&&(this.index=0),this.connect.each(function(){var t=i.$(this),e=i.$(t.children()),n=i.$(e.filter(".@-active")),o=i.$(e.eq(a.index));a.animating=!0,l.apply(a,[n,o]).then(function(){n.removeClass("@-active"),o.addClass("@-active"),i.Utils.checkDisplay(o,!0),a.animating=!1})})),this.trigger("show.uk.switcher",[r]))}}}),n={none:function(){var i=t.Deferred();return i.resolve(),i.promise()},fade:function(t,i){return e.apply(this,["@-animation-fade",t,i])},"slide-bottom":function(t,i){return e.apply(this,["@-animation-slide-bottom",t,i])},"slide-top":function(t,i){return e.apply(this,["@-animation-slide-top",t,i])},"slide-vertical":function(t,i){var n=["@-animation-slide-top","@-animation-slide-bottom"];return t&&t.index()>i.index()&&n.reverse(),e.apply(this,[n,t,i])},"slide-left":function(t,i){return e.apply(this,["@-animation-slide-left",t,i])},"slide-right":function(t,i){return e.apply(this,["@-animation-slide-right",t,i])},"slide-horizontal":function(t,i){var n=["@-animation-slide-left","@-animation-slide-right"];return t&&t.index()>i.index()&&n.reverse(),e.apply(this,[n,t,i])},scale:function(t,i){return e.apply(this,["@-animation-scale-up",t,i])}},i.switcher.animations=n}(jQuery,UIkit),function(t,i){"use strict";i.component("tab",{defaults:{target:">li:not(.@-tab-responsive, .@-disabled)",connect:!1,active:0,animation:!1,duration:200},boot:function(){i.ready(function(t){i.$("[data-@-tab]",t).each(function(){var t=i.$(this);if(!t.data("tab")){i.tab(t,i.Utils.options(t.attr("data-@-tab")))}})})},init:function(){var e=this;this.on("click",this.options.target,function(t){t.preventDefault(),e.find(e.options.target).not(this).removeClass(i.prefix("@-active")).blur(),e.trigger("change.uk.tab",[i.$(this).addClass("@-active")])}),this.options.connect&&(this.connect=t(this.options.connect)),this.responsivetab=i.$('<li class="@-tab-responsive @-active"><a></a></li>').append(i.prefix('<div class="@-dropdown @-dropdown-small"><ul class="@-nav @-nav-dropdown"></ul><div>')),this.responsivetab.dropdown=this.responsivetab.find(".@-dropdown"),this.responsivetab.lst=this.responsivetab.dropdown.find("ul"),this.responsivetab.caption=this.responsivetab.find("a:first"),this.element.hasClass("@-tab-bottom")&&this.responsivetab.dropdown.addClass("@-dropdown-up"),this.responsivetab.lst.on("click","a",function(i){i.preventDefault(),i.stopPropagation();var n=t(this);e.element.children(":not(.@-tab-responsive)").eq(n.data("index")).trigger("click")}),this.on("show.uk.switcher change.uk.tab",function(t,i){e.responsivetab.caption.html(i.text())}),this.element.append(this.responsivetab),this.options.connect&&i.switcher(this.element,{toggle:">li:not(.@-tab-responsive)",connect:this.options.connect,active:this.options.active,animation:this.options.animation,duration:this.options.duration}),i.dropdown(this.responsivetab,{mode:"click"}),e.trigger("change.uk.tab",[this.element.find(this.options.target).filter(".@-active")]),this.check(),i.$win.on("resize orientationchange",i.Utils.debounce(function(){e.element.is(":visible")&&e.check()},100)),this.on("display.uk.check",function(){e.element.is(":visible")&&e.check()})},check:function(){var e=this.element.children(":not(.@-tab-responsive)").removeClass("@-hidden");if(e.length){var n,o,s=e.eq(0).offset().top+Math.ceil(e.eq(0).height()/2),a=!1;if(this.responsivetab.lst.empty(),e.each(function(){t(this).offset().top>s&&(a=!0)}),a)for(var r=0;r<e.length;r++)n=i.$(e.eq(r)),o=n.find("a"),"none"==n.css("float")||n.attr("@-dropdown")||(n.addClass("@-hidden"),n.hasClass("@-disabled")||this.responsivetab.lst.append('<li><a href="'+o.attr("href")+'" data-index="'+r+'">'+o.html()+"</a></li>"));this.responsivetab[this.responsivetab.lst.children().length?"removeClass":"addClass"]("@-hidden")}}})}(jQuery,UIkit),function(t,i){"use strict";var e,n,o;i.component("tooltip",{defaults:{offset:5,pos:"top",animation:!1,delay:0,cls:"",src:function(){return this.attr("title")}},tip:"",boot:function(){i.$html.on("mouseenter.tooltip.uikit focus.tooltip.uikit","[data-@-tooltip]",function(){var t=i.$(this);if(!t.data("tooltip")){{i.tooltip(t,i.Utils.options(t.attr("data-@-tooltip")))}t.trigger("mouseenter")}})},init:function(){var t=this;e||(e=i.$('<div class="@-tooltip"></div>').appendTo("body")),this.on({focus:function(){t.show()},blur:function(){t.hide()},mouseenter:function(){t.show()},mouseleave:function(){t.hide()}}),this.tip="function"==typeof this.options.src?this.options.src.call(this.element):this.options.src,this.element.attr("data-cached-title",this.element.attr("title")).attr("title","")},show:function(){if(n&&clearTimeout(n),o&&clearTimeout(o),this.tip.length){e.stop().css({top:-2e3,visibility:"hidden"}).show(),e.html(i.prefix('<div class="@-tooltip-inner">')+this.tip+"</div>");var s=this,a=t.extend({},this.element.offset(),{width:this.element[0].offsetWidth,height:this.element[0].offsetHeight}),r=e[0].offsetWidth,l=e[0].offsetHeight,c="function"==typeof this.options.offset?this.options.offset.call(this.element):this.options.offset,h="function"==typeof this.options.pos?this.options.pos.call(this.element):this.options.pos,u=h.split("-"),d={display:"none",visibility:"visible",top:a.top+a.height+l,left:a.left};if("fixed"==t("html").css("position")||"fixed"==t("body").css("position")){var f=i.$("body").offset(),p=i.$("html").offset(),g={top:p.top+f.top,left:p.left+f.left};a.left-=g.left,a.top-=g.top}"left"!=u[0]&&"right"!=u[0]||"right"!=i.langdirection||(u[0]="left"==u[0]?"right":"left");var m={bottom:{top:a.top+a.height+c,left:a.left+a.width/2-r/2},top:{top:a.top-l-c,left:a.left+a.width/2-r/2},left:{top:a.top+a.height/2-l/2,left:a.left-r-c},right:{top:a.top+a.height/2-l/2,left:a.left+a.width+c}};t.extend(d,m[u[0]]),2==u.length&&(d.left="left"==u[1]?a.left:a.left+a.width-r);var v=this.checkBoundary(d.left,d.top,r,l);if(v){switch(v){case"x":h=2==u.length?u[0]+"-"+(d.left<0?"left":"right"):d.left<0?"right":"left";break;case"y":h=2==u.length?(d.top<0?"bottom":"top")+"-"+u[1]:d.top<0?"bottom":"top";break;case"xy":h=2==u.length?(d.top<0?"bottom":"top")+"-"+(d.left<0?"left":"right"):d.left<0?"right":"left"}u=h.split("-"),t.extend(d,m[u[0]]),2==u.length&&(d.left="left"==u[1]?a.left:a.left+a.width-r)}d.left-=t("body").position().left,n=setTimeout(function(){e.css(d).attr("class",i.prefix(["@-tooltip","@-tooltip-"+h,s.options.cls].join(" "))),s.options.animation?e.css({opacity:0,display:"block"}).animate({opacity:1},parseInt(s.options.animation,10)||400):e.show(),n=!1,o=setInterval(function(){s.element.is(":visible")||s.hide()},150)},parseInt(this.options.delay,10)||0)}},hide:function(){this.element.is("input")&&this.element[0]===document.activeElement||(n&&clearTimeout(n),o&&clearTimeout(o),e.stop(),this.options.animation?e.fadeOut(parseInt(this.options.animation,10)||400):e.hide())},content:function(){return this.tip},checkBoundary:function(t,e,n,o){var s="";return(0>t||t-i.$win.scrollLeft()+n>window.innerWidth)&&(s+="x"),(0>e||e-i.$win.scrollTop()+o>window.innerHeight)&&(s+="y"),s}})}(jQuery,UIkit);
/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('K M;I(M)1S 2U("2a\'t 4k M 4K 2g 3l 4G 4H");(6(){6 r(f,e){I(!M.1R(f))1S 3m("3s 15 4R");K a=f.1w;f=M(f.1m,t(f)+(e||""));I(a)f.1w={1m:a.1m,19:a.19?a.19.1a(0):N};H f}6 t(f){H(f.1J?"g":"")+(f.4s?"i":"")+(f.4p?"m":"")+(f.4v?"x":"")+(f.3n?"y":"")}6 B(f,e,a,b){K c=u.L,d,h,g;v=R;5K{O(;c--;){g=u[c];I(a&g.3r&&(!g.2p||g.2p.W(b))){g.2q.12=e;I((h=g.2q.X(f))&&h.P===e){d={3k:g.2b.W(b,h,a),1C:h};1N}}}}5v(i){1S i}5q{v=11}H d}6 p(f,e,a){I(3b.Z.1i)H f.1i(e,a);O(a=a||0;a<f.L;a++)I(f[a]===e)H a;H-1}M=6(f,e){K a=[],b=M.1B,c=0,d,h;I(M.1R(f)){I(e!==1d)1S 3m("2a\'t 5r 5I 5F 5B 5C 15 5E 5p");H r(f)}I(v)1S 2U("2a\'t W 3l M 59 5m 5g 5x 5i");e=e||"";O(d={2N:11,19:[],2K:6(g){H e.1i(g)>-1},3d:6(g){e+=g}};c<f.L;)I(h=B(f,c,b,d)){a.U(h.3k);c+=h.1C[0].L||1}Y I(h=n.X.W(z[b],f.1a(c))){a.U(h[0]);c+=h[0].L}Y{h=f.3a(c);I(h==="[")b=M.2I;Y I(h==="]")b=M.1B;a.U(h);c++}a=15(a.1K(""),n.Q.W(e,w,""));a.1w={1m:f,19:d.2N?d.19:N};H a};M.3v="1.5.0";M.2I=1;M.1B=2;K C=/\\$(?:(\\d\\d?|[$&`\'])|{([$\\w]+)})/g,w=/[^5h]+|([\\s\\S])(?=[\\s\\S]*\\1)/g,A=/^(?:[?*+]|{\\d+(?:,\\d*)?})\\??/,v=11,u=[],n={X:15.Z.X,1A:15.Z.1A,1C:1r.Z.1C,Q:1r.Z.Q,1e:1r.Z.1e},x=n.X.W(/()??/,"")[1]===1d,D=6(){K f=/^/g;n.1A.W(f,"");H!f.12}(),y=6(){K f=/x/g;n.Q.W("x",f,"");H!f.12}(),E=15.Z.3n!==1d,z={};z[M.2I]=/^(?:\\\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\\29-26-f]{2}|u[\\29-26-f]{4}|c[A-3o-z]|[\\s\\S]))/;z[M.1B]=/^(?:\\\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\\d*|x[\\29-26-f]{2}|u[\\29-26-f]{4}|c[A-3o-z]|[\\s\\S])|\\(\\?[:=!]|[?*+]\\?|{\\d+(?:,\\d*)?}\\??)/;M.1h=6(f,e,a,b){u.U({2q:r(f,"g"+(E?"y":"")),2b:e,3r:a||M.1B,2p:b||N})};M.2n=6(f,e){K a=f+"/"+(e||"");H M.2n[a]||(M.2n[a]=M(f,e))};M.3c=6(f){H r(f,"g")};M.5l=6(f){H f.Q(/[-[\\]{}()*+?.,\\\\^$|#\\s]/g,"\\\\$&")};M.5e=6(f,e,a,b){e=r(e,"g"+(b&&E?"y":""));e.12=a=a||0;f=e.X(f);H b?f&&f.P===a?f:N:f};M.3q=6(){M.1h=6(){1S 2U("2a\'t 55 1h 54 3q")}};M.1R=6(f){H 53.Z.1q.W(f)==="[2m 15]"};M.3p=6(f,e,a,b){O(K c=r(e,"g"),d=-1,h;h=c.X(f);){a.W(b,h,++d,f,c);c.12===h.P&&c.12++}I(e.1J)e.12=0};M.57=6(f,e){H 6 a(b,c){K d=e[c].1I?e[c]:{1I:e[c]},h=r(d.1I,"g"),g=[],i;O(i=0;i<b.L;i++)M.3p(b[i],h,6(k){g.U(d.3j?k[d.3j]||"":k[0])});H c===e.L-1||!g.L?g:a(g,c+1)}([f],0)};15.Z.1p=6(f,e){H J.X(e[0])};15.Z.W=6(f,e){H J.X(e)};15.Z.X=6(f){K e=n.X.1p(J,14),a;I(e){I(!x&&e.L>1&&p(e,"")>-1){a=15(J.1m,n.Q.W(t(J),"g",""));n.Q.W(f.1a(e.P),a,6(){O(K c=1;c<14.L-2;c++)I(14[c]===1d)e[c]=1d})}I(J.1w&&J.1w.19)O(K b=1;b<e.L;b++)I(a=J.1w.19[b-1])e[a]=e[b];!D&&J.1J&&!e[0].L&&J.12>e.P&&J.12--}H e};I(!D)15.Z.1A=6(f){(f=n.X.W(J,f))&&J.1J&&!f[0].L&&J.12>f.P&&J.12--;H!!f};1r.Z.1C=6(f){M.1R(f)||(f=15(f));I(f.1J){K e=n.1C.1p(J,14);f.12=0;H e}H f.X(J)};1r.Z.Q=6(f,e){K a=M.1R(f),b,c;I(a&&1j e.58()==="3f"&&e.1i("${")===-1&&y)H n.Q.1p(J,14);I(a){I(f.1w)b=f.1w.19}Y f+="";I(1j e==="6")c=n.Q.W(J,f,6(){I(b){14[0]=1f 1r(14[0]);O(K d=0;d<b.L;d++)I(b[d])14[0][b[d]]=14[d+1]}I(a&&f.1J)f.12=14[14.L-2]+14[0].L;H e.1p(N,14)});Y{c=J+"";c=n.Q.W(c,f,6(){K d=14;H n.Q.W(e,C,6(h,g,i){I(g)5b(g){24"$":H"$";24"&":H d[0];24"`":H d[d.L-1].1a(0,d[d.L-2]);24"\'":H d[d.L-1].1a(d[d.L-2]+d[0].L);5a:i="";g=+g;I(!g)H h;O(;g>d.L-3;){i=1r.Z.1a.W(g,-1)+i;g=1Q.3i(g/10)}H(g?d[g]||"":"$")+i}Y{g=+i;I(g<=d.L-3)H d[g];g=b?p(b,i):-1;H g>-1?d[g+1]:h}})})}I(a&&f.1J)f.12=0;H c};1r.Z.1e=6(f,e){I(!M.1R(f))H n.1e.1p(J,14);K a=J+"",b=[],c=0,d,h;I(e===1d||+e<0)e=5D;Y{e=1Q.3i(+e);I(!e)H[]}O(f=M.3c(f);d=f.X(a);){I(f.12>c){b.U(a.1a(c,d.P));d.L>1&&d.P<a.L&&3b.Z.U.1p(b,d.1a(1));h=d[0].L;c=f.12;I(b.L>=e)1N}f.12===d.P&&f.12++}I(c===a.L){I(!n.1A.W(f,"")||h)b.U("")}Y b.U(a.1a(c));H b.L>e?b.1a(0,e):b};M.1h(/\\(\\?#[^)]*\\)/,6(f){H n.1A.W(A,f.2S.1a(f.P+f[0].L))?"":"(?:)"});M.1h(/\\((?!\\?)/,6(){J.19.U(N);H"("});M.1h(/\\(\\?<([$\\w]+)>/,6(f){J.19.U(f[1]);J.2N=R;H"("});M.1h(/\\\\k<([\\w$]+)>/,6(f){K e=p(J.19,f[1]);H e>-1?"\\\\"+(e+1)+(3R(f.2S.3a(f.P+f[0].L))?"":"(?:)"):f[0]});M.1h(/\\[\\^?]/,6(f){H f[0]==="[]"?"\\\\b\\\\B":"[\\\\s\\\\S]"});M.1h(/^\\(\\?([5A]+)\\)/,6(f){J.3d(f[1]);H""});M.1h(/(?:\\s+|#.*)+/,6(f){H n.1A.W(A,f.2S.1a(f.P+f[0].L))?"":"(?:)"},M.1B,6(){H J.2K("x")});M.1h(/\\./,6(){H"[\\\\s\\\\S]"},M.1B,6(){H J.2K("s")})})();1j 2e!="1d"&&(2e.M=M);K 1v=6(){6 r(a,b){a.1l.1i(b)!=-1||(a.1l+=" "+b)}6 t(a){H a.1i("3e")==0?a:"3e"+a}6 B(a){H e.1Y.2A[t(a)]}6 p(a,b,c){I(a==N)H N;K d=c!=R?a.3G:[a.2G],h={"#":"1c",".":"1l"}[b.1o(0,1)]||"3h",g,i;g=h!="3h"?b.1o(1):b.5u();I((a[h]||"").1i(g)!=-1)H a;O(a=0;d&&a<d.L&&i==N;a++)i=p(d[a],b,c);H i}6 C(a,b){K c={},d;O(d 2g a)c[d]=a[d];O(d 2g b)c[d]=b[d];H c}6 w(a,b,c,d){6 h(g){g=g||1P.5y;I(!g.1F){g.1F=g.52;g.3N=6(){J.5w=11}}c.W(d||1P,g)}a.3g?a.3g("4U"+b,h):a.4y(b,h,11)}6 A(a,b){K c=e.1Y.2j,d=N;I(c==N){c={};O(K h 2g e.1U){K g=e.1U[h];d=g.4x;I(d!=N){g.1V=h.4w();O(g=0;g<d.L;g++)c[d[g]]=h}}e.1Y.2j=c}d=e.1U[c[a]];d==N&&b!=11&&1P.1X(e.13.1x.1X+(e.13.1x.3E+a));H d}6 v(a,b){O(K c=a.1e("\\n"),d=0;d<c.L;d++)c[d]=b(c[d],d);H c.1K("\\n")}6 u(a,b){I(a==N||a.L==0||a=="\\n")H a;a=a.Q(/</g,"&1y;");a=a.Q(/ {2,}/g,6(c){O(K d="",h=0;h<c.L-1;h++)d+=e.13.1W;H d+" "});I(b!=N)a=v(a,6(c){I(c.L==0)H"";K d="";c=c.Q(/^(&2s;| )+/,6(h){d=h;H""});I(c.L==0)H d;H d+\'<17 1g="\'+b+\'">\'+c+"</17>"});H a}6 n(a,b){a.1e("\\n");O(K c="",d=0;d<50;d++)c+="                    ";H a=v(a,6(h){I(h.1i("\\t")==-1)H h;O(K g=0;(g=h.1i("\\t"))!=-1;)h=h.1o(0,g)+c.1o(0,b-g%b)+h.1o(g+1,h.L);H h})}6 x(a){H a.Q(/^\\s+|\\s+$/g,"")}6 D(a,b){I(a.P<b.P)H-1;Y I(a.P>b.P)H 1;Y I(a.L<b.L)H-1;Y I(a.L>b.L)H 1;H 0}6 y(a,b){6 c(k){H k[0]}O(K d=N,h=[],g=b.2D?b.2D:c;(d=b.1I.X(a))!=N;){K i=g(d,b);I(1j i=="3f")i=[1f e.2L(i,d.P,b.23)];h=h.1O(i)}H h}6 E(a){K b=/(.*)((&1G;|&1y;).*)/;H a.Q(e.3A.3M,6(c){K d="",h=N;I(h=b.X(c)){c=h[1];d=h[2]}H\'<a 2h="\'+c+\'">\'+c+"</a>"+d})}6 z(){O(K a=1E.36("1k"),b=[],c=0;c<a.L;c++)a[c].3s=="20"&&b.U(a[c]);H b}6 f(a){a=a.1F;K b=p(a,".20",R);a=p(a,".3O",R);K c=1E.4i("3t");I(!(!a||!b||p(a,"3t"))){B(b.1c);r(b,"1m");O(K d=a.3G,h=[],g=0;g<d.L;g++)h.U(d[g].4z||d[g].4A);h=h.1K("\\r");c.39(1E.4D(h));a.39(c);c.2C();c.4C();w(c,"4u",6(){c.2G.4E(c);b.1l=b.1l.Q("1m","")})}}I(1j 3F!="1d"&&1j M=="1d")M=3F("M").M;K e={2v:{"1g-27":"","2i-1s":1,"2z-1s-2t":11,1M:N,1t:N,"42-45":R,"43-22":4,1u:R,16:R,"3V-17":R,2l:11,"41-40":R,2k:11,"1z-1k":11},13:{1W:"&2s;",2M:R,46:11,44:11,34:"4n",1x:{21:"4o 1m",2P:"?",1X:"1v\\n\\n",3E:"4r\'t 4t 1D O: ",4g:"4m 4B\'t 51 O 1z-1k 4F: ",37:\'<!4T 1z 4S "-//4V//3H 4W 1.0 4Z//4Y" "1Z://2y.3L.3K/4X/3I/3H/3I-4P.4J"><1z 4I="1Z://2y.3L.3K/4L/5L"><3J><4N 1Z-4M="5G-5M" 6K="2O/1z; 6J=6I-8" /><1t>6L 1v</1t></3J><3B 1L="25-6M:6Q,6P,6O,6N-6F;6y-2f:#6x;2f:#6w;25-22:6v;2O-3D:3C;"><T 1L="2O-3D:3C;3w-32:1.6z;"><T 1L="25-22:6A-6E;">1v</T><T 1L="25-22:.6C;3w-6B:6R;"><T>3v 3.0.76 (72 73 3x)</T><T><a 2h="1Z://3u.2w/1v" 1F="38" 1L="2f:#3y">1Z://3u.2w/1v</a></T><T>70 17 6U 71.</T><T>6T 6X-3x 6Y 6D.</T></T><T>6t 61 60 J 1k, 5Z <a 2h="6u://2y.62.2w/63-66/65?64=5X-5W&5P=5O" 1L="2f:#3y">5R</a> 5V <2R/>5U 5T 5S!</T></T></3B></1z>\'}},1Y:{2j:N,2A:{}},1U:{},3A:{6n:/\\/\\*[\\s\\S]*?\\*\\//2c,6m:/\\/\\/.*$/2c,6l:/#.*$/2c,6k:/"([^\\\\"\\n]|\\\\.)*"/g,6o:/\'([^\\\\\'\\n]|\\\\.)*\'/g,6p:1f M(\'"([^\\\\\\\\"]|\\\\\\\\.)*"\',"3z"),6s:1f M("\'([^\\\\\\\\\']|\\\\\\\\.)*\'","3z"),6q:/(&1y;|<)!--[\\s\\S]*?--(&1G;|>)/2c,3M:/\\w+:\\/\\/[\\w-.\\/?%&=:@;]*/g,6a:{18:/(&1y;|<)\\?=?/g,1b:/\\?(&1G;|>)/g},69:{18:/(&1y;|<)%=?/g,1b:/%(&1G;|>)/g},6d:{18:/(&1y;|<)\\s*1k.*?(&1G;|>)/2T,1b:/(&1y;|<)\\/\\s*1k\\s*(&1G;|>)/2T}},16:{1H:6(a){6 b(i,k){H e.16.2o(i,k,e.13.1x[k])}O(K c=\'<T 1g="16">\',d=e.16.2x,h=d.2X,g=0;g<h.L;g++)c+=(d[h[g]].1H||b)(a,h[g]);c+="</T>";H c},2o:6(a,b,c){H\'<2W><a 2h="#" 1g="6e 6h\'+b+" "+b+\'">\'+c+"</a></2W>"},2b:6(a){K b=a.1F,c=b.1l||"";b=B(p(b,".20",R).1c);K d=6(h){H(h=15(h+"6f(\\\\w+)").X(c))?h[1]:N}("6g");b&&d&&e.16.2x[d].2B(b);a.3N()},2x:{2X:["21","2P"],21:{1H:6(a){I(a.V("2l")!=R)H"";K b=a.V("1t");H e.16.2o(a,"21",b?b:e.13.1x.21)},2B:6(a){a=1E.6j(t(a.1c));a.1l=a.1l.Q("47","")}},2P:{2B:6(){K a="68=0";a+=", 18="+(31.30-33)/2+", 32="+(31.2Z-2Y)/2+", 30=33, 2Z=2Y";a=a.Q(/^,/,"");a=1P.6Z("","38",a);a.2C();K b=a.1E;b.6W(e.13.1x.37);b.6V();a.2C()}}}},35:6(a,b){K c;I(b)c=[b];Y{c=1E.36(e.13.34);O(K d=[],h=0;h<c.L;h++)d.U(c[h]);c=d}c=c;d=[];I(e.13.2M)c=c.1O(z());I(c.L===0)H d;O(h=0;h<c.L;h++){O(K g=c[h],i=a,k=c[h].1l,j=3W 0,l={},m=1f M("^\\\\[(?<2V>(.*?))\\\\]$"),s=1f M("(?<27>[\\\\w-]+)\\\\s*:\\\\s*(?<1T>[\\\\w-%#]+|\\\\[.*?\\\\]|\\".*?\\"|\'.*?\')\\\\s*;?","g");(j=s.X(k))!=N;){K o=j.1T.Q(/^[\'"]|[\'"]$/g,"");I(o!=N&&m.1A(o)){o=m.X(o);o=o.2V.L>0?o.2V.1e(/\\s*,\\s*/):[]}l[j.27]=o}g={1F:g,1n:C(i,l)};g.1n.1D!=N&&d.U(g)}H d},1M:6(a,b){K c=J.35(a,b),d=N,h=e.13;I(c.L!==0)O(K g=0;g<c.L;g++){b=c[g];K i=b.1F,k=b.1n,j=k.1D,l;I(j!=N){I(k["1z-1k"]=="R"||e.2v["1z-1k"]==R){d=1f e.4l(j);j="4O"}Y I(d=A(j))d=1f d;Y 6H;l=i.3X;I(h.2M){l=l;K m=x(l),s=11;I(m.1i("<![6G[")==0){m=m.4h(9);s=R}K o=m.L;I(m.1i("]]\\>")==o-3){m=m.4h(0,o-3);s=R}l=s?m:l}I((i.1t||"")!="")k.1t=i.1t;k.1D=j;d.2Q(k);b=d.2F(l);I((i.1c||"")!="")b.1c=i.1c;i.2G.74(b,i)}}},2E:6(a){w(1P,"4k",6(){e.1M(a)})}};e.2E=e.2E;e.1M=e.1M;e.2L=6(a,b,c){J.1T=a;J.P=b;J.L=a.L;J.23=c;J.1V=N};e.2L.Z.1q=6(){H J.1T};e.4l=6(a){6 b(j,l){O(K m=0;m<j.L;m++)j[m].P+=l}K c=A(a),d,h=1f e.1U.5Y,g=J,i="2F 1H 2Q".1e(" ");I(c!=N){d=1f c;O(K k=0;k<i.L;k++)(6(){K j=i[k];g[j]=6(){H h[j].1p(h,14)}})();d.28==N?1P.1X(e.13.1x.1X+(e.13.1x.4g+a)):h.2J.U({1I:d.28.17,2D:6(j){O(K l=j.17,m=[],s=d.2J,o=j.P+j.18.L,F=d.28,q,G=0;G<s.L;G++){q=y(l,s[G]);b(q,o);m=m.1O(q)}I(F.18!=N&&j.18!=N){q=y(j.18,F.18);b(q,j.P);m=m.1O(q)}I(F.1b!=N&&j.1b!=N){q=y(j.1b,F.1b);b(q,j.P+j[0].5Q(j.1b));m=m.1O(q)}O(j=0;j<m.L;j++)m[j].1V=c.1V;H m}})}};e.4j=6(){};e.4j.Z={V:6(a,b){K c=J.1n[a];c=c==N?b:c;K d={"R":R,"11":11}[c];H d==N?c:d},3Y:6(a){H 1E.4i(a)},4c:6(a,b){K c=[];I(a!=N)O(K d=0;d<a.L;d++)I(1j a[d]=="2m")c=c.1O(y(b,a[d]));H J.4e(c.6b(D))},4e:6(a){O(K b=0;b<a.L;b++)I(a[b]!==N)O(K c=a[b],d=c.P+c.L,h=b+1;h<a.L&&a[b]!==N;h++){K g=a[h];I(g!==N)I(g.P>d)1N;Y I(g.P==c.P&&g.L>c.L)a[b]=N;Y I(g.P>=c.P&&g.P<d)a[h]=N}H a},4d:6(a){K b=[],c=2u(J.V("2i-1s"));v(a,6(d,h){b.U(h+c)});H b},3U:6(a){K b=J.V("1M",[]);I(1j b!="2m"&&b.U==N)b=[b];a:{a=a.1q();K c=3W 0;O(c=c=1Q.6c(c||0,0);c<b.L;c++)I(b[c]==a){b=c;1N a}b=-1}H b!=-1},2r:6(a,b,c){a=["1s","6i"+b,"P"+a,"6r"+(b%2==0?1:2).1q()];J.3U(b)&&a.U("67");b==0&&a.U("1N");H\'<T 1g="\'+a.1K(" ")+\'">\'+c+"</T>"},3Q:6(a,b){K c="",d=a.1e("\\n").L,h=2u(J.V("2i-1s")),g=J.V("2z-1s-2t");I(g==R)g=(h+d-1).1q().L;Y I(3R(g)==R)g=0;O(K i=0;i<d;i++){K k=b?b[i]:h+i,j;I(k==0)j=e.13.1W;Y{j=g;O(K l=k.1q();l.L<j;)l="0"+l;j=l}a=j;c+=J.2r(i,k,a)}H c},49:6(a,b){a=x(a);K c=a.1e("\\n");J.V("2z-1s-2t");K d=2u(J.V("2i-1s"));a="";O(K h=J.V("1D"),g=0;g<c.L;g++){K i=c[g],k=/^(&2s;|\\s)+/.X(i),j=N,l=b?b[g]:d+g;I(k!=N){j=k[0].1q();i=i.1o(j.L);j=j.Q(" ",e.13.1W)}i=x(i);I(i.L==0)i=e.13.1W;a+=J.2r(g,l,(j!=N?\'<17 1g="\'+h+\' 5N">\'+j+"</17>":"")+i)}H a},4f:6(a){H a?"<4a>"+a+"</4a>":""},4b:6(a,b){6 c(l){H(l=l?l.1V||g:g)?l+" ":""}O(K d=0,h="",g=J.V("1D",""),i=0;i<b.L;i++){K k=b[i],j;I(!(k===N||k.L===0)){j=c(k);h+=u(a.1o(d,k.P-d),j+"48")+u(k.1T,j+k.23);d=k.P+k.L+(k.75||0)}}h+=u(a.1o(d),c()+"48");H h},1H:6(a){K b="",c=["20"],d;I(J.V("2k")==R)J.1n.16=J.1n.1u=11;1l="20";J.V("2l")==R&&c.U("47");I((1u=J.V("1u"))==11)c.U("6S");c.U(J.V("1g-27"));c.U(J.V("1D"));a=a.Q(/^[ ]*[\\n]+|[\\n]*[ ]*$/g,"").Q(/\\r/g," ");b=J.V("43-22");I(J.V("42-45")==R)a=n(a,b);Y{O(K h="",g=0;g<b;g++)h+=" ";a=a.Q(/\\t/g,h)}a=a;a:{b=a=a;h=/<2R\\s*\\/?>|&1y;2R\\s*\\/?&1G;/2T;I(e.13.46==R)b=b.Q(h,"\\n");I(e.13.44==R)b=b.Q(h,"");b=b.1e("\\n");h=/^\\s*/;g=4Q;O(K i=0;i<b.L&&g>0;i++){K k=b[i];I(x(k).L!=0){k=h.X(k);I(k==N){a=a;1N a}g=1Q.4q(k[0].L,g)}}I(g>0)O(i=0;i<b.L;i++)b[i]=b[i].1o(g);a=b.1K("\\n")}I(1u)d=J.4d(a);b=J.4c(J.2J,a);b=J.4b(a,b);b=J.49(b,d);I(J.V("41-40"))b=E(b);1j 2H!="1d"&&2H.3S&&2H.3S.1C(/5s/)&&c.U("5t");H b=\'<T 1c="\'+t(J.1c)+\'" 1g="\'+c.1K(" ")+\'">\'+(J.V("16")?e.16.1H(J):"")+\'<3Z 5z="0" 5H="0" 5J="0">\'+J.4f(J.V("1t"))+"<3T><3P>"+(1u?\'<2d 1g="1u">\'+J.3Q(a)+"</2d>":"")+\'<2d 1g="17"><T 1g="3O">\'+b+"</T></2d></3P></3T></3Z></T>"},2F:6(a){I(a===N)a="";J.17=a;K b=J.3Y("T");b.3X=J.1H(a);J.V("16")&&w(p(b,".16"),"5c",e.16.2b);J.V("3V-17")&&w(p(b,".17"),"56",f);H b},2Q:6(a){J.1c=""+1Q.5d(1Q.5n()*5k).1q();e.1Y.2A[t(J.1c)]=J;J.1n=C(e.2v,a||{});I(J.V("2k")==R)J.1n.16=J.1n.1u=11},5j:6(a){a=a.Q(/^\\s+|\\s+$/g,"").Q(/\\s+/g,"|");H"\\\\b(?:"+a+")\\\\b"},5f:6(a){J.28={18:{1I:a.18,23:"1k"},1b:{1I:a.1b,23:"1k"},17:1f M("(?<18>"+a.18.1m+")(?<17>.*?)(?<1b>"+a.1b.1m+")","5o")}}};H e}();1j 2e!="1d"&&(2e.1v=1v);',62,441,'||||||function|||||||||||||||||||||||||||||||||||||return|if|this|var|length|XRegExp|null|for|index|replace|true||div|push|getParam|call|exec|else|prototype||false|lastIndex|config|arguments|RegExp|toolbar|code|left|captureNames|slice|right|id|undefined|split|new|class|addToken|indexOf|typeof|script|className|source|params|substr|apply|toString|String|line|title|gutter|SyntaxHighlighter|_xregexp|strings|lt|html|test|OUTSIDE_CLASS|match|brush|document|target|gt|getHtml|regex|global|join|style|highlight|break|concat|window|Math|isRegExp|throw|value|brushes|brushName|space|alert|vars|http|syntaxhighlighter|expandSource|size|css|case|font|Fa|name|htmlScript|dA|can|handler|gm|td|exports|color|in|href|first|discoveredBrushes|light|collapse|object|cache|getButtonHtml|trigger|pattern|getLineHtml|nbsp|numbers|parseInt|defaults|com|items|www|pad|highlighters|execute|focus|func|all|getDiv|parentNode|navigator|INSIDE_CLASS|regexList|hasFlag|Match|useScriptTags|hasNamedCapture|text|help|init|br|input|gi|Error|values|span|list|250|height|width|screen|top|500|tagName|findElements|getElementsByTagName|aboutDialog|_blank|appendChild|charAt|Array|copyAsGlobal|setFlag|highlighter_|string|attachEvent|nodeName|floor|backref|output|the|TypeError|sticky|Za|iterate|freezeTokens|scope|type|textarea|alexgorbatchev|version|margin|2010|005896|gs|regexLib|body|center|align|noBrush|require|childNodes|DTD|xhtml1|head|org|w3|url|preventDefault|container|tr|getLineNumbersHtml|isNaN|userAgent|tbody|isLineHighlighted|quick|void|innerHTML|create|table|links|auto|smart|tab|stripBrs|tabs|bloggerMode|collapsed|plain|getCodeLinesHtml|caption|getMatchesHtml|findMatches|figureOutLineNumbers|removeNestedMatches|getTitleHtml|brushNotHtmlScript|substring|createElement|Highlighter|load|HtmlScript|Brush|pre|expand|multiline|min|Can|ignoreCase|find|blur|extended|toLowerCase|aliases|addEventListener|innerText|textContent|wasn|select|createTextNode|removeChild|option|same|frame|xmlns|dtd|twice|1999|equiv|meta|htmlscript|transitional|1E3|expected|PUBLIC|DOCTYPE|on|W3C|XHTML|TR|EN|Transitional||configured|srcElement|Object|after|run|dblclick|matchChain|valueOf|constructor|default|switch|click|round|execAt|forHtmlScript|token|gimy|functions|getKeywords|1E6|escape|within|random|sgi|another|finally|supply|MSIE|ie|toUpperCase|catch|returnValue|definition|event|border|imsx|constructing|one|Infinity|from|when|Content|cellpadding|flags|cellspacing|try|xhtml|Type|spaces|2930402|hosted_button_id|lastIndexOf|donate|active|development|keep|to|xclick|_s|Xml|please|like|you|paypal|cgi|cmd|webscr|bin|highlighted|scrollbars|aspScriptTags|phpScriptTags|sort|max|scriptScriptTags|toolbar_item|_|command|command_|number|getElementById|doubleQuotedString|singleLinePerlComments|singleLineCComments|multiLineCComments|singleQuotedString|multiLineDoubleQuotedString|xmlComments|alt|multiLineSingleQuotedString|If|https|1em|000|fff|background|5em|xx|bottom|75em|Gorbatchev|large|serif|CDATA|continue|utf|charset|content|About|family|sans|Helvetica|Arial|Geneva|3em|nogutter|Copyright|syntax|close|write|2004|Alex|open|JavaScript|highlighter|July|02|replaceChild|offset|83'.split('|'),0,{}))
/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		var keywords =	'abstract as base bool break byte case catch char checked class const ' +
						'continue decimal default delegate do double else enum event explicit ' +
						'extern false finally fixed float for foreach get goto if implicit in int ' +
						'interface internal is lock long namespace new null object operator out ' +
						'override params private protected public readonly ref return sbyte sealed set ' +
						'short sizeof stackalloc static string struct switch this throw true try ' +
						'typeof uint ulong unchecked unsafe ushort using virtual void while';

		function fixComments(match, regexInfo)
		{
			var css = (match[0].indexOf("///") == 0)
				? 'color1'
				: 'comments'
				;
			
			return [new SyntaxHighlighter.Match(match[0], match.index, css)];
		}

		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	func : fixComments },		// one line comments
			{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },			// multiline comments
			{ regex: /@"(?:[^"]|"")*"/g,								css: 'string' },			// @-quoted strings
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },			// strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },			// strings
			{ regex: /^\s*#.*/gm,										css: 'preprocessor' },		// preprocessor tags like #region and #endregion
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' },			// c# keyword
			{ regex: /\bpartial(?=\s+(?:class|interface|struct)\b)/g,	css: 'keyword' },			// contextual keyword: 'partial'
			{ regex: /\byield(?=\s+(?:return|break)\b)/g,				css: 'keyword' }			// contextual keyword: 'yield'
			];
		
		this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['c#', 'c-sharp', 'csharp'];

	SyntaxHighlighter.brushes.CSharp = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();

/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		var keywords =	'break case catch continue ' +
						'default delete do else false  ' +
						'for function if in instanceof ' +
						'new null return super switch ' +
						'this throw true try typeof var while with'
						;

		var r = SyntaxHighlighter.regexLib;
		
		this.regexList = [
			{ regex: r.multiLineDoubleQuotedString,					css: 'string' },			// double quoted strings
			{ regex: r.multiLineSingleQuotedString,					css: 'string' },			// single quoted strings
			{ regex: r.singleLineCComments,							css: 'comments' },			// one line comments
			{ regex: r.multiLineCComments,							css: 'comments' },			// multiline comments
			{ regex: /\s*#.*/gm,									css: 'preprocessor' },		// preprocessor tags like #region and #endregion
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),	css: 'keyword' }			// keywords
			];
	
		this.forHtmlScript(r.scriptScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['js', 'jscript', 'javascript'];

	SyntaxHighlighter.brushes.JScript = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		// Contributes by B.v.Zanten, Getronics
		// http://confluence.atlassian.com/display/CONFEXT/New+Code+Macro

		var keywords = 'Add-Content Add-History Add-Member Add-PSSnapin Clear(-Content)? Clear-Item ' +
					'Clear-ItemProperty Clear-Variable Compare-Object ConvertFrom-SecureString Convert-Path ' +
					'ConvertTo-Html ConvertTo-SecureString Copy(-Item)? Copy-ItemProperty Export-Alias ' +
					'Export-Clixml Export-Console Export-Csv ForEach(-Object)? Format-Custom Format-List ' +
					'Format-Table Format-Wide Get-Acl Get-Alias Get-AuthenticodeSignature Get-ChildItem Get-Command ' +
					'Get-Content Get-Credential Get-Culture Get-Date Get-EventLog Get-ExecutionPolicy ' +
					'Get-Help Get-History Get-Host Get-Item Get-ItemProperty Get-Location Get-Member ' +
					'Get-PfxCertificate Get-Process Get-PSDrive Get-PSProvider Get-PSSnapin Get-Service ' +
					'Get-TraceSource Get-UICulture Get-Unique Get-Variable Get-WmiObject Group-Object ' +
					'Import-Alias Import-Clixml Import-Csv Invoke-Expression Invoke-History Invoke-Item ' +
					'Join-Path Measure-Command Measure-Object Move(-Item)? Move-ItemProperty New-Alias ' +
					'New-Item New-ItemProperty New-Object New-PSDrive New-Service New-TimeSpan ' +
					'New-Variable Out-Default Out-File Out-Host Out-Null Out-Printer Out-String Pop-Location ' +
					'Push-Location Read-Host Remove-Item Remove-ItemProperty Remove-PSDrive Remove-PSSnapin ' +
					'Remove-Variable Rename-Item Rename-ItemProperty Resolve-Path Restart-Service Resume-Service ' +
					'Select-Object Select-String Set-Acl Set-Alias Set-AuthenticodeSignature Set-Content ' +
					'Set-Date Set-ExecutionPolicy Set-Item Set-ItemProperty Set-Location Set-PSDebug ' +
					'Set-Service Set-TraceSource Set(-Variable)? Sort-Object Split-Path Start-Service ' +
					'Start-Sleep Start-Transcript Stop-Process Stop-Service Stop-Transcript Suspend-Service ' +
					'Tee-Object Test-Path Trace-Command Update-FormatData Update-TypeData Where(-Object)? ' +
					'Write-Debug Write-Error Write(-Host)? Write-Output Write-Progress Write-Verbose Write-Warning';
		var alias = 'ac asnp clc cli clp clv cpi cpp cvpa diff epal epcsv fc fl ' +
					'ft fw gal gc gci gcm gdr ghy gi gl gm gp gps group gsv ' +
					'gsnp gu gv gwmi iex ihy ii ipal ipcsv mi mp nal ndr ni nv oh rdr ' +
					'ri rni rnp rp rsnp rv rvpa sal sasv sc select si sl sleep sort sp ' +
					'spps spsv sv tee cat cd cp h history kill lp ls ' +
					'mount mv popd ps pushd pwd r rm rmdir echo cls chdir del dir ' +
					'erase rd ren type % \\?';

		this.regexList = [
			{ regex: /#.*$/gm,										css: 'comments' },  // one line comments
			{ regex: /\$[a-zA-Z0-9]+\b/g,							css: 'value'   },   // variables $Computer1
			{ regex: /\-[a-zA-Z]+\b/g,								css: 'keyword' },   // Operators    -not  -and  -eq
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,	css: 'string' },    // strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,	css: 'string' },    // strings
			{ regex: new RegExp(this.getKeywords(keywords), 'gmi'),	css: 'keyword' },
			{ regex: new RegExp(this.getKeywords(alias), 'gmi'),	css: 'keyword' }
		];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['powershell', 'ps'];

	SyntaxHighlighter.brushes.PowerShell = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		var funcs	=	'abs avg case cast coalesce convert count current_timestamp ' +
						'current_user day isnull left lower month nullif replace right ' +
						'session_user space substring sum system_user upper user year';

		var keywords =	'absolute action add after alter as asc at authorization begin bigint ' +
						'binary bit by cascade char character check checkpoint close collate ' +
						'column commit committed connect connection constraint contains continue ' +
						'create cube current current_date current_time cursor database date ' +
						'deallocate dec decimal declare default delete desc distinct double drop ' +
						'dynamic else end end-exec escape except exec execute false fetch first ' +
						'float for force foreign forward free from full function global goto grant ' +
						'group grouping having hour ignore index inner insensitive insert instead ' +
						'int integer intersect into is isolation key last level load local max min ' +
						'minute modify move name national nchar next no numeric of off on only ' +
						'open option order out output partial password precision prepare primary ' +
						'prior privileges procedure public read real references relative repeatable ' +
						'restrict return returns revoke rollback rollup rows rule schema scroll ' +
						'second section select sequence serializable set size smallint static ' +
						'statistics table temp temporary then time timestamp to top transaction ' +
						'translation trigger true truncate uncommitted union unique update values ' +
						'varchar varying view when where with work';

		var operators =	'all and any between cross in join like not null or outer some';

		this.regexList = [
			{ regex: /--(.*)$/gm,												css: 'comments' },			// one line and multiline comments
			{ regex: SyntaxHighlighter.regexLib.multiLineDoubleQuotedString,	css: 'string' },			// double quoted strings
			{ regex: SyntaxHighlighter.regexLib.multiLineSingleQuotedString,	css: 'string' },			// single quoted strings
			{ regex: new RegExp(this.getKeywords(funcs), 'gmi'),				css: 'color2' },			// functions
			{ regex: new RegExp(this.getKeywords(operators), 'gmi'),			css: 'color1' },			// operators and such
			{ regex: new RegExp(this.getKeywords(keywords), 'gmi'),				css: 'keyword' }			// keyword
			];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['sql'];

	SyntaxHighlighter.brushes.Sql = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();

/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		var keywords =	'AddHandler AddressOf AndAlso Alias And Ansi As Assembly Auto ' +
						'Boolean ByRef Byte ByVal Call Case Catch CBool CByte CChar CDate ' +
						'CDec CDbl Char CInt Class CLng CObj Const CShort CSng CStr CType ' +
						'Date Decimal Declare Default Delegate Dim DirectCast Do Double Each ' +
						'Else ElseIf End Enum Erase Error Event Exit False Finally For Friend ' +
						'Function Get GetType GoSub GoTo Handles If Implements Imports In ' +
						'Inherits Integer Interface Is Let Lib Like Long Loop Me Mod Module ' +
						'MustInherit MustOverride MyBase MyClass Namespace New Next Not Nothing ' +
						'NotInheritable NotOverridable Object On Option Optional Or OrElse ' +
						'Overloads Overridable Overrides ParamArray Preserve Private Property ' +
						'Protected Public RaiseEvent ReadOnly ReDim REM RemoveHandler Resume ' +
						'Return Select Set Shadows Shared Short Single Static Step Stop String ' +
						'Structure Sub SyncLock Then Throw To True Try TypeOf Unicode Until ' +
						'Variant When While With WithEvents WriteOnly Xor';

		this.regexList = [
			{ regex: /'.*$/gm,										css: 'comments' },			// one line comments
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,	css: 'string' },			// strings
			{ regex: /^\s*#.*$/gm,									css: 'preprocessor' },		// preprocessor tags like #region and #endregion
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),	css: 'keyword' }			// vb keyword
			];

		this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['vb', 'vbnet'];

	SyntaxHighlighter.brushes.Vb = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		function process(match, regexInfo)
		{
			var constructor = SyntaxHighlighter.Match,
				code = match[0],
				tag = new XRegExp('(&lt;|<)[\\s\\/\\?]*(?<name>[:\\w-\\.]+)', 'xg').exec(code),
				result = []
				;
		
			if (match.attributes != null) 
			{
				var attributes,
					regex = new XRegExp('(?<name> [\\w:\\-\\.]+)' +
										'\\s*=\\s*' +
										'(?<value> ".*?"|\'.*?\'|\\w+)',
										'xg');

				while ((attributes = regex.exec(code)) != null) 
				{
					result.push(new constructor(attributes.name, match.index + attributes.index, 'color1'));
					result.push(new constructor(attributes.value, match.index + attributes.index + attributes[0].indexOf(attributes.value), 'string'));
				}
			}

			if (tag != null)
				result.push(
					new constructor(tag.name, match.index + tag[0].indexOf(tag.name), 'keyword')
				);

			return result;
		}
	
		this.regexList = [
			{ regex: new XRegExp('(\\&lt;|<)\\!\\[[\\w\\s]*?\\[(.|\\s)*?\\]\\](\\&gt;|>)', 'gm'),			css: 'color2' },	// <![ ... [ ... ]]>
			{ regex: SyntaxHighlighter.regexLib.xmlComments,												css: 'comments' },	// <!-- ... -->
			{ regex: new XRegExp('(&lt;|<)[\\s\\/\\?]*(\\w+)(?<attributes>.*?)[\\s\\/\\?]*(&gt;|>)', 'sg'), func: process }
		];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['xml', 'xhtml', 'xslt', 'html'];

	SyntaxHighlighter.brushes.Xml = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
( function ( $ ) {

	// Init animation
    $( 'body' ).animate({
    	opacity: 1
    }, 1000 );

    // aload images
    aload();

    // Polyfill for object-fit
    objectFit.polyfill({
        selector: 'img', // this can be any CSS selector
        fittype: 'cover' // either contain, cover, fill or none
    });

    // Initialize code highlighting
    //hljs.initHighlightingOnLoad();

    // Close sidebar
    $( '.action-button' ).on( 'click', function ( e ) {

        e.preventDefault();
    	
    	var type = $( this ).attr( 'data-action' );

    	if ( type == 'close-sidebar' ) {

    		$( '.sidebar-header' ).addClass( 'closed' );
    		$( '.content' ).addClass( 'full-size' );
    	}

        if ( type == 'open-sidebar' ) {

            $( '.sidebar-header' ).removeClass( 'closed' );
            $( '.content' ).removeClass( 'full-size' );
        }

    	if ( type == 'show-menu' ) {
            $( '.mobile-menu' ).addClass( 'active' );

            setTimeout( function () {

    		    $( '.mobile-menu' ).addClass( 'visible' );
            }, 400 );
        }

    });

    $( '.close' ).on( 'click', function ( e ) {
        e.preventDefault();

        $( '.mobile-menu' ).removeClass( 'active visible' );
    })

    // Initialize Syntax Highlighter
    SyntaxHighlighter.all();

}) ( jQuery );