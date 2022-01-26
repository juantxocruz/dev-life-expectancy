let self = document;


let dictionary = [{ "key": "date", "value": "fecha" },
{ "key": "age", "value": "edad" },
{ "key": "gender", "value": "género" },
{ "key": "male", "value": "Hombre" },
{ "key": "female", "value": "Mujer" }
];


let result_today = self.getElementById('result_today');
let result_year = self.getElementById('result_year');
let result_vars_constitution = self.getElementById('result_vars_constitution');
let result_vars_charge = self.getElementById('result_vars_charge');

// functions
// MODAL WINDOW
export function initModalResults() {
    let modal_result = self.getElementById("modal_result");
    let close_modal_result = self.getElementById("close_modal_result");

    close_modal_result.onclick = function () {
        modal_result.style.display = "none";
    }
}


function getDictionaryWord(key) {
    return dictionary.filter(d => d.key === key);
}


export function openModalResults(event, _vars) {
    event.stopPropagation();

    // vars
    let newDate = new Date(_vars.today);
    let year = newDate.getFullYear();
    let today = newDate.getDate() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear() + ' a las ' + (newDate.getUTCHours() + 1) + ':' + newDate.getUTCMinutes() + 'h.';
    let gender = getDictionaryWord(_vars.gender)[0].value;
    let bornDate = new Date(_vars.date);
    let date = bornDate.getDate() + '/' + (bornDate.getMonth() + 1) + '/' + bornDate.getFullYear() + '';
    let age = _vars.age.regular + ' años';
    let actuarial = _vars.age.actuarial + ' años';
    let charge = _vars.charge + '%';



    let constitution = gender + ' | ' + date + ' | ' + age + ' (real) | ' + actuarial + ' (actuarial) ';


    // print
    result_today.innerHTML = today;
    result_year.innerHTML = year;
    result_vars_constitution.innerHTML = constitution;
    result_vars_charge.innerHTML = "Recargo del seguro de vida --> " + charge;


    modal_result.style.display = "block";
}
