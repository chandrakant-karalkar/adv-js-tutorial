var a = 2;

function multiply(fistNumber, secondNumber) {
    return fistNumber * secondNumber;
}

function square(number) {
    return multiply(number, number);
}

function printSquare(number) {
    var squareOfNumber = square(number);
    console.log(squareOfNumber);
}

printSquare(2);
printSquare(9);