Classes in JavaScript
=====================

### JavaScript "Classes" - ES5

Where does JavaScript fall in this regard? JS has had *some* class-like syntactic elements (like `new` and `instanceof`) for quite awhile, and more recently in ES6, some additions, like the `class` keyword.

But does that mean JavaScript actually *has* classes? Plain and simple: **No.**

Since classes are a design pattern, you *can*, with quite a bit of effort (as we'll see throughout the rest of this chapter), implement approximations for much of classical class functionality. JS tries to satisfy the extremely pervasive *desire* to design with classes by providing seemingly class-like syntax.

While we may have a syntax that looks like classes, it's as if JavaScript mechanics are fighting against you using the *class design pattern*, because behind the curtain, the mechanisms that you build on are operating quite differently. Syntactic sugar and (extremely widely used) JS "Class" libraries go a long way toward hiding this reality from you, but sooner or later you will face the fact that the *classes* you have in other languages are not like the "classes" you're faking in JS.

What this boils down to is that classes are an optional pattern in software design, and you have the choice to use them in JavaScript or not. Since many developers have a strong affinity to class oriented software design, we'll spend the rest of this chapter exploring what it takes to maintain the illusion of classes with what JS provides, and the pain points we experience.

## Mixins - Simulating Inheritance.

JavaScript's object mechanism does not *automatically* perform copy behavior when you "inherit" or "instantiate". Plainly, there are no "classes" in JavaScript to instantiate, only objects. And objects don't get copied to other objects, they get *linked together*.

Since observed class behaviors in other languages imply copies, let's examine how JS developers **fake** the *missing* copy behavior of classes in JavaScript: mixins. We'll look at two types of "mixin": **explicit** and **implicit**.

### Explicit Mixins

Let's consider two objects `Vehicle` and `Car` as examples (where `Car` has to extend `Vehicle`). Since JavaScript will not automatically copy behavior from `Vehicle` to `Car`, we can instead create a utility that manually copies. Such a utility is often called `extend(..)` by many libraries/frameworks, but we will call it `mixin(..)` here for illustrative purposes.

```js
// vastly simplified `mixin(..)` example:
    function mixin( sourceObj, targetObj ) {
        for (var key in sourceObj) {
            // only copy if not already present
            if (!(key in targetObj)) {
                targetObj[key] = sourceObj[key];
            }
        }
    
        return targetObj;
    }
    
    var Vehicle = {
        engines: 1,
    
        ignition: function() {
            console.log( "Turning on my engine." );
        },
    
        drive: function() {
            this.ignition();
            console.log( "Steering and moving forward!" );
        }
    };
    
    var Car = mixin( Vehicle, {
        wheels: 4,
    
        drive: function() {
            Vehicle.drive.call( this );
            console.log( "Rolling on all " + this.wheels + " wheels!" );
        }
    } );
```

**Note:** Subtly but importantly, we're not dealing with classes anymore, because there are no classes in JavaScript. `Vehicle` and `Car` are just objects that we make copies from and to, respectively.

`Car` now has a copy of the properties and functions from `Vehicle`. Technically, functions are not actually duplicated, but rather *references* to the functions are copied. So, `Car` now has a property called `ignition`, which is a copied reference to the `ignition()` function, as well as a property called `engines` with the copied value of `1` from `Vehicle`.

`Car` *already* had a `drive` property (function), so that property reference was not overridden (see the `if` statement in `mixin(..)` above).

#### "Polymorphism" Revisited

Let's examine this statement: `Vehicle.drive.call( this )`. This is what I call "explicit pseudo-polymorphism"

JavaScript does not have a facility for relative polymorphism. So, **because both `Car` and `Vehicle` had a function of the same name: `drive()`**, to distinguish a call to one or the other, we must make an absolute (not relative) reference. We explicitly specify the `Vehicle` object by name, and call the `drive()` function on it.

But if we said `Vehicle.drive()`, the `this` binding for that function call would be the `Vehicle` object instead of the `Car` object, which is not what we want. So, instead we use `.call( this )` to ensure that `drive()` is executed in the context of the `Car` object.

**Note:** If the function name identifier for `Car.drive()` hadn't overlapped with (aka, "shadowed") `Vehicle.drive()`, we wouldn't have been exercising "method polymorphism". So, a reference to `Vehicle.drive()` would have been copied over by the `mixin(..)` call, and we could have accessed directly with `this.drive()`. The chosen identifier overlap **shadowing** is *why* we have to use the more complex *explicit pseudo-polymorphism* approach.

In class-oriented languages, which have relative polymorphism, the linkage between `Car` and `Vehicle` is established once, at the top of the class definition, which makes for only one place to maintain such relationships.

But because of JavaScript's peculiarities, explicit pseudo-polymorphism (because of shadowing!) creates brittle manual/explicit linkage **in every single function where you need such a (pseudo-)polymorphic reference**. This can significantly increase the maintenance cost. Moreover, while explicit pseudo-polymorphism can emulate the behavior of "multiple inheritance", it only increases the complexity and brittleness.

The result of such approaches is usually more complex, harder-to-read, *and* harder-to-maintain code. **Explicit pseudo-polymorphism should be avoided wherever possible**, because the cost outweighs the benefit in most respects.

### Parasitic Inheritance:

A variation on this explicit mixin pattern, which is both in some ways explicit and in other ways implicit, is called "parasitic inheritance".

Here's how it can work:

```js
// "Traditional JS Class" `Vehicle`
    function Vehicle() {
        this.engines = 1;
    }
    Vehicle.prototype.ignition = function() {
        console.log( "Turning on my engine." );
    };
    Vehicle.prototype.drive = function() {
        this.ignition();
        console.log( "Steering and moving forward!" );
    };
    
    // "Parasitic Class" `Car`
    function Car() {
        // first, `car` is a `Vehicle`
        var car = new Vehicle();
    
        // now, let's modify our `car` to specialize it
        car.wheels = 4;
    
        // save a privileged reference to `Vehicle::drive()`
        var vehDrive = car.drive;
    
        // override `Vehicle::drive()`
        car.drive = function() {
            vehDrive.call( this );
            console.log( "Rolling on all " + this.wheels + " wheels!" );
        };
    
        return car;
    }
    
    var myCar = new Car();
    
    myCar.drive();
    // Turning on my engine.
    // Steering and moving forward!
    // Rolling on all 4 wheels!
```

As you can see, we initially make a copy of the definition from the `Vehicle` "parent class" (object), then mixin our "child class" (object) definition (preserving privileged parent-class references as needed), and pass off this composed object `car` as our child instance.

### Implicit Mixins

Implicit mixins are closely related to *explicit pseudo-polymorphism* as explained previously. As such, they come with the same caveats and warnings.

```js
    var Something = {
    	cool: function() {
    		this.greeting = "Hello World";
    		this.count = this.count ? this.count + 1 : 1;
    	}
    };
    
    Something.cool();
    Something.greeting; // "Hello World"
    Something.count; // 1
    
    var Another = {
    	cool: function() {
    		// implicit mixin of `Something` to `Another`
    		Something.cool.call( this );
    	}
    };
    
    Another.cool();
    Another.greeting; // "Hello World"
    Another.count; // 1 (not shared state with `Something`)
```

With `Something.cool.call( this )`, which can happen either in a "constructor" call (most common) or in a method call (shown here), we essentially "borrow" the function `Something.cool()` and call it in the context of `Another` (via its `this` binding) instead of `Something`. The end result is that the assignments that `Something.cool()` makes are applied against the `Another` object rather than the `Something` object.

So, it is said that we "mixed in" `Something`s behavior with (or into) `Another`.

While this sort of technique seems to take useful advantage of `this` rebinding functionality, it is the brittle `Something.cool.call( this )` call, which cannot be made into a relative (and thus more flexible) reference, that you should **heed with caution**. Generally, **avoid such constructs where possible** to keep cleaner and more maintainable code.

### JavaScript "Classes" - ES6

Until recently, industrious developers used constructor functions to mimic an object-oriented design pattern in JavaScript. The language specification ECMAScript 2015, often referred to as ES6, introduced classes to the JavaScript language. Classes in JavaScript do not actually offer additional functionality, and are often described as providing "syntactical sugar" over prototypes and inheritance in that they offer a cleaner and more elegant syntax. Because other programming languages use classes, the class syntax in JavaScript makes it more straightforward for developers to move between languages.

#### Classes Are Functions -

A JavaScript `class` is a type of function. Classes are declared with the class keyword. We will use function expression syntax to initialize a function and class expression syntax to initialize a class.

Consider the following example:

```js
// Initializing a constructor function
    
    function Hero(name, level) {
        this.name = name;
        this.level = level;
    }
    
    // Initializing a class definition
    
    class Hero {
        constructor(name, level) {
            this.name = name;
            this.level = level;
        }
    }
```

The only difference in the syntax of the initialization is using the class keyword instead of function, and assigning the properties inside a constructor() method.

### Defining Methods

The common practice with constructor functions is to assign methods directly to the prototype instead of in the initialization, as seen in the greet() method below.

Adding methods using Functions:

```js
    function Hero(name, level) {
        this.name = name;
        this.level = level;
    }
    
    // Adding a method to the constructor
    Hero.prototype.greet = function() {
        return this.name + " says hello.";
    }

```

Adding methods using class:

```js
    class Hero {
        constructor(name, level) {
            this.name = name;
            this.level = level;
        }
    
        // Adding a method to the constructor
        greet() {
            return this.name + " says hello.";
        }
    }

```


#### Extending a Class:

An advantageous feature of constructor functions and classes is that they can be extended into new object blueprints based off of the parent. This prevents repetition of code for objects that are similar but need some additional or more specific features.

Extension using Functions:

```js
    function Hero(name, level) {
            this.name = name;
            this.level = level;
    }
        
    function Mage(name, level, spell) {
        // Chain constructor with call
        Hero.call(this, name, level);
    
        this.spell = spell;
    }

```

Extension using classes:

```js
    class Hero {
        constructor(name, level) {
            this.name = name;
            this.level = level;
        }
            
        greet() {
            return this.name + " says hello.";
        }
    }

    class Mage extends Hero {
        constructor(name, level, spell) {
            // Chain constructor with super
            super(name, level);
    
            // Add a new property
            this.spell = spell;
        }
        
        greet(){
            return  "Mage "+super.greet();}
        }
```

Although the syntax is quite different, the underlying result is nearly the same between both methods. Classes give us a more concise way of creating object blueprints, and constructor functions describe more accurately what is happening under the hood.