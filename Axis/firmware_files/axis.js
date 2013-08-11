/*	
	Generic javascript for popup-windows
	--------------------------------------------
	The last argument controll if the window should be resizeable or not
	<a href="" onclick="axisPopUp('http://www.axis.com/','hej',500,200,false); return false;">test</a>
	
	Created by Jonas Elmqvist in 2004-12-02
*/

function axisPopUp(url,windowname,width,height,resize) {
	
	if (resize) {
		window.open(url,windowname,'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,copyhistory=0,width=' + width + ',height=' + height);
	} else {
		window.open(url,windowname,'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,copyhistory=0,width=' + width + ',height=' + height);
	}
	
	return false;
}

function axisImageShow(URL){
	window.open(URL,"axisImageShow","toolbar=no,scrollbars=no,status=no,width=700,height=700");
	return false;
}


/*
	axisRollOver function set
	------------------------------------------------
	Simple set of functions whish adds preload and mouseOver functinality
*/

var axisRollOverArray = new Array();

function axisRollOverAddImage(onImage,offImage,path) {
	if (path.substring(path.length-1,path.length) != "/") {
		path += "/";
	}
			
	axisRollOverArray[onImage] = path + offImage;
	axisRollOverArray[offImage] = path + onImage;	
} 			
		
function axisRollOver(imgObject) {
	arrayItemIndex = imgObject.src.substring(imgObject.src.lastIndexOf('\/')+1,imgObject.src.length);
	imgObject.src = axisRollOverArray[arrayItemIndex];
}



function axisRollOverLink(aTag){
	if(aTag.style.backgroundImage == "none"){
		aTag.style.backgroundImage = "#ffffff";
	}else{
		aTag.style.backgroundImage = "none";
		aTag.style.backgroundColor = "#000000";
	}
}

function axisRollOverLinkTwo(aTag){
	if(aTag.className == "hover"){
		aTag.className = "";
	}else{
		aTag.className = "hover";
	}
/*
	if(aTag.style.backgroundColor == ""){
		aTag.style.backgroundColor = "#E8E6E5";
		aTag.style.backgroundImage = "none";
	}else{
		aTag.style.backgroundColor = "";
		aTag.style.backgroundImage = "/core/indexpage/img/white_bg_shadowed.jpg";
	}
*/
	//if(aTag.style.backgroundImage == "none"){
/*		aTag.style.backgroundColor = "#51b532"; */
//	}else{
//		aTag.style.backgroundImage = "none";
/*		aTag.style.backgroundColor = "#ea1a1a"; */
//	}
}



var axisPreloadImageID = 0;
		
function axisPreloadImage(imageArray) {	
	axisPreloadImageID++;
 		
	for(a=0; a<imageArray.length; a++) {
		var imageName = "image_" + axisPreloadImageID + "_" + a;
			imageName = new Image();
			imageName = imageArray[a];
	}				
}


/*
  background-image: none;	
	background-color: #e8e6e5;
	border-top: 1px solid #e8e6e5;
  border-bottom: 1px solid #e8e6e5;
*/ 
  
  
  
/*
	axisRollOver function set
	------------------------------------------------
	Simple set off functions whish adds preload and mouseOver functinality
*/

/*
var axisRollOverArray = new Array();

function axisRollOverAddImage(onImage,offImage,path) {
	if (path.substring(path.length-1,path.length) != "/") {
		path += "/";
	}
			
	axisRollOverArray[onImage] = path + offImage;
	axisRollOverArray[offImage] = path + onImage;	
} 			
		
function axisRollOver(imgObject) {
	arrayItemIndex = imgObject.src.substring(imgObject.src.lastIndexOf('\/')+1,imgObject.src.length);
	imgObject.src = axisRollOverArray[arrayItemIndex];
}

function axisRollOverLink(aTag){
	if(aTag.style.backgroundImage == "none")
		aTag.style.backgroundImage = "url(/core/indexpage/img/gray.jpg)";
	else{
		aTag.style.backgroundImage = "none";
		aTag.style.backgroundColor = "#e7e7e7";
	}
}

function axisRollOverLinkTwo(aTag){
	if(aTag.style.backgroundImage == "none")
		aTag.style.backgroundImage = "url(/core/indexpage/img/gray2.jpg)";
	else{
		aTag.style.backgroundImage = "none";
		aTag.style.backgroundColor = "#e1e1e1";
	}
}

var axisPreloadImageID = 0;
		
function axisPreloadImage(imageArray) {	
	axisPreloadImageID++;
 		
	for(a=0; a<imageArray.length; a++) {
		var imageName = "image_" + axisPreloadImageID + "_" + a;
			imageName = new Image();
			imageName = imageArray[a];
	}				
}  
  
  
*/

















