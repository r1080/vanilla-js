const inputBox = document.querySelector(".inputField input");
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button");

function Task(taskId, task, completed) {
  this.taskId = taskId;
  this.task = task;
  this.completed = completed;
}

const taskServiceUrl = 'http://localhost:8443/tasks';

// onkeyup event
inputBox.onkeyup = () => {
  let userEnteredValue = inputBox.value; //getting user entered value
  if (userEnteredValue.trim() != 0) { //if the user value isn't only spaces
    addBtn.classList.add("active"); //active the add button
  } else {
    addBtn.classList.remove("active"); //unactive the add button
  }
}

window.onload = function onLoad() {
  console.log('On Load');
  getAllTasks(authenticateGetToken);
}

addBtn.onclick = () => { //when user click on plus icon button
  let userEnteredValue = inputBox.value; //getting input field value
  let getLocalStorageData = localStorage.getItem("New Todo"); //getting localstorage
  if (getLocalStorageData == null) { //if localstorage has no data
    listArray = []; //create a blank array
  } else {
    listArray = JSON.parse(getLocalStorageData);  //transforming json string into a js object
  }
  listArray.push(userEnteredValue); //pushing or adding new value in array

  addTask(userEnteredValue, authenticateGetToken);

  localStorage.setItem("New Todo", JSON.stringify(listArray)); //transforming js object into a json string
  showTasks(); //calling showTask function
  addBtn.classList.remove("active"); //unactive the add button once the task added
}

function addTask(inputTask, authenticateGetTokenCall) {
  let jwtToken = authenticateGetTokenCall();
  jwtToken.then(jwt => {
    saveTask(jwt, inputTask);
  });
}

const saveTask = async (jwt_token, inputTask) => {

  const task = new Task('', inputTask, false);

  console.log('JWT TOken resolved from promise ' + jwt_token);

  const headers = new Headers();
  headers.append('Authorization', 'Bearer ' + jwt_token);
  headers.append('Content-Type', 'application/json');

  console.log('task object created ' + JSON.stringify(task));
  const response = await fetch(taskServiceUrl,
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(task)
    }).then(response => console.log(response))
    .catch(err => console.log(err));

}

function showTasks() {

  console.log('show tasks called');

  let getLocalStorageData = localStorage.getItem("New Todo");
  if (getLocalStorageData == null) {
    listArray = [];
  } else {
    listArray = JSON.parse(getLocalStorageData);
  }
  const pendingTasksNumb = document.querySelector(".pendingTasks");
  pendingTasksNumb.textContent = listArray.length; //passing the array length in pendingtask
  if (listArray.length > 0) { //if array length is greater than 0
    deleteAllBtn.classList.add("active"); //active the delete button
  } else {
    deleteAllBtn.classList.remove("active"); //unactive the delete button
  }
  let newLiTag = "";
  listArray.forEach((element, index) => {
    newLiTag += `<li>${element}<span class="icon" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></span></li>`;
  });
  todoList.innerHTML = newLiTag; //adding new li tag inside ul tag
  inputBox.value = ""; //once task added leave the input field blank
}

// delete task function
function deleteTask(index) {
  let getLocalStorageData = localStorage.getItem("New Todo");
  listArray = JSON.parse(getLocalStorageData);
  listArray.splice(index, 1); //delete or remove the li
  localStorage.setItem("New Todo", JSON.stringify(listArray));
  showTasks(); //call the showTasks function
}

// delete all tasks function
deleteAllBtn.onclick = () => {
  listArray = []; //empty the array
  localStorage.setItem("New Todo", JSON.stringify(listArray)); //set the item in localstorage
  showTasks(); //call the showTasks function
}

function getAllTasks(authenticateGetTokenCall) {

  console.log('Get All Tasks');

  let jwtToken = authenticateGetTokenCall();
  jwtToken.then(jwt => {
    getTasks(jwt);
  });
  
}

const getTasks = async (jwt_token) => {

  console.log('JWT TOken resolved from promise ' + jwt_token);

  const headers = new Headers();
  headers.append('Authorization', 'Bearer ' + jwt_token);
  headers.append('Content-Type', 'application/json');
  const response = await fetch(taskServiceUrl,
    {
      method: 'GET',
      headers: headers,
    }).then(response => response.json())
    .then(r => addToLocalStorage(r))
    .catch(err => console.log(err));

}

const addToLocalStorage = async (response) => {
  response.forEach((element, index) => {
    console.log(element);

    let getLocalStorageData = localStorage.getItem("New Todo");
    if (getLocalStorageData == null) {
      listArray = [];
    } else {
      listArray = JSON.parse(getLocalStorageData);
    }
    listArray.push(element);
    localStorage.setItem("New Todo", JSON.stringify(listArray));
  });
  showTasks();
}

const authenticateGetToken = async () => {

  console.log('Hitting Authorization Server to Authenticate and get JWT');

  // Build formData object.
  let formData = new FormData();
  formData.append('grant_type', 'password');
  formData.append('username', 'raghavtenneti11@gmail.com');
  formData.append('password', 'personal#1990');
  formData.append('scopes', 'read write');

  const myHeaders = new Headers();
  const username = 'task-service-app';
  const password = '1702';

  console.log('Bearer ' + btoa(username + ":" + password));

  myHeaders.append('Authorization', 'Basic ' + btoa(username + ":" + password));

  let jwt = '';

  const response = await fetch("http://localhost:9091/oauth/token",
    {
      method: "POST",
      headers: myHeaders,
      body: formData
    }).then(response => response.json())
    .then(j => j.access_token)
    .then(token => { jwt = token }

    ).then(jwt => {
      return jwt;
    })
    .catch(err => console.log(err));

  return jwt;

}