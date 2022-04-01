import { gk } from './lifeExpectancyTables';



// findGk finds number correspondence for age on database[gk] column
// 20 years old, gkm80 -->  0.00075
// @ age: number =  the actuarial age, 20 [20 years old]
// @ gk: any[]   = the database, the tables
// @ column: string   = the life expectancy column (gkm80) 
function findGk(age, database, column) {
    let row = database.filter(el => el["edad"] === age)[0];
    let result = row[column];
    return result;
}

// seek recursive function
// @ age: number =  the actuarial age, 20 [20 years old]
// @ gk: any[]   = the database, the tables
// @ column: string   = the life expectancy column (gkm80) 
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
function seek(age, database, column, charge) {
    if (age > 15) {
        let temp = findGk(age - 1, database, column);
        return (1 - (temp * (1 + charge))) * seek(age - 1, database, column, charge);
    } else {
        // when age is 15 recursion ends.
        return 1000000;
    }
}

//let w = seek(20, gk, column, charge);





export function seekLifeExpectancy(inputs, search) {
    // if charge is higher than 300 return acturial age


    let database = "gk";
    let gender = inputs.gender === "male" ? "m" : "f";
    let table = "80";

    //let column = database + gender + table;
    let column = search.replace(':::', gender);
    let age = inputs.age.actuarial;
    let charge = inputs.charge / 100;
    let expectancyWithCharge;
    let expectancy;
    let k;
    let j;
    let i;

    if (+inputs.charge >= 300) {
        return {
            "column": column,
            "age": age,
            "gender": gender,
            "charge": inputs.charge,
            "expectancy": age,
            "expectancyWithCharge": age
        };

    }

    // loop two times
    // first for expectancyWithCharge
    // second for expectancyWithoutCharge (expectancy)
    // constant k
    for (j = 0; j <= 1; j++) {
        //first loop k with input charge
        k = seek(age, gk, column, charge);
        expectancy = age;

        if (k !== 0) {
            for (i = age; i < 126; i++) {
                expectancy = expectancy + (seek(i + 1, gk, column, charge) / k);
            }
        }
        // second loop runs with no charge
        if (charge > 0) {
            expectancyWithCharge = expectancy;
            charge = 0;
        }
    }

    // * Si, por causas extrañas, la esperanza agravada es mayor que la normal (es un fallo matemático, no mío)
    // * hay que rebajarla a la misma que la normal.También si devuelve un valor menor que la edad actual

    if (expectancy < age) {
        expectancy = age;
    }
    if (expectancyWithCharge && expectancyWithCharge < age) {
        expectancyWithCharge = age;
    }
    if (expectancyWithCharge && expectancyWithCharge > expectancy) {
        expectancyWithCharge = expectancy;
    }



    // redondeo al más cercano
    let result = {
        "column": column,
        "age": age,
        "gender": gender,
        "charge": inputs.charge,
        "expectancy": Math.round(expectancy),
        "expectancyWithCharge": expectancyWithCharge ? Math.round(expectancyWithCharge) : Math.round(expectancy)
    };
    return result;
}


export function calculateLifeExpectancy(inputs) {
    return {
        "gk80": seekLifeExpectancy(inputs, 'gk:::80'),
        "gk95": seekLifeExpectancy(inputs, 'gk:::95'),
    }
}




