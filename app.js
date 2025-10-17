const form = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const stats = document.getElementById('stats');
const clearAllBtn = document.getElementById('clearAll');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  stats.textContent = `Total: ${total} | Completadas: ${completed} | Pendientes: ${pending}`;
}

function renderTasks() {
  tasksList.innerHTML = '';

  if (tasks.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.classList.add('empty');
    emptyMsg.textContent = 'No hay tareas registradas.';
    tasksList.appendChild(emptyMsg);
    renderStats();
    return;
  }

  tasks.forEach((task, index) => {
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
    btnToggle.setAttribute('onclick', `toggleTask(${index})`);

    const btnEdit = document.createElement('button');
    btnEdit.textContent = 'Editar';
    btnEdit.setAttribute('onclick', `editTask(${index})`);

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Eliminar';
    btnDelete.setAttribute('onclick', `deleteTask(${index})`);

    btnContainer.appendChild(btnToggle);
    btnContainer.appendChild(btnEdit);
    btnContainer.appendChild(btnDelete);

    div.appendChild(title);
    div.appendChild(desc);
    div.appendChild(date);
    div.appendChild(status);
    div.appendChild(btnContainer);

    tasksList.appendChild(div);
  });

  renderStats();
}

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

function deleteTask(index) {
  const taskElement = tasksList.children[index];
  taskElement.classList.add('fade-out');
  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }, 300);
}

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

renderTasks();
