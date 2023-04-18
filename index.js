//console.log("hello world")
import './style.css';
import { Fetch } from './customFetch.js';

/* 
  client side
    template: static template
    logic(js): MVC(model, view, controller): used to server side technology, single page application
        model: prepare/manage data,
        view: manage view(DOM),
        controller: business logic, event bindind/handling

  server side
    json-server
    CRUD: create(post), read(get), update(put, patch), delete(delete)


*/

//read
/* fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    }); */

//IIFE
//todos
/* 
    hashMap: faster to search
    array: easier to iterate, has order


*/

const APIs = (() => {
  const createTodo = (newTodo) => {
    console.log(newTodo);
    return fetch('http://localhost:3000/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json());
  };

  const deleteTodo = (id) => {
    return fetch('http://localhost:3000/todos/' + id, {
      method: 'DELETE',
    }).then((res) => res.json());
  };

  const getTodos = () => {
    return fetch('http://localhost:3000/todos').then((res) => res.json());
  };

  const updateTodo = (data, completed, id) => {
    console.log(data);
    return fetch('http://localhost:3000/todos/' + id, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        content: data,
        completed: completed,
      }),
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  };

  return {
    createTodo,
    deleteTodo,
    getTodos,
    updateTodo,
  };
})();

//IIFE
//todos
/* 
  hashMap: faster to search
  array: easier to iterate, has order
*/
const Model = (() => {
  class State {
    #todos; //private field
    #completedTodos;
    #onChange; //function, will be called when setter function todos is called
    constructor() {
      this.#todos = [];
      this.#completedTodos = []; //added completedtodos
    }
    get todos() {
      return this.#todos;
    }
    set todos(newTodos) {
      // reassign value
      console.log('setter function');
      this.#todos = newTodos;
      this.#onChange?.(); // rendering
    }

    subscribe(callback) {
      //subscribe to the change of the state todos
      this.#onChange = callback;
    }

    getTodoById(id) {
      console.log(typeof id);
      return this.#todos.find((todo) => todo.id === id);
    }

    togglePendingTodo(id) {
      var index = 0;
      //console.log("what is completedtodo = ", this.#completedTodos);
      console.log(id);
      for (let i = 0; i < this.#todos.length; i++) {
        if (this.#todos[i]['id'] == Number(id)) {
          console.log('found todo');
          index = i;
        }
      }
      this.#todos[index]['completed'] = 'true';
      this.#completedTodos.push(this.#todos[index]);
      this.#onChange?.();
      console.log(typeof id);
      updateTodo(this.#todos[index].content, this.#todos[index].completed, id);
    }

    toggleCompletedTodo(id) {
      var index = 0;
      console.log(id);
      for (let i = 0; i < this.#completedTodos.length; i++) {
        if (this.#completedTodos[i]['id'] == Number(id)) {
          console.log('found todo');
          index = i;
        }
      }
      this.#completedTodos[index].completed = 'false';
      this.#onChange?.();
      console.log(typeof id);
      updateTodo(
        this.#completedTodos[index].content,
        this.#completedTodos[index].completed,
        id
      );
    }
  }
  const { getTodos, createTodo, deleteTodo, updateTodo } = APIs;
  return {
    State,
    getTodos,
    createTodo,
    deleteTodo,
    updateTodo,
  };
})(); //API, View?
/* 
/* 
  todos = [
      {
          id:1,
          content:"eat lunch"
      },
      {
          id:2,
          content:"eat breakfast"
      }
  ]
*/
const View = (() => {
  const todolistEl = document.querySelector('.todo-list');
  const submitBtnEl = document.querySelector('.submit-btn');
  const inputEl = document.querySelector('.input');
  const completedList = document.querySelector('.completed-list');

  const renderTodos = (todos) => {
    let todosTemplate = '';
    let completedTodosTemplate = '';
    todos.forEach((todo) => {
      const liTemplate = `<li>
      <span>${todo.content}</span>
      <button class="edit-btn" id="${todo.id}"><i class='fa fa-pencil'></i> </button>
      <button class="delete-btn" id="${todo.id}"><i class="fa fa-trash"></i></button>
      <button class="move-btn" id="${todo.id}"><i class="fa fa-arrow-right"></i></button>
      </li>`;
      const liCompleteTemplate = `<li class = "completed-item">
      <button class="move-btn" id="${todo.id}"><i class="fa fa-arrow-left"></i></button>
      <span>${todo.content}</span>
      <button class="edit-btn" id="${todo.id}"><i class='fa fa-pencil'></i> </button>
      <button class="delete-btn" id="${todo.id}"><i class="fa fa-trash"></i></button>
  
      </li>`;
      if (todo.completed == 'true') {
        completedTodosTemplate += liCompleteTemplate;
      } else {
        todosTemplate += liTemplate;
      }
    });
    if (todos.length === 0) {
      todosTemplate = '<h4>no task to display!</h4>';
    }
    todolistEl.innerHTML = todosTemplate;
    completedList.innerHTML = completedTodosTemplate;
  };

  const clearInput = () => {
    inputEl.value = '';
  };

  return {
    renderTodos,
    submitBtnEl,
    inputEl,
    clearInput,
    todolistEl,
    completedList,
  };
})();

const Controller = ((view, model) => {
  const state = new model.State();
  const init = () => {
    model.getTodos().then((todos) => {
      todos.reverse();
      state.todos = todos;
    });
  };

  const handleSubmit = () => {
    view.submitBtnEl.addEventListener('click', (event) => {
      /* 
              1. read the value from input
              2. post request
              3. update view
          */
      const inputValue = view.inputEl.value;
      model
        .createTodo({ content: inputValue, completed: 'false' })
        .then((data) => {
          state.todos = [data, ...state.todos];
          view.clearInput();
        });
    });
  };

  const handleDelete = () => {
    //event bubbling
    /* 
          1. get id
          2. make delete request
          3. update view, remove
      */
    view.todolistEl.addEventListener('click', (event) => {
      if (event.target.parentNode.className === 'delete-btn') {
        const id = Number(event.target.parentNode.id);
        console.log('id', typeof id);
        model.deleteTodo(+id).then((data) => {
          state.todos = state.todos.filter((todo) => todo.id !== +id);
        });
      }
    });
  };

  const deleteCompletedItem = () => {
    //event bubbling
    /* 
          1. get id
          2. make delete request
          3. update view, remove
      */
    view.completedList.addEventListener('click', (event) => {
      if (event.target.parentNode.className === 'delete-btn') {
        const id = Number(event.target.parentNode.id);
        console.log('id', typeof id);
        model.deleteTodo(id).then((data) => {
          state.todos = state.todos.filter((todo) => todo.id !== id);
        });
      }
    });
  };

  const editPendingTask = () => {
    view.todolistEl.addEventListener('click', (event) => {
      if (event.target.parentNode.className === 'edit-btn') {
        const id = Number(event.target.parentNode.id);
        //console.log("need to edit");
        let li = event.target.parentNode.parentNode;
        let span = li.querySelector('span');
        let edited = span.getAttribute('contenteditable');
        if (edited == 'true') {
          span.setAttribute('contenteditable', 'false');
          console.log('text = ', span.innerText);
          model.updateTodo(span.innerText, 'false', id);
        } else {
          span.setAttribute('contenteditable', 'true');
        }
        console.log('id = ', id);
      }
      event.preventDefault();
    });
  };

  const editCompletedTask = () => {
    view.completedList.addEventListener('click', (event) => {
      if (event.target.parentNode.className === 'edit-btn') {
        const id = Number(event.target.parentNode.id);
        //console.log("need to edit");
        let li = event.target.parentNode.parentNode;
        let span = li.querySelector('span');
        let edited = span.getAttribute('contenteditable');
        if (edited == 'true') {
          span.setAttribute('contenteditable', 'false');
          console.log('text = ', span.innerText);
          model.updateTodo(span.innerText, 'true', id);
        } else {
          span.setAttribute('contenteditable', 'true');
        }
        console.log('id = ', id);
      }
      event.preventDefault();
    });
  };

  const moveTaskToCompleted = () => {
    view.todolistEl.addEventListener('click', (event) => {
      if (event.target.parentNode.className === 'move-btn') {
        const id = event.target.parentNode.id;
        state.togglePendingTodo(id);
      }
    });
  };

  const moveTaskToPending = () => {
    view.completedList.addEventListener('click', (event) => {
      if (event.target.parentNode.className === 'move-btn') {
        const id = event.target.parentNode.id;
        state.toggleCompletedTodo(id);
      }
    });
  };

  const bootstrap = () => {
    init();
    handleSubmit();
    handleDelete();
    deleteCompletedItem();
    editPendingTask(),
      editCompletedTask(),
      moveTaskToCompleted(),
      moveTaskToPending(),
      state.subscribe(() => {
        view.renderTodos(state.todos);
      });
  };
  return {
    bootstrap,
  };
})(View, Model); //ViewModel

Controller.bootstrap();
