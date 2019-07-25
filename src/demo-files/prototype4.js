var obj2 = {};

Object.defineProperty(obj2, "a", {
    set: function (value) {
        console.log("Obj 2 setter is called new value: " + value);
        this._a = value;
    },
    get: function () {
        return this._a;
    }
});

obj2.a = 2;

var obj1 = Object.create(obj2);

Object.defineProperty(obj1,"a",{
    value : 5
});

console.log(obj1.a); // setter is not called. aka shadowed.