/*
window.open(url,title,"toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,copyhistory=0,width=" + width + ",height=" + height);
	
*/

/*
	Old function for popup-windows
	---------------------------------------------
	This function should be removed after the migration to new web in 2004/2005
*/

function ftpwin(HTMLPage) {
	displayWindow=this.open (HTMLPage,"displayWindow", "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,copyhistory=0,width=360,height=200");
}

function grafwin(HTMLPage) {
	displayWindow=this.open (HTMLPage,"displayWindow","toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,copyhistory=0,width=560,height=550")
}


/*
	This snippet removes the default text in the search input box when focused, and adds it again when blurred and empty
*/
var searchBox = {
	boxText: null,
	init:function(){
		if(document.getElementById){
			if(document.getElementById("searchBox")){
				var box = document.getElementById("searchBox");
				searchBox.boxText = box.value;
				//box.value = searchBox.boxText;
				box.style.color = "#AAAAAA";
				box.onblur = function(){ searchBox.blurTheBox(this); }
				box.onfocus = function(){ searchBox.focusTheBox(this); }
			}
		}
	},
	blurTheBox:function(box){
		if(box.value == ""){
			box.value = searchBox.boxText;
			box.style.color = "#AAAAAA";
		}
	},
	focusTheBox:function(box){
		if(box.value == searchBox.boxText){
			box.value = "";
			box.style.color = "#222222";
		}
	}
}


var addThisLoader = {
	adl: 0,
	init:function(){
		if($("#addthis_placeholder").length){
			$("#addthis_placeholder").mouseover(function(){
				if(addThisLoader.adl == 0){
					$("#addthis_placeholder").load("/core/includes/foot_share.htm");
					addThisLoader.adl = 1;
				}
					
				//Default for all languages
				/*
				htmlForDiv = '<!-- AddThis Button BEGIN -->';
				htmlForDiv += '<div class="addthis_toolbox addthis_default_style" style="float: left; margin-left: 2px;">';
				htmlForDiv += '<style type="text/css">';
				htmlForDiv += '.addthis_default_style .at15t_expanded, .addthis_default_style .at15t_compact {';
				htmlForDiv += 'margin-right: 1px !important;';
				htmlForDiv += '}</style>';
				htmlForDiv += '<a href="http://www.addthis.com/bookmark.php?v=250&amp;username=axiscommunications" addthis:url="http://www.axis.com/" class="addthis_button_compact"></a>';
				//htmlForDiv += '<a class="addthis_button_compact"></a>';
				htmlForDiv += '</div>';
				addthis_config = { services_compact: 'email, favorites, aim, baidu, blogger, buzz, delicious, digg, facebook, google, linkedin, live, myspace, newsvine, reddit, slashdot, squidoo, stumbleupon, technorati, twitter, typepad, wordpress, yahoobkm', 
									data_track_linkback: true, 
									ui_delay: 500, 
									ui_cobrand: 'Axis Communications' 
								}
				htmlForDiv += '<scr'+'ipt type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=axiscommunications&domready=1"></scr'+'ipt>';
				htmlForDiv += '<!-- AddThis Button END -->';		
					
				$("#addthis_placeholder").html(htmlForDiv);
				//addThisHomebrewedInitialization(); //when using domready=1, addthis.init() is not needed
				*/
			});
		}
	}
}

/*
if(typeof jQuery == 'undefined'){
	//jquery not loaded
}
else{
	//jquery loaded, call the searchBox-init
	$(document).ready(function(){
		searchBox.init();
	});
}*/
//window.onload = function(){ searchBox.init(); }
