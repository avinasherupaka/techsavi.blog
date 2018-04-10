---
layout: post
title: "Deep Dive into Functional ocean, Be more adventurous and awesome !!!"
img: functional-Programming1.png
tags: [Functional Programming, Javascript, Immutability, Higher Order Functions, Closure, Partial Functions, Currying]
author: Avinash Reddy Erupaka
---

# Higher-Order Functions (HOF)

> A function which takes a function as an argument and/or returns a function.

If refresh your memory, we have used `HOF` above when talking about [Declarative over Imperative](#declarative-over-imperative), remember the `map` examples we saw, that is an example of HOF to. A more real world with react flavor..

```javascript
Example 1:

const filter = (predicate, xs) => xs.filter(predicate)
const is = (type) => (x) => Object(x) instanceof type
filter(is(String), [0, 'Avinash','number', '1', null, 1]) // ['Avinash','number','1']
```
```
// Lets see look at a more real world example:
/*
Let's assume we want to wrap our components in another component that is used for debugging purposes, it just wraps them in a DIV with "debug class on it".
*/
> const EnhancedDebugComponent = ComponentToDebug => props => (
  <div className="debug">
    <ComponentToDebug {...props}/>
  </div>
);

> const EnhancedCustomComponent = EnhancedDebugComponent(CustomComponent);
```

# Partial Functions

> Partial functions are when you apply some of the required parameters of a function and return a function that takes the rest of the parameters.

```javascript
// Syntax:

> const partial = (fn, ...args) => // Takes a function and some arguments
  (...moreArgs) => // take more args
    fn(...args, ...moreArgs) // returns executed function by taking in all args.

> const concat = (a,b,c) => a + b + c
> const firstName  = partial(concat, 'Mr.', 'Avinash ')
firstName('Erupaka') // 'Mr.Avinash Erupaka'
```
Now lets take this concept little further, what if the functions passed to partial functions are self apply on their own and we don't need to use any explicit partial functions. That's where currying comes in to picture.

# Currying

> The process of converting a function that takes multiple arguments into a function that takes one at a time. It will return a new function until it receives all its arguments.

```javascript
curryedMultiply = (n) => ( (m) => multiply(n, m) )

> const currying = (a) => (b) => fn(a, b)

> const curriedConcat = (a) => (b) => (c) => a + b + c
> const curriedFirstName  = curriedConcat('Mr.')('Avinash ') // First 2 args are fulfilled and It will return a curredFunction that will resolve upon getting its last arg.
> curriedFirstName('Erupaka') // 'Mr.Avinash Erupaka'
```

Notice the difference ? A curried function always applies 1 parameter at a time. Partial application is not this strict.

> A curried function tends to be partially applied but a partially applied function does not have to be curried. This means we can automate the currying process.

Now if you are aware of javascript [promises](https://scotch.io/tutorials/javascript-promises-for-dummies), just think about tight, neat code you can achieve by using these together.

Lets look at a real world example...

```javascript

const multiply = x => y => x * y // curried function we use header-page
const totalTax = multiply(0.33)
const takeHome = tax => salary => salary - tax(salary)

const createRequest = (...defaultOptions) => (...customOptions) => request(...defaultOptions, ...customOptions)

const customRequest = createRequest ({header: {"X-Custom-Request-Id":uuid()}})
const api = {url: '/employees/salaries'}

const employeesTakeHome = customRequest(api) // [{name:A, salary:100},{name:B, salary:1000},{name:C, salary:10000}]
                 .then(R.pipe(R.pluck('salary'), // [100, 1000, 10000]
                              R.map(takeHome(totalTax)))) // [67, 670, 6700]
```
Please refer to [rambda](http://ramdajs.com/docs/#) documentation to see how to use `pipe`, `pluck`, `map` functions.

# Closure's in javascript

>A closure is a way of accessing a variable outside its scope. Formally, a closure is a technique for implementing lexically scoped named binding. It is a way of storing a function with an environment. In other words, a closure gives you access to an outer function’s scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.

Above mentioned examples depend on javascript closure's concept one way other.

Lets see a real world examples mixing some of the above concepts.

```
// So every time the slider is adjusted appropriate slider value is set in the redux store, this way by using Closure and HOF we can write re-usable code

// MainPage.jsx
const buildButtonCustomOnClick = (someReduxStoreData, objectToBeUpdated , someReduxAction) => value => someReduxAction(someReduxStoreData
                                        .setIn([objectToBeUpdated, 'min'], value[0])
                                        .setIn([objectToBeUpdated, 'max'], value[1]));

export const Sidebar = ({ someReduxStoreData, someReduxAction}) => {

  return (<div>
    <SliderWithLabel label="Distance" onChange={buildFilterUpdate(someReduxStoreData, 'frequency', someReduxAction)} />
    <SliderWithLabel label="Time" onChange={buildFilterUpdate(someReduxStoreData, 'deployYearRange', someReduxAction)} />
  </div>
  );
};

export default Sidebar;

// SliderWithLabel.jsx
const SliderWithLabel = ({ min, max, label, currentMin, currentMax, onChange }) =>
  (<div>
    <Typography variant="title">{label}</Typography>
    <Slider.Range
      min={min}
      max={max}
      step={1}
      value={[currentMin, currentMax]}
      onChange={onChange}
    />
  </div>);

export default SliderWithLabel;           
```

### Summarizing some of the Functional Programming languages, frameworks and libraries that I used and are worth trying.

#### Languages:

1. Clojure (Back-end, by far my favourite)
2. Clojure Script (Front-end-This complies to javascript)
3. Scala/Akka (Back-end)
4. Javascript (Front-end & Back-end, needs some library support to make it more effective)
5. Java 8 (not 100% functional)
6. Python
7. R
8. Elm (I did not use this, but heard good things about it)

#### Frameworks and Libraries:

1. React
2. Redux
3. Immutable
4. Ramda
5. ramda-adjunct
6. lodash
7. Underscore.js
8. Lazy.js

Cheers and Happy Coding :metal:
