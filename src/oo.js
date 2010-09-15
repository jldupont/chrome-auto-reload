/** 
 * 	oo.js
 * 
 * @author: Jean-Lou Dupont
 */

/*  Useful for binding callbacks to a scope
 *  Required function for Classes defined herein
 */
function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

/*
 * from D. Crockford
 */
Function.prototype.method = function (name, func) {
	this.prototype[name] = func;
	return this;
};
			
