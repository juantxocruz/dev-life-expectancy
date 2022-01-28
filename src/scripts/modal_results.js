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
let result_charge_table = self.getElementById('result_charge_table');

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


function drawTable(_expectancy) {

    let table = '';
    table += '<table class="table charge-table" style="width:100%">';
    table += '<thead>';
    table += '<tr><th></th>';
    table += '<th>PASEMF</th>';
    table += '<th>GKM95<br></th>';
    table += '</tr>';
    table += '</thead>';
    table += '<tbody>';
    table += '</tr>';
    table += '<td>' + 'Normal' + '</td>';
    table += ' <td>' + _expectancy.gk80.expectancy + ' años</td>';
    table += ' <td>' + _expectancy.gk95.expectancy + ' años</td>';
    table += '</tr>';

    if (_expectancy.gk80.charge > 0 || _expectancy.gk95.charge > 0) {
        table += '</tr>';
        table += ' <td>' + 'Agravado' + '</td>';
        table += ' <td class="red" style="font-weight:700">' + _expectancy.gk80.expectancyWithCharge + ' años</td>';
        table += ' <td class="red" style="font-weight:700">' + _expectancy.gk95.expectancyWithCharge + ' años</td>';
        table += '</tr>';
    }
    table += '</tbody>';
    table += '</table>';

    return table;


}

export function openModalResults(event, _vars, _expectancy) {
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
    let table = drawTable(_expectancy);



    let constitution = gender + ' | ' + date + ' | ' + age + ' (real) | ' + actuarial + ' (actuarial) ';


    // print
    result_today.innerHTML = today;
    result_year.innerHTML = year;
    result_vars_constitution.innerHTML = constitution;
    result_vars_charge.innerHTML = charge;
    result_charge_table.innerHTML = table;




    modal_result.style.display = "block";
}
