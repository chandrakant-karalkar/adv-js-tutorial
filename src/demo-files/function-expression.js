var a = 2;

(function foo() {

    var a = 3;
    console.log(a); // 3

})();

console.log(a); // 2