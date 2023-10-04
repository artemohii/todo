const tasks = [
  {
    id: "task-42528647",
    completed: false,
    text: "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit.",
    title: "Eu ea incididunt sunt consectetur",
  },
  {
    id: "task-63583488",
    completed: false,
    text: "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in.",
    title: "Eu ea incididunt sunt consectetur fugiat non",
  },
  {
    id: "task-45299838",
    completed: false,
    text: "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.",
    title: "Deserunt laborum id consectetur pariatur veniam occaecat",
  },
  {
    id: "task-41603808",
    completed: false,
    text: "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip.",
    title: "Deserunt laborum id consectetur",
  },
];

const tasksObj = tasks.reduce((acc, el) => {
  acc[el.id] = el;
  return acc;
}, {});

const themes = {
  dark: {
    "--primary": "#181818",
    "--secondary": "#fafafa",
  },
  light: {
    "--primary": "#fafafa",
    "--secondary": "#181818",
  },
};

// DOM Elements
const tasksWrapper = document.querySelector(".tasks-wrapper");
const form = document.querySelector(".add-task");
// const inputTitle = form.querySelector("[name='taskTitle']");
const inputTitle = form.elements.taskTitle;
const inputText = form.elements.taskText;
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const themeSelect = document.querySelector(".header__select-theme");
const htmlRoot = document.querySelector(":root");

// Variables
const inputs = [inputTitle, inputText];
const themeFromLS = localStorage.getItem("theme");

// Events
renderAllTasks();
setTheme(themeFromLS); 
// баг , при выборе светлой темы и рефреш, темная тема выбирается только после выбора светлой темы 

/* Event on form */
form.addEventListener("submit", onSubmitForm);

/* Event on buttons */
tasksWrapper.addEventListener("click", onDeleteTask);

/* Event on Select */
themeSelect.addEventListener("change", onChangeTheme);

// Functions
function createTaskTemplate({ title, text, id }) {
  return `
    <div class="task" id="${id}">
      <h3>${title}</h3>
      <p class="task__text">${text}</p>
      <div>
        <button class="btn btn--delete">Delete Task</button>
      </div>
    </div>
  `;
}

function renderAllTasks() {
  const fragment = Object.values(tasksObj).reduce(
    (acc, task) => (acc += createTaskTemplate(task)),
    ""
  );
  tasksWrapper.insertAdjacentHTML("beforeend", fragment);
}

for (let input of inputs) {
  input.addEventListener("input", () => {
    validateInput(input, input.value);
  });
}

function onSubmitForm(e) {
  e.preventDefault();
  const titleValue = inputTitle.value;
  const textValue = inputText.value;
  let error = 0;
  for (let input of inputs) {
    if (!validateInput(input, input.value)) {
      error++;
    }
  }
  if (!error) {
    const newTask = createNewTask(titleValue, textValue);
    tasksWrapper.insertAdjacentHTML("afterbegin", createTaskTemplate(newTask));
  }
  e.target.reset();
}

function validateInput(input, value) {
  if (!value.trim()) {
    input.style.border = "1px solid red";
    input.nextElementSibling.textContent = input.dataset.message;
    return false;
  } else if (value.trim().length < input.dataset.minLength) {
    input.style.border = "1px solid red";
    input.nextElementSibling.textContent = `${input.placeholder} must be at list ${input.dataset.minLength} characters`;
    return false;
  } else {
    input.style.border = "1px solid #181818";
    input.nextElementSibling.textContent = null;
    return true;
  }
}

function createNewTask(title, text) {
  const task = {
    id: `task-${Math.floor(Math.random() * 100000000)}`,
    text,
    title, // === title: title,
    completed: false,
  };
  tasksObj[task.id] = task;
  return task;
  // console.log(tasksObj);
}

/* Delete tasks */
function onDeleteTask(e) {
  if (e.target.classList.contains("btn--delete")) {
    const task = e.target.closest(".task");
    const taskId = task.id;
    showModal();
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn--delete")) {
        deleteTaskFromLayout(task);
        deleteTaskFromObj(taskId);
        hideModal();
      }
      if (e.target.classList.contains("btn--cancel")) {
        hideModal();
      }
    });
  }
}

function deleteTaskFromLayout(task) {
  task.remove();
}

function deleteTaskFromObj(taskId) {
  delete tasksObj[taskId];
}

function showModal() {
  overlay.classList.add("active");
  modal.classList.add("active");
}

function hideModal() {
  overlay.classList.remove("active");
  modal.classList.remove("active");
}

function onChangeTheme(e) {
  const selectedTheme = e.target.value;
  localStorage.setItem("theme", selectedTheme);
  setTheme(selectedTheme)
}

function setTheme(themeName) {
  const themeObj = themes[themeName];
  for (let key in themeObj) {
    htmlRoot.style.setProperty(key, themeObj[key]);
  }
}

/* localStorage */

/* console.log(localStorage); */
localStorage.setItem("test", "value-test"); // Збереження даних у localStorage
localStorage.getItem("test"); // -> "value-test "Отримання даних з localStorage
//localStorage.removeItem("test");// Видалення даних з localStorage
