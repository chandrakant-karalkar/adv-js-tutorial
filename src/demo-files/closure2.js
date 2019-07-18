function foo() {
    var a = 2;

    function baz() {
        console.log(a);
    }

    bar(baz);
}

function bar(fn) {
    fn();
}