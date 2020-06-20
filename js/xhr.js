let xhr = new XMLHttpRequest();

const url = "./data/data.json";
let firstMark = true;

xhr.open('GET',url);

xhr.onload = (evt) => {
    if(evt.target.status === 200){
        // init basic divs
        init();
        // store data fr JSON file to local storage initially 
        storeTodoItems(evt);    
        // init todo items to todo-list and completed-list    
        initTodoItems();
        // bind all btn Events
        bandAllEvent();
    }
    console.log(evt.status);
}

xhr.send();

let todoItemsMap = {};

/**
 * init add new to-do item and hide it
 */
let init = function (){
    document.getElementById("add-new").style.display = "none";
    document.getElementById("add-btn").onclick=addNewTodoItem;

}

/**
 * initially store data fr JSON file to local storage
 * @param {*} evt 
 */
let storeTodoItems = function (evt) {
    // make sure just store one time
    console.log("First: " + window.localStorage.getItem("firstTimeUserMark"));
    if(window.localStorage.getItem("firstTimeUserMark") !== "marked"){
        console.log("first marked!");
        setTodoItemsToMap(evt);
        setMapToLocalStorage();
        window.localStorage.setItem("firstTimeUserMark", "marked");
    }
}

/**
 * set new todo items to the todoItemsMap
 * @param {*} evt 
 */
let setTodoItemsToMap = function (evt) {
    let todoItemsList = JSON.parse(evt.target.responseText);
    todoItemsList.forEach(todoItem => {
        todoItemsMap[todoItem.title] = todoItem;
    });
}

/**
 * get todo item object
 * @param {*} title 
 */
let getTodoItemByTitle = function (title) {
    return getTodoItemsFrLocalStorage()[title];
}

/**
 * set updated map to local storage
 */
let setMapToLocalStorage = function () {
    localStorage.setItem("todoItemsMap", JSON.stringify(todoItemsMap));
    console.log(JSON.stringify(todoItemsMap));
    console.log(JSON.parse(localStorage.getItem("todoItemsMap")));
}

/**
 * get todo items list fr map in localstorage
 */
let getTodoItemsFrLocalStorage = function () {
    console.log(todoItemsMap);
    todoItemsMap = JSON.parse(window.localStorage.getItem("todoItemsMap"));
    console.log(todoItemsMap);
    
    return todoItemsMap;
}


/**
 * delete todo item fr map and update map in local storage
 * @param title of the todo item
 */
let deleteTodoItem = function (title) {
    delete todoItemsMap[title];
    console.log(todoItemsMap);
    setMapToLocalStorage();
}


/**
 * display to-do items to to-do list and complete list
 */
let initTodoItems = function(){
    let todoItemHolder = document.getElementById('todo-list');
    let completeItemHolder = document.getElementById('complete-list');
    console.log("initTodoItems");

    console.log(todoItemsMap);

    getTodoItemsFrLocalStorage();

    console.log(todoItemsMap);

    let keys = Object.keys(todoItemsMap);
    console.log("keys: " + keys);

    // while( i-- ){
        
    //     let todoItem = getTodoItemByTitle(keys[i]);
    //     todoItems.push(todoItem);
    // }
    keys.forEach(key => {
        let theTodoItem = todoItemsMap[key];
        console.log(theTodoItem);
        if(theTodoItem.status){
            appendTodoItem(theTodoItem,completeItemHolder);
        }else {
            appendTodoItem(theTodoItem,todoItemHolder);
        }
        console.log("stored into local storage");
    })
    
}

/**
 * bind events to all btns
 */
let bandAllEvent = function (){

    let todoItemHolder = document.getElementById('todo-list');
    let completeItemHolder = document.getElementById('complete-list');

    // bind event to btns in todo Item Holder
    for(let i = 0; i < todoItemHolder.children.length; i ++){
        console.log(i);
        if(todoItemHolder.children[i].matches("li")){
            bandEventInTodoList(todoItemHolder.children[i]);
        }
    }
    // bind event to btns in completed Item Holder
    for(let i = 0; i < completeItemHolder.children.length; i ++){
        console.log(i);
        if(completeItemHolder.children[i].matches("li")){
            bandEventInTodoList(completeItemHolder.children[i]);
        }
    }

    // bind event to add new todo btn
    bandAddNewBtn();

}

/**
 * bind event to add new todo btn
 */
