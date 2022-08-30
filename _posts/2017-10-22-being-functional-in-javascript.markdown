---
layout: post
title: "Be functional, Be awesome !!!"
img: functional-Programming2.jpeg
tags: [Functional Programming, Javascript, Immutability, Higher Order Functions]
author: Avinash R. E
---

# What is functional programming ?

Functional programming is a style of writing software, where your **_programs_** are composed of **_pure functions_**.

# What is the difference between a function and pure function ?

> A function is a unit which takes some input and produces some output.

> A pure function is a function that, given the same input, will produce same output and does not have any observable side effect.

Lets look at this in actions

## Purity

```javascript
const funcA = (value) => {
 return value * value;
}
```
```javascript
const randomNum = Math.random();
const funcB = (value) => {
 return randomNum * value;
}
```

```javascript
> console.log(funcA(10)); // prints 100
> console.log(funcA(10)); // still prints 100
> console.log(funcA(10)); // WILL ALWAYS print 100

> console.log(funcB(10)); // prints some number
> console.log(funcB(10)); // prints some other number
> console.log(funcB(10)); // WILL ALWAYS print some other number
```
See the difference ? no matter how many times `funcA` is invoked with argument `10` it returns the same result, where as `funcB` returns different result. `funcB` doesn't solely depend on argument passed in, it also depends on shared or global state thus making it impure. What did we gain with `funcA`?  [Referential Transparency](https://en.wikipedia.org/wiki/Referential_transparency). This approach allows writing software with ease.

# Referential Transparency
Lets look at another scenario, say function `funcD` depends on `funcA` and `funcB`.

```javascript
const funcD = (f, val) => {
 return f(val) + 1;
}

> console.log(funcD(funcA, 10)); // prints 101
> console.log(funcD(funcA, 10)); // prints 101

> console.log(funcD(funcB, 10)); // some number
> console.log(funcD(funcB, 10)); // WILL ALWAYS print some other number
```

Unlike `funcA`, `funcB` has side effect on `funcD`.  `funcA` is a pure function thus `funcD's` return value is always predictable and consistent. Referential Transparency allows us to replace `funcA(10)` with 100.

If you have been programming in Object Oriented or procedural style, you must be wondering what is `funcD(funcA, 10)`, where function is passed as an argument. It is possible as functions are **first-class citizens** in javascript.

> Function being first class citizens means the language supports passing functions as arguments to other functions, returning them as the values from other functions, and assigning them to variables or storing them in data structures.

# Saves yourself from Side Effects

```javascript

const funcE = (val) => {
 console.log(val + 1);
}

const insertRecord = name => Schema.create(name) // inserts data into the Data base.
```
Functions `funcE` and `insertRecord` are considered to be impure, as they are affecting global state. `funcE` is emulating to a terminal and `insertRecord` is writing to DB both are considered outside state.

Functional programming styles saves you from affecting global state, at the same time shields you from outer state change effects.

# Declarative over Imperative  

> Imperative programming focuses on describing how a program operates or steps in to execute in order to achieve that.

> Declarative programming focuses on what the program should accomplish without specifying how the program should achieve the result.

How is declarative better over imperative ?

```javascript
const doubleNumbers = (numbers) => {      
const doubled = [];
const l = numbers.length;

for(let i=0, i < l, i++){
  double.push(number[i]*2);
}
return doubled;
}

> console.log(doubleNumbers([1,2,3]])); //[2,4,6]
```
same example can be written as..

```javascript
const doubleNumbers = (numbers) => {      
return numbers.map(n => n*2);
}

> console.log(doubleNumbers([1,2,3]])); //[2,4,6]
```
You can look how declarative approach produced tight and composed code, with out emphasizing on steps to solve a problem. If you are new to functional programming you might be wondering what is a `map`^^^ . As we've been discussing `pure functions` are heart of functional programming, `map` is one such. If you are interested check out [rambda](http://ramdajs.com/docs/#) one of practical functional library for JavaScript programmers.


# Immutability ?

> An immutable object is one, once created, itself or its properties can’t be modified.

How do I achieve it, **_Create a shared state, and don't mutate it._** Sounds familiar ? if you have been using react or redux in web app development, that is one the main fundamental they are built on.

## Why is Immutability important ?

When you have a shared state and it is mutable you create side effects:


```javascript
> const rollNumbers = [1,2,3,4]
> rollNumbers.pop() //4
> v //[ 1, 2, 3 ]
```
Lets say there is another entity, that is using `rollNumbers`, now `rollNumbers.pop()` has side effects on it to.

>Unfortunately In Javascript, we have both immutable and mutable data structures that make this language both more flexible and frustrating.

Is there is way we can seal this gap ? Yes, there are libraries like [ImmutabeJS](https://facebook.github.io/immutable-js/), that allow you to achieve full level of Immutability, above examples look like this.

```javascript
> const rollNumbers = Immutable.List([1,2,3,4])
> rollNumbers.pop().toJS() //[1, 2, 3]
> rollNumbers.toJS() //[1, 2, 3, 4]
```
If you observe, `rollNumbers.pop()` did not mutate `rollNumbers` data structure.

## Check out more in-depth functional programming concepts in [part 2]({{ site.baseurl }}{% post_url 2017-11-06-functional-javascript-indepth %})


# Lets summarize on some benefits of functional programming

#### Functional software is easy to reason about
Your software is more reasonable with pure functions as you eliminate things like interfacing with outside state and having hidden inputs. Your function will do one thing and function signature can tell you exactly what that is. That way your software is easy to read and understand. That way you can list out all possible units required to build a block and start converting each unit into a function.

![Functional blocks]({{site.baseurl}}/assets/img/function-blocks.png)

#### Easier to test and predict output
Since your functions typically do one thing, it is easy to predict what the outcome is. Such code is also easy to test as you are testing a single unit with out complicating your tests by doing bunch of function call mocking that has no relating context.

####  Debugging is less painful
If your function does bunch of things, mutating values all over place, in case if an error occurs it is very complicated to find what went wrong. Because pure functions depend only on their input parameters to produce their output, debugging such applications is easier. Again I'm not saying pure functions are always bug free, but they are easy to debug. With this incase of an production emergency your recovery time considerably less.

#### Reusability
Functional code is more reusable. They do exactly what they say they do, with out deviation. That way if a function can be reused with peace of mind. Look at my [Referential Transparency](#referential-transparency) example.

#### Write concurrent code with ease
Parallel and concurrent capabilities are must haves for an HVHA applications. "Because FP only has immutable values, you can’t possibly have the race conditions that are so difficult to deal with in imperative code."

[The Clojure.org website](https://clojure.org/about/rationale) adds these statements about how Clojure and FP help with concurrency:

![concurrency]({{site.baseurl}}/assets/img/clojure-concurrency.jpg)

That being said if you're talking about an application that has to store data in a database, then you definitely need side-effects and you will have to be concerned about the order of operations and potential race conditions just as you would in any other language. Writing functional code gives you a better abstractions and reasoning during such issues.

#### Referential Transparency - The ability to treat functions as values

#### Recursive Looping
In functional languages looping and iteration are replaced/implemented via recursive function calls. Many such languages guarantee that function calls made in tail position do not consume stack space, and thus recursive loops utilize constant space.

Cheers and Happy Coding 🤘
