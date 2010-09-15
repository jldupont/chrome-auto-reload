/**
 * 	Params.js
 * 
 * 	@author: Jean-Lou Dupont
 */

function UrlManager() {}

UrlManager.method("get", function(url, param, default_value){
	var value=(localStorage[param+"."+url] || default_value);
	if ((typeof rvalue=="undefined") || (rvalue=="undefined"))
		value=default_value;
	return value;
});

UrlManager.method("set", function(url, param, value){
	localStorage[param+"."+url] = value;
	return this;
});


function OptionsManager() {}

OptionsManager.method("get", function(which, type, default_value) {
	var rvalue=localStorage[which] || default_value;
	var value=default_value;
	try {
		if (type=="int")
			value=parseInt(rvalue);
		if (type=="float")
			value=parseFloat(rvalue);
		if (type=="string")
			value=rvalue;
	} catch(err) {}
	
	return value;
});

OptionsManager.method("set", function(which, value){
	localStorage[which]=value;
	return this;
});
