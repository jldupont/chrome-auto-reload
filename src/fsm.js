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
	this.state="off";
	this.map={
		"off": "on",
		"on":  "sticky",
		"sticky": "off",
		"stopped": "on",
	};
}

FSM.method("next", function(stop_event) {
	if (stop_event) {
		if (this.state=="on") {
			this.state="stopped";
			return this.state;
		}
		if (this.state=="sticky") {
			this.state="sticky_stopped";
			return this.state;
		}
		return this.state=this.map[this.state];
	}
	this.state=this.map[this.state];
	return this.state;
	
});
