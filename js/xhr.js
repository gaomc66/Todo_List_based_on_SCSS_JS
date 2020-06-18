let xhr = new XMLHttpRequest();

const url = "./data/data.json";

console.log("test");
xhr.open('GET',url);

xhr.onload = (evt) => {
    if(evt.target.status === 200){
        let todoItems = JSON.parse(evt.target.responseText);
        addTodoItems(todoItems);
    }
    console.log(evt.status);
}

xhr.send();

let addTodoItems = function(todoItems){
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


