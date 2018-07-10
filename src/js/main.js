const clientsUrl = 'http://localhost:3000/clients'
var clientForm;

function init() {
    let content = document.getElementById("content");
    loadClients()
        .then(renderClients(content));

    formTemplate = document.getElementById('form-template');
formTemplate.getElementBy()



    content.appendChild(form)
    clientForm.addEventListener('submit', (event) => {
        event.preventDefault();
        createClient()
            .then(loadClients)
            .then(renderClients);
    });
};
window.onload = init;

function createClient() {
    let clientFormValues = {
        'name': studentForm.name.value,
        'lastName': studentForm.mark.value
    }
    return fetch(clientsUrlUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentFormValues)

    })
        .then(r => r.json())
};

function loadClients() {
    return fetch(clientsUrl)
        .then(r => r.json());
};

function updateClientElement(clientElement, client) {
    clientElement.getElementById("clientId").innerHTML = client.id;
    clientElement.getElementById("clientName").innerHTML = client.firstName;
    clientElement.getElementById("clientLastName").innerHTML = client.lastName;
};

function renderClients(clients,content) {
    console.log(clients);
    let template = document.getElementById('client-template');
    let clientElement = template.getElementById('client');
    let clientTableTemplate = document.getElementById('clients-table-template');
    let clientsList = clientTableTemplate.getElementById('clients');

    clientsList.innerHTML = '';
    for (let client of clients) {
        let clientClone = clientElement.cloneNode(true);
        updateClientElement(clientClone, client);
        clientsList.appendChild(clientClone);
    }
    content.appendChild(clientTableTemplate);
}