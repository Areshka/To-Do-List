let addBtn = document.getElementById('addBtn'); // кнопка добавления задачи
let inputTask = document.getElementById('newTask');
let unfinishedTasks = document.getElementById('unfinished-tasks');
let finishedTasks = document.getElementById('finished-tasks');

// Создание новой задачи
function createNewTask(task, check) {
  var listItem = document.createElement('li'); // создаем элемент списка
  var checkbox = document.createElement('button'); // создаем кнопку для переноса таска в завершенные дела
  checkbox.className = "checkbox"; // добавляем ей класс для кнопки 
  if (check) {
    checkbox.innerHTML = '<span class="icon-close"  title="Убрать в завершенные"></span>';
  } else {
    checkbox.innerHTML = '<span class="icon-checkmark"  title="Убрать в завершенные"></span>';
  }
  var label = document.createElement('label'); // создаем название задачи
  label.innerHTML = task;
  var input = document.createElement('input'); // создаем тектовое поле для редактирования задачи
  input.type = "text";
  var editBtn = document.createElement('button'); // создаем кнопку для редактирования задачи
  editBtn.className = "edit"
  editBtn.innerHTML = '<span class="icon-edit-pencil"  title="Редатировать"></span>';
  var deleteBtn = document.createElement('button'); // создаем кнопку для удаления названия задачи
  deleteBtn.className = "delete"
  deleteBtn.innerHTML = '<span class="icon-trash" title="Удалить"></span>';

  // добавляем созданные элементы в пункт списка
  listItem.appendChild(checkbox);
  listItem.appendChild(label);
  listItem.appendChild(input);
  listItem.appendChild(editBtn);
  listItem.appendChild(deleteBtn);

  return listItem;
}

// Добавление задачи в список
function addTask() {
  if (inputTask.value) {
    var listItem = createNewTask(inputTask.value, false); // если таск не пустой, то создаем его
    unfinishedTasks.appendChild(listItem); // добаляем в список дел
    bindTaskEvents(listItem, finishTask)
    inputTask.value = '';
  } else {
    alert("Введите задачу");
  }
  save();
}

inputTask.onfocus = function () {
  window.onkeydown = function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      addTask();
    }
  }
}

addBtn.onclick = addTask;

function deleteTask() {
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  ul.removeChild(listItem);
  save();
}

function editTask() {
  var editBtn = this;
  var listItem = this.parentNode;
  var label = listItem.querySelector('label');
  var input = listItem.querySelector('input[type=text]');
  var containsClass = listItem.classList.contains('editMode');

  if (containsClass) {
    label.innerText = input.value;
    editBtn.className = 'edit';
    editBtn.innerHTML = '<span class="icon-edit-pencil" title="Редактировать"></span>';
    save();
  } else {
    input.value = label.innerText;
    editBtn.className = 'edit';
    editBtn.innerHTML = '<span class="icon-save-disk" title="Сохранить"></span>';
  }

  listItem.classList.toggle('editMode');
  input.focus();
}

function finishTask() {
  var listItem = this.parentNode;
  var checkbox = listItem.querySelector('button.checkbox');
  checkbox.className = "checkbox";
  checkbox.innerHTML = '<span class="icon-close" title="Добавить в список дел"></span>';
  finishedTasks.appendChild(listItem);
  bindTaskEvents(listItem, unfinishTask);
  save();
}

function unfinishTask() {
  var listItem = this.parentNode;
  var checkbox = listItem.querySelector('button.checkbox');
  checkbox.className = "checkbox";
  checkbox.innerHTML = '<span class="icon-checkmark" title="Убрать в завершенные"></span>';
  unfinishedTasks.appendChild(listItem);
  bindTaskEvents(listItem, finishTask);
  save();
}

function bindTaskEvents(listItem, checkboxEvent) {
  var checkbox = listItem.querySelector('button.checkbox');
  var editBtn = listItem.querySelector('button.edit');
  var deleteBtn = listItem.querySelector('button.delete');

  checkbox.onclick = checkboxEvent;
  editBtn.onclick = editTask;
  deleteBtn.onclick = deleteTask;
  save();
}

function save() {
  var unfinishedTasksArr = [];

  for (let i = 0; i < unfinishedTasks.children.length; i++) {
    unfinishedTasksArrElem = unfinishedTasks.children[i].getElementsByTagName('label')[0].innerText;
    unfinishedTasksArr.push(unfinishedTasksArrElem);
  }

  var finishedTasksArr = [];

  for (let i = 0; i < finishedTasks.children.length; i++) {
    finishedTasksArrElem = finishedTasks.children[i].getElementsByTagName('label')[0].innerText;
    finishedTasksArr.push(finishedTasksArrElem);
  }

  localStorage.removeItem('todo');
  localStorage.setItem('todo', JSON.stringify({
    unfinishedTasks: unfinishedTasksArr,
    finishedTasks: finishedTasksArr
  }))

}

function load() {
  return JSON.parse(localStorage.getItem('todo'));
}

var data = load();
for (var i = 0; i < data.unfinishedTasks.length; i++) {
  var listItem = createNewTask(data.unfinishedTasks[i], false);
  unfinishedTasks.appendChild(listItem);
  bindTaskEvents(listItem, finishTask);
}

for (var i = 0; i < data.finishedTasks.length; i++) {
  var listItem = createNewTask(data.finishedTasks[i], true);
  finishedTasks.appendChild(listItem);
  bindTaskEvents(listItem, unfinishTask);
}