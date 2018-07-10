const clientsUrl = 'http://localhost:3000/clients';
const servicesUrl = 'http://localhost:3000/services';
const journalUrl = 'http://localhost:3000/journal';
const categoriesUrl = 'http://localhost:3000/categories';


function init() {
    document.getElementById("clients").addEventListener('click', (event) => {
        event.preventDefault();
        loadClients()
            .then(renderClients)
    });
    document.getElementById("services").addEventListener('click', (event) => {
        event.preventDefault();
        loadServices()
            .then(renderServices)
    });

}

window.onload = init;


function createClient(clientForm) {
    let clientFormValues = {
        'firstName': clientForm.firstName.value,
        'lastName': clientForm.lastName.value
    };
    return fetch(clientsUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientFormValues)

    }).then(r => r.json());
}

function deleteClient(id) {
    return fetch(clientsUrl + '/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(r => r.json());


}

function loadClients() {
    return fetch(clientsUrl)
        .then(r => r.json());
}

function updateCategoryElement(categoryElement, category) {
    categoryElement.querySelector("#category-id").innerText = category.categoryId;
    categoryElement.querySelector("#category-name").innerText = category.categoryName;
    //categoryElement.querySelector("#categoryServices")= category.categoryServices;
}

function checkCategory(id) {
    let categoryPromise = fetch(categoriesUrl)
        .then(r => r.json())
        .then(function (categories) {
            for (let category of categories) {
                if (category.categoryId == id) {
                    return category.categoryName;
                }
            }
        });

}

function updateServiceElement(serviceElement, service) {
    serviceElement.querySelector("#service-id").innerText = service.serviceId;
    serviceElement.querySelector("#service-name").innerText = service.name;
    serviceElement.querySelector("#service-price").innerText = service.price;
    serviceElement.querySelector("#service-category").innerText = checkCategory(service.categoryId);
}

function updateClientElement(clientElement, client) {
    clientElement.querySelector("#client-id").innerText = client.id;
    clientElement.querySelector("#client-name").innerText = client.firstName;
    clientElement.querySelector("#client-last-name").innerText = client.lastName;
}

function createForm(formElement, object) {
    let inputTemplate = document.getElementById("input&buttom");
    let input = inputTemplate.content.querySelector("input");
    for (let element of Object.keys(object)) {
        let inputClone = input.cloneNode(true);
        if (element !== "id") {
            inputClone.name = element.toString();
            inputClone.placeholder = element.toString();
            formElement.appendChild(inputClone);
        }
    }
    return formElement;
}

//CLIENT

function renderClientTable(clients, content) {
    let template = document.getElementById('client-template');
    let clientElement = template.content.querySelector('.client');
    let clientTableTemplate = document.getElementById('clients-table-template');
    let clientTable = clientTableTemplate.content.getElementById("clients-table-block");
    let tableBlockClone = clientTable.cloneNode(true);
    let clientTableBody = tableBlockClone.querySelector('#table-clients');

    for (let client of clients) {
        let clientClone = clientElement.cloneNode(true);
        updateClientElement(clientClone, client);

        let deleteButton = clientClone.querySelector("#delete-client");
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteClient(parseInt(clientClone.querySelector('#client-id').innerText))
                .then(loadClients)
                .then(renderClients);
        });
        clientTableBody.appendChild(clientClone);
    }
    content.appendChild(tableBlockClone);
}

function renderAddClientForm(clients, content) {
    let formTemplate = document.getElementById('form-template');

    let formCard = formTemplate.content.querySelector(".card");
    let formCardClone = formCard.cloneNode(true);
    let clientForm = createForm(formCardClone.querySelector("form"), clients[0]);

    let button = document.getElementById("input&buttom").content.querySelector("button");
    let buttonClone = button.cloneNode(true);
    buttonClone.innerText = 'Add Client';
    clientForm.appendChild(buttonClone);
    formCardClone.querySelector('#form-name').innerText = 'Add client';
    formCardClone.querySelector(".card-body").appendChild(clientForm);
    content.appendChild(formCardClone);

    clientForm.addEventListener('submit', (event) => {
        event.preventDefault();
        createClient(clientForm)
            .then(loadClients)
            .then(renderClients);
    });
}

function renderClients(clients) {
    let content = document.getElementById("content");
    content.innerHTML = '';
    renderClientTable(clients, content);
    renderAddClientForm(clients, content);
}

//Service
function createService(serviceForm) {
    let serviceFormValues = {
        'name': serviceForm.name.value,
        'price': serviceForm.price.value,
        'category': serviceForm.category.value
    };
    return fetch(servicesUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceFormValues)
    }).then(r => r.json());
}

function deleteService(id) {
    return fetch(servicesUrl + '/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(r => r.json());


}

function loadServices() {
    return fetch(servicesUrl)
        .then(r => r.json());
}

function renderServiceTable(services, content) {
    let template = document.getElementById('service-template');
    let serviceElement = template.content.querySelector('.service');
    let serviceTableTemplate = document.getElementById('services-table-template');
    let serviceTable = serviceTableTemplate.content.getElementById("services-table-block");
    let tableBlockClone = serviceTable.cloneNode(true);
    let serviceTableBody = tableBlockClone.querySelector('#table-services');

    for (let service of services) {
        let serviceClone = serviceElement.cloneNode(true);
        updateServiceElement(serviceClone, service);

        let deleteButton = serviceClone.querySelector("#delete-service");
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteService(parseInt(serviceClone.querySelector('#service-id').innerText))
                .then(loadServices)
                .then(renderServices);
        });
        serviceTableBody.appendChild(serviceClone);
    }
    content.appendChild(tableBlockClone);
}

function renderAddServiceForm(services, content) {
    let formTemplate = document.getElementById('form-template');

    let formCard = formTemplate.content.querySelector(".card");
    let formCardClone = formCard.cloneNode(true);
    let serviceForm = createForm(formCardClone.querySelector("form"), services[0]);

    let button = document.getElementById("input&buttom").content.querySelector("button");
    let buttonClone = button.cloneNode(true);
    buttonClone.innerText = 'Add service';
    serviceForm.appendChild(buttonClone);
    formCardClone.querySelector('#form-name').innerText = 'Add service';
    formCardClone.querySelector(".card-body").appendChild(serviceForm);
    content.appendChild(formCardClone);

    serviceForm.addEventListener('submit', (event) => {
        event.preventDefault();
        createService(serviceForm)
            .then(loadServices)
            .then(renderServices);
    });
}

function renderServices(services) {
    let content = document.getElementById("content");
    content.innerHTML = '';
    renderServiceTable(services, content);
    renderAddServiceForm(services, content);
}
