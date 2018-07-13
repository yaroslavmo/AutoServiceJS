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
    document.getElementById("journal").addEventListener('click', (event) => {
        event.preventDefault();
        loadJournal()
            .then(renderJournal)
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


function updateServiceElement(serviceElement, service) {
    serviceElement.querySelector("#service-id").innerText = service.id;
    serviceElement.querySelector("#service-name").innerText = service.name;
    serviceElement.querySelector("#service-price").innerText = service.price;
    serviceElement.querySelector("#service-category").innerText = service.categoryName;
    serviceElement.querySelector("#service-category").addEventListener('click', (event) => {
        event.preventDefault();
        loadCategories()
            .then(renderCategories)
    });
    // category.then(category => {
    //     serviceElement.querySelector("#service-category").innerText = category.categoryName
    // });


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
    clientForm.querySelectorAll("input").forEach((input) => input.setAttribute('onblur', 'validateName(name)'));

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
        'categoryName': serviceForm.categoryName.value
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

function updateElement(id, formElement, url) {
    let serviceFormValues = {};
    let formInputs = formElement.querySelectorAll("input");
    formInputs.forEach((input) => {
        serviceFormValues[input.name] = input.value
    });

    return fetch(url + '/' + id, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceFormValues)
    }).then(r => r.json());
}

function renderEditForm(elementToRender, elementTable) {
    let id = elementToRender.querySelector('#service-id').innerText;
    let formCard = document.getElementById("form-card");
    let entityName = elementTable.querySelector("table").querySelector("thead").querySelectorAll("th")[1].innerText.split(' ')[0];
    let formName = formCard.querySelector("#form-name");
    let formInputs = formCard.querySelector("#form").querySelectorAll("input");
    let elementValues = elementToRender.querySelectorAll("td");
    let editForm = formCard.querySelector("form");

    formName.innerText = "Edit " + entityName + " No" + id;
    formInputs.forEach((input, i) => {
        input.value = elementValues[i].innerText
    });
    let submitButtton = formCard.querySelector("button").cloneNode(true);
    editForm.replaceChild(submitButtton, formCard.querySelector("button"));
    submitButtton.innerText = "Edit " + entityName;
    let cancelButton = submitButtton.cloneNode(true);
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener('click', (event) => {
        event.preventDefault();
        loadServices()
            .then(renderServices)
    });
    editForm.appendChild(cancelButton);


    submitButtton.addEventListener('click', (event) => {
        event.preventDefault();
        updateElement(id, editForm, servicesUrl)
            .then(loadServices)
            .then(renderServices);
    });
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
        // let category = loadServiceCategory(service.categoryId);
        updateServiceElement(serviceClone, service);

        let deleteButton = serviceClone.querySelector("#delete-service");
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteService(parseInt(serviceClone.querySelector('#service-id').innerText))
                .then(loadServices)
                .then(renderServices);
        });
        let editButton = serviceClone.querySelector("#edit-service");
        editButton.addEventListener('click', (event) => {
            event.preventDefault();
            renderEditForm(serviceClone, tableBlockClone);
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

    buttonClone.addEventListener('click', (event) => {
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
        if (service.categoryName === category.categoryName) {
            let serviceClone = serviceElement.cloneNode(true);

            serviceClone.querySelector("#service-id").innerText = service.id;
            serviceClone.querySelector("#service-name").innerText = service.name;
            serviceClone.querySelector("#service-price").innerText = service.price;
            serviceClone.querySelector("#service-category").innerHTML = '';
            serviceClone.querySelector("#delete-service").innerHTML = '';
            serviceTableBody.appendChild(serviceClone);
        }
    }
    tableBlockClone.style.backgroundcolor = "#bfbfbf";
    categoryElement.querySelector("#category-services-collapsed" + category.id).appendChild(tableBlockClone);


}

function loadCategoryServices() {
    return fetch(servicesUrl)
        .then(r => r.json());
}

function updateCategoryElement(categoryElement, category, discount) {
    categoryElement.querySelector("#category-id").innerText = category.id;
    categoryElement.querySelector("#category-name").innerText = category.categoryName;
    let services = loadCategoryServices();
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
        'categoryName': categoryForm.categoryName.value
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

//Journal

function renderBillServices(bill, billElement) {
    billElement.querySelector("#bill-services-collapsed" + bill.id).innerHTML = '';
    let template = document.getElementById('service-template');
    let serviceElement = template.content.querySelector('.service');
    let serviceTableTemplate = document.getElementById('services-table-template');
    let serviceTable = serviceTableTemplate.content.getElementById("services-table-block");
    let tableBlockClone = serviceTable.cloneNode(true);


    let serviceTableBody = tableBlockClone.querySelector('#table-services');
    for (let service of bill.services) {
        let serviceClone = serviceElement.cloneNode(true);
        serviceClone.querySelector("#service-id").innerText = service.serviceId;
        serviceClone.querySelector("#service-name").innerText = service.name;
        serviceClone.querySelector("#service-price").innerText = service.price;
        console.log(service);
        serviceClone.querySelector("#service-category").innerHTML = service.categoryName;
        // serviceClone.querySelector("#service-category").innerHTML = '';
        serviceClone.querySelector("#actions").innerHTML = '';
        serviceTableBody.appendChild(serviceClone);

    }
    tableBlockClone.style.backgroundcolor = "#bfbfbf";
    billElement.querySelector("#bill-services-collapsed" + bill.id).appendChild(tableBlockClone);


}

function loadClientByID(id) {
    return fetch(clientsUrl+ '/'+ id )
        .then((response) => {
            return response.json();
        });
}


function updateBillElement(billElement, bill) {
    billElement.querySelector("#bill-id").innerText = bill.id;

    loadClientByID(bill.billClientId).then(c => {
        billElement.querySelector("#bill-client-name").innerText = c.firstName+ ' ' + c.lastName
    });
        billElement.querySelector("#bill-services").querySelector(".btn")
            .addEventListener('click', (event) => {
                event.preventDefault();
                renderBillServices(bill, billElement);
            });

    billElement.querySelector("#bill-total").innerText = bill.total;

}

function createBill(billForm) {
    let billFormValues = {
        'billClientId': parseInt(billForm.billClientId.value),  //!!!!!!!!!!!!!!!! console
        'total': parseInt(billForm.total.value)
    };
    return fetch(journalUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(billFormValues)
    }).then(r => r.json());
}

function deleteBill(id) {
    return fetch(journalUrl + '/' + id, {
        method: 'DELETE',
    }).then(r => r.json());
}

function loadJournal() {
    return fetch(journalUrl)
        .then(r => r.json());
}

function renderJournalTable(bills, content) {
    let template = document.getElementById('bill-template');
    let billElement = template.content.querySelector('.bill');
    let billTableTemplate = document.getElementById('journal-table-template');
    let billTable = billTableTemplate.content.getElementById("journal-table-block");

    let tableBlockClone = billTable.cloneNode(true);

    let billTableBody = tableBlockClone.querySelector('#table-bills');

    for (let bill of bills) {
        let billClone = billElement.cloneNode(true);

        billClone.querySelector("#bill-services").querySelector(".btn")
            .setAttribute("data-target", "#bill-services-collapsed" + bill.id);
        billClone.querySelector("#bill-services-collapsed")
            .setAttribute("id", "bill-services-collapsed" + bill.id);
        updateBillElement(billClone, bill);

        let deleteButton = billClone.querySelector("#delete-bill");
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteBill(parseInt(billClone.querySelector('#bill-id').innerText))
                .then(loadJournal)
                .then(renderJournal);
        });
        billTableBody.appendChild(billClone);
    }
    content.appendChild(tableBlockClone);
}


