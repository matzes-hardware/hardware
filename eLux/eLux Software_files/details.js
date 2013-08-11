
function details(dir,url) {
  url = "/details/" + dir + "/" + url;
  F2 = open(url,"PackageDetails","scrollbars=1,width=640,height=400,resizable=yes,dependent=yes");
  F2.focus();
  return;
}

function showclienthelp(id, text) {
  document.getElementById(id).innerHTML=text;
  return;
}

function hideclienthelp(id) {
  document.getElementById(id).innerHTML="";
  return;
}

function clientlist(cid) {
  url = "/clients.htm?cid=" + cid; 
  F2 = open(url,"SupportedClients","scrollbars=1,width=300,height=360,resizable=yes,dependent=yes,status=no,menubar=no,toolbar=no");
  F2.focus();
  return;
}


function hwlist(dir) {
  url = "/details/hwlist.html"; 
  F2 = open(url,"SupportedHardwareComponents","scrollbars=1,width=1200,height=800,resizable=yes,dependent=yes");
  F2.focus();
  return;
}

function sclist(dir) {
  url = "/details/sclist.html"; 
  F2 = open(url,"SupportedSCReaders","scrollbars=1,width=800,height=600,resizable=yes,dependent=yes");
  F2.focus();
  return;
}

function reslist(hw) {
  url = "/resolutions.htm?hw=" + hw; 
  F2 = open(url,"SupportedResolutions","scrollbars=1,width=740,height=480,resizable=yes,dependent=yes,menubar=no,location=no,toolbar=no,hotkeys=no");
  F2.focus();
  return;
}

function gpl(gpl,version) {
  url = "/details/gnu-" + gpl + "-" + version +".html"; 
  F2 = open(url,"GPL","scrollbars=1,width=640,height=480,resizable=yes,dependent=yes");
  F2.focus();
  return;
}

function supportfts() {
  url = "http://ts.fujitsu.com/support/contact/contact.html";
  F2 = open(url,"_blank","scrollbars=1,width=900,height=800,resizable=yes,dependent=yes");
  F2.focus();
  return;
}
