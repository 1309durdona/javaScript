
let matn = "salom dunyo bunchalar, salom zursan dunyo seni tog'ang emas"

console.log(matn);
console.log(matn.length);
console.log(matn.toUpperCase());
console.log(matn.toLowerCase());

console.log(matn.indexOf("dunyo1", 7));
console.log(matn.lastIndexOf("dunyo", 28));
console.log(matn.search("dunyo", 7));

// kesib olish
console.log(matn.slice(6, 11)); // 6 dan 11 gacha
console.log(matn.slice(-12, -5)); // oxirdan hisoblab 12 dan 5 gacha
console.log(matn.substring(6, 11)); // 6 dan 11 gacha
console.log(matn.substr(6, 5));
console.log(matn.substring(6)); // 6 dan oxirigacha
console.log(matn.substr(6)); // 6 dan oxirigacha

// almashtirish
console.log(matn.replace("salom", "Assalomu alaykum"));
console.log(matn.replaceAll("salom", "Assalomu alaykum"));
console.log(matn.replace(/ZURSAN/i, "yaxshi"));
console.log(matn.replace(/dunyo/g, "alik"));

// qismga ajratish
console.log(matn.split(" ")); // bo'sh joy bo'yicha ajratish
console.log(matn.split(","));

let ism = "Jumaniyoz";
let familiya = "Shonazarov";
let yosh = 21;

// qo'shish

let toliq = ism.concat(" ", familiya);
console.log(toliq);
console.log(ism.concat(" ", familiya));
console.log(`${ism} ${familiya}`);
console.log(ism + " " + familiya);

let yangiMatn = `${ism} ${familiya} yoshim ${yosh} da`;
console.log(yangiMatn);

let trimmed = "     Hello World     ";
console.log(trimmed.trim());
console.log(trimmed.trimStart());
console.log(trimmed.trimEnd());


// charAt va charCodeAt
let matn2 = "JavaScript";
console.log(matn2.charAt(0)); // J
console.log(matn2.charAt(4)); // S
console.log(matn2.charCodeAt(0)); // 74
console.log(matn2.charCodeAt(4)); // 83
let code = matn2.charCodeAt(0);
console.log(code); // 74
console.log(String.fromCharCode(code)); // J
// bracket notation
console.log(matn2[0]);
console.log(matn2[4]);
