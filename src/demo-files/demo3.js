var b = 2;

function foo(a) {
    console.log( a + b );
}

foo( 2 ); // 4

//The RHS reference for `b` cannot be resolved inside the function `foo`,
// but it can be resolved in the *Scope* surrounding it (in this case, the global).