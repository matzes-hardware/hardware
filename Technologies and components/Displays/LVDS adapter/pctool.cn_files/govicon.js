// JavaScript Document
// zengqingfeng_20130618 create
function GetRequest() {
    var d = document.getElementById("ebsgovicon").src;
    var theRequest = /govicon.js\?id=([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})&width=([0-9]+)&height=([0-9]+)/.test(d) ? RegExp.$1 : "error";
    var iconwidth = /govicon.js\?id=([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})&width=([0-9]+)&height=([0-9]+)&type=([0-9]+)/.test(d) ? RegExp.$2 : "36"; //default height
    var iconheight = /govicon.js\?id=([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})&width=([0-9]+)&height=([0-9]+)&type=([0-9]+)/.test(d) ? RegExp.$3 : "50"; //default width
    var type = /govicon.js\?id=([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})&width=([0-9]+)&height=([0-9]+)&type=([0-9]+)/.test(d) ? RegExp.$4 : "1"; //default width
    var retstr = { "id": theRequest, "width": iconwidth, "height": iconheight, "type": type };
    return retstr;
}
var webprefix = "https://cert.ebs.gov.cn/"
var iconImageURL = "https://cert.ebs.gov.cn/Images/govIcon.gif";
var niconImageURL = "https://cert.ebs.gov.cn/Images/newGovIcon.gif";
var tempiconImageURL = "";

var params = GetRequest();
if (params.type == "1") {
    tempiconImageURL = iconImageURL;
}
if (params.type == "2") {
    tempiconImageURL = niconImageURL;
}
var params = GetRequest();
document.write('<a href="' + webprefix + params.id + '" target="_blank"><img src="' + tempiconImageURL + '" title="深圳市市场监督管理局企业主体身份公示" alt="深圳市市场监督管理局企业主体身份公示" width="' + params.width + '" height="' + params.height + '"border="0" style="border-width:0px;border:hidden; border:none;"></a>');
