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
    let confirmDelete = null;
    let taskToDelete = null;

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

    deleteAllBtn.addEventListener('click' , () => {
        showPopup("Delete All Tasks" , "Are you sure you want to delete all tasks?");
        confirmDelete = 'all';
    })

    deleteDoneBtn.addEventListener('click' , () => {

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
            }
        }

        if(isConfirm && isCancel){
            confirmDelete = null;
            taskToDelete = null;
        }

        hidePopup();
        setTimeout(updateDeleteAllBtnState(),0);
    })

    function updateDeleteAllBtnState(){
        deleteAllBtn.disabled = tasksList.children.length === 0
    }
});