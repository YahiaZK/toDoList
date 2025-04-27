let allTasksArray = [];
let doneTasksArray = [];
let todoTasksArray = [];

const toDoForm = document.querySelector("form");
const toDoInput = document.getElementById("toDoInput");
const tasksList = document.getElementById("tasksList");

toDoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = toDoInput.value.trim();
  if (taskText.length > 0) {
    const taskObject = {
      text: taskText,
      completed: false,
    };
    allTasksArray.push(taskObject);
    createTasksList();
    saveTasks();
    toDoInput.value = "";
  }
});

const createTasksList = () => {
  tasksList.innerHTML = "";
  allTasksArray.forEach((taskObject, taskIndex) => {
    taskElement = createOneTask(taskObject, taskIndex);
    tasksList.append(taskElement);
  });
};

const createOneTask = (taskObject, taskIndex) => {
  const taskElement = document.createElement("li");
  const taskId = "task-" + taskIndex;
  const taskText = taskObject.text;
  taskElement.className = "task";
  taskElement.innerHTML = `
              <input type="checkbox" id="${taskId}" />
              <label class="taskText" for="${taskId}">${taskText}</label>
              <label class="custom-checkbox" for="${taskId}">
                <i class="fa-solid fa-check"></i>
              </label>
              <div class="taskIcons">
                <i class="fa-solid fa-pen"></i>
                <i class="fa-solid fa-trash"></i>
              </div>
  `;

  const taskCheckbox = taskElement.querySelector("input");
  taskCheckbox.addEventListener("change", () => {
    allTasksArray[taskIndex].completed = taskCheckbox.checked;
    saveTasks();
  });
  taskCheckbox.checked = taskObject.completed;
  return taskElement;
};

const saveTasks = () => {
  const tasksJson = JSON.stringify(allTasksArray);
  localStorage.setItem("allTasks", tasksJson);
};

const getTasks = () => {
  const tasks = localStorage.getItem("allTasks") || "[]";
  return JSON.parse(tasks);
};

allTasksArray = getTasks();
createTasksList();
