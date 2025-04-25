let allTasksArray = [];
let doneTasksArray = [];
let todoTasksArray = [];   

function showPopup(popupTitle,popupText) {
    const popup = document.querySelector(".popup");
    popup.style.display = "flex";
    document.getElementById("popupText").innerText = popupText;
    document.getElementById("popupTitle").innerText = popupTitle;
  }
  function hidePopup() {
    const popup = document.querySelector(".popup");
    popup.style.display = "none";
  }

document.addEventListener('DOMContentLoaded', () => {
    const tasksList = document.getElementById("tasksList");
    const deleteAllBtn = document.getElementById("deleteAllBtn");
    const deleteDoneBtn = document.getElementById("deleteDoneBtn");
    const popup = document.getElementById("popup");
    const allTasks = document.querySelectorAll('.task');
    let doneTasksCheckbox = [];
    let doneTasks = [];
    let confirmDelete = null;
    let taskToDelete = null;

    updateDeleteAllBtnState();
    updateDoneTasksCheckbox();
    updateDoneTasksArr();
    updateDeleteDoneBtnState();  

    tasksList.addEventListener('click', (e) => {
        const isDeleteBtn = e.target.id.startsWith("deleteBtn-");

        if(isDeleteBtn){
            const taskId = e.target.id.replace("deleteBtn-" , "task-" );
            taskToDelete = document.getElementById(taskId);
            if(taskToDelete){
                const taskText = taskToDelete.querySelector('.taskText')?.textContent || 'this task';
                showPopup("Delete Task" , `Are you sure you want yo delete ${taskText} ?`);
                confirmDelete = 'single';
            }
        }
    })

    tasksList.addEventListener('change' , (e) => {
        if (e.target.type === "checkbox"){
            console.log("True");
            updateDoneTasksCheckbox();
            updateDoneTasksArr();
            updateDeleteDoneBtnState()
        }
    })

    deleteAllBtn.addEventListener('click' , () => {
        showPopup("Delete All Tasks" , "Are you sure you want to delete all tasks?");
        confirmDelete = 'all';
    })

    deleteDoneBtn.addEventListener('click' , () => {
        showPopup("Delete Done Tasks","Are you sure you want to delete all done tasks?");
        confirmDelete = 'doneTasks'
    })

    popup.addEventListener('click' , (e) => {
        const isConfirm = e.target.id === 'popupConfirmBtn';
        const isCancel = e.target.id === 'popupCancelBtn';

        if(isConfirm){
            if(confirmDelete === 'single' && taskToDelete){
                taskToDelete.remove();

            } else if(confirmDelete === 'all'){
                allTasks.forEach(task => {
                    task.remove();
                });
            } else if(confirmDelete === 'doneTasks'){
                updateDoneTasksCheckbox();
                console.log(doneTasksCheckbox);
                doneTasksCheckbox.forEach(el=> {
                    console.log(el);
                    taskId = el.id.replace('taskCheckbox' , 'task');
                    taskToDelete = document.getElementById(taskId);
                    doneTasks.push(taskToDelete);
                    taskToDelete.remove();
                })
            }
        }

        if(isConfirm && isCancel){
            confirmDelete = null;
            taskToDelete = null;
        }

        hidePopup();
        setTimeout(
            updateDeleteAllBtnState(),
             updateDoneTasksCheckbox(),
              updateDoneTasksArr(),
             updateDeleteDoneBtnState()
              ,0);
    })

    function updateDeleteAllBtnState(){
        deleteAllBtn.disabled = tasksList.children.length === 0;
    }

    function updateDeleteDoneBtnState(){
        deleteDoneBtn.disabled = doneTasks.length === 0;
        console.log(doneTasks.length);
        console.log(doneTasks);
    }

    function updateDoneTasksArr(){
        let task;
        let taskId;
        doneTasks =[];
        doneTasksCheckbox.forEach(checkbox => {
            taskId = checkbox.id.replace('taskCheckbox' , 'task');
            task = document.getElementById(taskId);
            doneTasks.push(task);
        })
        console.log(doneTasks);
    }

    function updateDoneTasksCheckbox(){
        doneTasksCheckbox = tasksList.querySelectorAll('input[type="checkbox"]:checked');
        console.log(doneTasksCheckbox);
    }
});