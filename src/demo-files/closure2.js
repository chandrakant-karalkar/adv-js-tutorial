function foo() {
    var a = 2;

    function baz() {
        console.log(a);
    }

    bar(baz);
}
foo();
function bar(fn) {
    fn();
}