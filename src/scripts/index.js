import '../styles/index.scss';

import {
  onClick,
  gk
} from './starter.service';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

console.log('webpack starterkit');

// https://observablehq.com/@lacroute/d3-parliament-export
// globals



// window
let doc = window.document;
// When the user clicks anywhere outside of the modal, close it
doc.addEventListener("click", onClick, false);

let database = "gk";
let gender = "f";
let table = "80";
let field = database + gender + table;
let age = 20;
let charge = 0;
let oldCharge = charge;
let expectancyWithCharge = 0;
let expectancyWithoutCharge = age;
let k;
let j;
let i;

// loop two times
// first for expectancyWithCharge
// second for expectancyWithoutCharge

for (j = 0; j <= 1; j++) {
  // constant k
  k = seek(age, gk, field);
  expectancyWithoutCharge = age;

  if (k !== 0) {
    for (i = age; i < 126; i++) {
      expectancyWithoutCharge = expectancyWithoutCharge + (seek(i + 1, gk, field) / k);
    }
  }
}

// redondeo al más cercano
let a = expectancyWithoutCharge;
let b = 0;




// findGk finds number correspondence for age on database[gk] column
// 20 years old, gkm80 -->  0.00075
// @ age: number =  the actuarial age, 20 [20 years old]
// @ gk: any[]   = the database, the tables
// @ field: string   = the life expectancy column (gkm80) 
function findGk(age, database, column) {
  let row = database.filter(el => el["edad"] === age)[0];
  let result = row[column];
  return result;
}

// seek recursive function
// @ age: number =  the actuarial age, 20 [20 years old]
// @ gk: any[]   = the database, the tables
// @ field: string   = the life expectancy column (gkm80) 
// see gk.xlsx table to check recursion on column G
// 20 years old, gkm80 -->  996744.2261735977
// runs from 1000000 (< 15) to 19 years old gk number
// seek(20)
// (1 - 0.00073) * seek(19)
// (1 - 0.00073) * (1 - 0.00072) *  seek(18)
// (1 - 0.00073) * (1 - 0.00072) *  (1 - 0.00072) * seek(17)
// (1 - 0.00073) * (1 - 0.00072) *  (1 - 0.00072) *  (1 - 0.0006) * seek(16)
// (1 - 0.00073) * (1 - 0.00072) *  (1 - 0.00072) *  (1 - 0.0006) * (1 - 0.00049) * seek(15)
// (1 - 0.00073) * (1 - 0.00072) *  (1 - 0.00072) *  (1 - 0.0006) * (1 - 0.00049) * 1000000 = 996744.2261735977
function seek(age, gk, field) {
  if (age > 15) {
    let temp = findGk(age - 1, gk, field);
    return (1 - temp) * seek(age - 1, gk, field);
  } else {
    // when age is 15 recursion ends.
    return 1000000;
  }
}

let w = seek(20, gk, field);

let s = 0;

console.log(gk);

