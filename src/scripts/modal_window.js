let modalDiv = document.getElementById("modal_window");
let today = new Date();
let year = today.getFullYear();
let close_modal_span = document.getElementById("close_modal_info");
let modal_header_span = document.getElementById("modal_header_span");
let modal_body1_span = document.getElementById("modal_body1_span");
let modal_body2_span = document.getElementById("modal_body2_span");
let modal_footer_span = document.getElementById("modal_footer_span");



export let modalSetup = {
    header: "Atención:",
    content: "",
    action: "",
    footer: " © NacionalRe. Todos los derechos reservados."
}


// MODAL WINDOW
export function initModalWindow() {


    close_modal_span.onclick = function () {
        modalDiv.style.display = "none";
    }
}
// MODAL WINDOW FUNC
function drawModalWindowInnerHTML(message) {
    modal_header_span.innerHTML = message.header;
    modal_body1_span.innerHTML = message.action;
    modal_body2_span.innerHTML = message.content;
    modal_footer_span.innerHTML = year + message.footer;
    modalDiv.style.display = "block";
}

export function openModalWindow(event, message) {
    //event.stopPropagation();
    if (event && event.currentTarget && event.currentTarget.name === 'cbox') {
        if (event.currentTarget.checked) {
            let pathology = event.currentTarget.nextSibling.data;
            message['action'] = pathology + "."
            drawModalWindowInnerHTML(message);

        }
        return;
    }
    drawModalWindowInnerHTML(message);
    return;
};

