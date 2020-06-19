let xhr = new XMLHttpRequest();

const url = "./data/data.json";
let firstMark = true;

xhr.open('GET',url);

xhr.onload = (evt) => {
    if(evt.target.status === 200){
        // parse todoItems from JSON file
        init();
        storeTodoItems(evt);        
        initTodoItems();
        bandAllEvent();
    }
    console.log(evt.status);
}

xhr.send();

let init = function (){
    document.getElementById("add-new").style.display = "none";
    document.getElementById("add-btn").onclick=addNewTodoItem;

}

let storeTodoItems = function (evt) {
    
    if(Object.keys(localStorage).length < 1){
        let todoItems = JSON.parse(evt.target.responseText);

        console.log(todoItems);
        todoItems.forEach(theTodoItem => {
            window.localStorage.setItem(theTodoItem.title, JSON.stringify(theTodoItem));
        });
    }
    
}

let initTodoItems = function(){

    let todoItemHolder = document.getElementById('todo-list');
    let completeItemHolder = document.getElementById('complete-list');

    let todoItems = [],
        keys = Object.keys(localStorage),
        i = keys.length;

        console.log("keys: " + keys);

    while( i-- ){
        let todoItem = JSON.parse(window.localStorage.getItem(keys[i]));
        todoItems.push(todoItem);
    }

    todoItems.forEach(theTodoItem => {
        console.log(theTodoItem);
        if(theTodoItem.status){
            appendTodoItem(theTodoItem,completeItemHolder);
        }else {
            appendTodoItem(theTodoItem,todoItemHolder);
        }
        console.log("stored into local storage");
    });
}

let bandAllEvent = function (){

    bandAddNewBtn();

    let todoItemHolder = document.getElementById('todo-list');
    let completeItemHolder = document.getElementById('complete-list');

    console.log(todoItemHolder);
    for(let i = 0; i < todoItemHolder.children.length; i ++){
        console.log(i);
        if(todoItemHolder.children[i].matches("li")){
            bandEventInTodoList(todoItemHolder.children[i]);
        }
    }

    for(let i = 0; i < completeItemHolder.children.length; i ++){
        console.log(i);
        if(completeItemHolder.children[i].matches("li")){
            bandEventInTodoList(completeItemHolder.children[i]);
        }
    }

}

let bandAddNewBtn = function () {
    let addNewBtn = document.getElementById("add-new-btn");
    console.log("---" + addNewBtn);
    addNewBtn.addEventListener("click", function (event) {
        let addNewDiv = document.getElementById("add-new");
        // toggle Hide and Show 
        if(addNewDiv.style.display === "none"){
            addNewDiv.style.display = "grid";
        }else {
            addNewDiv.style.display = "none";
        }
    });

}

let bandEventInTodoList = function (theTodoItemElement) {
    console.log ("bind event to the buttons in to do div");
    console.log(theTodoItemElement);

    let checkbox = theTodoItemElement.querySelector("input[type=checkbox]");
    let checked = checkbox.checked;
    let viewBtn = theTodoItemElement.querySelector("button.view");
    // let deleteBtn = theTodoItem.querySelector("button.delete");
    let title = theTodoItemElement.querySelector("label").innerText;

    console.log(viewBtn);

    // deleteBtn.onclick=detouchTodoItem();

    checkbox.addEventListener("change", (event) => {
        let theTodoItem = JSON.parse(window.localStorage.getItem(title));
        window.localStorage.removeItem(title);
        if(theTodoItem.status){
            theTodoItem.status = false;
        }else {
            theTodoItem.status = true;
        }
        console.log(theTodoItem);
        window.localStorage.setItem(title, JSON.stringify(theTodoItem));

        location.reload();
    });

    viewBtn.addEventListener("click", function (event){

        console.log("showDetails");
        let divId = "detail-view-div" + title;
        console.log(divId);
        let detailViewDiv = document.getElementById(divId);

        // console.log(todoItemTitle);
        // getTodoItemByTitle(todoItemTitle);

        // toggle Hide and Show 
        if(detailViewDiv.style.display === "none"){
            detailViewDiv.style.display = "block";
        }else {
            detailViewDiv.style.display = "none";
        }
       
    });
}

let getTodoItemByTitle = function (title) {
    let todoItem = localStorage.getItem(title);
    console.log(todoItem);
}



let addNewTodoItem = function () {
    console.log("addNewTodoItem");

    let todoItem = {
        "title" : document.getElementById("title-input").value,
        "description" : document.getElementById("description-input").value,
        "date" : document.getElementById("date-input").value,
        "time" : document.getElementById("time-input").value
    }

    console.log("new todo item added: " + todoItem);

    console.log("Add new todo item to local storage.");

    window.localStorage.setItem(todoItem.title,  JSON.stringify(todoItem));

    console.log("append new todo item to todo list");

    appendTodoItem(todoItem,document.getElementById('todo-list'));

}

// let createDetailView = function (to)



let appendTodoItem = function(theTodoItem, parent){
    parent.appendChild(createNewTodoItem(theTodoItem));
    parent.appendChild(createDetailView(theTodoItem));
}

let detouchTodoItem = function(theTodoItem, parent){
    parent.removeChild(theTodoItem);
    parent.removeChild(document.getElementById("detail-view-div" + theTodoItem.title));
}

let createNewTodoItem = function(theTodoItem){

    // create <li>
    let listElement = document.createElement("li");

    // create <input type="checkbox">
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";

    if(theTodoItem.status){
        checkBox.checked = true;
    }

    // create <label>
    let label = document.createElement("label");
    label.innerText = theTodoItem.title;

    // create <button> view </button>
    let viewButton = document.createElement("button");
    viewButton.innerText = "View";
    viewButton.className = "view";

    // create <button> delete </button>
    // let deleteButton = document.createElement("button");
    // deleteButton.innerText="Delete";
    // deleteButton.className="delete";
    
    listElement.appendChild(checkBox);
	listElement.appendChild(label);
	listElement.appendChild(viewButton);
    // listElement.appendChild(deleteButton);
    
    return listElement;
}

let createDetailView = function (todoItem) {


    let detailViewDiv = document.createElement("div");
    detailViewDiv.id = "detail-view-div" + todoItem.title;
    
    let titleP = document.createElement("p");

    titleP.innerText = 'Title: ' + todoItem.title;

    // let titleLabel = document.createElement("label");
    // titleLabel.innerText = todoItem.title;

    let descriP = document.createElement("p");
    descriP.innerText = "Description: " + todoItem.description;

    let dateP = document.createElement("p");
    dateP.innerText = "Date: " + todoItem.date;

    let timeP = document.createElement("p");
    timeP.innerText = "Time: " + todoItem.time;

    let statusP = document.createElement("p");
    if(todoItem.status) {
        statusP.innerText = "Status: Completed!";
    }else{
        statusP.innerText = "Status: UnCompleted!";
    }

    detailViewDiv.appendChild(titleP);
    detailViewDiv.appendChild(descriP);
    detailViewDiv.appendChild(dateP);
    detailViewDiv.appendChild(timeP);
    detailViewDiv.appendChild(statusP);

    // hide detail view when generate 
    detailViewDiv.style.display = "none";

    return detailViewDiv;
}
