let input =document.querySelector(".input");
let submit =document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");


// empty array to store the tasks
let arrayOfTasks = [];

// check if theres tasks in local storage "اخر خطوه "
if (localStorage.getItem("tasks")){
    arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
};

const del = {
    type: "div",
    classN: "delete-all",
    divText: "Delete All",
};


// trigger this function [4]
getDataFromLocalStorage();

// Add Task and prevent defult
document.forms[0].onsubmit = function (e) {
    e.preventDefault();
    
    if(input.value !== ""){

        // function [1]
        addTaskToArray(input.value); // add task to array of tasks
        input.value = "" ; //Empty the input

        if (arrayOfTasks.length > 1) {
            createElementDelete ();
        };
    };
};



// click on task element 
tasksDiv.addEventListener('click', (e) => {
    // Delete btn
    if (e.target.classList.contains("del")){

        // remove task from local storage
        deleteTaskwith(e.target.parentElement.getAttribute("data-id"));

        // remove elmet form page 
        e.target.parentElement.remove();

    };

        // task element 
        if (e.target.classList.contains("task")){
            // Toggle completed For the Task
            toggleStatusTaskWith(e.target.getAttribute("data-id"));
            // Toggle done class
            e.target.classList.toggle("done");
        };

});

function addTaskToArray(taskText) {
    // task data
    const task = {
        id: Date.now(),
        title: taskText,
        completed: false,
    };

    // push task to Array of tasks
    arrayOfTasks.push(task);

    // function [2]
    // function add task to page (convert tasks to elements)
    addElementsToPageFrom(arrayOfTasks);

    // function [3] add task to local storage
    addTaskToLocalStorageFrom(arrayOfTasks);

    // for Tasting
    // console.log(arrayOfTasks);
    // console.log(JSON.stringify(arrayOfTasks));
    
};


function addElementsToPageFrom(arrayOfTasks) {

    // Empty the tasks div
    tasksDiv.innerHTML = "" ;
    // looping on array of Tasks
    arrayOfTasks.forEach((task) => {

        // create tasks element divs
        let div = document.createElement("div");
        div.className = "task";

        // check if task completed [last order to this function]
        if (task.completed) { // if (task.completed === true) {}
        div.className = "task done"; // or div.classList.add("done");
    };

        div.setAttribute("data-id",task.id ); // or div.id = task.id ;
        div.appendChild(document.createTextNode(task.title));

        // creat delete btn
        let span = document.createElement("span");
        span.className = "del"
        span.appendChild(document.createTextNode("Delete"));
        // append delet to task
        div.appendChild(span);
        // append to page (tasks container)
        tasksDiv.appendChild(div)
    });
};

// add to local storage
function addTaskToLocalStorageFrom(arrayOfTasks) {
    window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
};

// get to local storage
function getDataFromLocalStorage() {
    let data = window.localStorage.getItem("tasks");
    if (data){
        let tasks = JSON.parse(data);
        addElementsToPageFrom(tasks);
    };
};

function deleteTaskwith(taskId) {
    // For Explaining only
    // for (let i = 0 ; i < arrayOfTasks.length ; i++) {
    //         console.log(`${arrayOfTasks[i].id} === ${taskId}`);
    // }
    arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
    addTaskToLocalStorageFrom(arrayOfTasks)
};


function toggleStatusTaskWith(taskId) {
    for (let i = 0; i < arrayOfTasks.length; i++){
        if (arrayOfTasks[i].id == taskId){
            arrayOfTasks[i].completed == false
            ? arrayOfTasks[i].completed = true
            :arrayOfTasks[i].completed = false;
        };
    };
    addTaskToLocalStorageFrom(arrayOfTasks)
};


function createElementDelete () {
    let div = document.createElement("div");
    div.className = "delete-all";
    div.innerHTML =  "Delete All";
    tasksDiv.prepend(div);
    div.addEventListener("click",function () {
        tasksDiv.innerHTML = "" ;
        window.localStorage.clear();
    });
};


