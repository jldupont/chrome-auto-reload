/**
 *  Finite State Machine 
 *
 *	@author: Jean-Lou Dupont
 *
 *
 */

function FSM() {
	this.state={};
	this.url_map={};
	
	// transitions without the "stop" cmd
	this.map={
		"off": "on",
		"on":  "sticky",
		"sticky": "off",
		"stopped": "on"
	};
	// transitions with the "stop" cmd
	this.smap={
		"off":     			"off",
		"on":      			"stopped",
		"sticky":  			"sticky_stopped",
		"stopped": 			"stopped",
		"sticky_stopped":	"sticky_stopped"
	};
	
	this.data={};
}

FSM.method("_update", function(tid){
	if (this.url_map[tid]==undefined)
		return;
		
	var sticky_state=localStorage["sticky."+this.url_map[tid]] === "sticky";
	if (sticky_state)
		this.state[tid]="sticky";
});

/**
 * 
 * @param integer tid
 * @param {Object} n namespace
 * @param {Object} k key
 * @param {Object} v value
 */
FSM.method("setData", function(tid, n,k,v){
	var tset=this.data[tid] || {};
	var set=tset[n] || {};
	set[k]=v;
	tset[n]=set;
	this.data[tid]=tset;
});

/**
 * 
 * @param {Object} n
 * @param {Object} k
 */
FSM.method("getData", function(tid, n, k) {
	var tset=this.data[tid] || {};
	var set=tset[n] || {};
	return set[k];
});

FSM.method("setState", function(tid, state){
	this.state[tid]=state;
});

FSM.method("getState", function(tid){
	var state=this.state[tid] || "off";
	return state;
});

FSM.method("setUrl", function(tid, url){
	//this.state[tid]="off";
	var current_url=this.url_map[tid];
	if (current_url != url) {
		this.state[tid]="off";
	}
	this.url_map[tid]=url;
	this._update(tid);
});

/**
 * 
 * @param {Object} tid
 * @param {Object} stop_event
 * @return: true if state hasn't changed
 */
FSM.method("nextState", function(tid, stop_event) {
	var url=this.url_map[tid];
	var state=this.state[tid] || "off";
	
	// if currently "sticky", then 'next'
	// state is for sure "not sticky"!
	if (url!=undefined)
		if (state=="sticky")
			localStorage["sticky."+url]="not sticky";
	var next=null;
	if (stop_event) {
		next=this.smap[state];
	} else
		next=this.map[state];
		
	if (next=="sticky")
		if (url!=undefined)
			localStorage["sticky."+url]="sticky";
			
	this.state[tid]=next;
	return state!=next;
});
