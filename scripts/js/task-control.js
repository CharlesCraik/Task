// database
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://xeqakifqoncvitlrbymn.supabase.co', 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcWFraWZxb25jdml0bHJieW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYyNDE5ODUsImV4cCI6MTk4MTgxNzk4NX0.7k5szeNRkhhbIf7sEUpp7oL0-HDoIhsTK_U8r42YM7A');

async function getTasks() {
    const { data, error } = await supabase.from('Tasks').select('*')
    return data
}

async function getProjects() {
    const { data, error } = await supabase.from('Projects').select('*')
    return data
}

async function addTaskToDB(t_title, t_status, t_og_status, t_deadline, t_notes, t_task_done, t_project, t_project_id, t_color) {
    const { data, error } = await supabase
      .from('Tasks')
      .insert([{ 
        id: Date.now(),
        task_title: t_title,
        task_status: t_status,
        task_og_status: t_og_status,
        task_deadline: t_deadline,
        task_notes: t_notes,
        task_done: t_task_done,
        task_project: t_project,
        task_project_id: t_project_id,
        task_color: t_color
    }]);
    return data;
}

async function updateTaskDoneDB(task_id, status, taskStatus){
    let {data, error} = await supabase.from('Tasks').update({task_done: status, task_status: taskStatus}).match({id: task_id});
    return data;
}

// stage 1 : task creation
const taskForm = document.querySelector('#newTaskForm');
const taskTitle = document.querySelector('#f_taskTitle');
const taskProject = document.querySelector('#f_taskProject');
const taskStatus = document.querySelector('#f_taskStatus');
const taskDeadline = document.querySelector('#f_taskDeadline');
const taskNotes = document.querySelector('#f_taskNotes');

const upcomingTaskFeed = document.querySelector('#feed_upcomingTasks');
const priorityTaskFeed = document.querySelector('#feed_priorityTasks');
const completedTaskFeed = document.querySelector('#feed_completedTasks');


let tasks = [];
let projects = [];

getTasks().then((data) => {
    console.log('Converting tasks...');
    if(data.length >= 1){
    data.forEach(function(item){
        tasks.push(item);
    });
    initTasks(tasks);
    }
});

getProjects().then((data) => {
    console.log('Converting projects...');
    if(data.length >= 1){
    data.forEach(function(item){
        projects.push(item);
    });
    }
    populateTaskProjects(projects);
});

taskForm.addEventListener('submit', function(event){
    event.preventDefault();

    var deadline = new Date(taskDeadline.value).toDateString();
    
    createTask(
        taskTitle.value, 
        taskProject.value, 
        taskStatus.value, 
        deadline, 
        taskNotes.value
    );

    taskTitle.value = '';
    taskProject.value = '';
    taskStatus.value = '';
    taskDeadline.value = '';
    taskNotes.value = '';

    closeEditor(document.querySelector('#newTaskEditor'));
});

function populateTaskProjects(projects){
    taskProject.innerHTML = `<option disabled selected hidden class="default-option">Select project...</option>`;
    projects.forEach(function(item){
        const option = document.createElement('option');
        option.setAttribute('value', item.project_title);
        option.innerHTML = `${item.project_title}`;
        taskProject.prepend(option);
    });
}

function createTask(t_title, t_project, t_status, t_deadline, t_notes){
    console.log(t_title, t_project, t_status, t_deadline, t_notes);

    var taskProject = projects.find(item => item.project_title == t_project);
    var projectName = taskProject.project_title;
    var projectID = taskProject.id;
    var projectColor = taskProject.project_color;

    addTaskToDB(t_title, t_status, t_status, t_deadline, t_notes, false, projectName, projectID, projectColor);

    if(t_title !== ''){
        const task = {
            id: Date.now(),
            task_title: t_title,
            task_status: t_status,
            task_og_status: t_status,
            task_deadline: t_deadline,
            task_notes: t_notes,
            task_done: false,
            task_project: projectName,
            task_project_id: projectID,
            task_color: projectColor
        };

        tasks.push(task);
        initTasks(tasks);
    }
}



