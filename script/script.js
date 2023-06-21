document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const taskTable = document.getElementById('taskTable');
    const taskInput = document.getElementById('taskInput');
    const taskPriority = document.getElementById('taskPriority');
    const filterPriority = document.getElementById('filterPriority');
    const searchInput = document.getElementById('searchInput');
    const tbody = taskTable.querySelector('tbody');

    // Carregar as tarefas salvas no localStorage
    function loadTasks() {
        tbody.innerHTML = '';
        for (let i = 0; i < localStorage.length; i++) {
            let taskId = localStorage.key(i);
            let taskData = JSON.parse(localStorage.getItem(taskId));
            addTaskToTable(taskId, taskData.name, taskData.priority, taskData.completed);
        }
    }

    // Adicionar tarefa à tabela
    function addTaskToTable(taskId, taskName, taskPriority, completed) {
        let row = document.createElement('tr');
        if (completed) {
            row.classList.add('completed');
        }
        row.innerHTML = `
            <td><p>${taskName}</p></td>
            <td><p>${taskPriority}</p></td>
            <td class="buttons">
                <button class="btn-edit" data-id="${taskId}"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-delete" data-id="${taskId}"><i class="fa-solid fa-xmark"></i></button>
                <button class="btn-complete" data-id="${taskId}"><i class="fa-solid fa-check"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    }

    // Adicionar nova tarefa
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let taskId = 'task_' + Date.now();
        let taskName = taskInput.value.trim();
        let taskData = {
            name: taskName,
            priority: taskPriority.value,
            completed: false
        };
        if (taskName !== '') {
            localStorage.setItem(taskId, JSON.stringify(taskData));
            addTaskToTable(taskId, taskData.name, taskData.priority, taskData.completed);
            taskInput.value = '';
            filterTasks(); // Adicionado para atualizar a tabela após adicionar uma tarefa
        }
    });

    // Excluir tarefa
    taskTable.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-delete')) {
            let taskId = e.target.getAttribute('data-id');
            localStorage.removeItem(taskId);
            e.target.parentElement.parentElement.remove();
            filterTasks(); // Adicionado para atualizar a tabela após excluir uma tarefa
        }
    });

    // Marcar tarefa como feita
    taskTable.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-complete')) {
            let taskId = e.target.getAttribute('data-id');
            let row = e.target.parentElement.parentElement;
            row.classList.toggle('completed');
            let taskData = JSON.parse(localStorage.getItem(taskId));
            taskData.completed = !taskData.completed;
            localStorage.setItem(taskId, JSON.stringify(taskData));
        }
    });

    // Editar tarefa
    taskTable.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-edit')) {
            let taskId = e.target.getAttribute('data-id');
            let taskData = JSON.parse(localStorage.getItem(taskId));
            let taskName = prompt('Editar tarefa:', taskData.name);
            if (taskName !== null) {
                taskData.name = taskName;
                localStorage.setItem(taskId, JSON.stringify(taskData));
                e.target.parentElement.parentElement.querySelector('p').textContent = taskName;
            }
        }
    });

    // Filtrar e pesquisar tarefas
    function filterTasks() {
        let priority = filterPriority.value.toLowerCase(); // Convertido para minúsculo
        let searchTerm = searchInput.value.toLowerCase();
        let rows = tbody.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let taskName = row.cells[0].textContent.toLowerCase();
            let taskPriority = row.cells[1].textContent.toLowerCase();
            if ((priority === '' || taskPriority === priority) && taskName.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }

    filterPriority.addEventListener('change', filterTasks);
    searchInput.addEventListener('input', filterTasks);

    // Carregar tarefas ao carregar a página
    loadTasks();
});
