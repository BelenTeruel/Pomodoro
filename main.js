let tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let currentTask = null;

const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");
const taskName = document.querySelector("#time #taskName");
renderTime();

form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    if(itTask.value != '') {
        createTask(itTask.value); 
        itTask.value = '';
        workTime.value = '';
        breakTime.value = '';
        renderTasks(); 
    }
})

function createTask(value) {
    const workTime = document.querySelector("#workTime");
    const breakTime = document.querySelector("#breakTime");

    const newTask = {
        id : (Math.random() * 100).toString(36).slice(3),
        title : value,
        completed : false, 
        workTime: workTime.value ? parseInt(workTime.value) : 25, 
        breakTime: breakTime.value ? parseInt(breakTime.value) : 5,
    };
    tasks.unshift(newTask); // Added to the beggining of the array
}

function renderTasks(){
    const html = tasks.map((task)=> {
        return `
            <div class="task">
                <div class="completed">
                    ${task.completed 
                        ? `<span class="done">Done</span>` 
                        : `<button class="start-button" data-id="${task.id}">Start</button>`
                    }
                </div>
                <div class="title">${task.title}</div>
            </div>
        `;
    });
    const taskContainer = document.querySelector('#tasks');
    taskContainer.innerHTML = html.join('');

    const startButton = document.querySelectorAll('.task .start-button');
    startButton.forEach((button) => {
        button.disabled = !!timer;
        button.addEventListener('click', (e) => {
            if(!timer) {
                const id = button.getAttribute('data-id');
                startButtonHandler(id);
                button.disabled = true;
                button.textContent = "In progress...";
            }
        });
    });
}



function startButtonHandler(id) {
    interruptBreak();
    time = tasks.find(task => task.id == id).workTime * 60; 
    currentTask = id;
    const taskIndex = tasks.findIndex((task) => task.id === id);
    taskName.textContent = tasks[taskIndex].title;
    renderTime();
    timer = setInterval(() => { timerHandler(id); }, 1000); 
}

function timerHandler (id) {
    if (time > 0) {time--;}    
    renderTime();

    if(time == 0) {
        clearInterval(timer);
        markCompleted(id);
        timer = null;
        renderTasks();
        startBreak(id);
    }
}

function startBreak(id) {
    time = tasks.find(task => task.id == id).breakTime * 60 ; // 25 minutes in seconds
    taskName.textContent = "Break time !";
    renderTime();
    timerBreak = setInterval(() => {timerBreakHandler();}, 1000);
}

function timerBreakHandler() {
    if (time > 0 ) {time--;}
    renderTime();

    if(time == 0) {
        clearInterval(timerBreak);
        currentTask = null;
        timerBreak = null;
        taskName.textContent = "";
        renderTasks();
    }
}

function interruptBreak() {
    if (timerBreak) {
        clearInterval(timerBreak);
        timerBreak = null;
        taskName.textContent = "";
    }
}

function renderTime() {
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:
                            ${seconds < 10 ? "0" : ""}${seconds}`;   
}

function markCompleted(id) {
    const taskIndex = tasks.findIndex((task) => task.id == id);
    tasks[taskIndex].completed = true;

    // Move the completed task to the end of the array
    const [completedTask] = tasks.splice(taskIndex, 1);
    tasks.push(completedTask);
}

function clearCompletedTasks() {
    const clearButt = document.getElementById('clearCompleted');
    clearButt.addEventListener("click", (e) => {
        e.preventDefault();
        tasks = tasks.filter(task => !task.completed); 
        renderTasks();
    });
}

function clearAllTasks() {
    const clearButt = document.getElementById('clearAll');
    clearButt.addEventListener("click", (e) => {
        e.preventDefault();
        tasks = []; 
        renderTasks();
        taskName.textContent = ""; 
        resetTimer();
    });
}

function resetTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    if (timerBreak) {
        clearInterval(timerBreak);
        timerBreak = null;
    }
    time = 0;
    taskName.textContent = ""; 
    renderTime();
}

clearCompletedTasks();
clearAllTasks();