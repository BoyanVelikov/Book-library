let baseUrl = 'http://localhost:3030/jsonstore/collections/books/';

let bodyTag = document.getElementsByTagName('body')[0];
let loadBooksButton = document.getElementById('loadBooks');
loadBooksButton.addEventListener('click', load);
let form = document.getElementsByTagName('form')[0];


function load() {
    let tableBody = document.getElementsByTagName('tbody')[0];
    let arr = [];
    for (i = 0; i < tableBody.children.length; i++) {
        arr.push(tableBody.children[i]);
    };
    for (each of arr) {
        each.remove();
    }

    fetch(baseUrl)
        .then((res) => res.json())
        .then((data) => {
            for (i = 0; i < Object.entries(data).length; i++) {

                let newRow = document.createElement('tr');
                let newCellAuthor = document.createElement('td');
                let newCellTitle = document.createElement('td');
                newCellAuthor.textContent = Object.entries(data)[i][1].author;
                newCellTitle.textContent = Object.entries(data)[i][1].title;
                let newButtons = document.createElement('td');
                let newButtonEdit = document.createElement('button');
                let newButtonDelete = document.createElement('button');
                newButtonEdit.textContent = 'Edit';
                newButtonDelete.textContent = 'Delete';
                newButtons.appendChild(newButtonEdit);
                newButtons.appendChild(newButtonDelete);
                newRow.appendChild(newCellTitle);
                newRow.appendChild(newCellAuthor);
                newRow.appendChild(newButtons);
                newRow.setAttribute('id', Object.entries(data)[i][0]);
                tableBody.appendChild(newRow);

                let allButtons = [...document.getElementsByTagName('button')];
                for (each of allButtons) {
                    if (each.textContent == 'Edit') {
                        each.addEventListener('click', editBook);
                    } else if (each.textContent == 'Delete') {
                        each.addEventListener('click', deleteBook);
                    }
                }
            }
        });
}

let x = document.querySelectorAll('button');
let submitButton = x[x.length - 1];
submitButton.addEventListener('click', submitBook);



function submitBook(e) {

    e.preventDefault();
    let inputTitle = document.querySelector('[name="title"]');
    let inputAuthor = document.querySelector('[name="author"]');

    if (inputTitle.value == '') {
        throw new Error('The Title field must be filled!');
    } else if (inputAuthor.value == '') {
        throw new Error('The Author field must be filled!');
    } else {

        let newData = {
            author: inputAuthor.value,
            title: inputTitle.value
        };

        fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        });

        let tableBody = document.getElementsByTagName('tbody')[0];
        let newRow = document.createElement('tr');
        let newCellAuthor = document.createElement('td');
        let newCellTitle = document.createElement('td');
        newCellAuthor.textContent = inputAuthor.value;
        newCellTitle.textContent = inputTitle.value;
        let newButtons = document.createElement('td');
        let newButtonEdit = document.createElement('button');
        let newButtonDelete = document.createElement('button');
        newButtonEdit.textContent = 'Edit';
        newButtonDelete.textContent = 'Delete';
        newButtons.appendChild(newButtonEdit);
        newButtons.appendChild(newButtonDelete);
        newRow.appendChild(newCellTitle);
        newRow.appendChild(newCellAuthor);
        newRow.appendChild(newButtons);
        tableBody.appendChild(newRow);
        inputAuthor.value = '';
        inputTitle.value = '';

        let allButtons = [...document.getElementsByTagName('button')];
        for (each of allButtons) {
            if (each.textContent == 'Edit') {
                each.addEventListener('click', editBook);
            } else if (each.textContent == 'Delete') {
                each.addEventListener('click', deleteBook);
            }
        }
    }
}


function editBook(e) {
    let editForm = form.cloneNode(true);
    editForm.children[0].textContent = 'EditFORM';
    editForm.children[5].textContent = 'Save';
    editForm.children[5].addEventListener('click', saveEdit);
    form.remove();
    bodyTag.appendChild(editForm);
    let rowToEdit = e.target.parentNode.parentNode;
    let idEdit = rowToEdit.getAttribute('id');

    let inputEditTitle = document.querySelector('[name="title"]');
    let inputEditAuthor = document.querySelector('[name="author"]');
    inputEditTitle.value = rowToEdit.children[0].textContent;
    inputEditAuthor.value = rowToEdit.children[1].textContent;

    function saveEdit(e) {
        e.preventDefault();

        let editData = {
            author: inputEditAuthor.value,
            title: inputEditTitle.value
        };


        fetch((baseUrl + idEdit), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editData)
        });
        rowToEdit.children[0].textContent = inputEditTitle.value;
        rowToEdit.children[1].textContent = inputEditAuthor.value;
        editForm.remove();
        bodyTag.appendChild(form);
    }
}

function deleteBook(e) {

    let rowToDelete = e.target.parentNode.parentNode;

    fetch(baseUrl + rowToDelete.getAttribute('id'), {
        method: 'DELETE'
    });

    rowToDelete.remove();
}