// stage 2 : initiate tasks
function initUpcomingTasks(items){
    upcomingTaskFeed.innerHTML = '';

    const query = items.filter(t => t.task_status != 'Priority');
    const upcomingTasksQuery = query.filter(t => t.task_status != 'Complete');

    upcomingTasksQuery.forEach(function(task){
        const checked = task.task_done ? 'checked': null;
        const taskItem = document.createElement('li');

        taskItem.setAttribute('class', 'task-item');
        taskItem.setAttribute('data-key', task.id);

        if(task.task_done === true){
            taskItem.classList.add('task-complete');
        }

        taskItem.innerHTML = `
        <div class="task-content row">
            <label class="input-container">
                <input type="checkbox" class="task-complete" id="markComplete">
                <img class='complete-icon' src="/media/icons/mark-complete.svg">
            </label>
            <div class="task-title-container">
                <span class="task-title">${task.task_title}</span>
            </div>
            <div class="task-details">
                <div class="task-deadline row align-c">
                    <i class="isax isax-calendar5"></i>
                    <span class="task-sub-item">${task.task_deadline}</span>
                </div>
                <div class="task-status row align-c">
                    <span class="task-status-output" status="${task.task_status}" >
                        ${task.task_status}
                    </span>
                </div>
            </div>
            <div class="task-options">
                <a class="task-sub-menu" >
                    <i class="isax isax-menu5"></i>
                </a>
            </div>
        </div>
        <div class="task-extra-content inactive">
            <div class="task-notes-container">
                <p>
                    ${task.task_notes}
                </p>
            </div>
            <div class="task-extra-details row align-c">
                <span class="task-project" style="background: ${task.task_color}48; color: ${task.task_color}">
                    ${task.task_project}
                </span>
            </div>
        </div>
        <div class="task-option-menu-container inactive">
            <ul class="task-option-menu">
                <li class="task-option-menu-item">
                    <a class="delete-task row align-c">
                        <i class="isax isax-tag-cross5"></i>
                        Delete task
                    </a>
                </li>
                <li class="task-option-menu-item">
                    <a class="edit-task row align-c">
                        <i class="isax isax-edit5"></i>
                        Edit task
                    </a>
                </li>
                <li class="task-option-menu-item">
                    <a class="cancel-task row align-c">
                        <i class="isax isax-close-circle5"></i>
                        Cancel
                    </a>
                </li>
            </ul>
        </div>
        `;

        upcomingTaskFeed.prepend(taskItem);
    });

    if(upcomingTasksQuery.length == 0){
        upcomingTaskFeed.innerHTML = `<span class="warning">You currently have no upcoming tasks</span>`;
    }

}

function initPriorityTasks(items){
    priorityTaskFeed.innerHTML = '';

    const priorityTasksQuery = items.filter(t => t.task_status == 'Priority');

    priorityTasksQuery.forEach(function(task){
        const checked = task.task_done ? 'checked': null;
        const priorityItem = document.createElement('li');

        priorityItem.setAttribute('class', 'task-item');
        priorityItem.setAttribute('data-key', task.id);

        if(task.task_done === true){
            priorityItem.classList.add('task-complete');
        }

        priorityItem.innerHTML = `
            <div class="task-content row">
                <label class="input-container">
                    <input type="checkbox" class="task-complete" id="markComplete">
                    <img class='complete-icon' src="/media/icons/mark-complete.svg">
                </label>
                <div class="task-title-container">
                    <span class="task-title">${task.task_title}</span>
                </div>
                <div class="task-details">
                    <div class="task-deadline row align-c">
                        <i class="isax isax-calendar5"></i>
                        <span class="task-sub-item">${task.task_deadline}</span>
                    </div>
                    <div class="task-status row align-c">
                        <span class="task-status-output" status="${task.task_status}">${task.task_status}</span>
                    </div>
                </div>
                <div class="task-options">
                    <a href="#" class="task-sub-menu" id="taskSubMenu">
                        <i class="isax isax-menu5"></i>
                    </a>
                </div>
            </div>
            <div class="task-extra-content inactive">
                <div class="task-notes-container">
                    <p>
                        ${task.task_notes}
                    </p>
                </div>
                <div class="task-extra-details row align-c">
                    <span class="task-project" style="background: ${task.task_color}48; color: ${task.task_color}">
                        ${task.task_project}
                    </span>
                </div>
            </div>
            <div class="task-option-menu-container">
                <ul class="task-option-menu">
                    <li class="task-option-menu-item">
                        <a class="delete-task row align-c">
                            <i class="isax isax-tag-cross5"></i>
                            Delete task
                        </a>
                    </li>
                    <li class="task-option-menu-item">
                        <a class="edit-task row align-c">
                            <i class="isax isax-edit5"></i>
                            Edit task
                        </a>
                    </li>
                    <li class="task-option-menu-item">
                        <a class="cancel-task row align-c">
                            <i class="isax isax-close-circle5"></i>
                            Cancel
                        </a>
                    </li>
                </ul>
            </div>
        `;

        priorityTaskFeed.prepend(priorityItem);
    });

    if(priorityTasksQuery.length == 0){
        priorityTaskFeed.innerHTML = `<span class="warning">You currently have no priority tasks</span>`;
    }
}

