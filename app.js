

function salom(ism){
    console.log("salom, " + ism + " men " + this.role + "man");
    
}

const user = {role: "O'qituvchi"};
salom.call(user, "Jumaniyoz");