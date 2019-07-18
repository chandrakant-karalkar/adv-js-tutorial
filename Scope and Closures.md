Scope and Closures:
===================
**Chapter 1**: What is Scope and Lexical Scope?
-----------------------------------------------
JS allows us to use *variables* to store values.
In fact, the ability to store values and pull these values out of *variables* is what gives a program state.

Where do these *variables* we create live/exist?
How does our running script/program find these variables when needed?

These questions speak to the need for a well-defined set of rules for storing variables in some location, and for finding those variables at a later time.
Well we call that set of rules: *Scope*.

But, where and how do these *Scope* rules get set?
Before we do this we need to understand how any typical Compiler works.
It is a 3 step process (combination of these 3 process - Compilation) -
To understand this we need to understand how JS Compiler process in brief:
1. **Tokenizing/Lexing**: breaking up a string of characters into meaningful (to the language) chunks, called tokens. For instance, consider the program: `var a = 2;`. This program would likely be broken up into the following tokens: `var`, `a`, `=`, `2`, and `;`. Whitespace may or may not be persisted as a token, depending on whether it's meaningful or not.
2. **Parsing**: taking a stream (array) of tokens and turning it into a tree of nested elements, which collectively represent the grammatical structure of the program. This tree is called an "AST" (<b>A</b>bstract <b>S</b>yntax <b>T</b>ree).
                The tree for `var a = 2;` might start with a top-level node called `VariableDeclaration`, with a child node called `Identifier` (whose value is `a`), and another child called `AssignmentExpression` which itself has a child called `NumericLiteral` (whose value is `2`).
3. **Code-Generation**:  the process of taking an AST and turning it into executable code. This part varies greatly depending on the language, the platform it's targeting, etc.

The best way we can understand Scope is think of the process of Compilation and Execution as a conversation between **Engine**, **Compiler** and **Scope**.

1. **Engine**: responsible for start-to-finish compilation and execution of our Javascript program.
2. **Compiler**: work with the Engine, handles parsing and code generation.
3. **Scope**: works with the Engine, collects and maintains a look-up of all declared variables and enforces a strict set of rules as to how these are accessible to currently executing code.

Consider following expression:
```javascript
var a = 2;
``` 
First thing compiler does is perform lexing to break the statement to tokens and then parse it into a tree.
But when Compiler comes to code generation it will treat this program a little differently.
1. On Encountering `var a`, Compiler asks Scope to see if `a` exists for this particular scope collection. If so compile ignores the declaration and moves on. Otherwise, Compiler asks Scope to declare a new variable called `a` for that scope collection.

 [Demo](src/demo-files/demo1.js)
    
2. Compiler produces code to Engine to later handle `a = 2` assignment. The code Engine asks Scope if there is a variable called `a` accessible in current scope collection. If so Engine uses it or looks elsewhere.
Finally if it is unable to find it, it throws out an Error.

**LHS** and **RHS** look-ups:    
1.**LHS**: look-up for the existence of the variable. `var a = 2;`
2.**RHS**: look-up for the variable value. `console.log(a);`

[Demo](src/demo-files/demo2.js)

Time for a quick [Quiz](src/quiz-files/quiz1.js):

**Nested Scope**:
We mentioned Scope is a set od rules for looking up variables, but there is usually more than one Scope to consider.
If a variable is not found in the current Scope collection continue looking until found or outermost/global scope has been reached.
[Demo](src/demo-files/demo3.js)

**Errors**:
Does it really matter if it is a LHS or RHS lookup?
Because these two lookups behave differently in case variable is not yet declared.

If RHS lookup fails it results in `Reference Error`
[Demo](src/demo-files/demo4.js)
If LHS lookup fails it creates a new Undeclared variable in global Scope in normal mode(Throws `Reference Error` in Strict mode)
[Demo](src/demo-files/demo5.js)

Finally if a variable is found for an RHS look-up but you try to do something with its value that is impossible, Engine throws `TypeError`     
[Demo](src/demo-files/demo6.js)

`Reference Error` is related to Scope-resolution failure.
`Type error` implies that Scope-resolution was successful, but there was an illegal/impossible action on the value.

**Lexical Scope**:    

As discussed above first step of the Compiler is called lexing(tokenizing). 
lexing process examines a string of source code characters and assigns meaning to the tokens.
Scope for any variables is defined during lexing process. Thus the name `Lexical Scope.`

In simpler words lexical scope is based on where variables and blocks of scope are authored at write time and thus freezed by the time lexer processes your code.

**Shadowing**:
Scope look-ups stop once they find the first match.
Same variable name can be specified at multiple layers of nested scope aka shadowing. (inner variable shadows outer variable).
Regardless of shadowing, scope lookup always starts at innermost scope being executed at that time, and works its way outwards until first match.
[Demo](src/demo-files/demo8.js)
  
