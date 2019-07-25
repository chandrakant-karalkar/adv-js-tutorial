function Foo(name) {
    this.name = name;
}

Foo.prototype.myName = function () {
    return this.name;
};

function Bar(name, label) {
    Foo.call(this, name);
    this.label = label;
}

// here, we make a new `Bar.prototype`
// linked to `Foo.prototype`
Bar.prototype = Object.create(Foo.prototype);


Bar.prototype.myLabel = function () {
    return this.label;
};

var a = new Bar("a", "obj a");

console.log(a.name);
console.log(a.label);
a.myName(); // "a"
a.myLabel(); // "obj a"