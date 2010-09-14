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

function MenuManager() {
	this.randomizeMenuItems={};
	this.timeoutMenuItems={};
	this.rmid=null;
	this.tmid=null;
	this.randomizeMenu = {type: "normal", title: "Randomize", contexts:["page"]};    
	this.timeoutMenu   = {type: "normal", title: "Timeout",   contexts:["page"]};   
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
	localStorage["randomize."+tab.url]=this.randomizeMenuItems[id].random;
	
	console.log("MenuItemId: "+id+", random: "+this.randomizeMenuItems[id].random+", url:"+tab.url);
};

MenuManager.prototype.handleTimeout = function(info, tab){

	var id=info.menuItemId;
	this.clearTimeoutCheckmarks();
	chrome.contextMenus.update(id, {checked: true});
	localStorage["timeout."+tab.url]=this.timeoutMenuItems[id].random;
	
	console.log("MenuItemId: "+id+", timeout: "+this.timeoutMenuItems[id].timeout+", url:"+tab.url);
};

MenuManager.prototype.getRandomize = function(url) {
	
	return localStorage["randomize."+url];
};

MenuManager.prototype.getTimeout = function(url) {
	
	return localStorage["timeout."+url];
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
	
	var r=localStorage["randomize."+url];
	var t=localStorage["timeout."+url];
	
	var rmenuid=this.findRandomizeMenuItem(r);
	var tmenuid=this.findTimeoutMenuItem(t);
	
	if (rmenuid!=null)
		chrome.contextMenus.update(rmenuid, {checked: true});
	
	if (tmenuid!=null)
		chrome.contextMenus.update(tmenuid, {checked: true});
};


MenuManager.prototype.create = function() {
	//console.log("A: ");
	
	// create the top level menus
	this.rmid=chrome.contextMenus.create(this.randomizeMenu);
	this.tmid=chrome.contextMenus.create(this.timeoutMenu);

	//console.log("B");
	// options under 'randomize' and 'timeout'
	var randomizeMenuList=[
		 {type:"checkbox", title:"Default", contexts:["page"], parentId: this.rmid, onclick: function(info, tab){ this.handleRandomize.call(info, tab); } }
		,{type:"checkbox", title:"10%",     contexts:["page"], parentId: this.rmid, onclick: function(info, tab){ this.handleRandomize.call(info, tab); } }	
		,{type:"checkbox", title:"25%",     contexts:["page"], parentId: this.rmid, onclick: function(info, tab){ this.handleRandomize.call(info, tab); } }
		,{type:"checkbox", title:"50%",     contexts:["page"], parentId: this.rmid, onclick: function(info, tab){ this.handleRandomize.call(info, tab); } }
	];
	var randomList=[null, 10, 25, 50];

	//console.log("C");
	var id, mobj;
	for (var item in randomizeMenuList) {
		//console.log("menu: "+item);
		mobj=randomizeMenuList[item];
		id=chrome.contextMenus.create(mobj);
		
		mobj.random=randomList[item];
		this.randomizeMenuItems[id]=mobj;
		//console.log("=> created menu item: "+id);
	}

	//console.log("D");
	// options under 'randomize' and 'timeout'
	var timeoutMenuList=[
		 {type:"checkbox", title:"Default", contexts:["page"], parentId: this.tmid, onclick: this.handleTimeout}
		,{type:"checkbox", title:"3sec",    contexts:["page"], parentId: this.tmid, onclick: this.handleTimeout}					
		,{type:"checkbox", title:"10sec",   contexts:["page"], parentId: this.tmid, onclick: this.handleTimeout}
		,{type:"checkbox", title:"30sec",   contexts:["page"], parentId: this.tmid, onclick: this.handleTimeout}
		,{type:"checkbox", title:"60sec",   contexts:["page"], parentId: this.tmid, onclick: this.handleTimeout}
		,{type:"checkbox", title:"120sec",  contexts:["page"], parentId: this.tmid, onclick: this.handleTimeout}
		,{type:"checkbox", title:"300sec",  contexts:["page"], parentId: this.tmid, onclick: this.handleTimeout}
		,{type:"checkbox", title:"900sec",  contexts:["page"], parentId: this.tmid, onclick: this.handleTimeout}								
		,{type:"checkbox", title:"1800sec", contexts:["page"], parentId: this.tmid, onclick: this.handleTimeout}
		,{type:"checkbox", title:"3600sec", contexts:["page"], parentId: this.tmid, onclick: this.handleTimeout}
	];

	var timeoutList=[null, 3, 10, 30, 60, 120, 300, 900, 1800, 3600];

	//console.log("E");
	for (var item in timeoutMenuList) {
		//console.log("menu: "+item);
		mobj=timeoutMenuList[item];
		id=chrome.contextMenus.create(mobj);
		
		mobj.timeout=timeoutList[item];
		this.timeoutMenuItems[id]=mobj;
		//console.log("=> created menu item: "+id);
	}
	
	//console.log("Z");
};





