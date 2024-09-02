//programma met synchrone functie aanroep

function print(naam, leeftijd) {
    console.log(`Hallo ${naam}. U bent ${leeftijd}`);
}

//Node.js event loop
//1. 
/*
print("Jan", 22)
*/
//2. 
/*
const mytimeout = setTimeout(function(){print("Kwik", 26)}, 5000);
*/
//3. 
/*
const myinterval = setInterval(function(){print("Kwik", 26)}, 5000);
*/
//4. 
const myinterval = setInterval(function(){print("Kwik", 26)}, 5000);
const myend = setTimeout(function(){clearInterval(myinterval)}, 20000);