/* 	
*	This function is intended to add the class "active" to the corresponding item in top navigation.
*	The script looks at the first folder after "www.axis.com/" - ignoring the language folder - in which the file/script is present. 
*	This behaviour can be overridden by including the topnav with a parameter e.g. ?activeTopNav=products. The parameter
*	will then be sent to this function.
*/
//alert(window.location.pathname.split("/")[1]);
function setActiveTopNav(subfolder){
	if(subfolder==""){
		// If subfolder isn't already set, get the name of the first subfolder after axis.com in URL
		var subfolder = window.location.pathname.split("/")[1];
	
		// The first folder might be a language folder. Check it by comparing to Lang cookie. If that's the case, use the second folder instead.
		var langfolder = getCookie("Lang").substring(0,2);
		if(subfolder == langfolder){
			subfolder = window.location.pathname.split("/")[2];
		}
	}
	
	// Add "active" class to corresponding nav item
	if(subfolder == "products"){
		$("#navProducts").addClass("active");
	}
	else if(subfolder == "solutions"){
		$("#navSolutions").addClass("active");
	}
	else if(subfolder == "techsup"){
		$("#NavSupport").addClass("active");
	}
	else if(subfolder == "sales"){
		$("#navWhereToBuy").addClass("active");
	}
	else if(subfolder == "partner"){
		$("#navPartner").addClass("active");
	}
	else if(subfolder == "academy"){
		$("#navLearningCenter").addClass("active");
	}
	else if(subfolder == "corporate"){
		$("#navAboutAxis").addClass("active");
	}
	else if(subfolder == "home" || subfolder == "" || subfolder == "index.htm"){
		$("#navHome").addClass("active");
	}
	
	//That's it. No default active menu item as it might make things confusing for the user.
}