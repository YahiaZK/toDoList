let allTasksArray = [];
let doneTasksArray = [];
let todoTasksArray = [];

const toDoForm = document.getElementById("toDoInputForm");
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

const filterBtnAll = document.getElementById("filterBtnAll");
const filterBtnDone = document.getElementById("filterBtnDone");
const filterBtnTodo = document.getElementById("filterBtnTodo");
let filterStatus = "all";

filterBtnAll.addEventListener("click", (e) => {
  e.preventDefault();
  filterStatus = "all";
  createTasksList();
});

filterBtnDone.addEventListener("click", (e) => {
  e.preventDefault();
  filterStatus = "done";
  createTasksList();
});

filterBtnTodo.addEventListener("click", (e) => {
  e.preventDefault();
  filterStatus = "todo";
  createTasksList();
});

const createTasksList = () => {
  tasksList.innerHTML = "";
  let tasksArrayToShow = [];

  if (filterStatus == "all") {
    tasksArrayToShow = allTasksArray;
  } else if (filterStatus == "done") {
    tasksArrayToShow = allTasksArray.filter(
      (tasksObject) => tasksObject.completed
    );
  } else if (filterStatus == "todo") {
    tasksArrayToShow = allTasksArray.filter(
      (tasksObject) => !tasksObject.completed
    );
  }

  tasksArrayToShow.forEach((taskObject, taskIndex) => {
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
                <i class="fa-solid fa-pen edit-btn"></i>
                <i class="fa-solid fa-trash"></i>
              </div>
  `;

  const taskCheckbox = taskElement.querySelector("input");
  taskCheckbox.addEventListener("change", () => {
    allTasksArray[taskIndex].completed = taskCheckbox.checked;
    saveTasks();
  });
  taskCheckbox.checked = taskObject.completed;

  const popupCancelBtn = document.getElementById("popupCancelBtn");
  const editBtn = taskElement.querySelector(".edit-btn");
  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showPopupEdit();

    const popupEditForm = document.getElementById("popupEditForm");
    const popupEditInput = document.getElementById("popupEditInput");
    popupEditInput.value = taskObject.text;
    popupEditForm.addEventListener("submit", (e) => {
      const newText = popupEditInput.value.trim();
      if (newText.length > 0) {
        allTasksArray[taskIndex].text = newText;
        createTasksList();
        saveTasks();
      }
    });

    popupCancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hidePopupEdit();
    });
  });

  return taskElement;
};


const showPopupEdit = () => {
  const popupEdit = document.getElementById("popupEdit");
  popupEdit.style.display = "flex";
};

const hidePopupEdit = () => {
  const popupEdit = document.getElementById("popupEdit");
  popupEdit.style.display = "none";
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
