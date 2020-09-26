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
        const tasks = Store.getTasks();
        tasks.forEach((task) => UI.addTaskToList(task));
    }

    static addTaskToList(task) {
        const list = document.querySelector('#task-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${task.taskName}</td>
        <td>${task.priority}</td>
        <td>${task.targetDate}</td>
        <td>${task.completionDate}</td>
        <td>${task.isCompleted}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
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
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getTasks() {
        let tasks;
        if (localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        return tasks;
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

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#task-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const taskName = document.querySelector('#taskName').value;
    const targetDate = document.querySelector('#targetDate').value;
    const completionDate = document.querySelector('#completionDate').value;

    // Validate
    if (taskName === '' || targetDate === '' || completionDate === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instatiate book
        const task = new Task(taskName, targetDate, completionDate);
        // Add Book to UI
        UI.addTaskToList(book);
        // Add book to store
        Store.addBook(book);
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