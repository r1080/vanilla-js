// Task Class: Represents a Task
class Task {
    constructor(taskName, priority, targetDate, completionDate, isCompleted) {
        this.taskName = taskName;
        this.priority = priority;
        this.targetDate = targetDate;
        this.completionDate = completionDate;
        this.isCompleted = isCompleted;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayTasks() {
        const request = async () => {
            const response = await fetch('http://localhost:8442/tracker/tasks');
            const json = await response.json();
            const tasks = Store.getTasks(json);
            tasks.forEach((task) => UI.addTaskToList(task));
        }
        request();
    }

    static addTaskToList(task) {
        const list = document.querySelector('#task-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${task.taskName}</td>
        <td>${task.priority}</td>
        <td>${task.completed}</td>
        <td>${task.targetDate}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a>
        <a href="#" class="btn btn-info btn-sm delete">Edit</a>
        </td>
      `;
        list.appendChild(row);
    }

    static deleteTask(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#task-form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#taskName').value = '';
        document.querySelector('#priority').value = '';
        document.querySelector('#targetDate').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getTasks(json) {
        let tasks;
        console.log(json.data);
        // tasks = JSON.parse(json.data);
        // console.log(tasks);
        return json.data;
    }

    static addTask(task) {
        const tasks = Store.getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('tasks', JSON.stringify(books));
    }
}

class Service {

}

// Event: Display Tasks
document.addEventListener('DOMContentLoaded', UI.displayTasks);

// Event: Add a Book
document.querySelector('#task-form').addEventListener('submit', (e) => {
    // Prevent actual submit form
    e.preventDefault();

    // Get form values
    const taskName = document.querySelector('#taskName').value;
    const priority = document.querySelector('#priority').value;
    const targetDate = document.querySelector('#targetDate').value;

    // Validate
    if (taskName === '' || priority === '' || targetDate === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        const task = new Task(taskName, priority, targetDate);
        console.log(task);
        // Add Task to UI
        UI.addTaskToList(task);
        // Add Task to store
        Store.addTask(task);
        // Show success message
        UI.showAlert('Task Added', 'success');
        // Clear fields
        UI.clearFields();
    }
});

// Event: Remove a Book
document.querySelector('#task-list').addEventListener('click', (e) => {
    // Remove book from UI
    UI.deleteTask(e.target);
    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // Show success message
    UI.showAlert('Task Removed', 'success');
});

document.getElementById('delete-all').addEventListener('click', () => {
    console.log('removing tasks');
    localStorage.removeItem('tasks');
    document.location.reload();
});