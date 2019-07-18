// Identify all LHS and RHS lookups.
function foo(a) {
    var b = a;
    return a + b;
}

var c = foo( 2 );