function initCompleteTasks(items){
    completedTaskFeed.innerHTML = '';

    const query = items.filter(t => t.task_status == 'Complete');

    query.forEach(function(task){
        const checked = task.task_done ? 'checked': null;
        const taskItem = document.createElement('li');

        taskItem.setAttribute('class', 'task-item');
        taskItem.setAttribute('data-key', task.id);

        if(task.task_done === true){
            taskItem.classList.add('task-complete');
        }

        taskItem.innerHTML = `
            <div class="task-content row">
                <label class="input-container">
                    <input type="checkbox" class="task-complete" id="markComplete">
                    <img class='complete-icon' src="/media/icons/mark-complete.svg">
                </label>
                <div class="task-title-container">
                    <span class="task-title">${task.task_title}</span>
                </div>
                <div class="task-details">
                    <div class="task-deadline row align-c">
                        <i class="isax isax-calendar5"></i>
                        <span class="task-sub-item">${task.task_deadline}</span>
                    </div>
                    <div class="task-status row align-c">
                        <span class="task-status-output" status="${task.task_status}">${task.task_status}</span>
                    </div>
                </div>
                <div class="task-options">
                    <a href="#" class="task-sub-menu" id="taskSubMenu">
                        <i class="isax isax-menu5"></i>
                    </a>
                </div>
            </div>
            <div class="task-extra-content inactive">
                <div class="task-notes-container">
                    <p>
                        ${task.task_notes}
                    </p>
                </div>
                <div class="task-extra-details row align-c">
                    <span class="task-project" style="background: ${task.task_color}48; color: ${task.task_color}">
                        ${task.task_project}
                    </span>
                </div>
            </div>
            <div class="task-option-menu-container">
                <ul class="task-option-menu">
                    <li class="task-option-menu-item">
                        <a class="delete-task row align-c">
                            <i class="isax isax-tag-cross5"></i>
                            Delete task
                        </a>
                    </li>
                    <li class="task-option-menu-item">
                        <a class="edit-task row align-c">
                            <i class="isax isax-edit5"></i>
                            Edit task
                        </a>
                    </li>
                    <li class="task-option-menu-item">
                        <a class="cancel-task row align-c">
                            <i class="isax isax-close-circle5"></i>
                            Cancel
                        </a>
                    </li>
                </ul>
            </div>
        `;

        completedTaskFeed.prepend(taskItem);
    });

    if(query.length == 0){
        completedTaskFeed.innerHTML = `<span class="warning">You currently have no completed tasks</span>`;
    }
}

function initTasks(tasks){
    initUpcomingTasks(tasks);
    initPriorityTasks(tasks);
    initCompleteTasks(tasks);
}


// task behaviour
upcomingTaskFeed.addEventListener('click', function(event){
    if(event.target.classList.contains('task-complete')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        var marker = event.target.closest('[data-key]').querySelector('.task-complete');
        markTaskComplete(id);
    }

    if(event.target.classList.contains('task-title')){
        var tab = event.target.closest('[data-key]').querySelector('.task-extra-content');
        const allTasks = document.querySelectorAll('.task-item .task-extra-content');

        allTasks.forEach(function(item){
            if(item.classList.contains('active')){
                item.classList.remove('active');
                item.classList.add('inactive');
            }
        });
        
        tab.classList.remove('inactive');
        tab.classList.add('active');
    }

    if(event.target.classList.contains('delete-task')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        console.log('Deleting: ' + id);
        deleteTask(id);
    }

    if(event.target.classList.contains('isax-menu5')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        viewTaskOptions(id);
    }

    if(event.target.classList.contains('edit-task')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        updateTask(id);
        populateFields(id);
    }

    if(event.target.classList.contains('cancel-task')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        hideTaskOptions(id);
    }
});



