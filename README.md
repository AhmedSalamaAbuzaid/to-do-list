# to-do-list-tutorial
Get started
The todo list app we’ll build in this tutorial will be pretty basic. A user can add a task, mark a task as completed and delete an already added task. I’ll explain how to build each feature, but you must follow along by typing the code and running it on your end to get the most out of this tutorial.

I recommend using JSFiddle while working through this tutorial, but feel free to use other code playgrounds or your local text editor if you prefer. Without further ado, grab the markup and styles for the app on JSFiddle. If you’re using JSFiddle, you can hit the Fork button to create a new fiddle of your own.

Add a todo
The first thing we need to do is set up an array where we’ll place the todo list items. Each todo item will be an object with three properties: text, a string which holds whatever the user types into the text input, checked, a boolean which helps us know if a task has been marked completed or not, and id, a unique identifier for the item.

Once a new task is added, we’ll create a new todo object, push it into the array and render the value of the text property on the screen. When a todo is marked as completed, we’ll toggle the checked property to true, and when the user deletes a todo, we’ll locate the todo item in the array using its id and remove it.

Let’s start by adding a todo item to our list. To do so, we need to listen for the submit event on the form element, and then invoke a new addTodo() function when the form is submitted.

Update the JavaScript pane on JSFiddle to look like this:
```
// This is the array that will hold the todo list items
let todoItems = [];

// This function will create a new todo object based on the
// text that was entered in the text input, and push it into
// the `todoItems` array
function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  todoItems.push(todo);
  console.log(todoItems);
}

// Select the form element
const form = document.querySelector('.js-form');
// Add a submit event listener
form.addEventListener('submit', event => {
  // prevent page refresh on form submission
  event.preventDefault();
  // select the text input
  const input = document.querySelector('.js-todo-input');

  // Get the value of the input and remove whitespace
  const text = input.value.trim();
  if (text !== '') {
    addTodo(text);
    input.value = '';
    input.focus();
  }
});
```
By default, when a form is submitted, the browser will attempt to submit it to a server which will cause a page refresh. To prevent that from happening, we can stop the default behaviour by listening for the submit event on the form, and using event.preventDefault().

Next, we select the text input and trim its value to remove whitespace from the beginning and end of the string, and then save it in a new variable called text. If the text variable is not equal to an empty string, we pass the text to the addTodo() function which is defined above the event listener.
```
const todo = {
  text,
  checked: false,
  id: Date.now(),
};
```

Within the function, we create a new object for the task and add the properties I mentioned earlier. The text property is set to the function argument, checked is initialised to false, and id is initialised to the number of milliseconds elapsed since January 1, 1970. This id will be unique for each todo item unless you can add more than one task in a millisecond, which I don’t think is possible.
```
todoItems.push(todo);
console.log(todoItems);
```

Finally, the task is pushed to the todoItems array, and the array is logged to the console. In the form event listener after addTodo(text), the value of the text input is cleared by setting it to an empty string, and it’s also focused so that the user can add multiple items to the list without having to focus the input over and over again.

Add a few todo items and view the todoItems array in your browser console. You will see that each todo item is represented by an object in the array. If you’re using JSFiddle, you may need to check the built-in console provided by JSFiddle.

Render the todo items
Once a new todo item is added to the todoItems array, we want the app to be updated with the item rendered on the screen. We can do this pretty easily by appending a new li element for each item to the .js-todo-list element in the DOM.

To achieve this, add a new renderTodo() function above addTodo():
```
function renderTodo(todo) {
  // Select the first element with a class of `js-todo-list`
  const list = document.querySelector('.js-todo-list');

  // Use the ternary operator to check if `todo.checked` is true
  // if so, assign 'done' to `isChecked`. Otherwise, assign an empty string
  const isChecked = todo.checked ? 'done': '';
  // Create an `li` element and assign it to `node`
  const node = document.createElement("li");
  // Set the class attribute
  node.setAttribute('class', `todo-item ${isChecked}`);
  // Set the data-key attribute to the id of the todo
  node.setAttribute('data-key', todo.id);
  // Set the contents of the `li` element created above
  node.innerHTML = `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    <svg><use href="#delete-icon"></use></svg>
    </button>
  `;

  // Append the element to the DOM as the last child of
  // the element referenced by the `list` variable
  list.append(node);
}
```
The renderTodo() function takes a todo object as its only parameter. It constructs a li DOM node using the document.createElement method. On the next line, the class attribute is set to todo-item ${isChecked}. The value of isChecked will be an empty string if the checked property in the todo object is false. Otherwise, it will be ‘done’. You will see the effect of this ‘done’ class in the next section.

