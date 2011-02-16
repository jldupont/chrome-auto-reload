/**
 *  Tab related parameters 
 *
 *	@author: Jean-Lou Dupont
 *
 *	- In Storage:
 *		[url; sticky]
 *
 *	- Temporary (browser session scope)
 *		[(tabid, url); state]
 *
 */

function TabParams() {
	this.params={};
}

/**
 * Return the current state of the tuple (tid, url)
 * 
 * @return: a string
 */
TabParams.method("getByTidUrl", function(tid, url, name){
	var tab_params = this.params[tid]     || {};
	var tab_urls   = tab_params["urls"]   || {};
	
	var state      = tab_urls[url]        || "";
	
	return state;
});

TabParams.method("setByTidUrl", function(tid, url, name, state){
	var tab_params = this.params[tid]     || {};
	var tab_urls   = tab_params["urls"]   || {};
	
	tab_urls[url] = state;
	
	tab_params["urls"] = tab_urls;
	this.params[tid]=tab_params;
});

/**
 * Get a variable from the "permanent" storage
 * by tuple (url, name)
 * 
 *  @return: a string
 */
TabParams.method("getByUrl", function(url, name){
	var params=localStorage["params."+url] || {};
	var value=params[name] || "";
	
	return value;
});

/**
 * Sets a variable in the permanent storage
 * following the tuple (url, name, value)
 * 
 */
TabParams.method("setByUrl", function(url, name, value){
	var params=localStorage["params."+url] || {};
	params[name]=value;
	localStorage["params."+url]=params;
});

