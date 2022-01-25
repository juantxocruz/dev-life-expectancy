import '../styles/index.scss';

import { onClick, gk } from './starter.service';
import { modalSetup, openModalWindow, initModalWindow } from './modal_window';
import { dateRange, dateOptions, calculate_age, dateIsHigher, subtractYearsToDate, dateIsOnRange } from './date'
import { addEventListenerList, setSubmitButtonState, radioButtonOn, fieldsOn, resetNodeFields, resetInnerHtml, checkNodeFields, toggleMandatoryMsg, disableEnter } from './form';
import { openModalResults, initModalResults } from './modal_results';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}




// window
let doc = window.document;
// When the user clicks anywhere outside of the modal, close it
// doc.addEventListener("click", onClick, false);
let vidanr_cal = document.getElementById('vidanr_cal');
let formForm = document.forms["vidanr_form"];

let genderField = formForm.elements['gender'];
let dateFields = formForm.querySelectorAll('input[type="date"]');
let chargeField = formForm.elements['charge'];




let birthdayModalSetup = {
  header: "Fecha incorrecta",
  content: "La fecha seleccionada no puede ser mayor que la fecha actual.",
  action: "Por favor, escoga una fecha de nuevo",
  footer: modalSetup.footer
}
let dateRangeModalSetup = {
  header: "Atención: Fecha fuera de rango",
  content: "Por favor, escoga una fecha en el rango (entre " + dateRange[0] + " y " + dateRange[1] + " años de edad).",
  action: "La fecha seleccionada debe estar entre el " + subtractYearsToDate(new Date(), dateRange[1]).toLocaleDateString('es-ES', dateOptions) + " y el " + subtractYearsToDate(new Date(), dateRange[0]).toLocaleDateString('es-ES', dateOptions) + ".",
  footer: modalSetup.footer
}
let fieldsOffModalSetup = {
  header: modalSetup.header,
  content: "Por favor, rellene correctamente los campos con mensajes en rojo.",
  action: "Existen campos erróneos o sin rellenar.",
  footer: modalSetup.footer
}



// global results
let _today = new Date();
let _age = {};
let _date = formForm.elements['birthday'].value;
let _gender = formForm.elements['gender'].value;
let _charge = formForm.elements['charge'].value;
let _formInputs = {};



function initBirthday() {

  let birthdayInput = formForm.elements['birthday'];
  birthdayInput.onblur = (e) => {
    _date = new Date(e.currentTarget.value);
    if (!dateIsHigher(_date)) {
      if (dateIsOnRange(dateRange, _date)) {
        _age = calculate_age(new Date(e.currentTarget.value));
        document.getElementById("birthday_msg").style.display = "none";
      } else {
        openModalWindow(e, dateRangeModalSetup);
        e.currentTarget.value = "";
        document.getElementById("birthday_msg").style.display = "block";
      }
    }
    else {
      openModalWindow(e, birthdayModalSetup);
      e.currentTarget.value = "";
      document.getElementById("birthday_msg").style.display = "block";
    }
    setSubmitButtonState();
  }
}


function initRadioButtons(name) {
  let input = formForm.elements[name];
  addEventListenerList(input, "change", (e) => {
    toggleMandatoryMsg(e);
    switch (name) {
      case 'gender':
        _gender = e.currentTarget.value; // male, female
        break;
      default:
        return "";
    }
    setSubmitButtonState();
  });
}


function getFormInputs() {
  return {
    today: _today,
    date: _date,
    age: _age,
    gender: _gender,
    charge: Number(_charge)
  }
}


function initForm() {
  initRadioButtons('gender');
  initBirthday();
}


function initSubmit() {

  // submit
  formForm.onsubmit = (e) => {
    e.preventDefault();

    checkNodeFields(formForm.elements['gender']);
    checkNodeFields(dateFields);


    if (fieldsOn()) {

      // vars from form
      _formInputs = getFormInputs();
      let x = 0;


      // OPEN results
      openModalResults(e, _formInputs);

    } else {

      openModalWindow(e, fieldsOffModalSetup)
      return false;
    }
  }
}



let init = () => {
  initForm();
  initModalWindow();
  initModalResults();
  initSubmit();
  //initReset();
  disableEnter();



};

init();





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

