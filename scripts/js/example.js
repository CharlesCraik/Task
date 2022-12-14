//Get -- Date
var dateDisplay = document.querySelector('#mainDate');
var date = new Date();
var today = date.toDateString();
dateDisplay.innerHTML = `${today}`;

//Variables -- Creators
const projectCreator = document.querySelector("#createProject")
const taskCreator = document.querySelector('#createTask');
const settings = document.querySelector('#settings');
const projectView = document.querySelector('#projectView');

//Display -- Project Creator
const closeProjectCreator = document.querySelector(".create-project-container div.popup-header .close-btn")
const newProject = document.querySelector("#newProject");
//Open
newProject.addEventListener('click', function(){
    projectCreator.classList.add('active');
    projectCreator.classList.remove('inactive');
});

//Close
closeProjectCreator.addEventListener('click', function(){
    projectCreator.classList.remove('active');
    projectCreator.classList.add('inactive');
});


//Display -- Task Creator
const closeTaskCreator = document.querySelector(".create-task-container div.popup-header .close-btn")
const newTask = document.querySelector("#newTask");
//Open
newTask.addEventListener('click', function(){
    taskCreator.classList.add('active');
    taskCreator.classList.remove('inactive');
});

//Close
closeTaskCreator.addEventListener('click', function(){
    taskCreator.classList.remove('active');
    taskCreator.classList.add('inactive');
});


//Display -- Settings
const closeSettings = document.querySelector(".settings-container div.popup-header .close-btn")
const openSettings = document.querySelector("#openSettings");
//Open
openSettings.addEventListener('click', function(){
    settings.classList.add('active');
    settings.classList.remove('inactive');
});

//Close
closeSettings.addEventListener('click', function(){
    settings.classList.remove('active');
    settings.classList.add('inactive');
});

//Display -- Project
const closeProjectSmall = document.querySelector(".project-view-container div.popup-header .close-btn")
const closeProjectLarge = document.querySelector("#closeProjectBtn");
//Close
closeProjectSmall.addEventListener('click', function(){
    projectView.classList.remove('active');
    projectView.classList.add('inactive');
});

closeProjectLarge.addEventListener('click', function(){
    projectView.classList.remove('active');
    projectView.classList.add('inactive');
});


//Create -- Project
const projectForm = document.querySelector('#addProject');
const projectName = document.querySelector('#projectNameInput');
const projectType = document.querySelector('#projectTypeInput');
const projectDueDate = document.querySelector('#projectDueDateInput');
const projectDescription = document.querySelector('#projectDescInput');
const projectColors = document.querySelectorAll('div.project-color-field-wrap label input')

const projectDisplay = document.querySelector('#mainProjects');
const projectSelectInput = document.querySelector('#taskProjectInput');

let projects = [];

const project = {
    id: Date.now(),
    name: 'Project Name',
    type: 'Project Type',
    due_date: 'Project Due',
    description: 'Project Description',
    color: '#eeeeee',
    tasks: 0,
    completedTasks: 0,
    progress: 0,
    status: 'Project Status',
    set_status: false
}

projectForm.addEventListener('submit', function(event){
    event.preventDefault();
    var projectDue = new Date(projectDueDate.value);
    var displayDueDate = projectDue.toDateString();
    var projectColor = '';
    projectColors.forEach(function(color){
        if(color.checked){
            projectColor = color.value;
        }
    });
    addProject(projectName.value, projectType.value, displayDueDate, projectDescription.value, projectColor);
    
    projectName.value = '';
    projectType.placeholder = 'Select Project Type...';
    projectDueDate.value = '';
    projectDescription.value = '';
    projectColors.value = '';

    projectCreator.classList.remove('active');
    projectCreator.classList.add('inactive');
});

function addProject(p_name, p_type, p_dueDate, p_description, p_color){
    //console.table(p_name, p_type, p_dueDate, p_description, p_color);
    if(p_name !== ''){
        const project = {
            id: Date.now(),
            name: p_name,
            type: p_type,
            due_date: p_dueDate,
            description: p_description,
            color: p_color,
            tasks: 0,
            completedTasks: 0,
            progress: 0,
            status: null,
            set_status: false
        };

        projects.push(project);
        projectProgress(projects);
        saveProject(projects);
        projectForm.querySelectorAll('input').values = '';
        projectType.value = '';
    }
}