*Note: Global variables are automatic properties of global object (`window` for browsers) so it is possible to reference a global variable as a property reference to the global  object.
```javascript
window.shadow
```
non-global shadow variables cannot be accessed.
No matter where the function is invoked from ot even how it is invoked, its lexical scope is only defined by where the function was declared.

**Chapter 2**: Function vs. Block Scope?
-----------------------------------------

As we saw in Chapter 1 scope consist scope consists of a series of "bubbles" that each act as a container or bucket, in which identifiers (variables, functions) are declared. These bubbles nest neatly inside each other, and this nesting is defined at author-time.
                                  
But what exactly makes a new bubble? Is it only the function? Can other structures in JavaScript create bubbles of scope?
**Scope from Functions**
The most common answer to those questions is that JavaScript has function-based scope. That is, each function you declare creates a bubble for itself, but no other structures create their own scope bubbles. As we'll see in just a little bit, this is not quite true.

But first, let's explore function scope and its implications.
[Demo](src/demo-files/demo8.js)
 **It doesn't matter** *where* in the scope a declaration appears, the variable or function belongs to the containing scope bubble, regardless. We'll explore how exactly *that* works in the next chapter.
Function scope encourages the idea that all variables belong to the function, and can be used and reused throughout the entirety of the function (and indeed, accessible even to nested scopes). This design approach can be quite useful, and certainly can make full use of the "dynamic" nature of JavaScript variables to take on values of different types as needed.

On the other hand, if you don't take careful precautions, variables existing across the entirety of a scope can lead to some unexpected pitfalls.

`Hiding`:
The traditional way of thinking about functions is that you declare a function, and then add code inside it. But the inverse thinking is equally powerful and useful: take any arbitrary section of code you've written, and wrap a function declaration around it, which in effect "hides" the code.
Why would "hiding" variables and functions be a useful technique?

There's a variety of reasons motivating this scope-based hiding. They tend to arise from the software design principle "Principle of Least Privilege", also sometimes called "Least Authority" or "Least Exposure". This principle states that in the design of software, such as the API for a module/object, you should expose only what is minimally necessary, and "hide" everything else.

[Bad Design Example](src/demo-files/bad-design.js)
[Better Design Example](src/demo-files/better-design.js)

`Collision Avoidance`:

Another benefit of "hiding" variables and functions inside a scope is to avoid unintended collision between two different identifiers with the same name but different intended usages. Collision results often in unexpected overwriting of values.

[Demo](src/demo-files/demo9.js) 

`Global "Namespaces"`

A particularly strong example of (likely) variable collision occurs in the global scope. Multiple libraries loaded into your program can quite easily collide with each other if they don't properly hide their internal/private functions and variables.

Such libraries typically will create a single variable declaration, often an object, with a sufficiently unique name, in the global scope. This object is then used as a "namespace" for that library, where all specific exposures of functionality are made as properties of that object (namespace), rather than as top-level lexically scoped identifiers themselves.

[Global NameSpace example](src/demo-files/global-name-space.js)

**Functions As Scopes**:

We've seen that we can take any snippet of code and wrap a function around it, and that effectively "hides" any enclosed variable or function declarations from the outside scope inside that function's inner scope.

For example:

   ```javascript
    var a = 2;
    
    function foo() { // <-- insert this
    
    	var a = 3;
    	console.log( a ); // 3
    
    } // <-- and this
    foo(); // <-- and this
    
    console.log( a ); // 2
   ```


While this technique "works", it is not necessarily very ideal. There are a few problems it introduces. The first is that we have to declare a named-function `foo()`, which means that the identifier name `foo` itself "pollutes" the enclosing scope (global, in this case). We also have to explicitly call the function by name (`foo()`) so that the wrapped code actually executes.
It would be more ideal if the function didn't need a name (or, rather, the name didn't pollute the enclosing scope), and if the function could automatically be executed.

[Demo](src/demo-files/function-expression.js)

Now that we have a function as an expression by virtue of wrapping it in a `( )` pair, we can execute that function by adding another `()` on the end, like `(function foo(){ .. })()`. The first enclosing `( )` pair makes the function an expression, and the second `()` executes the function.
 This pattern is so common, a few years ago the community agreed on a term for it: **IIFE**, which stands for **I**mmediately **I**nvoked **F**unction **E**xpression.
 
 **Blocks As Scopes**:
 While functions are the most common unit of scope, and certainly the most wide-spread of the design approaches in the majority of JS in circulation, other units of scope are possible, and the usage of these other scope units can lead to even better, cleaner to maintain code.
 But even if you've never written a single line of code in block-scoped fashion, you are still probably familiar with this extremely common idiom in JavaScript:
 
   ```javascript
    for (var i=0; i<10; i++) {
    	console.log( i );
    }
   ``` 
We declare the variable `i` directly inside the for-loop head, most likely because our *intent* is to use `i` only within the context of that for-loop, and essentially ignore the fact that the variable actually scopes itself to the enclosing scope (function or global).

