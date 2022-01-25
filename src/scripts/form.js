

export function addEventListenerList(nodelist, event, fn) {
    let e = event || window.event;
    for (var i = 0, len = nodelist.length; i < len; i++) {
        nodelist[i].addEventListener(e, fn, false);
    }
}



export function setSubmitButtonState() {
    let button = document.getElementById('submit_button');
    if (fieldsOn()) {
        return button.classList.add("fieldsOn");
    }
    else {
        return button.classList.remove("fieldsOn");
    }
}


export function radioButtonOn(list) {
    let wrongFields = [];
    list.forEach((l) => {
        let fields = document.getElementsByName(l);
        let wrongTemp = [];
        fields.forEach((f) => {
            if (f.checked === false) {
                wrongTemp.push(f);
            }
        })
        if (wrongTemp.length === fields.length) { wrongFields.push(fields) };
    })
    return wrongFields.length > 0 ? false : true;
}


// CHECK ALL FIELDS FUNCTIONS
export function fieldsOn() {
    let formForm = document.forms["vidanr_form"];
    let nodeList = formForm.querySelectorAll('input[type="number"], input[type="date"], input[type="checkbox"], input[type="radio"]');
    let wrongFields = [];
    let i = 0;
    for (i = 0; i < nodeList.length; i++) {
        if (nodeList[i].type === "checkbox" && nodeList[i].checked) {
            wrongFields.push(nodeList[i]);
        }
        if ((nodeList[i].type === "date" || nodeList[i].type === "number") && nodeList[i].value === "") {
            wrongFields.push(nodeList[i]);
        }

    }


    if (!radioButtonOn(["gender"])) {
        wrongFields.push({});
    }

    return wrongFields.length > 0 ? false : true;
}


export function resetNodeFields(nodeList) {

    let i = 0;
    if (nodeList && nodeList.length > 0) {
        for (i = 0; i < nodeList.length; i++) {
            document.getElementById(nodeList[i].name + "_msg").style.display = "none";
        }

    }
}

export function resetInnerHtml(elId) {
    document.getElementById(elId).innerHTML = '';
}


export function checkNodeFields(nodeList) {
    let i = 0;
    for (i = 0; i < nodeList.length; i++) {
        if (nodeList[i].type === "checkbox" && nodeList[i].checked) {
            document.getElementById(nodeList[i].name + "_msg").style.display = "block";
        }

        if (nodeList[i].type === "radio" && nodeList.value === "") {
            document.getElementById(nodeList[i].name + "_msg").style.display = "block";
        }

        if ((nodeList[i].type === "date" || nodeList[i].type === "number") && nodeList[i].value === "") {
            document.getElementById(nodeList[i].name + "_msg").style.display = "block";
        }
    }
}


export function toggleMandatoryMsg(e) {


    if ((e.currentTarget.type === 'date' || e.currentTarget.type === "number" || e.currentTarget.type === 'radio') && e.currentTarget.value !== "") {
        document.getElementById(e.currentTarget.name + "_msg").style.display = "none";
        return false;
    }

    if (e.currentTarget.type === 'checkbox' && !e.currentTarget.checked) {
        let boxes = document.getElementsByName(e.currentTarget.name);
        let checked = Array.prototype.slice.call(boxes).filter(d => d.checked);
        if (checked.length < 1) {
            document.getElementById(e.currentTarget.name + "_msg").style.display = "none";
            return false;
        }
    }
    document.getElementById(e.currentTarget.name + "_msg").style.display = "block";
    return false;
}


export function disableEnter() {

    vidanr_cal.addEventListener('keydown', (e) => {
        if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13 || e.code == 'Enter' || e.which == 13) {
            if (e.target.nodeName == 'INPUT') {
                e.preventDefault();
                let form = e.target.form;
                let index = Array.prototype.indexOf.call(form, e.target);
                if (index < 37) {
                    form.elements[index + 1].focus();
                }
                return false;
            }
        }
    },
        true);
}





