const clientsUrl = 'http://localhost:3000/clients';
const servicesUrl = 'http://localhost:3000/services';
const journalUrl = 'http://localhost:3000/journal';
const categoriesUrl = 'http://localhost:3000/categories';


function init() {
    console.log(document.getElementById("input"));
    document.getElementById("clients").addEventListener('click', (event) => {
        event.preventDefault();
        loadClients()
            .then(clients => renderClients(clients))//, template, clientTableTemplate, formTemplate));
    });

//categories

    //services
    //journal
    //
}

window.onload = init;


function createClient() {
    let clientFormValues = {
        'name': clientForm.firstName.value,
        'lastName': clientForm.lastName.value
    };
    return fetch(clientsUr, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientFormValues)

    })
        .then(r => r.json())
}

function loadClients() {
    return fetch(clientsUrl)
        .then(r => r.json());
}

function updateClientElement(clientElement, client) {
    clientElement.querySelector("#clientId").innerText = client.id;
    clientElement.querySelector("#clientName").innerText = client.firstName;
    clientElement.querySelector("#clientLastName").innerText = client.lastName;
}

function createForm(formElement, object) {
    let inputTemplate = document.getElementById("input");
    let input = inputTemplate.content.querySelector("input");
    let button = inputTemplate.content.querySelector("button");
    let buttonClone = button.cloneNode(true);
    for (let element of Object.keys(object)) {
        let inputClone = input.cloneNode(true);
        console.log(element)
        if (element !== "id") {
            inputClone.name = element.toString();
            inputClone.placeholder = element.toString();
            formElement.appendChild(inputClone);
        }
        formElement.appendChild(buttonClone.innerText = )
    }
    return formElement;

}

function renderClients(clients) {
    let content = document.getElementById("content");
    let template = document.getElementById('client-template');
    let clientElement = template.content.getElementById('client');
    let clientTableTemplate = document.getElementById('clients-table-template');
    let clientTable = clientTableTemplate.content.getElementById("table-block");
    let tableBlockClone = clientTable.cloneNode(true);
    let clientTableBody = tableBlockClone.querySelector('#table-clients');

    content.innerHTML = '';
    for (let client of clients) {
        let clientClone = clientElement.cloneNode(true);
        updateClientElement(clientClone, client);
        clientTableBody.appendChild(clientClone);
    }
    content.appendChild(tableBlockClone);


    let formTemplate = document.getElementById('form-template');

    let formCard = formTemplate.content.querySelector(".card");
    let formCardClone = formCard.cloneNode(true);
    let clientForm = createForm(formCardClone.querySelector("form"), clients[0]);
    console.log(formCardClone)
    console.log(clientForm)

    formCardClone.querySelector(".card-body").appendChild(clientForm);
    content.appendChild(formCardClone);

    clientForm.addEventListener('submit', (event) => {
        event.preventDefault();
        createClient()
            .then(loadClients)
            .then(renderClients);
    });
}

//export {renderClients, updateClientElement, loadClients, createClient};