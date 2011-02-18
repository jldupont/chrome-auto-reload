/**
 *  Finite State Machine 
 *
 *	@author: Jean-Lou Dupont
 *
 	States:
 		- OFF
 		- ON
 		- ON & Sticky
 		- STOPPED
 		- STOPPED & Sticky
 		
 	"flow":
 		OFF ------> ON --> STOPPED
 		                   STOPPED --> ON
 		OFF ------> ON --> STICKY  --> STICKY_STOPPED --> STICKY
 		                           --> OFF
 		                           
		OFF (stop) --> OFF
		STICKY_STOPPED (stop) --> STICKY_STOPPED
 *
 */

function FSM() {
	this.state={};
	this.url_map={};
	this.map={
		"off": "on",
		"on":  "sticky",
		"sticky": "off",
		"stopped": "on",
	};
	this.data={};
}

FSM.method("_update", function(tid){
	if (this.url[map]==undefined)
		return;
		
	var sticky_state=localStorage["sticky."+this.url_map[tid]] === "on";
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
	var set=tset[n];
	set[k]=v;
	tset[n]=set
	this.data[n]=tset;
});

/**
 * 
 * @param {Object} n
 * @param {Object} k
 */
FSM.method("getData", function(tid, n, k) {
	var tset=this.data[tid] || {};
	var set=tset[n];
	return set[k];
});

FSM.method("getState", function(tid){
	var state=this.state[tid] || "off";
	return state;
});

FSM.method("setUrl", function(tid, url){
	this.url_map[tid]=url;
	this._update(tid);
});

FSM.method("nextState", function(tid, stop_event) {
	var url=this.url_map[tid];
	var state=this.state[tid] || "off";
	
	if (url!=undefined)
		if (state=="sticky")
			localStorage["sticky."+url]="not sticky";
	var next=null;
	if (stop_event) {
		if (state=="on") {
			next="stopped";
		} else {
			if (state == "sticky") {
				next = "sticky_stopped";
			} else
				next=this.map[state];
		} 
	} else
		next=this.map[state];
		
	if (next=="sticky")
		if (url!=undefined)
			localStorage["sticky."+url]="sticky";
	return this.state[tid]=next;
});
