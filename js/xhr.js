let xhr = new XMLHttpRequest();

const url = "./data/data.json";

xhr.open('GET',url);

xhr.onload = (evt) => {
    if(evt.target.status === 200){
        // parse todoItems from JSON file
        let todoItems = JSON.parse(evt.target.responseText);
        initTodoItems(todoItems);
        bandAllEvent();
    }
    console.log(evt.status);
}

xhr.send();


let bandAllEvent = function (){

    let todoItemHolder = document.getElementById('todo-list');
    let completeItemHolder = document.getElementById('complete-list');

    console.log(todoItemHolder);
    for(let i = 0; i < todoItemHolder.children.length; i ++){
        console.log(i);
        if(todoItemHolder.children[i].matches("li")){
            bandEvent(todoItemHolder.children[i]);
        }
    }
}

let bandEvent = function (theTodoItem) {
    console.log ("bind event to the buttons in to do div");
    console.log(theTodoItem);

    let checkbox = theTodoItem.querySelector("input[type=checkbox]");
    let viewBtn = theTodoItem.querySelector("button.view");
    let deleteBtn = theTodoItem.querySelector("button.delete");
    let title = theTodoItem.querySelector("label").innerText;

    console.log(viewBtn);

    deleteBtn.onclick=deleteTodoItem("test");

    viewBtn.addEventListener("click", function (event){

        let todoItemTitle = theTodoItem.querySelector("label").innerText;
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



let deleteTodoItem = function (test){
    console.log(test);
}

// let createDetailView = function (to)

let initTodoItems = function(todoItems){

    let todoItemHolder = document.getElementById('todo-list');
    let completeItemHolder = document.getElementById('complete-list');

    todoItems.forEach(theTodoItem => {
        console.log(theTodoItem);
        if(theTodoItem.status){
            addTodoItem(theTodoItem,todoItemHolder);
        }else {
            addTodoItem(theTodoItem,completeItemHolder);
        }
        window.localStorage.setItem(theTodoItem.title,  JSON.stringify(theTodoItem));
        console.log("stored into local storage");
    });

}

let addTodoItem = function(theTodoItem, parent){
    parent.appendChild(createNewTodoItem(theTodoItem));
    parent.appendChild(createDetailView(theTodoItem));

}

let createNewTodoItem = function(theTodoItem){

    // create <li>
    let listElement = document.createElement("li");

    // create <input type="checkbox">
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";

    // create <label>
    let label = document.createElement("label");
    label.innerText = theTodoItem.title;

    // create <button> view </button>
    let viewButton = document.createElement("button");
    viewButton.innerText = "View";
    viewButton.className = "view";

    // create <button> delete </button>
    let deleteButton = document.createElement("button");
    deleteButton.innerText="Delete";
    deleteButton.className="delete";
    
    listElement.appendChild(checkBox);
	listElement.appendChild(label);
	listElement.appendChild(viewButton);
    listElement.appendChild(deleteButton);
    
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
    statusP.innerText = "Status: " + todoItem.status;

    detailViewDiv.appendChild(titleP);
    detailViewDiv.appendChild(descriP);
    detailViewDiv.appendChild(dateP);
    detailViewDiv.appendChild(timeP);
    detailViewDiv.appendChild(statusP);

    // hide detail view when generate 
    detailViewDiv.style.display = "none";

    return detailViewDiv;



}
