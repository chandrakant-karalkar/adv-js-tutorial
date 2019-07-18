var shadow = "a";

function foo(shadow) {
    function bar(shadow) {
        console.log("Function bar scope - "+shadow);
        //console.log("Accessing global scope - "+window.shadow); - JSConsole
    }
    bar("c");
    console.log("Function foo scope - "+shadow);
}

foo("b");
console.log("Global scope - " + shadow);