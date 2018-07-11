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
    document.getElementById("categories").addEventListener('click', (event) => {
        event.preventDefault();
        loadCategories()
            .then(renderCategories)
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


function updateServiceElement(serviceElement, service, category) {
    serviceElement.querySelector("#service-id").innerText = service.id;
    serviceElement.querySelector("#service-name").innerText = service.name;
    serviceElement.querySelector("#service-price").innerText = service.price;
    category.then(category => {
        serviceElement.querySelector("#service-category").innerText = category.categoryName
    });

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
function loadServiceCategory(id) {
    return fetch(categoriesUrl + '/' + id)
        .then(r => r.json());
}


function createService(serviceForm) {
    let serviceFormValues = {
        'name': serviceForm.name.value,
        'price': serviceForm.price.value,
        'categoryId': serviceForm.categoryId.value
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
        let category = loadServiceCategory(service.categoryId);
        updateServiceElement(serviceClone, service, category);

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

//Category

function renderCategoryServices(category, services, categoryElement) {
    categoryElement.querySelector("#category-services-collapsed" + category.id).innerHTML = '';
    let template = document.getElementById('service-template');
    let serviceElement = template.content.querySelector('.service');
    let serviceTableTemplate = document.getElementById('services-table-template');
    let serviceTable = serviceTableTemplate.content.getElementById("services-table-block");
    let tableBlockClone = serviceTable.cloneNode(true);
    tableBlockClone.querySelector(".table").querySelector("thead").querySelectorAll("th")[3].innerHTML = '';


    let serviceTableBody = tableBlockClone.querySelector('#table-services');

    for (let service of services) {
        let serviceClone = serviceElement.cloneNode(true);

        serviceClone.querySelector("#service-id").innerText = service.id;
        serviceClone.querySelector("#service-name").innerText = service.name;
        serviceClone.querySelector("#service-price").innerText = service.price;
        serviceClone.querySelector("#service-category").innerHTML = '';
        serviceClone.querySelector("#delete-service").innerHTML = '';
        serviceTableBody.appendChild(serviceClone);
    }
    tableBlockClone.style.backgroundcolor = "#bfbfbf";
    categoryElement.querySelector("#category-services-collapsed" + category.id).appendChild(tableBlockClone);


}

function loadCategoryServices(id) {
    return fetch(servicesUrl + '?categoryId' + '=' + id)
        .then(r => r.json());
}

function updateCategoryElement(categoryElement, category, discount) {
    categoryElement.querySelector("#category-id").innerText = category.id;
    categoryElement.querySelector("#category-name").innerText = category.categoryName;
    let services = loadCategoryServices(category.id);
    services.then(services => {
        categoryElement.querySelector("#category-services").querySelector(".btn")
            .addEventListener('click', (event) => {
                event.preventDefault();
                renderCategoryServices(category, services, categoryElement);
            });
    });
    if (discount) {
        discount.then(discount => {
            categoryElement.querySelector("#category-discount").innerText = discount.name
        });
    }
}

function createCategory(categoryForm) {
    let categoryFormValues = {
        'name': categoryForm.name.value,
        'price': categoryForm.price.value,
        'categoryId': categoryForm.categoryId.value
    };
    return fetch(categoriesUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryFormValues)
    }).then(r => r.json());
}

function deleteCategory(id) {
    return fetch(categoriesUrl + '/' + id, {
        method: 'DELETE',
    }).then(r => r.json());
}

function loadCategories() {
    return fetch(categoriesUrl)
        .then(r => r.json());
}

function renderCategoryTable(categories, content) {
    let template = document.getElementById('category-template');
    let categoryElement = template.content.querySelector('.category');
    let categoryTableTemplate = document.getElementById('categories-table-template');
    let categoryTable = categoryTableTemplate.content.getElementById("categories-table-block");
    let tableBlockClone = categoryTable.cloneNode(true);
    let categoryTableBody = tableBlockClone.querySelector('#table-categories');

    for (let category of categories) {
        let categoryClone = categoryElement.cloneNode(true);
        categoryClone.querySelector("#category-services").querySelector(".btn")
            .setAttribute("data-target", "#category-services-collapsed" + category.id);
        categoryClone.querySelector("#category-services-collapsed")
            .setAttribute("id", "category-services-collapsed" + category.id);
        updateCategoryElement(categoryClone, category);

        let deleteButton = categoryClone.querySelector("#delete-category");
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteCategory(parseInt(categoryClone.querySelector('#category-id').innerText))
                .then(loadCategories)
                .then(renderCategories);
        });
        categoryTableBody.appendChild(categoryClone);
    }
    content.appendChild(tableBlockClone);
}


function renderAddCategoryForm(categories, content) {
    let formTemplate = document.getElementById('form-template');

    let formCard = formTemplate.content.querySelector(".card");
    let formCardClone = formCard.cloneNode(true);
    let categoryForm = createForm(formCardClone.querySelector("form"), categories[0]);

    let button = document.getElementById("input&buttom").content.querySelector("button");
    let buttonClone = button.cloneNode(true);
    buttonClone.innerText = 'Add category';
    categoryForm.appendChild(buttonClone);
    formCardClone.querySelector('#form-name').innerText = 'Add category';
    formCardClone.querySelector(".card-body").appendChild(categoryForm);
    content.appendChild(formCardClone);

    categoryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        createCategory(categoryForm)
            .then(loadCategories)
            .then(renderCategories);
    });
}

function renderCategories(categories) {
    let content = document.getElementById("content");
    content.innerHTML = '';
    renderCategoryTable(categories, content);
    renderAddCategoryForm(categories, content);
}