That's what block-scoping is all about. Declaring variables as close as possible, as local as possible, to where they will be used. 

Another example:
   ```javascript
    var foo = true;
    
    if (foo) {
    	var bar = foo * 2;
    	bar = something( bar );
    	console.log( bar );
    }
   ``` 
We are using a `bar` variable only in the context of the if-statement, so it makes a kind of sense that we would declare it inside the if-block. However, where we declare variables is not relevant when using `var`, because they will always belong to the enclosing scope. This snippet is essentially "fake" block-scoping, for stylistic reasons, and relying on self-enforcement not to accidentally use `bar` in another place in that scope.

Block scope is a tool to extend the earlier "Principle of Least Privilege Exposure" from hiding information in functions to hiding information in blocks of our code.

Consider the for-loop example again:
Why pollute the entire scope of a function with the `i` variable that is only going to be (or only *should be*, at least) used for the for-loop?   

`let`:
Thus far, we've seen that JavaScript only has some strange niche behaviors which expose block scope functionality. If that were all we had, and *it was* for many, many years, then block scoping would not be terribly useful to the JavaScript developer.

Fortunately, ES6 changes that, and introduces a new keyword `let` which sits alongside `var` as another way to declare variables.

The `let` keyword attaches the variable declaration to the scope of whatever block (commonly a `{ .. }` pair) it's contained in. In other words, `let` implicitly hijacks any block's scope for its variable declaration.

[Demo](src/demo-files/demo10.js)

Creating explicit blocks for block-scoping can address some of these concerns, making it more obvious where variables are attached and not. Usually, explicit code is preferable over implicit or subtle code. This explicit block-scoping style is easy to achieve, and fits more naturally with how block-scoping works in other languages
[Explicit-blocks Demo](src/demo-files/explicit-blocks.js)

In next chapter, we will address hoisting, which talks about declarations being taken as existing for the entire scope in which they occur.

However, declarations made with `let` will *not* hoist to the entire scope of the block they appear in. Such declarations will not observably "exist" in the block until the declaration statement.

  ```javascript
        {
           console.log( bar ); // ReferenceError!
           let bar = 2;
        }
   ```

`const`

In addition to `let`, ES6 introduces `const`, which also creates a block-scoped variable, but whose value is fixed (constant). Any attempt to change that value at a later time results in an error.

[Demo](src/demo-files/demo11.js)

**Chapter 3**: Hoisting?
-----------------------------------------

By now, you should be fairly comfortable with the idea of scope, and how variables are attached to different levels of scope depending on where and how they are declared. Both function scope and block scope behave by the same rules in this regard: any variable declared within a scope is attached to that scope.

But there's a subtle detail of how scope attachment works with declarations that appear in various locations within a scope, and that detail is what we will examine here.

There's a temptation to think that all of the code you see in a JavaScript program is interpreted line-by-line, top-down in order, as the program executes. While that is substantially true, there's one part of that assumption which can lead to incorrect thinking about your program.

Consider this code:

```js
a = 2;

var a;

console.log( a );
```

What do you expect to be printed in the `console.log(..)` statement?

Consider another piece of code:

```js
console.log( a );

var a = 2;
```

What do you expect to be printed in the `console.log(..)` statement?

**So, what's going on here?** 

To answer this question, we need to refer back to Chapter 1, and our discussion of compilers. Recall that the *Engine* actually will compile your JavaScript code before it interprets it. Part of the compilation phase was to find and associate all declarations with their appropriate scopes.

So, the best way to think about things is that all declarations, both variables and functions, are processed first, before any part of your code is executed.

When you see `var a = 2;`, you probably think of that as one statement. But JavaScript actually thinks of it as two statements: `var a;` and `a = 2;`. The first statement, the declaration, is processed during the compilation phase. The second statement, the assignment, is left **in place** for the execution phase.

So, one way of thinking, sort of metaphorically, about this process, is that variable and function declarations are "moved" from where they appear in the flow of the code to the top of the code. This gives rise to the name "Hoisting".

   ```js
    foo();
    
    function foo() {
    	console.log( a );
    
    	var a = 2;
    }
   ```
What do you expect to be printed in the `console.log(..)` statement?


Function declarations are hoisted, as we just saw. But function expressions are not.

```javascript
    foo(); // not ReferenceError, but TypeError!
    
    var foo = function bar() {
        // ...
    };
```

`Function vs Variable Hoisting`

Both function declarations and variable declarations are hoisted. But a subtle detail (that *can* show up in code with multiple "duplicate" declarations) is that functions are hoisted first, and then variables.

[Demo](src/demo-files/demo12.js)

While multiple/duplicate `var` declarations are effectively ignored, subsequent function declarations *do* override previous ones.
[Demo](src/demo-files/demo13.js)

**Chapter 4**: Scope Closure
-----------------------------------------
