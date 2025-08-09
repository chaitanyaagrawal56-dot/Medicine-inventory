const medicineList = document.getElementById('medicine-list');
const addBtn = document.getElementById('add-btn');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');
const form = document.getElementById('medicine-form');
const formTitle = document.getElementById('form-title');
const searchInput = document.getElementById('search');

const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const locationInput = document.getElementById('location');
const quantityInput = document.getElementById('quantity');
const expiryInput = document.getElementById('expiry');

let medicines = JSON.parse(localStorage.getItem('medicines')) || [];
let editingIndex = -1;

function saveMedicines() {
  localStorage.setItem('medicines', JSON.stringify(medicines));
}

function renderList(filter = '') {
  medicineList.innerHTML = '';
  const filtered = medicines.filter(med =>
    med.name.toLowerCase().includes(filter.toLowerCase()) ||
    med.category.toLowerCase().includes(filter.toLowerCase()) ||
    med.location.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    medicineList.innerHTML = `<li>No medicines found.</li>`;
    return;
  }

  filtered.forEach((med, i) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <div class="medicine-header">
        <div class="medicine-name">${med.name}</div>
        <div class="medicine-actions">
          <button aria-label="Edit" data-index="${i}">✏️</button>
          <button aria-label="Delete" data-index="${i}">🗑️</button>
        </div>
      </div>
      <div class="medicine-details">
        Category: ${med.category || '-'}<br/>
        Location: ${med.location || '-'}<br/>
        Quantity: ${med.quantity}<br/>
        Expiry: ${med.expiry || '-'}
      </div>
    `;

    medicineList.appendChild(li);
  });
}

function openModal(editIndex = -1) {
  editingIndex = editIndex;
  if (editIndex >= 0) {
    formTitle.textContent = 'Edit Medicine';
    const med = medicines[editIndex];
    nameInput.value = med.name;
    categoryInput.value = med.category;
    locationInput.value = med.location;
    quantityInput.value = med.quantity;
    expiryInput.value = med.expiry;
  } else {
    formTitle.textContent = 'Add Medicine';
    form.reset();
    quantityInput.value = 0;
  }
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  nameInput.focus();
}

function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}

addBtn.addEventListener('click', () => openModal());

overlay.addEventListener('click', closeModal);

form.addEventListener('submit', e => {
  e.preventDefault();

  const newMed = {
    name: nameInput.value.trim(),
    category: categoryInput.value.trim(),
    location: locationInput.value.trim(),
    quantity: Number(quantityInput.value),
    expiry: expiryInput.value,
  };

  if (!newMed.name) {
    alert('Name is required');
    return;
  }

  if (editingIndex >= 0) {
    medicines[editingIndex] = newMed;
  } else {
    medicines.push(newMed);
  }

  saveMedicines();
  renderList(searchInput.value);
  closeModal();
});

medicineList.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const index = Number(e.target.dataset.index);
    if (e.target.textContent === '✏️') {
      openModal(index);
    } else if (e.target.textContent === '🗑️') {
      if (confirm('Delete this medicine?')) {
        medicines.splice(index, 1);
        saveMedicines();
        renderList(searchInput.value);
      }
    }
  }
});

searchInput.addEventListener('input', e => {
  renderList(e.target.value);
});

// Initial render
renderList();
