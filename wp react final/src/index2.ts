interface MyInterface {
    prop: string;
}

class MyClass implements MyInterface {
    prop = '1000';
}

let b = new MyClass();
console.log('b: ', b)