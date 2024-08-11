const init = () => {
    const input = document.querySelector('#input');
    const addButton = document.querySelector('#addButton');
    const taskList = document.querySelector('.list');
    const localStorageTasks = loadLocalStorage();


    localStorageTasks.forEach(({text, id}) => {

        const taskElement = createTaskElement(text, id);
        taskList.appendChild(taskElement);

    });

    controlInput(input, addButton);
    addNewTask(input, addButton, taskList);
}

document.addEventListener('DOMContentLoaded', init);

const controlInput = (input, addButton) => {
    input.addEventListener('input', ({ target }) => {
        const hasValue = target.value.trim() !== '';
        addButton.classList.toggle('activeBtn', hasValue);
        addButton.disabled = !hasValue;
    })
}

const generateId = () => Math.random().toString(36).slice(2, 9);

const addNewTask = (input, addButton, taskList) => {
    addButton.addEventListener('click' , () => {
        const taskValue = input.value.trim();
        const id = generateId();

        if (taskValue) {
            const newTask = createTaskElement(taskValue, id);

            taskList.appendChild(newTask); 
            input.value = '';
            addButton.disabled = true;
            addButton.classList.remove('activeBtn');

            addInLocalStorage(newTask);
        }
    })
}

const createDeleteBtn = () => {

    const removeBtn = document.createElement('button');
    const removeIcon = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-trash-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /><path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z" /></svg>';

    removeBtn.classList.add('btn', 'danger-btn');
    removeBtn.innerHTML = removeIcon;
    removeBtn.setAttribute('aria-label', 'Delete task');

    return removeBtn;
}

const createEditBtn = () => {
    const editBtn = document.createElement('button');
    const editIcon = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>';

    editBtn.classList.add('btn', 'edit-btn');
    editBtn.innerHTML = editIcon;
    editBtn.setAttribute('aria-label', 'Edit task');

    return editBtn;
}

const createTaskElement = (taskValue, id) => {
    const newTask = document.createElement('li');
    const taskText = document.createElement('span');
    const buttonsContainer = document.createElement('div');
    const removeBtn = createDeleteBtn();
    const editBtn = createEditBtn();

    buttonsContainer.className = 'buttons-container';
    buttonsContainer.appendChild(removeBtn);
    buttonsContainer.appendChild(editBtn);

    taskText.classList = 'task-text';
    taskText.textContent = taskValue;

    newTask.append(taskText);
    newTask.append(buttonsContainer);
    newTask.id = id;

    removeBtn.addEventListener('click', () => removeTask(newTask));
    editBtn.addEventListener('click', () => editTask(newTask));

    return newTask;
}

const removeTask = (task) => {
    const taskList = document.querySelector('.list');

    if(confirm('¿Quieres eliminar la tarea?')) {
        taskList.removeChild(task);
        removeFromLocalStorage(task);
    }
}

const editTask = (task) => {    
    const taskText = task.querySelector('.task-text');
    const textEdit = prompt('Edita la tarea:', taskText.textContent);

    if (textEdit === null || textEdit.trim() === '') return;

    taskText.textContent = textEdit;
    updateLocalStorage(task);
}

const addInLocalStorage = (task) => {
    const tasks = loadLocalStorage();
    const taskData = {
        text: task.textContent,
        id: task.id
    }

    tasks.push(taskData);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const loadLocalStorage = () => JSON.parse(localStorage.getItem('tasks') || '[]');

const removeFromLocalStorage = (taskToRemove) => {
    const tasks = loadLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskToRemove.id);

    if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const updateLocalStorage = ({textContent, id}) => {
    const tasks = loadLocalStorage();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex > -1) {
        tasks[taskIndex] = {
            text: textContent,
            id
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}