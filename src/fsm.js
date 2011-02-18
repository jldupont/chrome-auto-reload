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

function FSM(url) {
	this.url=url;
	this.state="off";
	this.map={
		"off": "on",
		"on":  "sticky",
		"sticky": "off",
		"stopped": "on",
	};
	this.data={};
	this._update();
}

FSM.method("_update", function(){
	var sticky_state=localStorage["sticky."+this.url] === "on";
	if (sticky_state)
		this.state="sticky";
});

/**
 * 
 * @param {Object} n namespace
 * @param {Object} k key
 * @param {Object} v value
 */
FSM.method("setData", function(n,k,v){
	var set=this.data[n];
	set[k]=v;
	this.data[n]=set;
});

/**
 * 
 * @param {Object} n
 * @param {Object} k
 */
FSM.method("getData", function(n, k) {
	var set=this.data[n];
	return set[k];
});

FSM.method("getState", function(){
	return this.state;
});

FSM.method("setUrl", function(url){
	this.url=url;
});


FSM.method("nextState", function(stop_event) {
	if (this.state=="sticky")
		localStorage["sticky."+this.url]="not sticky";
	var next=null;
	if (stop_event) {
		if (this.state=="on") {
			next="stopped";
		} else {
			if (this.state == "sticky") {
				next = "sticky_stopped";
			} else
				next=this.map[this.state];
		} 
	} else
		next=this.map[this.state];
		
	if (next=="sticky")
		localStorage["sticky."+this.url]="sticky";
	return this.state=next;
});
