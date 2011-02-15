/**
 * 	Params.js
 * 
 * 	@author: Jean-Lou Dupont
 * 
 * Dependency:  oo.js
 */

function UrlManager() {}

UrlManager.method("get", function(url, param, default_value){
	var key=param+"."+url;
	var value=localStorage[key];
	if (value=="null")
		value=null;
	if ((typeof value=="undefined") || (value=="undefined"))
		value=default_value;
	
	//console.log("UrlManager: get key: "+key+", value:"+value);
	return value;
});

UrlManager.method("set", function(url, param, value){
	localStorage[param+"."+url] = value;
	//console.log("UrlManager: set param: "+param+", value:"+value);
	return this;
});


function OptionsManager() {}

OptionsManager.method("get", function(which, type, default_value) {
	var rvalue=localStorage[which] || default_value;
	var value=default_value;
	if (value=="null")
		value=null;
	else
		try {
			if (type=="int")
				value=parseInt(rvalue);
			if (type=="float")
				value=parseFloat(rvalue);
			if (type=="string")
				value=rvalue;
		} catch(err) {
			value=null;
		}
	
	return value;
});

OptionsManager.method("set", function(which, value){
	localStorage[which]=value;
	return this;
});
