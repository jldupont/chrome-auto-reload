/**
 * 	Params.js
 * 
 * 	@author: Jean-Lou Dupont
 */

function UrlManager() {
}

UrlManager.method("get", function(url, param, default_value){
	var value=(localStorage[param+"."+url] || default_value);
	if ((typeof value=="undefined") || (value=="undefined"))
		value=default_value;
	return value;
});

UrlManager.method("set", function(url, param, value){
	localStorage[param+"."+url] = value;
	return this;
});
