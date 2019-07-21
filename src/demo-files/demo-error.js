function foo() {
    throw new Error("Opps and Error");
}

function bar(){
    foo();
}

function baz() {
    bar();
}

baz();