/*
			
var randomizeMenuItems={};
var timeoutMenuItems={};

function _clearRandomizeCheckmarks() {
	for (var mid in randomizeMenuItems) {
		chrome.contextMenus.update(parseInt(mid), {checked: false});
	}
}

function _clearTimeoutCheckmarks() {
	for (var mid in timeoutMenuItems) {
		chrome.contextMenus.update(parseInt(mid), {checked: false});
	}
}

function doRandomizeMenuItem(info, tab) {
	
	_clearRandomizeCheckmarks();
	chrome.contextMenus.update(info.menuItemId, {checked: true});
	
	var id=info.menuItemId;
	
	console.log("MenuItemId: "+id+", random: "+randomizeMenuItems[id].random+", url:"+tab.url);
	
	localStorage["randomize."+tab.url]=randomizeMenuItems[id].random;
}

function doTimeoutMenuItem(info, tab) {
	_clearTimeoutCheckmarks();
	chrome.contextMenus.update(info.menuItemId, {checked: true});
	
	var id=info.menuItemId;
	
	console.log("MenuItemId: "+id+", timeout: "+timeoutMenuItems[id].timeout+", url:"+tab.url);
	
	localStorage["timeout."+tab.url]=timeoutMenuItems[id].timeout;				
}

var rmid;
var tmid;
var randomizeMenu = {type: "normal", title: "Randomize", contexts:["page"]};    
var timeoutMenu   = {type: "normal", title: "Timeout",   contexts:["page"]};   


// create the top level menus
rmid=chrome.contextMenus.create(randomizeMenu);
tmid=chrome.contextMenus.create(timeoutMenu);
//chrome.contextMenus.create(allOffMenu);

// options under 'randomize' and 'timeout'
var randomizeMenuList=[
	 {type:"checkbox", title:"Default", contexts:["page"], parentId: rmid, onclick: doRandomizeMenuItem}
	,{type:"checkbox", title:"10%",     contexts:["page"], parentId: rmid, onclick: doRandomizeMenuItem}					
	,{type:"checkbox", title:"25%",     contexts:["page"], parentId: rmid, onclick: doRandomizeMenuItem}
	,{type:"checkbox", title:"50%",     contexts:["page"], parentId: rmid, onclick: doRandomizeMenuItem}
];
var randomList=[null, 10, 25, 50];

var id, mobj;
for (var item in randomizeMenuList) {
	//console.log("menu: "+item);
	mobj=randomizeMenuList[item];
	id=chrome.contextMenus.create(mobj);
	
	mobj.random=randomList[item];
	randomizeMenuItems[id]=mobj;
	//console.log("=> created menu item: "+id);
}

// options under 'randomize' and 'timeout'
var timeoutMenuList=[
	 {type:"checkbox", title:"Default", contexts:["page"], parentId: tmid, onclick: doTimeoutMenuItem}
	,{type:"checkbox", title:"3sec",    contexts:["page"], parentId: tmid, onclick: doTimeoutMenuItem}					
	,{type:"checkbox", title:"10sec",   contexts:["page"], parentId: tmid, onclick: doTimeoutMenuItem}
	,{type:"checkbox", title:"30sec",   contexts:["page"], parentId: tmid, onclick: doTimeoutMenuItem}
	,{type:"checkbox", title:"60sec",   contexts:["page"], parentId: tmid, onclick: doTimeoutMenuItem}
	,{type:"checkbox", title:"120sec",  contexts:["page"], parentId: tmid, onclick: doTimeoutMenuItem}
	,{type:"checkbox", title:"300sec",  contexts:["page"], parentId: tmid, onclick: doTimeoutMenuItem}
	,{type:"checkbox", title:"900sec",  contexts:["page"], parentId: tmid, onclick: doTimeoutMenuItem}								
	,{type:"checkbox", title:"1800sec", contexts:["page"], parentId: tmid, onclick: doTimeoutMenuItem}
	,{type:"checkbox", title:"3600sec", contexts:["page"], parentId: tmid, onclick: doTimeoutMenuItem}
];

var timeoutList=[null, 3, 10, 30, 60, 120, 300, 900, 1800, 3600];

for (var item in timeoutMenuList) {
	//console.log("menu: "+item);
	mobj=timeoutMenuList[item];
	id=chrome.contextMenus.create(mobj);
	
	mobj.timeout=timeoutList[item];
	timeoutMenuItems[id]=mobj;
	//console.log("=> created menu item: "+id);
}

*/