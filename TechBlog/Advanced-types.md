---
title: Enhancing Typescript by embracing Types!
---
# Introduction
Typescript has an amazing support of types, generics and type inference. It's also possible to generate a large amount of utility types through generics to make your typescript functions far better suited to use composition or inheritance instead of the specific objects. In this article i will do a short-dive into the vast possibilities possible with types. However sometimes it's difficult to imagine one-self using these types, when reading about them, so hopefully the examples i've brought from my own experince will atleast resemble to issues you yourself might've encountered.

# Built in generic types
I will introduce this subject with a little detour, instead of jumping into the specific types right away, i want to rediscover one for ourselves. Im assuming you're atleast somewhat familiar with typescript and declaring interfaces. Keep in mind that in many cases interfaces and types can be substituted for eachother, but they are not the same.

Now you might have created an interface for a object working as a dictionary, just like a standard js object. This can easily be done with the following declaration.
```ts
interface Dict {
    [key: string]: any
}
const dict: Dict = {
    name: 'Dictionary',
    someRecord: {}
}
```
What is interesting here is that we can declare multiple properties on an interface, in a single line. We can even declare what value the dictionary can contain.

With that in mind, lets turn the crank up a notch. Imagine that we had some sort of reduxLike state library, and we wanted to update a property in that state. I've made a simplified example of a naive solution that gets the job done:

```ts
interface Item {
    id: number,
    name: string,
    description: string,
    amount: number,
}

const item: Item = {
    id: 1,
    name: "testItem",
    description: "Lorem Ipsum",
    amount: 1
};

function update(toUpdate: any, key: string, value: any) {
    toUpdate[key] = value;
}

update(item, 'description', 'Dolor Sit Amet')
console.log(item.description) // Dolor Sit Amet
```
Now you might see many problems with this implementation, thats the point. First of all we are not using typescript to help us here at all, secondly we are not sure that the item we want to update even has the property already, in that case we just set a new property. Thirdly we are not sure we are even assigning a value of the type that the Item interface is declaring.
Also if we for some reason need to change the Item interface, we won't get any compile time errors if property we want to update doesn't exist anymore.
```ts
update(item, 'otherProp', 'someValue') //Setting a new prop
update(item, 'description', {}) //Changing type of an existing prop
```

Lets introduce generics to make this a bit more safe.

```ts
function updateGeneric<T>(toUpdate: T, key: keyof T, value: any) {
    toUpdate[key] = value;
}
```

Here we already improved a lot on the design of the function by introducing the generic type T aswell as the keyword `keyof`. If you are not familiar with `keyof`, it contains all the keys of the generic item.

```ts
update(item, 'otherProp', 'someValue') //Fails as the prop 'otherProp' doesnt exists on type Item
update(item, 'description', {}) //This will still work
```

Further increasing the typesafety of this function we can introduce another type U.

```ts
function updateGenericTwo<T,U extends keyof T>(toUpdate: T, key: U, value: T[U]) {
    toUpdate[key] = value;
}
```

We've moved the keyof into the generic declaration, stating that U must be a key in T, but we also typed the `value` with `T[U]`. This specifies that the type of value **must** be exactly the type of the item with the key U.

```ts
update(item, 'otherProp', 'someValue') //Fails as the prop 'otherProp' doesnt exists on type Item
update(item, 'description', {}) //Fails as {} is not a string
```

Now we've finally created a generic function that helps us achieve our goals, which gives us intellisense aswell as compile time errors instead of runtime errors.

Now imagine that we want to update multiple values at the same time. Instead we might create an object with the values to assign to the item.

```ts
const itemUpdate = {
    description: 'Dolor Sit Amet',
    amount: 5
};
```

Going back to the original example where we declared multiple properties with a single line we can do that here aswell by declaring a type.
```ts
type Update<T> = {
    [U in keyof T]: T[U]
}
const itemUpdate: Update<Item> = { //Fails
    "description": 'Dolor Sit Amet'
};
```
However this fails as we need to populate all properties in item. This is actually the Identity Function of types, which takes a type and outputs the same type. However we can modify it slightly by setting all properties to be optional

```ts
type Update<T> = {
    [U in keyof T]?: T[U] //Notice the ? in the declaration
}
const itemUpdate: Update<Item> = { //Works now
    "description": 'Dolor Sit Amet'
};
```

Now we just need to create a function that applies an update to an object and we have full typesafety, while being able to dynamically create updates for any type of item.

```ts
function apply<T>(toUpdate: T, update: Update<T>) {
    Object.assign(toUpdate, update)
}
```
Now while Object.assign is not typesafe, we've wrapped it into a function that is. Now this `Update<T>` is pretty nifty, and does actually exist as a generic type in typescript itself: `Partial<T>`. However i wanted to take the route of rediscovery, for you to get an understanding of how to declare such types yourself.

# Wrapping unsafe functions
Now we have essentially wrapped `Object.assign` to be able to update values of any object, without breaking the original interface. There's multiple candidates for the same treatment, and a good example of that is the deepcopy with JSON. For those who don't know a very common and easy way of deepcloning an object is using the following function.