Next, a data-key attribute is also set on the li element. It is set to the id property of the todo object and will be used to locate a specific todo item in the DOM later in the tutorial. Following that, the contents of the li element are set using the innerHTML method and finally, the li element is inserted as the last child of the .js-todo-list element.

Change the console.log(todoItems) line in addTodo() to renderTodo(todo) as shown below so that the renderTodo() function is invoked each time a new todo item is added.
```
function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  todoItems.push(todo);
  renderTodo(todo);
}
```
Try it out by adding a few todo items. They should all render on the page.

Mark a task as completed
Let’s add the ability to mark a task as completed. To do so, we need to listen for the click event on the checkbox and toggle the checked property on the corresponding todo item.

Add the following code at the bottom of the JavaScript pane to detect the todo item that is being checked off:
```
// Select the entire list
const list = document.querySelector('.js-todo-list');
// Add a click event listener to the list and its children
list.addEventListener('click', event => {
  if (event.target.classList.contains('js-tick')) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }
});
```
Instead of listening for clicks on individual checkbox elements, we are listening for clicks on the entire list container. When a click event occurs on the list, a check is done to ensure that the element that was clicked is a checkbox. If so, the value of data-key on the checkbox’s parent element is extracted and passed to a new toggleDone() function (shown below) which should be placed below the addTodo() function.
```
function toggleDone(key) {
  // findIndex is an array method that returns the position of an element
  // in the array.
  const index = todoItems.findIndex(item => item.id === Number(key));
  // Locate the todo item in the todoItems array and set its checked
  // property to the opposite. That means, `true` will become `false` and vice
  // versa.
  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
}
```
This function receives the key of the list item that was checked or unchecked and finds the corresponding entry in the todoItems array using the findIndex method. Once we have the index of the todo item, we need to locate it in the todoItems array using bracket notation. The value of the checked property on the todo item is then set to the opposite value.

Finally, the renderTodo() function is called with the todo object passed in. If you run the code now and try checking off an item, it will duplicate the todo item instead of checking off the existing one.
To fix this, we need to check if the current todo item exists in the DOM first, and replace it with the updated node if it does. Change your renderTodo() function as shown below:
``
function renderTodo(todo) {
  const list = document.querySelector('.js-todo-list');
  // select the current todo item in the DOM
  const item = document.querySelector(`[data-key='${todo.id}']`);

  const isChecked = todo.checked ? 'done': '';
  const node = document.createElement("li");
  node.setAttribute('class', `todo-item ${isChecked}`);
  node.setAttribute('data-key', todo.id);
  node.innerHTML = `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    <svg><use href="#delete-icon"></use></svg>
    </button>
  `;

  // If the item already exists in the DOM
  if (item) {
    // replace it
    list.replaceChild(node, item);
  } else {
    // otherwise append it to the end of the list
    list.append(node);
  }
}
```
First, the current todo item is selected. If it exists in the DOM, the element will be returned and subsequently replaced. If the item does not exist (as is the case for new todo items), it will be added at the end of the list.


Delete todo items
Similar to the way we implemented the last feature, we’ll listen for clicks on the .js-delete-todo element, then grab the key of the parent and pass it off to a new deleteTodo function which will remove the corresponding todo object in todoItems array send the todo item to renderTodo() to be removed from the DOM.

First, let’s detect when the delete button is clicked:
```
const list = document.querySelector('.js-todo-list');
list.addEventListener('click', event => {
  if (event.target.classList.contains('js-tick')) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  // add this `if` block
  if (event.target.classList.contains('js-delete-todo')) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});
```
Next, create the deleteTodo() function below toggleDone() as shown below:
```
function deleteTodo(key) {
  // find the corresponding todo object in the todoItems array
  const index = todoItems.findIndex(item => item.id === Number(key));
  // Create a new object with properties of the current todo item
  // and a `deleted` property which is set to true
  const todo = {
    deleted: true,
    ...todoItems[index]
  };
  // remove the todo item from the array by filtering it out
  todoItems = todoItems.filter(item => item.id !== Number(key));
  renderTodo(todo);
}
```
The renderTodo() function also needs to be updated as follows:
```
function renderTodo(todo) {
  const list = document.querySelector('.js-todo-list');
  const item = document.querySelector(`[data-key='${todo.id}']`);

  // add this if block
  if (todo.deleted) {
    // remove the item from the DOM
    item.remove();
    return
  }

  const isChecked = todo.checked ? 'done': '';
  const node = document.createElement("li");
  node.setAttribute('class', `todo-item ${isChecked}`);
  node.setAttribute('data-key', todo.id);
  node.innerHTML = `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    <svg><use href="#delete-icon"></use></svg>
    </button>
  `;

  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}
```
Now, you should be able to delete tasks by clicking the delete button.