priorityTaskFeed.addEventListener('click', function(event){
    if(event.target.classList.contains('task-complete')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        var marker = event.target.closest('[data-key]').querySelector('.task-complete');
        markTaskComplete(id);
    }

    if(event.target.classList.contains('task-title')){
        var tab = event.target.closest('[data-key]').querySelector('.task-extra-content');
        const allTasks = document.querySelectorAll('.task-item .task-extra-content');

        allTasks.forEach(function(item){
            if(item.classList.contains('active')){
                item.classList.remove('active');
                item.classList.add('inactive');
            }
        });
        
        tab.classList.remove('inactive');
        tab.classList.add('active');
    }

    if(event.target.classList.contains('task-delete')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        console.log('Deleting: ' + id);
        deleteTask(id);
    }

    if(event.target.classList.contains('isax-menu5')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        viewTaskOptions(id);
    }

    if(event.target.classList.contains('edit-task')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        updateTask(id);
        populateFields(id);
    }

    if(event.target.classList.contains('cancel-task')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        hideTaskOptions(id);
    }
});



completedTaskFeed.addEventListener('click', function(event){
    if(event.target.classList.contains('task-complete')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        var marker = event.target.closest('[data-key]').querySelector('.task-complete');
        markTaskComplete(id);
    }

    if(event.target.classList.contains('task-title')){
        var tab = event.target.closest('[data-key]').querySelector('.task-extra-content');
        const allTasks = document.querySelectorAll('.task-item .task-extra-content');

        allTasks.forEach(function(item){
            if(item.classList.contains('active')){
                item.classList.remove('active');
                item.classList.add('inactive');
            }
        });
        
        tab.classList.remove('inactive');
        tab.classList.add('active');
    }

    if(event.target.classList.contains('task-delete')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        console.log('Deleting: ' + id);
        deleteTask(id);
    }

    if(event.target.classList.contains('isax-menu5')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        viewTaskOptions(id);
    }

    if(event.target.classList.contains('edit-task')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        updateTask(id);
        populateFields(id);
    }

    if(event.target.classList.contains('cancel-task')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        hideTaskOptions(id);
    }
});

function markTaskComplete(id){
    var thisTask = tasks.find(item => item.id == id);
    thisTask.task_done = !thisTask.task_done;
    if(thisTask.task_done == true){
        thisTask.task_status = 'Complete';
    }
    else{
        thisTask.task_status = thisTask.task_og_status;
    }
    updateTaskDoneDB(id, thisTask.task_done, thisTask.task_status);
    initTasks(tasks);
}

async function deleteTask(id){
    const { error } = await supabase.from('Tasks').delete().eq('id', id);
    
    tasks = tasks.filter(function(item){
        return item.id != id;
    });
    initTasks(tasks);
}


// stage 3 : update task
const updateTaskForm = document.querySelector('#updateTaskForm');
const updateTaskTitle = document.querySelector('#f2_taskTitle');
const updateTaskStatus = document.querySelector('#f2_taskStatus');
const updateTaskDeadline = document.querySelector('#f2_taskDeadline');
const updateTaskNotes = document.querySelector('#f2_taskNotes');

function populateFields(id){
    var result = tasks.find(item => item.id == id);

    updateTaskForm.setAttribute('data-key', id);
    updateTaskTitle.value = result.task_title;
    updateTaskStatus.value = result.task_status;
    updateTaskDeadline.value = new Date(result.task_deadline).toISOString().substring(0, 10);
    updateTaskNotes.value = result.task_notes;
}

updateTaskForm.addEventListener('submit', function(event){
    event.preventDefault();

    var id = event.target.closest('[data-key]').getAttribute('data-key');
    var result = tasks.find(item => item.id == id);

    updateTaskDB(
        id,
        updateTaskTitle.value,
        updateTaskStatus.value,
        updateTaskStatus.value,
        new Date(updateTaskDeadline.value).toDateString(),
        updateTaskNotes.value
    );

    result.task_title = updateTaskTitle.value;
    result.task_status = updateTaskStatus.value;
    result.task_og_status = updateTaskStatus.value;
    result.task_deadline = new Date(updateTaskDeadline.value).toDateString();
    result.task_notes = updateTaskNotes.value;

    updateTaskTitle.value = '';
    updateTaskStatus.value = 'Select status type...';
    updateTaskDeadline.value = '';
    updateTaskNotes.value = '';

    closeEditor(document.querySelector('#updateTaskEditor'));
    initTasks(tasks);
});

async function updateTaskDB(id, t_title, t_status, t_og_status, t_deadline, t_notes) {
    const { data, error } = await supabase.from('Tasks').update({
        task_title: t_title,
        task_status: t_status,
        task_og_status: t_og_status,
        task_deadline: t_deadline,
        task_notes: t_notes,
    }).match({ id: id });
    return data
}



