const form = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const stats = document.getElementById('stats');
const clearAllBtn = document.getElementById('clearAll');
const modal = document.getElementById('modalConfirm');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const searchContainer = document.getElementById('searchContainer');
const searchInput = document.getElementById('searchInput');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let taskToDelete = null;

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  stats.textContent = `Total: ${total} | Completadas: ${completed} | Pendientes: ${pending}`;
}

function renderTasks(filter = "") {
  tasksList.innerHTML = '';

  let filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(filter.toLowerCase()) ||
    task.description.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredTasks.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.classList.add('empty');
    emptyMsg.textContent = 'No hay tareas registradas.';
    tasksList.appendChild(emptyMsg);
    renderStats();
    return;
  }

  filteredTasks.forEach((task, index) => {
    const div = document.createElement('div');
    div.classList.add('task');

    const title = document.createElement('h3');
    title.textContent = task.title;

    const desc = document.createElement('p');
    desc.textContent = task.description;

    const date = document.createElement('p');
    date.innerHTML = `<strong>Fecha límite:</strong> ${task.date || 'Sin fecha'}`;

    const status = document.createElement('p');
    status.innerHTML = `<strong>Estado:</strong> ${task.completed ? '✅ Completada' : '⏳ Pendiente'}`;

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('buttons');

    const btnToggle = document.createElement('button');
    btnToggle.textContent = task.completed ? 'Marcar pendiente' : 'Marcar completada';
    btnToggle.onclick = () => toggleTask(index);

    const btnEdit = document.createElement('button');
    btnEdit.textContent = 'Editar';
    btnEdit.onclick = () => editTask(index);

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Eliminar';
    btnDelete.onclick = () => tryDeleteTask(index);

    btnContainer.append(btnToggle, btnEdit, btnDelete);

    div.append(title, desc, date, status, btnContainer);
    tasksList.appendChild(div);
  });

  renderStats();

  // Si hay más de 10 tareas, mostrar búsqueda
  if (tasks.length > 10) {
    searchContainer.classList.remove('d-none');
  } else {
    searchContainer.classList.add('d-none');
  }
}

// Intento de eliminar tarea
function tryDeleteTask(index) {
  if (!tasks[index].completed) {
    alert("⚠️ No puedes eliminar una tarea que no esté completada.");
    return;
  }
  taskToDelete = index;
  modal.style.display = 'flex';
}

// Confirmar o cancelar eliminación
confirmDeleteBtn.onclick = () => {
  if (taskToDelete !== null) {
    tasks.splice(taskToDelete, 1);
    saveTasks();
    renderTasks();
    modal.style.display = 'none';
    taskToDelete = null;
  }
};

cancelDeleteBtn.onclick = () => {
  modal.style.display = 'none';
  taskToDelete = null;
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const date = document.getElementById('date').value;

  if (!title || !description) {
    alert('Por favor completa todos los campos.');
    return;
  }

  const newTask = { title, description, date, completed: false };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  form.reset();
});

function editTask(index) {
  const task = tasks[index];
  const newTitle = prompt('Nuevo título:', task.title);
  const newDesc = prompt('Nueva descripción:', task.description);
  const newDate = prompt('Nueva fecha (YYYY-MM-DD):', task.date);

  if (newTitle && newDesc) {
    tasks[index] = { ...task, title: newTitle, description: newDesc, date: newDate };
    saveTasks();
    renderTasks();
  }
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

clearAllBtn.addEventListener('click', () => {
  if (tasks.length === 0) {
    alert('No hay tareas para eliminar.');
    return;
  }
  if (confirm('¿Seguro que deseas eliminar todas las tareas?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

// Filtro de búsqueda
searchInput.addEventListener('input', e => {
  renderTasks(e.target.value);
});

// Modos de color
document.getElementById('dayMode').onclick = () => {
  document.body.className = 'day-mode';
};
document.getElementById('nightMode').onclick = () => {
  document.body.className = 'night-mode';
};
document.getElementById('spidermanMode').onclick = () => {
  document.body.className = 'spiderman-mode';
};

renderTasks();
