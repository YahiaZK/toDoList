let allTasksArray = [];
let filterStatus = "all";
let currentlyEditingTaskId = null;
const regex = /^[0-9]/;

const toDoForm = document.getElementById("toDoInputForm");
const toDoInput = document.getElementById("toDoInput");
const tasksList = document.getElementById("tasksList");
const filterBtnAll = document.getElementById("filterBtnAll");
const filterBtnDone = document.getElementById("filterBtnDone");
const filterBtnTodo = document.getElementById("filterBtnTodo");
const popupCancelBtn = document.getElementById("popupCancelBtn");
const beEmpty = document.getElementById("beEmpty");
const startWithNumber = document.getElementById("startWithNumber");
const fiveCharLong = document.getElementById("fiveCharLong");
const popupBeEmpty = document.getElementById("popupBeEmpty");
const popupStartWithNumber = document.getElementById("popupStartWithNumber");
const popupFiveCharLong = document.getElementById("popupFiveCharLong");

toDoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createTask();
});

const createTask = () => {
  const taskText = toDoInput.value.trim();
  if (taskText.length == 0) {
    beEmpty.style.display = "flex";
    fiveCharLong.style.display = "none";
    startWithNumber.style.display = "none";
  } else if (taskText.length < 5) {
    beEmpty.style.display = "none";
    fiveCharLong.style.display = "flex";
    startWithNumber.style.display = "none";
  } else if (regex.test(taskText)) {
    beEmpty.style.display = "none";
    fiveCharLong.style.display = "none";
    startWithNumber.style.display = "flex";
  } else {
    beEmpty.style.display = "none";
    fiveCharLong.style.display = "none";
    startWithNumber.style.display = "nono";
    const taskObject = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    saveInputAndReset(taskObject);
  }
};

const saveInputAndReset = (taskObject) => {
  allTasksArray.push(taskObject);
  createTasksList();
  saveTasks();
  toDoInput.value = "";
};

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
  let tasksArrayToShow = changeFilterStatus();

  tasksArrayToShow.forEach((taskObject) => {
    taskElement = createOneTask(taskObject);
    tasksList.append(taskElement);
  });
};

const changeFilterStatus = () => {
  if (filterStatus == "all") {
    return allTasksArray;
  } else if (filterStatus == "done") {
    return allTasksArray.filter((taskObject) => taskObject.completed);
  } else if (filterStatus == "todo") {
    return allTasksArray.filter((taskObject) => !taskObject.completed);
  }
};

const createOneTask = (taskObject) => {
  const taskElement = document.createElement("li");
  const taskId = "task-" + taskObject.id;
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

  changeCheckbox(taskElement, taskObject);
  renameTask(taskElement, taskObject);

  return taskElement;
};

const changeCheckbox = (taskElement, taskObject) => {
  const taskCheckbox = taskElement.querySelector("input");
  taskCheckbox.addEventListener("change", () => {
    const taskIndex = allTasksArray.findIndex(
      (task) => task.id === taskObject.id
    );
    if (taskIndex !== -1) {
      allTasksArray[taskIndex].completed = taskCheckbox.checked;
      saveTasks();
    }
  });
  taskCheckbox.checked = taskObject.completed;
};

const renameTask = (taskElement, taskObject) => {
  const editBtn = taskElement.querySelector(".edit-btn");
  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showPopupEdit();

    const popupEditForm = document.getElementById("popupEditForm");
    popupEditInput.value = taskObject.text;
    currentlyEditingTaskId = taskObject.id;

    popupEditForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const popupEditInput = document.getElementById("popupEditInput");
      const newText = popupEditInput.value.trim();

      if (newText.length == 0) {
        popupBeEmpty.style.display = "flex";
        popupFiveCharLong.style.display = "none";
        popupStartWithNumber.style.display = "none";
      } else if (newText.length < 5) {
        popupBeEmpty.style.display = "none";
        popupFiveCharLong.style.display = "flex";
        popupStartWithNumber.style.display = "none";
      } else if (regex.test(newText)) {
        popupBeEmpty.style.display = "none";
        popupFiveCharLong.style.display = "none";
        popupStartWithNumber.style.display = "flex";
      } else if (currentlyEditingTaskId !== null) {
        popupBeEmpty.style.display = "none";
        popupFiveCharLong.style.display = "none";
        popupStartWithNumber.style.display = "none";

        const taskIndex = allTasksArray.findIndex(
          (task) => task.id === currentlyEditingTaskId
        );
        if (taskIndex !== -1) {
          allTasksArray[taskIndex].text = newText;
          saveTasks();
          createTasksList();
          hidePopupEdit();
        }
      }
    });
  });
};

const showPopupEdit = () => {
  const popupEdit = document.getElementById("popupEdit");
  popupEdit.style.display = "flex";
};

const hidePopupEdit = () => {
  const popupEdit = document.getElementById("popupEdit");
  popupEdit.style.display = "none";
};

popupCancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  hidePopupEdit();
});

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
