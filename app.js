const form = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const stats = document.getElementById('stats');
const clearAllBtn = document.getElementById('clearAll');
const searchInput = document.getElementById('taskSearch');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let taskToDeleteIndex = null;

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  stats.textContent = `Total: ${total} | Completadas: ${completed} | Pendientes: ${pending}`;
}

function renderTasks(filteredTasks = null) {
  const list = filteredTasks || tasks;
  tasksList.innerHTML = '';

  if (list.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.classList.add('empty');
    emptyMsg.textContent = 'No hay tareas registradas.';
    tasksList.appendChild(emptyMsg);
    renderStats();
    return;
  }

  list.forEach((task, index) => {
    const div = document.createElement('div');
    div.classList.add('task');

    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p><strong>Fecha límite:</strong> ${task.date || 'Sin fecha'}</p>
      <p><strong>Estado:</strong> ${task.completed ? '✅ Completada' : '⏳ Pendiente'}</p>
      <div class="buttons">
        <button onclick="toggleTask(${index})">${task.completed ? 'Marcar pendiente' : 'Marcar completada'}</button>
        <button onclick="editTask(${index})">Editar</button>
        <button onclick="deleteTask(${index})">Eliminar</button>
      </div>
    `;

    tasksList.appendChild(div);
  });

  renderStats();
  searchInput.style.display = tasks.length > 10 ? 'block' : 'none';
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
  const task = tasks[index];
  if (!task.completed) {
    alert("Solo puedes eliminar tareas que ya estén completadas ✅");
    return;
  }
  taskToDeleteIndex = index;
  document.getElementById("deleteModal").style.display = "flex";
}

document.getElementById("confirmDelete").onclick = () => {
  if (taskToDeleteIndex !== null) {
    tasks.splice(taskToDeleteIndex, 1);
    saveTasks();
    renderTasks();
  }
  document.getElementById("deleteModal").style.display = "none";
};

document.getElementById("cancelDelete").onclick = () => {
  document.getElementById("deleteModal").style.display = "none";
  taskToDeleteIndex = null;
};

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

// ----- FILTRO DE BÚSQUEDA -----
searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(keyword) ||
    t.description.toLowerCase().includes(keyword)
  );
  renderTasks(filtered);
});

// ----- MODOS VISUALES -----
document.getElementById("dayMode").addEventListener("click", () => {
  document.body.className = "light-mode";
});

document.getElementById("nightMode").addEventListener("click", () => {
  document.body.className = "dark-mode";
});

document.getElementById("spidermanMode").addEventListener("click", () => {
  document.body.className = "spiderman-mode";
});

renderTasks();
