import '../styles/index.scss';

import { onClick } from './starter.service';
import { modalSetup, openModalWindow, initModalWindow } from './modal_window';
import { dateRange, dateOptions, calculate_age, dateIsHigher, subtractYearsToDate, dateIsOnRange } from './date'
import { addEventListenerList, setSubmitButtonState, radioButtonOn, fieldsOn, resetNodeFields, resetInnerHtml, checkNodeFields, toggleMandatoryMsg, disableEnter } from './form';
import { openModalResults, initModalResults } from './modal_results';
import { calculateLifeExpectancy } from './lifeExpectancyCalc';
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

function initSelect(name) {
  let select = formForm.elements[name];
  select.addEventListener("change", (e) => {
    if (select.value) {
      _charge = select.value;
    }
  });
  return false;

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
  initSelect('charge')
}


function initSubmit() {
  let _formInputs = {};
  let _lifeExpectancy = {};

  // submit
  formForm.onsubmit = (e) => {
    e.preventDefault();

    checkNodeFields(formForm.elements['gender']);
    checkNodeFields(dateFields);


    if (fieldsOn()) {
      // vars from form
      _formInputs = getFormInputs();
      _lifeExpectancy = calculateLifeExpectancy(_formInputs);
      // OPEN results
      openModalResults(e, _formInputs, _lifeExpectancy);

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




