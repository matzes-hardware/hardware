$('a.emailfriend').replaceWith($('#sharelinksdiv'));
$('div.emailfriend').css('visibility', 'visible');
$("a.returntop").click(function() {
  $('html, body').animate({ scrollTop: 0 }, 'slow');
  return false;
});

function getElementsByClass (searchClass) {
  // This function returns an array of all HTML objects with the
  // specified className.  Tag is optional   
  var returnArray = [];
  var els = document.getElementsByTagName('*');
  var pattern = new RegExp('(^|\\s)'+searchClass+'(\\s|$)');
  for (var i = 0; i < els.length; i++) {
    if ( pattern.test(els[i].className) ) { returnArray.push(els[i]); }
  }
  return returnArray;
}

function popVideo(vid, darken) {
  // This function accepts a division ID (vid), either a string or the actual
  // object itself.   vid is mandatory.   darken is optional, if it's true
  // the page will be greyed out under the video.
  var videos = getElementsByClass('video');     // Get all the videos on the page.
  var isplaying=null;
  for(i=0; i<videos.length; i++) {              // Loop through all the videos
    if (videos[i].style.display=='block') {     // This video is playing 
      isplaying=videos[i].id;                   // remember its name
      var tmp=videos[i].innerHTML;              // Get the division contents
      videos[i].innerHTML='';                   // destroy the contents
      videos[i].style.display='none';           // Terminate the video.
      videos[i].innerHTML=tmp;                  // rebuild the contents.
    }
  }
  // This handles the darkening of the background while a video is playing.
  // First we see if the dark layer exists.
  var dark=document.getElementById('darkenScreenObject');
  if (!dark) {
    // The dark layer doesn't exist, it's never been created.  So we'll
    // create it here and apply some basic styles.
    var tbody = document.getElementsByTagName("body")[0];
    var tnode = document.createElement('div');          // Create the layer.
        tnode.style.backgroundColor='rgb(0, 0, 0)';     // Make it black.
        tnode.style.opacity='0.7';                      // Set the opacity (firefox/Opera)
        tnode.style.MozOpacity='0.70';                  // Firefox 1.5
        tnode.style.filter='alpha(opacity=70)';         // IE.
        tnode.style.zIndex='1';                         // Zindex of 50 so it "floats"
        tnode.style.position='absolute';                // Position absolutely
        tnode.style.top='0px';                          // In the top
        tnode.style.left='0px';                         // Left corner of the page
        tnode.style.overflow='hidden';                  // Try to avoid making scroll bars            
        tnode.style.display='none';                     // Start out Hidden
        tnode.id='darkenScreenObject';                  // Name it so we can find it later
    tbody.appendChild(tnode);                           // Add it to the web page
    dark=document.getElementById('darkenScreenObject'); // Get the object.
  }
  dark.style.display='none';
  if ((isplaying==vid)||(/^close$/i.test(vid))) { return false; }
  if (typeof(vid)=="string") { vid=document.getElementById(vid); }
  if (vid&&typeof(vid)=="object") {
    if (darken) {
      // Calculate the page width and height 
      if( window.innerHeight && window.scrollMaxY )  { 
        var pageWidth = window.innerWidth + window.scrollMaxX;
        var pageHeight = window.innerHeight + window.scrollMaxY;
      } else if( document.body.scrollHeight > document.body.offsetHeight ) {
        var pageWidth = document.body.scrollWidth;
        var pageHeight = document.body.scrollHeight;
      } else { 
        var pageWidth = document.body.offsetWidth + document.body.offsetLeft; 
        var pageHeight = document.body.offsetHeight + document.body.offsetTop; 
      }
      //set the shader to cover the entire page and make it visible. 
      dark.style.width= pageWidth+'px';
      dark.style.height= pageHeight+'px';
      dark.style.display='block';                                
    }
    // Make the video visible and set the zindex so its on top of everything else
    vid.style.zIndex='100';    
    vid.style.display='block';
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop)
      scrollTop = document.documentElement.scrollTop;
    else if (document.body)
      scrollTop = document.body.scrollTop;

    // set the starting x and y position of the video
    vid.style.top=scrollTop+Math.floor((document.documentElement.clientHeight/2)-(vid.offsetHeight/2))+'px';
    vid.style.left=Math.floor((document.documentElement.clientWidth/2)-(vid.offsetWidth/2))+'px';
  }
  return false;
}