```ts
function deepClone<T>(input: T): T {
    return JSON.parse(JSON.stringify(input))
}
```

This will create a new clone, with no references to the old data. However there are some pitfalls with this function, that being many objects in javascript doesnt translate back into their original type when parsing. A very common bug that occurs with this function is Dates, as they are represented as a string in JSON, and thus gets parsed as a string later.

Imagine we had this utility function in our code base and we want to avoid anyone using this function with the wrong input, how can we wrap this 'unsafe' function with a type that disallows dates?

```ts
type NotADate<T> = Exclude<T, Date>
type ContainsNoDates<T> = NotADate<T> & {
    [K in keyof T]: ContainsNoDates<T[K]>
}
```

First we make a type that is not a date with the Exclude utility type, after that we create a recursive type that is also NotADate aswell as containing no keys that are dates, recursively.
With this simple type we can extend our deepClone like the following:

```ts
function deepClone<T>(input: ContainsNoDates<T>): T {
    return JSON.parse(JSON.stringify(input))
}

const date = deepClone(new Date()) // Compile error
const someObject = {
    id: 1,
    name: "Lorem Ipsum"
}
const clone = deepClone(someObject)
const dateObject ={
    id: 1,
    name: "Lorem Ipsum",
    events: [
        {eventName: "some event", time: new Date()}
    ]
}
const dateClone = deepClone(dateObject) //Compile error
```
As can be seen this will even find dates hidden nested deep inside objects and arrays, and if the types ever change to suddenly include a Date, now the compiler will alert you, that the deepclone will need to be handled differently.

# The big finale: Creating a chain like Rxjs .pipe()
Now lets finish off with a more complex type! Ever wondered how the RxJs pipe function can take an unlimited amount of functions, and still keep track of the types between each function and the last returned type? Well here i will show you. Now the complexity will increase in the last example, and my goal with this is more to pique your interest with what is possible with Typescripts amazing typesystem. So if it gets too advanced, just appreciate the typemagic!

This is the function we want to construct, but with typesafety
```ts
const chain = <T extends any[]>(...funcs: T): (any): any => {
    throw "Not implemented"
}
```
This function should take and array of functions, and chain them together, producing a single function takes the first functions argument and returns the result of the functions.

First lets declare some helper types:
```ts
type SingleReturnType<T> = T extends (arg: any) => infer R ? R : never
type SingleParameterType<T> = T extends (arg: infer A) => any ? A : never
```
These two types uses the `infer` keyword to return the type of the parameter and returned value respectively. They also enforce that the function takes only a single argument, which is important in chaining.

Next we create the type of the parameters of the `chain` function 
```ts
type Chain<T extends any[], S = T> =
    S extends [infer Head, infer Next, ...infer Tail]
        ? SingleReturnType<Head> extends SingleParameterType<Next>
            ? Chain<T, [Next, ...Tail]>
            : never
        : T
```
This type uses state, recursion and conditionals to check each part of the chain returns the next links parameter type. If these conditions are met it returns to original type unchanged. Think of this type as a constraint, it doesnt modify the internal type if it adheres to the constraint. If it doesnt the type is then `never`

The last types we need to declare are types that can tell what the parameters and return types of a chain is.
```ts
type ChainParam<T extends any[]> =
     T extends [infer Head , ...infer _]
        ? SingleParameterType<Head>
        : never
type ChainReturn<T extends any[]> =
     T extends [...infer __, infer Last]
        ? SingleReturnType<Last>
        : never
```
These are basically the same as the `SingleReturnType` and `SingleParameterType` i defined earlier, however these takes a list of functions instead.

Now we are finally ready to implement `chain()`
```ts
const chain = <T extends any[]>(...funcs: Chain<T>): ((arg: ChainParam<T>) => ChainReturn<T>) => {
    return (input) => {
        let value = input;
        for(const func of funcs) {
            value = func(value)
        }
        return value
    }
}
```
The importance here is the types! chain takes an array of functions T, that must extend Chain<T>. It then returns a new function that takes the parameter of the first function of T, and returns the type of the last function of T. And in the example below we can inspect the fruits of our labours!

```ts
// Dummy functions
let strToNumber = (str: string) => 3
let numberToBool = (num: number) => true
let boolToString = (bool: boolean) => "foo"

// The chains
chain(strToNumber, numberToBool) // (arg: string) => boolean
chain(strToNumber, numberToBool)("Some Input") // boolean
chain(strToNumber, boolToString) // Compile error
chain(numberToBool)(3) // boolean
chain(boolToString)(3) // Compile Error
```

## Final words
I hope you found this article interesting and found appreciation with the typesystem. I hope the last section didn't throw you off and if you want to continue exploring, here are some very useful links. I especially recommend tring the typescript challenges, where different type problems must be solved.
- [Typescript handbook - Type Manipulation](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Typescript challenges](https://github.com/type-challenges/type-challenges)