//Project to project select
function addProjectToSelect(projects){
    projectSelectInput.innerHTML = '';
    projects.forEach(function(item){
        const op = document.createElement('option');
        op.setAttribute('value', item.name);
        op.innerHTML = `${item.name}`;
        projectSelectInput.prepend(op);
    });
}

function renderProjects(projects){
    projectDisplay.innerHTML = '';

    projects.forEach(function(item){
        projectProgress(projects);
        const p_li = document.createElement('li');
        p_li.setAttribute('class', 'project-item');
        p_li.setAttribute('data-key', item.id);
        
        p_li.innerHTML = `
            <div class="project-details row">
                <div class="display-info column">
                    <h5 class="project-title">
                        ${item.name}
                    </h5>
                    <span class="subtitle">
                        Due: ${item.due_date}
                    </span>
                </div>
                <div class="project-actions">
                    <div class="img-container icon">
                        <img src="media/Settings.svg" class="icon" onClick="openProject(${item.id})">
                    </div>
                </div>
            </div>
            <div class="project-progress">
                <div class="progress-bar" id="projectProgressBar" data-key='${item.id}'>
                    <div class="progress-completion-rate" style="width: ${item.progress}%"></div>
                </div>
                <div class="progress-details row">
                    <span class="project-task-count label-text" id="projectProgressCount" data-key='${item.id}'>
                        ${item.completedTasks}/${item.tasks} Tasks Complete
                    </span>
                    <span class="project-progress-status label-text">
                        <i class="fa-solid fa-circle"></i> ${item.status}
                    </span>
                </div>
            </div>
        `;
        projectDisplay.prepend(p_li);
    });
}

function saveProject(projects){
    localStorage.setItem('projects', JSON.stringify(projects));
    addProjectToSelect(projects);
    renderProjects(projects);
}

function getProjectsFromStorage(){
    const ref = localStorage.getItem('projects');
    if(ref){
        projects = JSON.parse(ref);
        addProjectToSelect(projects);
        renderProjects(projects);
    }
}

getProjectsFromStorage();


//Create -- Task
const taskForm = document.querySelector('#addTask');
const taskName = document.querySelector('#taskNameInput');
const taskProject = document.querySelector('#taskProjectInput');
const taskDueDate = document.querySelector('#taskDueDateInput');
const taskDescription = document.querySelector('#taskDescInput');

const taskList = document.querySelector('#latestTasks');

let tasks = [];

const task = {
    id: Date.now(),
    name: 'Task Name',
    completed: false,
    project: 'Task Project',
    due_date: 'Due Date',
    description: 'Task Description',
    color: 'Color'
};

taskForm.addEventListener('submit', function(event){
    event.preventDefault();
    var due = new Date(taskDueDate.value);
    var taskDue = due.toDateString();
    addTask(taskName.value, taskProject.value, taskDue, taskDescription.value);
    
    taskName.value = '';
    taskProject.placeholder = 'Select Project';
    taskDueDate.value = '';
    taskDescription.value = '';
    
    taskCreator.classList.remove('active');
    taskCreator.classList.add('inactive');
    totalTaskProgressDisplay(tasks);
    displayProgress();
});

function getProjectColor(project){
    const result = projects.filter(proj => proj.name == project).map(filtProj => filtProj.color);
    //console.log(result);
    return result;
}

function addTask(t_name, t_project, t_dueDate, t_description){
    //console.log(t_name, t_project, t_dueDate, t_description);
    if(t_name !== ''){
        const task = {
            id: Date.now(),
            name: t_name,
            completed: false,
            project: t_project,
            due_date: t_dueDate,
            description: t_description,
            color: getProjectColor(t_project)
        };
        tasks.push(task);
        addTaskToProject(t_project);
        saveTask(tasks);
        taskForm.querySelectorAll('input').value = '';
        taskProject.value = '';
    }
}

function renderTasks(tasks){
    taskList.innerHTML = '';
    tasks.forEach(function(item){
        const checked = item.completed ? 'checked': null;
        const t_li = document.createElement('li');
        
        t_li.setAttribute('class', 'task-item');
        t_li.setAttribute('data-key', item.id);
        t_li.setAttribute('task-color', item.color);
        t_li.setAttribute('project-data', item.project)

        if(item.completed === true){
            t_li.classList.add('task-complete');
        }

        t_li.innerHTML = `
            <div class="task-details">
                <h5>${item.name}</h5>
                <div class="task-data">
                    <span class="task-due-date">Due: ${item.due_date}</span>
                    <img src="media/Dot.svg" class="data-separator">
                    <span class="task-project">${item.project}</span>
                </div>
            </div>
            <label class="task-marker-container" data-key='${item.id}'>
                <input type="checkbox" class="task-marker">
                <span class="task-marker-display"><img src="media/check.svg"></span>
            </label>
            <button class="task-delete" id="deleteTask"><img src="media/cross.svg"></button>
        `;
        taskList.prepend(t_li);
        projectProgress(projects);
    });
}

