//"use strict";
var obj2 = {};

Object.defineProperty(obj2, "a", {
    value: 2,
    configurable: true,
    writable: false,
    enumerable: true
});

var obj1 = Object.create(obj2);

obj1.a = 3;

console.log(obj1.a);