function renderAddBillForm(bills, content) {
    let formTemplate = document.getElementById('form-template');

    let formCard = formTemplate.content.querySelector(".card");
    let formCardClone = formCard.cloneNode(true);
    let billForm = createForm(formCardClone.querySelector("form"), bills[0]);

    let button = document.getElementById("input&buttom").content.querySelector("button");
    let buttonClone = button.cloneNode(true);
    buttonClone.innerText = 'Add bill';
    billForm.appendChild(buttonClone);
    formCardClone.querySelector('#form-name').innerText = 'Add bill';
    formCardClone.querySelector(".card-body").appendChild(billForm);
    content.appendChild(formCardClone);

    billForm.addEventListener('submit', (event) => {
        event.preventDefault();
        createBill(billForm)
            .then(loadJournal)
            .then(renderJournal);
    });
}

function renderJournal(bills) {
    let content = document.getElementById("content");
    content.innerHTML = '';
    renderJournalTable(bills, content);
    renderAddBillForm(bills, content);
}

function validateName(id){
    var re = /[A-Za-z-‘]$/;
    if(re.test(document.getElementById(id).value)){
        document.getElementById(id).style.background ='#ccffcc';
        return true;
    }else{
        document.getElementById(id).style.background ='#e35152';
        return false;
    }
}

