let formEl = document.querySelector("#task-form");
let tasksToDoEl = document.querySelector("#tasks-to-do");

function taskFormHandler (event) {
  // debugger;
  event.preventDefault();

  let taskNameInput = document.querySelector("input[name='task-name']").value;
  let taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check for null inputs
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill oout the task form!");
    return false;
  }

  formEl.reset();
  // package up task data as object
  let taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
  }

  createTaskEl (taskDataObj)
};

function createTaskEl (taskDataObj) {
  // create list item
  let listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // create div to hold task info and add to list item
  let taskInfoEl = document.createElement("div");
  // give it a class name
  taskInfoEl.className = "task-info";
  // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

  listItemEl.appendChild(taskInfoEl);

  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);
}

formEl.addEventListener("submit", taskFormHandler);