function saveTask(tasks){
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
}

function getTasksFromStorage(){
    const ref = localStorage.getItem('tasks');
    if(ref){
        tasks = JSON.parse(ref);
        renderTasks(tasks);
    }
}

getTasksFromStorage();

taskList.addEventListener('click', function(event){
    if(event.target.type === 'checkbox'){
        taskMarkComplete(event.target.parentElement.getAttribute('data-key'));
    }

    if (event.target.classList.contains('task-delete')) {
        var id = event.target.parentElement.getAttribute('data-key');
        var project = tasks.filter(task => task.id == id).map(t => t.project);
        const projectTasks = projects.filter(target => target.name == project).map(p => p.name);
        var tasksProperty = '';
        projectTasks.forEach(function(item){
            tasksProperty = item;
        });
        projects.forEach(function(item){
            if(item.name === tasksProperty){
                item.tasks = item.tasks - 1;
            }
        })
        deleteTask(event.target.parentElement.getAttribute('data-key'));
        saveProject(projects);
    }
});

function taskMarkComplete(id){
    console.log(id);
    tasks.forEach(function(item){
        if(item.id == id){
            projects.forEach(function(project){
                if(project.name == item.project && item.completed == false){
                    project.completedTasks = project.completedTasks + 1;
                }
                else if(project.name == item.project && item.completed == true){
                    project.completedTasks = project.completedTasks - 1;
                }
            });
            item.completed = !item.completed;
        }
    });
    saveTask(tasks);
    saveProject(projects);
    displayProgress();
    totalTaskProgressDisplay(tasks);
}

function deleteTask(id) {
    tasks = tasks.filter(function(item) {
        if(item.id == id){
            projects.forEach(function(p){
                if(p.name === item.project && item.completed === true){
                    console.log("Hello World");
                    p.completedTasks = p.completedTasks - 1;
                }
            });
        }
        return item.id != id;
    });
    saveTask(tasks);
    saveProject(projects);
    totalTaskProgressDisplay(tasks);
    displayProgress();
}

function findTotalTaskProgress(tasks){
    const completedTasks = tasks.filter(t => t.completed == true);
    //console.log(completedTasks.length);
    //console.log(tasks.length);
    //console.log((completedTasks.length / tasks.length) * 100)
    var result = (completedTasks.length / tasks.length) * 100;
    var progress = Math.round(result);
    return progress;
}


let progressBar = document.querySelector("#totalTaskProgress");
let valueContainer = document.querySelector("#totalTaskProgressValue");

function displayProgress(){
    let progressValue = 0;
    let progressEndValue = findTotalTaskProgress(tasks);
    let speed = 16;

    if(progressEndValue > 0){
        let progress = setInterval(() => {
            progressValue++;
            valueContainer.textContent = `${progressValue}%`;
            progressBar.style.background = `conic-gradient(
                #DBF996 ${progressValue * 3.6}deg,
                #f5f5f5 ${progressValue * 3.6}deg
            )`;
            if (progressValue == progressEndValue) {
              clearInterval(progress);
            }
        }, speed);
    }
    else if(tasks.length <= 0){
        progressBar.style.background = '#f5f5f5';
    }
    else{
        progressBar.style.background = '#f5f5f5';
    }
}
displayProgress();

function totalTaskProgressDisplay(tasks){
    const displayText = document.querySelector('#totalTasksDisplay');
    const completedTasks = tasks.filter(t => t.completed == true);
    var complete = completedTasks.length;
    var totalTasks = tasks.length;
    displayText.innerHTML = `${complete}/${totalTasks} Tasks Complete`;
}
totalTaskProgressDisplay(tasks);

function addTaskToProject(projectName){
    projects.forEach(function(item){
        if(item.name == projectName){
            item.tasks = item.tasks + 1;
            console.log(item.name + ' tasks: ' + item.tasks);
            saveProject(projects);
        }
    });
}

