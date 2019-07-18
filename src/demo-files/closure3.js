var fn;

function foo() {
    var a = 2;

    function baz() {
        console.log(a);
    }

    fn = baz; // assign `baz` to global variable
}

function bar() {
    fn(); // closure!
}

foo();

bar(); // 2