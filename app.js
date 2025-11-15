var person = new Object();
person.firstName = "Ali";
person.lastName = "Valiyev";
person.age = 45;
person.eyeColor = "qora";

console.log(typeof person);
console.log(person);

let x = person;
x.age = 50;
console.log(x);
console.log(person);

let txt = "";
for(s in person){
    txt += person[s] + " " ;
}
console.log(txt);  


 
let mas = txt.split();   
console.log(mas);

delete person.age;
delete person.lastName;
console.log(person);







// var person = {firstName:"Ali", lastName:"Valiyev", age:45, eyeColor:"qora"};
// var x = person;
// x.age = 10;
// console.log(person.age);