const apiBase = 'http://localhost:3000';

async function fetchData(type) {
    const response = await fetch(`${apiBase}/${type}`);
    const data = await response.json();
    render(type, data);
}

function render(type, data) {
    const table = document.querySelector(`#${type}Table tbody`);
    table.innerHTML = '';
    data.forEach((animal) => {
        let row = table.insertRow();
        row.innerHTML = `
            <td class="${type === 'dogs' ? 'bold' : type === 'bigFish' ? 'bold-italic-blue' : ''}">${animal.name}</td>
            <td>${animal.size}</td>
            <td>${animal.location}</td>
            <td><img src="${animal.image}" alt="${animal.name}" /></td>
            <td>
                <button onclick="editAnimal('${type}', ${animal.id})" class="btn btn-warning">Edit</button>
                <button onclick="deleteAnimal('${type}', ${animal.id})" class="btn btn-danger">Delete</button>
            </td>
        `;
    });
}

async function deleteAnimal(type, id) {
    await fetch(`${apiBase}/${type}/${id}`, { method: 'DELETE' });
    fetchData(type);
}

function editAnimal(type, id) {
    fetch(`${apiBase}/${type}/${id}`)
        .then((response) => response.json())
        .then((animal) => {
            document.getElementById('name').value = animal.name;
            document.getElementById('size').value = animal.size;
            document.getElementById('location').value = animal.location;
            document.getElementById('image').value = animal.image;
            document.getElementById('animalModalLabel').textContent = 'Edit Animal';
            document.getElementById('animalForm').onsubmit = (e) => {
                e.preventDefault();
                updateAnimal(type, id);
            };
            $('#animalModal').modal('show');
        });
}

async function updateAnimal(type, id) {
    const name = document.getElementById('name').value;
    const size = document.getElementById('size').value;
    const location = document.getElementById('location').value;
    const image = document.getElementById('image').value || 'https://via.placeholder.com/50'; 
    const animals = await fetch(`${apiBase}/${type}`).then(res => res.json());
    if (animals.some(animal => animal.name.toLowerCase() === name.toLowerCase())) {
        alert('Animal with this name already exists!');
        return;
    }

    const updatedAnimal = { name, size, location, image };
    await fetch(`${apiBase}/${type}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedAnimal),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    fetchData(type);
    $('#animalModal').modal('hide');
}

function openAddAnimalModal(type) {
    document.getElementById('animalModalLabel').textContent = 'Add Animal';
    document.getElementById('animalForm').onsubmit = (e) => {
        e.preventDefault();
        addAnimal(type);
    };
    $('#animalModal').modal('show');
}

async function addAnimal(type) {
    const name = document.getElementById('name').value;
    const size = document.getElementById('size').value;
    const location = document.getElementById('location').value;
    const image = document.getElementById('image').value || 'https://via.placeholder.com/50'; 

    const animals = await fetch(`${apiBase}/${type}`).then(res => res.json());
    if (animals.some(animal => animal.name.toLowerCase() === name.toLowerCase())) {
        document.getElementById(`${type}Error`).textContent = 'Animal already exists!';
        return;
    } else {
        document.getElementById(`${type}Error`).textContent = '';
    }

    const newAnimal = { name, size, location, image };
    await fetch(`${apiBase}/${type}`, {
        method: 'POST',
        body: JSON.stringify(newAnimal),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    fetchData(type);
    $('#animalModal').modal('hide');
}

async function sortTable(type, key) {
    const response = await fetch(`${apiBase}/${type}`);
    let data = await response.json();
    data.sort((a, b) => a[key].localeCompare(b[key]));
    render(type, data);
}

fetchData('bigCats');
fetchData('dogs');
fetchData('bigFish');