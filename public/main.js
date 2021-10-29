const todoContainer = document.querySelector("#todo-container")
const task = document.querySelector("input[name='title']")
const todoCard = document.querySelector(".todoCard")
const noTodos = document.querySelector(".no-todos")

const taskAdd = document.querySelector(".task-add")
const taskUpdate = document.querySelector(".task-update")
const cancelUpdate = document.querySelector(".cancel-update")
taskUpdate.style.display = "none";
cancelUpdate.style.display = "none";

spinner = document.querySelector(".spinner-border")

async function getTasks() {
    todoContainer.innerHTML = "";
    toggleSpinnerDisplay("inline-block");
    const todos = fetch("http://localhost:3300/api/tasks")
        .then((response) => response.json())
        .then((data) => {
            if (data.length == 0) {
                noTodos.style.display = "block";
            } else {
                noTodos.style.display = "none";
                for (let i = 0; i < data.length; i++) {
                    const con = document.createElement("div")
                    con.classList.add("card", "my-1", "todoCard")
                    con.innerHTML =
                        `
                                    <div class="card-body d-flex justify-content-between align-items-center" data-id="${data[i]._id}">
                                        <h4 class="card-title flex-grow-1">${data[i].title}</h4>
                                        <span class="flex-grow-1 small d-none d-md-inline createdAT">Created: <span class="text-muted">${data[i].created}</span></span>
                                        <div class="btns my-2 d-flex flex-column flex-sm-row">
                                            <button class="btn btn-outline-primary px-3 mx-1 my-1" onclick="update('${data[i]._id}', '${data[i].title}')">Edit</button>
                                            <button class="btn btn-danger px-3 mx-1 my-1" onclick="deleteTask('${data[i]._id}')">Delete</button>
                                        </div>
                                    </div>
                                `
                    todoContainer.appendChild(con);
                }
            }
            toggleSpinnerDisplay("none");
        })
}

async function addTask(e) {
    e = e || window.event
    e.preventDefault();

    if (!validateTask()) {
        alert("Task cannot be empty!")
        return;
    }

    const postTask = await fetch("http://localhost:3300/api/tasks", {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "title": `${task.value}`
        }),
    }).then(response => response.json())
        .then(data => {
            task.value = "";
        })

    getTasks();
}

async function deleteTask(id) {
    const deletedTask = await fetch(`http://localhost:3300/api/tasks/${id}`, {
        method: "delete",
    }).then(response => response.json())

    getTasks()
}

async function updateTask(el) {
    if (!validateTask()) {
        alert("Task cannot be empty!")
        return;
    }

    const postTask = await fetch(`http://localhost:3300/api/tasks/${el.getAttribute("data-id")}`, {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "title": `${task.value}`,
            "updated": Date().toLocaleString(),
        }),
    }).then(response => {
        response.json()
        task.value = "";
    })

    taskUpdate.removeAttribute("data-id");
    taskAdd.style.display = "initial";
    taskUpdate.style.display = "none";
    cancelUpdate.style.display = "none";

    getTasks();
}

function update(id, title) {
    taskAdd.style.display = "none";
    taskUpdate.style.display = "initial";
    cancelUpdate.style.display = "initial";

    task.value = title
    taskUpdate.setAttribute("data-id", id)
}

function cancel() {
    taskAdd.style.display = "initial";
    taskUpdate.style.display = "none";
    cancelUpdate.style.display = "none";

    task.value = ""
    taskUpdate.removeAttribute("data-id")
}

function validateTask() {
    if (task.value != null && task.value != undefined && task.value != "") {
        return true;
    }

    return false;
}

function toggleSpinnerDisplay(spinnerState) {
    spinner.style.display = spinnerState;
}


document.addEventListener("DOMContentLoaded", () => {
    getTasks();
})