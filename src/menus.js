/*
 * Menus.js
 *
 * 1) Install menus with Chrome
 * 2) Intercept user selection and update localStorage value
 * 3) Set selection from localStorage
 * 4) Get current selection
 * 
 *  @author: Jean-Lou Dupont
 */

function MenuManager(params) {
	this.randomizeMenuItems={};
	this.timeoutMenuItems={};
	this.rmid=null;
	this.tmid=null;
	this.randomizeMenu = {type: "normal", title: "Randomize", contexts:["page"]};    
	this.timeoutMenu   = {type: "normal", title: "Timeout",   contexts:["page"]};
	this.params=params;
}

MenuManager.prototype.clearRandomizeCheckMarks = function() {
	for (var mid in this.randomizeMenuItems) {
		chrome.contextMenus.update(parseInt(mid), {checked: false});
	}	
};

MenuManager.prototype.clearTimeoutCheckMarks = function() {
	for (var mid in this.timeoutMenuItems) {
		chrome.contextMenus.update(parseInt(mid), {checked: false});
	}	
};

MenuManager.prototype.handleRandomize = function(info, tab){

	var id=info.menuItemId;
	this.clearRandomizeCheckMarks();
	chrome.contextMenus.update(id, {checked: true});
	this.params.set(tab.url, "randomize", this.randomizeMenuItems[id].random);
	//localStorage["randomize."+tab.url]=
	
	console.log("MenuItemId: "+id+", random: "+this.randomizeMenuItems[id].random+", url:"+tab.url);
};

MenuManager.prototype.handleTimeout = function(info, tab){

	var id=info.menuItemId;
	this.clearTimeoutCheckMarks();
	chrome.contextMenus.update(id, {checked: true});
	//localStorage["timeout."+tab.url]=this.timeoutMenuItems[id].random;
	this.params.set(tab.url, "timeout", this.timeoutMenuItems[id].timeout);
	console.log("MenuItemId: "+id+", timeout: "+this.timeoutMenuItems[id].timeout+", url:"+tab.url);
};

MenuManager.prototype.getRandomize = function(url) {
	return this.params.get(url, "randomize");
	//return localStorage["randomize."+url];
};

MenuManager.prototype.getTimeout = function(url) {
	return this.params.get(url, "timeout");
	//return localStorage["timeout."+url];
};

/**
 *  Finds the menu item based on the menu value
 */
MenuManager.prototype.findRandomizeMenuItem = function(value) {
	for (var mid in this.randomizeMenuItems) {
		if (this.randomizeMenuItems[mid].random==value)
			return mid;
	}
	return null;
};

/**
 *  Finds the menu item based on the menu value
 */
MenuManager.prototype.findTimeoutMenuItem = function(value) {
	for (var mid in this.timeoutMenuItems) {
		if (this.timeoutMenuItems[mid].timeout==value)
			return mid;
	}
	return null;
};

MenuManager.prototype.update = function(url) {
	
	this.clearRandomizeCheckMarks();
	this.clearTimeoutCheckMarks();
	
	//var r=localStorage["randomize."+url];
	//var t=localStorage["timeout."+url];
	var r=this.params.get(url, "randomize", null);
	var t=this.params.get(url, "timeout",   null);
	
	console.log("update: r="+r+", t="+t);
	
	var rmenuid=this.findRandomizeMenuItem(r);
	var tmenuid=this.findTimeoutMenuItem(t);
	
	console.log("update: rmenuid="+rmenuid+", tmenuid="+tmenuid);
	
	if (rmenuid!=null)
		chrome.contextMenus.update(parseInt(rmenuid), {checked: true});
	
	if (tmenuid!=null)
		chrome.contextMenus.update(parseInt(tmenuid), {checked: true});
};


MenuManager.prototype.create = function() {
	
	// create the top level menus
	this.rmid=chrome.contextMenus.create(this.randomizeMenu);
	this.tmid=chrome.contextMenus.create(this.timeoutMenu);

	// options under 'randomize' and 'timeout'
	var randomizeMenuList=[
		 {type:"checkbox", title:"Default" }
		,{type:"checkbox", title:"10%"     }
		,{type:"checkbox", title:"25%"     }
		,{type:"checkbox", title:"50%"     }
	];
	var randomList=[null, 10, 25, 50];

	var id, mobj;
	for (var item in randomizeMenuList) {
		//console.log("menu: "+item);
		mobj=randomizeMenuList[item];
		mobj.contexts=["page"];
		mobj.parentId=this.rmid;
		mobj.onclick=bind(this, this.handleRandomize);
		id=chrome.contextMenus.create(mobj);
		
		mobj.random=randomList[item];
		this.randomizeMenuItems[id]=mobj;
		//console.log("=> created menu item: "+id);
	}

	// options under 'randomize' and 'timeout'
	var timeoutMenuList=[
		 {type:"checkbox", title:"Default" }
		,{type:"checkbox", title:"3sec"    }					
		,{type:"checkbox", title:"10sec"   }
		,{type:"checkbox", title:"30sec"   }
		,{type:"checkbox", title:"60sec"   }
		,{type:"checkbox", title:"120sec"  }
		,{type:"checkbox", title:"300sec"  }
		,{type:"checkbox", title:"900sec"  }								
		,{type:"checkbox", title:"1800sec" }
		,{type:"checkbox", title:"3600sec" }
	];

	var timeoutList=[null, 3, 10, 30, 60, 120, 300, 900, 1800, 3600];

	for (var item in timeoutMenuList) {
		//console.log("menu: "+item);
		mobj=timeoutMenuList[item];
		mobj.onclick=bind(this, this.handleTimeout);
		mobj.parentId=this.tmid;
		mobj.contexts=["page"];
		id=chrome.contextMenus.create(mobj);
		
		mobj.timeout=timeoutList[item];
		this.timeoutMenuItems[id]=mobj;
		//console.log("=> created menu item: "+id);
	}
};
