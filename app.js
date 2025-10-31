
let a;
let b = undefined;
let c = null;

console.log(a); // undefined
console.log(b); // undefined
console.log(c); // null

a = 10;
console.log(a);
a = undefined;
console.log(a);

let ism = "";
console.log(ism); // empty string
console.log(typeof ism);

let malumot = {ism: "Ali", yoshi: 25};
console.log(malumot);
console.log(typeof malumot.ism); // string
console.log(typeof malumot.yoshi); // number

malumot = null;
console.log(malumot); // null
console.log(typeof malumot); // object


console.log(undefined == null);
console.log(undefined === null);

let mass = [1, 2, 3];
console.log(mass[5]); // undefined
console.log(typeof mass);