function autoSetStatus(projects){
    var projectNotStarted = 'Not Started';
    var projectInProgress = 'In Progress';
    var projectComplete = 'Complete';
    projects.forEach(function(item){
        if(item.completedTasks != 0 && item.completedTasks == item.tasks){
            item.status = projectComplete;
        }

        if(item.completedTasks == 0){
            item.status = projectNotStarted;
        }

        if(item.completedTasks != 0 && item.completedTasks != item.tasks){
            item.status = projectInProgress;
        }
    });
}

function projectProgress(projects){
    projects.forEach(function(item){
        var completeTasks = item.completedTasks;
        var totalTask = item.tasks;
        var progress = Math.round((completeTasks / totalTask) * 100);
        item.progress = progress;
        if(item.set_status == false){
            autoSetStatus(projects);
        }
    });
    //autoSetStatus(projects);
}

function openProject(id){
    const projectTasks = document.querySelector('#projectContent');
    const projectTitle = document.querySelector('#projectViewTitle');
    const projectDueDate = document.querySelector('#projectViewDate');
    //Get Project
    var project = projects.filter(p => p.id == id);
    var projectColor = project.map(proj => proj.color);

    projectView.classList.remove('inactive');
    projectView.classList.add('active');

    projectTasks.setAttribute('data-type', `${project.map(proj => proj.id)}`);

    projectTitle.innerHTML = `${project.map(proj => proj.name)}`;
    projectDueDate.innerHTML = `Due: ${project.map(proj => proj.due_date)}`;
    projectTasks.innerHTML = '';
    projectTasks.innerHTML = `
    <div class="project-details">
        <div class="project-atts row">
            <span class="attribute project-type" id="projectViewType" style='background: ${projectColor}'>
                Web Development
            </span>
            <span class="attribute project-status" id="projectViewStatus" style='background: ${projectColor}'>
                ${project.map(proj => proj.status)}
            </span>
        </div>
        <div class="project-description-container" id="projectViewDesc">
            <p class="secondary-text">
                ${project.map(proj => proj.description)}
            </p>
        </div>
    </div>
    <div class="project-view-tasks-container">
        <div class="project-view-tasks-header">
            <h4>Tasks</h4>
            <div class="progress-bar" id="projectViewProgressBar">
                <div class="progress-completion-rate" style="width: ${project.map(proj => proj.progress)}%"></div>
            </div>
        </div>
        <ul class="project-view-tasks" id="projectTasklist">
    
        </ul>
    </div>
    `;
    
    const projectTaskList = document.querySelector('#projectTasklist');
    const tasksOfProject = tasks.filter(t => t.project == project.map(proj => proj.name));
    projectTaskList.innerHTML = '';

    tasksOfProject.forEach(function(projectTask){
        console.table(projectTask);
        var isComplete = projectTask.completed;
        const t_li = document.createElement('li');
        
        t_li.setAttribute('class', 'task-item');
        t_li.classList.add('project-task-item');
        t_li.setAttribute('data-key', projectTask.due_date);
        t_li.setAttribute('task-color', projectTask.color);
        t_li.setAttribute('project-data', projectTask.project)

        if(isComplete === true){
            t_li.classList.add('task-complete');
        }

        t_li.innerHTML = `
            <div class="task-details">
                <h5>${projectTask.name}</h5>
                <div class="task-data">
                    <span class="task-due-date">Due: ${projectTask.due_date}</span>
                </div>
            </div>
            <label class="task-marker-container" data-key='${projectTask.id}'>
                
                <span class="task-marker-display"><img src="media/check.svg"></span>
            </label>
            
        `;
        projectTaskList.prepend(t_li);
    });
}

const deleteProjectBtn = document.querySelector('#deleteProject');

deleteProjectBtn.addEventListener('click', function(event){
    var targetID = document.querySelector('#projectContent').getAttribute('data-type');
    deleteProjectTasks(targetID);
    deleteProject(targetID);
});

function deleteProject(id){
    projects = projects.filter(function(item){
        return item.id != id;
    });
    projectView.classList.remove('active');
    projectView.classList.add('inactive');
    saveProject(projects);
}

function deleteProjectTasks(id){
    var project = projects.filter(p => p.id == id).map(proj => proj.name);
    var targetProject = project.pop();
    const tasksOfProject = tasks.filter(t => t.project == targetProject).map(t => t.id);
    tasksOfProject.forEach(function(task){
        deleteTask(task);
    });
}