let bandAddNewBtn = function () {
    let addNewBtn = document.getElementById("add-new-btn");
    console.log("---" + addNewBtn);
    // show & hide add new div
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

/**
 * band event listener to checkbox and view button
 * @param {*} theTodoItemElement 
 */
let bandEventInTodoList = function (theTodoItemElement) {
    console.log ("bind event to the buttons in to do div");
    console.log(theTodoItemElement);

    let checkbox = theTodoItemElement.querySelector("input[type=checkbox]");
    let viewBtn = theTodoItemElement.querySelector("button.view");
    let deleteBtn = theTodoItemElement.querySelector("button.delete");
    let title = theTodoItemElement.querySelector("label").innerText;

    console.log(viewBtn);

    deleteBtn.addEventListener("click", () => {
        // window.localStorage.removeItem(title);
        deleteTodoItem(title);
        location.reload();
    });

    // add event listener on checkbox change, and make change on item in localstorage
    checkbox.addEventListener("change", (event) => {
        let theTodoItem = getTodoItemByTitle(title);
        window.localStorage.removeItem(title);
        if(theTodoItem.status){
            theTodoItem.status = false;
        }else {
            theTodoItem.status = true;
        }
        console.log(theTodoItem);
        // window.localStorage.setItem(title, JSON.stringify(theTodoItem));
        todoItemsMap[theTodoItem.title] = theTodoItem;
        console.log(todoItemsMap);
        setMapToLocalStorage();

        location.reload();
    });

    // add event listener on viewBtn click, and show detail views for the sepcific item
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



/**
 * generate new todo item object and added to local storage, and call appendTodoItem function
 */
let addNewTodoItem = function () {
    console.log("addNewTodoItem");

    let todoItem = {
        "title" : document.getElementById("title-input").value,
        "description" : document.getElementById("description-input").value,
        "date" : document.getElementById("date-input").value,
        "time" : document.getElementById("time-input").value,
        "status" : false 
    }

    console.log("new todo item added: " + todoItem);

    console.log("Add new todo item to local storage.");

    // window.localStorage.setItem(todoItem.title,  JSON.stringify(todoItem));

    todoItemsMap[todoItem.title] = todoItem;
    setMapToLocalStorage();

    console.log("append new todo item to todo list");

    appendTodoItem(todoItem,document.getElementById('todo-list'));

}

// let createDetailView = function (to)


/**
 * append todoItem and it's detailview (hiding) to todo-item list holder
 * @param {*} theTodoItem 
 * @param {*} parent 
 */
let appendTodoItem = function(theTodoItem, parent){
    parent.appendChild(createNewTodoItem(theTodoItem));
    parent.appendChild(createDetailView(theTodoItem));
}

/**
 * remove appended child
 * @param {*} theTodoItem 
 * @param {*} parent 
 */
let detouchTodoItem = function(theTodoItem, parent){
    parent.removeChild(theTodoItem);
    parent.removeChild(document.getElementById("detail-view-div" + theTodoItem.title));
}

/**
 * dynamically generate new todo item
 * @param {*} theTodoItem 
 */
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
    let deleteButton = document.createElement("button");
    deleteButton.innerText="Delete";
    deleteButton.className="delete";
    
    listElement.appendChild(checkBox);
	listElement.appendChild(label);
	listElement.appendChild(viewButton);
    listElement.appendChild(deleteButton);
    
    return listElement;
}

/**
 * dynamically generate new to-do item details view
 * @param {*} todoItem 
 */
let createDetailView = function (todoItem) {


    let detailViewDiv = document.createElement("div");
    detailViewDiv.id = "detail-view-div" + todoItem.title;
    
    // let titleP = document.createElement("p");

    // titleP.innerText = 'Title: ' + todoItem.title;

    // let titleLabel = document.createElement("label");
    // titleLabel.innerText = todoItem.title;

    let table = document.createElement("table");
    table.className = "table";

    let titleTr = document.createElement("tr");
    let titleTd = document.createElement("td");
    titleTd.innerText = "Title:";
    let titleValue = document.createElement("td");
    titleValue.innerText = todoItem.title;

    titleTr.appendChild(titleTd);
    titleTr.appendChild(titleValue);

    let descriTr = document.createElement("tr");
    let descriTd = document.createElement("td");
    descriTd.innerText = "Description:";
    let descriValue = document.createElement("td");
    descriValue.innerText = todoItem.description;

    descriTr.appendChild(descriTd);
    descriTr.appendChild(descriValue);

    let dateTr = document.createElement("tr");
    let dateTd = document.createElement("td");
    dateTd.innerText = "Date:";
    let dateValue = document.createElement("td");
    dateValue.innerText = todoItem.date;

    dateTr.appendChild(dateTd);
    dateTr.appendChild(dateValue);

    let timeTr = document.createElement("tr");
    let timeTd = document.createElement("td");
    timeTd.innerText = "Time:";
    let timeValue = document.createElement("td");
    timeValue.innerText = todoItem.time;

    timeTr.appendChild(timeTd);
    timeTr.appendChild(timeValue);


    let statusTr = document.createElement("tr");
    let statusTd = document.createElement("td");
    statusTd.innerText="Status: ";
    let statusValue = document.createElement("td");
    if(todoItem.status) {
        statusValue.innerText = "Completed!";
    }else{
        statusValue.innerText = "UnCompleted!";
    }
    statusTr.appendChild(statusTd);
    statusTr.appendChild(statusValue);


    // let descriP = document.createElement("p");
    // descriP.innerText = "Description: " + todoItem.description;

    // let dateP = document.createElement("p");
    // dateP.innerText = "Date: " + todoItem.date;

    // let timeP = document.createElement("p");
    // timeP.innerText = "Time: " + todoItem.time;

    // let statusP = document.createElement("p");
    // if(todoItem.status) {
    //     statusP.innerText = "Status: Completed!";
    // }else{
    //     statusP.innerText = "Status: UnCompleted!";
    // // }
    table.appendChild(titleTr);
    table.appendChild(descriTr);
    table.appendChild(dateTr);
    table.appendChild(timeTr);
    table.appendChild(statusTr);

    
    detailViewDiv.appendChild(table);
    // detailViewDiv.appendChild(descriP);
    // detailViewDiv.appendChild(dateP);
    // detailViewDiv.appendChild(timeP);
    // detailViewDiv.appendChild(statusP);

    // hide detail view when generate 
    detailViewDiv.style.display = "none";

    return detailViewDiv;
}
