import "./style.css"
import { ApiService } from "./utils/api-service";

const apiService = new ApiService('localhost', 4200)

const authForm = document.querySelector('#auth-form');
const root = document.querySelector('#app');
const emailField = authForm.querySelector('#email');
const passwordField = authForm.querySelector('#password');
const submitButton = authForm.querySelector('#submit-btn');
const todosButton = document.querySelector('#todos-btn');
const logoutButton = document.querySelector('#logout-btn');
const todosTitle = document.querySelector('#todos-title');
const user = document.querySelector('#user');


const validatePage = (isAuth = apiService.isAuth) => {
    if (isAuth) {
        // submitButton.disabled = false;
        authForm.style.display = 'none';
        logoutButton.style.display = 'block';
        todosTitle.style.display = 'block';
        user.innerText = apiService.email
        renderAddTodoForm()
        getTodos()
    } else {
        todosTitle.style.display = 'none';
        logoutButton.style.display = 'none';
        authForm.style.display = 'block';
        user.innerText = ''
        document.getElementById('todos-wrapper')?.remove();
    }
}

window.addEventListener('load', () => {
    const isAuth = apiService.isAuth;
    validatePage(isAuth)
})

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const credentials = {
        email: emailField.value,
        password: passwordField.value
    }
    const { jwt } = await apiService.login(credentials);
    const isAuth = apiService.isAuth;

    if (jwt && isAuth) {
        emailField.value = ''
        passwordField.value = ''
        validatePage(true)
    } else {
        submitButton.disabled = false;
    }
})

const logout = () => {
    apiService.logout();
    validatePage(false);
}

const getTodos = async () => {
    const todos = await apiService.todos();
    document.getElementById('todos-wrapper')?.remove();

    if (todos.length) {
        renderTodos(todos)
   }
}

const renderAddTodoForm = () => {
    const prevForm = document.getElementById('add-todo-form')

    if (prevForm) prevForm.remove()

    const addTodoFormTemplate = document.querySelector('#add-todo-form-template');
    const form = addTodoFormTemplate.content.cloneNode(true);
    document.getElementById('todos-title').appendChild(form);

    const addTodoForm = document.querySelector('#add-todo-form');
    const titleField = document.getElementById('title');
    const descriptionField = document.getElementById('description');
    addTodoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const todoData = {
            done: false,
            title: titleField.value,
            description: descriptionField.value
        }
        await apiService.addTodo(todoData);
        titleField.value = ''
        descriptionField.value = ''

        await getTodos();
    })
}

const renderTodos = (todos) => {
    document.getElementById('todos-wrapper')?.remove();
    const wrapper = document.createElement('div');
    wrapper.id = 'todos-wrapper'

    todos.forEach(todo => {
        const todoWrapper = document.createElement('div');
        todoWrapper.className = 'todo'
        const delBtn = document.createElement('button');
        delBtn.innerText = 'x'
        delBtn.className = 'mui-btn--danger'
        const title = document.createElement('div');
        title.className = `mui--text-headline ${todo.done ? 'strike' : ''}`
        todoWrapper.addEventListener("click", async (e) => {
            if (e.target === delBtn) {
                await apiService.removeTodo(todo._id)
                validatePage(apiService.isAuth);
            } else {
                await apiService.markTodo(todo);
                validatePage(apiService.isAuth);
            }
        })
        title.innerText = todo.title;
        const description = document.createElement('div');
        description.innerText = todo.description;
        description.className = `${todo.done ? 'strike' : ''}`
        todoWrapper.appendChild(title);
        todoWrapper.appendChild(description);
        todoWrapper.appendChild(delBtn);
        wrapper.appendChild(todoWrapper);
    })

    root.appendChild(wrapper)
}

logoutButton.addEventListener('click', logout);

todosButton.addEventListener('click', getTodos);