/** 
 * 	oo.js
 * 
 * @author: Jean-Lou Dupont
 */

/**
 * 	Callback generator for 'class' method instances	
 * 
 *  Useful for binding callbacks to a scope
 *  Required function for Classes defined herein
 */
function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

/**
 * Adds a method definition facility 
 * to the base Function definition
 * 
 * from D. Crockford
 */
Function.prototype.method = function (name, func) {
	this.prototype[name] = func;
	return this;
};
			
