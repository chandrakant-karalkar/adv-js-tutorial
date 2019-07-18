var foo = 1;

if (foo) {
    { // <-- explicit block
        let bar = foo * 2;
        console.log(bar);
    }
    console.log(bar); // ReferenceError
}

