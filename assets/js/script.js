let formEl = document.querySelector("#task-form");
let pageContentEl = document.querySelector("#page-content");
let tasksToDoEl = document.querySelector("#tasks-to-do");
let tasksInProgressEl = document.querySelector("#tasks-in-progress");
let tasksCompletedEl = document.querySelector("#tasks-completed");
let taskIdCounter = 0;

let tasks =[];

function taskFormHandler (event) {
  event.preventDefault();

  let isEdit = formEl.hasAttribute("data-task-id");
  let taskNameInput = document.querySelector("input[name='task-name']").value;
  let taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check for null inputs
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill oout the task form!");
    return false;
  };

  formEl.reset();


  if (isEdit) {
    let taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  
  else {
    // package up task data as object
    let taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    }

    createTaskEl(taskDataObj);
  }
};

function createTaskEl (taskDataObj) {
  // create list item
  let listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create div to hold task info and add to list item
  let taskInfoEl = document.createElement("div");
  // give it a class name
  taskInfoEl.className = "task-info";
  // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

  listItemEl.appendChild(taskInfoEl);

  let taskActionsEl = createTaskActions(taskIdCounter);
  
  listItemEl.appendChild(taskActionsEl);

  // add entire list item to list
  if (taskDataObj.status === "to do") {
    listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
    tasksToDoEl.appendChild(listItemEl)
  }
  else if (taskDataObj.status === "in progress") {
    listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
    tasksInProgressEl.appendChild(listItemEl)
  }
  else if (taskDataObj.status === "completed") {
    listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
    tasksCompletedEl.appendChild(listItemEl)
  }

  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  saveTasks();

  taskIdCounter++;
};

function createTaskActions (taskId) {
  let actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  let editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  let deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  let statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  let statusChoices = ["To Do", "In Progress", "Completed"];

  for (let i = 0; i < statusChoices.length; i++) {
    // create option element
    let statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    // append to select
    statusSelectEl.appendChild(statusOptionEl)
  }

  actionContainerEl.appendChild(statusSelectEl);

  return actionContainerEl;
};

function taskButtonHandler (event) {
  let targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    let taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    // get the element's task id
    let taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId)
  }
};

function editTask (taskId) {
  console.log("editing task #" + taskId);

  // get task list item element
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // get content from task name and type
  let taskName = taskSelected.querySelector("h3.task-name").textContent;
  let taskType = taskSelected.querySelector("span.task-type").textContent;

  document.querySelector("input[name= 'task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
}

function completeEditTask (taskName, taskType, taskId) {
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  
  // loop through tasks array and task object with new content
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  };

  saveTasks();
  alert("Task Updated!");

  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
}

function deleteTask (taskId) {
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  // create new array to hold updated list of tasks
  // why didn't we just ask for array position and delete that?
  let updatedTaskArr = [];

  // loop through current tasks array
  for (let i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr;
  saveTasks();
}

function taskStatusChangeHandler (event) {
  // get the task item's id
  let taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  let statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  }
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  }
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected)
  }

  // loop through tasks array and task object with new content
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }
  saveTasks();
}

function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks(){
  // get task items from local storage
  // don't use let here, we already defined tasks
  let savedTasks = localStorage.getItem("tasks");

  if (!savedTasks) {
    return false;
  }
  // convert tasks from the string format back into an array of objects
  savedTasks = JSON.parse(savedTasks);
  
  // loop through savedTasks array
  for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the `createTaskEl()` function
    createTaskEl(savedTasks[i]);
  }
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
loadTasks()