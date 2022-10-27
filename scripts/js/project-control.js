import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://xeqakifqoncvitlrbymn.supabase.co', 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcWFraWZxb25jdml0bHJieW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYyNDE5ODUsImV4cCI6MTk4MTgxNzk4NX0.7k5szeNRkhhbIf7sEUpp7oL0-HDoIhsTK_U8r42YM7A');

async function getProjects() {
    const { data, error } = await supabase.from('Projects').select('*')
    return data
}

async function getTasks() {
    const { data, error } = await supabase.from('Tasks').select('*')
    return data
}

async function addProjectToDB(p_title, p_type, p_status, p_startDate, p_deadline, p_url, p_description, p_color, p_icon) {
    const { data, error } = await supabase
      .from('Projects')
      .insert([{ 
        id: Date.now(),
        project_title: p_title,
        project_type: p_type,
        project_status: p_status,
        project_start_date: p_startDate,
        project_deadline: p_deadline,
        project_url: p_url,
        project_description: p_description,
        project_color: p_color,
        project_icon: p_icon
    }])
    return data
}

// stage 1 : project creation
const projectForm = document.querySelector('#newProjectForm');
const projectTitle = document.querySelector('#f_projectTitle');
const projectType = document.querySelector('#f_projectType');
const projectStatus = document.querySelector('#f_projectStatus');
const projectStartDate = document.querySelector('#f_projectStart');
const projectDeadline = document.querySelector('#f_projectDeadline');
const projectUrl = document.querySelector('#f_projectURL');
const projectDescription = document.querySelector('#f_projectDescription');
const projectColors = document.querySelectorAll('div#f_projectColorSelect label input');
const projectIcons = document.querySelectorAll('div#f_projectIconSelect label input');

const projectsFeed = document.querySelector('#feed_projects');

let projects = [];
let tasks = [];

getProjects().then((data) => {
    console.log('Converting...');
    if(data.length >= 1){
    data.forEach(function(item){
        projects.push(item);
    });
    //console.table(projects);
    initProjects(projects);
    }
});

getTasks().then((data) => {
    console.log('Converting...');
    if(data.length >= 1){
    data.forEach(function(item){
        tasks.push(item);
    });
    console.table(tasks);
    }
});



projectForm.addEventListener('submit', function(event){
    event.preventDefault();

    var raw_startDate = new Date(projectStartDate.value);
    var raw_deadline = new Date(projectDeadline.value);
    var startDate = raw_startDate.toDateString();
    var deadline = raw_deadline.toDateString();

    var color = '';
    projectColors.forEach(function(col){
        if(col.checked){
            color = col.value;
        }
    });

    var icon = '';
    projectIcons.forEach(function(ico){
        if(ico.checked){
            icon = ico.value;
        }
    });

    createProject(
        projectTitle.value,
        projectType.value,
        projectStatus.value,
        startDate,
        deadline,
        projectUrl.value,
        projectDescription.value,
        color,
        icon
    );
    
    projectTitle.value = '';
    projectType.value = 'Select project type...';
    projectStatus.value = 'Select project status...';
    projectStartDate.value = '';
    projectDeadline.value = '';
    projectUrl.value = '';
    projectDescription.value = '';
    projectColors.value = '';
    projectIcons.value = '';

    closeEditor(document.querySelector('#newProjectEditor'));
    
});

function createProject(p_title, p_type, p_status, p_startDate, p_deadline, p_url, p_description, p_color, p_icon){
    //console.table(p_title, p_type, p_status, p_startDate, p_deadline, p_url, p_description, p_color, p_icon);
    addProjectToDB(p_title, p_type, p_status, p_startDate, p_deadline, p_url, p_description, p_color, p_icon);
    if(p_title !== ''){
        const project = {
            id: Date.now(),
            project_title: p_title,
            project_type: p_type,
            project_status: p_status,
            project_start_date: p_startDate,
            project_deadline: p_deadline,
            project_url: p_url,
            project_description: p_description,
            project_color: p_color,
            project_icon: p_icon
        };

        projects.push(project);
        initProjects(projects);
    }
}

// stage 2 : initiate projects
function initProjects(items){
    projectsFeed.innerHTML = '';

    items.forEach(function(item){
        const projectItem = document.createElement('li');

        projectItem.setAttribute('class', 'project-item');
        projectItem.setAttribute('data-key', item.id);

        projectItem.innerHTML = `
        <div class="project-header row">
            <div class="project-avatar" style="background: ${item.project_color}42">
                <i class="isax ${item.project_icon}" style="color: ${item.project_color}"></i>
            </div>
            <div class="project-options row">
                <a class="project-option" onclick="viewOptions(${item.id})">
                    <i class="isax isax-menu5"></i>
                </a>
            </div>
        </div>
        <div class="project-details column">
            <span class="title">${item.project_title}</span>
            <div class="project-properties column">
                <div class="project-prop row align-c">
                    <i class="isax isax-tag5 prop-icon"></i>
                    <span class="detail">${item.project_type}</span>
                </div>
                <div class="project-prop row align-c">
                    <i class="isax isax-calendar5 prop-icon"></i>
                    <span class="detail">${item.project_deadline}</span>
                </div>
            </div>
        </div>
        <div class="project-progress column">
            <div class="project-progress-bar-container">
                <div class="project-progress-bar-completion">

                </div>
            </div>
            <div class="project-progress-details row">
                <span class="project-days-left">
                    00 Days Left
                </span>
                <span class="projct-status row align-c">
                    <span class="project-status-indicator"></span>
                    ${item.project_status}
                </span>
            </div>
        </div>
        <div class="project-option-menu">
            <ul class="project-options">
                <li class="project-option-item">
                    <a class="row align-c delete-project"><i class="isax isax-tag-cross5"></i>Delete project</a>
                </li>
                <li class="project-option-item">
                    <a href="#" class="row align-c edit-project" onclick="updateProject(${item.id})"><i class="isax isax-edit5"></i>Edit project</a>
                </li>
                <li class="project-option-item">
                    <a onclick="hideOptions(${item.id})" class="row align-c"><i class="isax isax-close-circle5"></i>Cancel</a>
                </li>
            </ul>
        </div>
        `;

        projectsFeed.prepend(projectItem);
    });

    if(projects.length == 0){
        projectsFeed.innerHTML = '<span class="warning">You currently have no projects</span>';
    }
}

projectsFeed.addEventListener('click', function(event){
    if(event.target.classList.contains('delete-project')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        deleteProject(id);
    }
    
    if(event.target.classList.contains('edit-project')){
        var id = event.target.closest('[data-key]').getAttribute('data-key');
        populateFields(id);
    }
});

async function deleteProject(id){
    const { error } = await supabase.from('Projects').delete().eq('id', id);

    projects = projects.filter(function(item){
        return item.id != id;
    });
    initProjects(projects);
}


// stage 3 : update project
const updateProjectForm = document.querySelector('#updateProjectForm');
const updateProjectTitle = document.querySelector('#update_projectTitle');
const updateProjectType = document.querySelector('#update_projectType');
const updateProjectStatus = document.querySelector('#update_projectStatus');
const updateProjectStartDate = document.querySelector('#update_projectStart');
const updateProjectDeadline = document.querySelector('#update_projectDeadline');
const updateProjectUrl = document.querySelector('#update_projectURL');
const updateProjectDescription = document.querySelector('#update_projectDescription');


function populateFields(id){
    var result = projects.find(item => item.id == id);

    updateProjectForm.setAttribute('data-key', id);
    updateProjectTitle.value = result.project_title;
    updateProjectType.value = result.project_type;
    updateProjectStatus.value = result.project_status;
    updateProjectStartDate.value = new Date(result.project_start_date).toISOString().substring(0, 10);
    updateProjectDeadline.value = new Date(result.project_deadline).toISOString().substring(0, 10);
    updateProjectUrl.value = result.project_url;
    updateProjectDescription.value = result.project_description;
}

updateProjectForm.addEventListener('submit', function(event){
    event.preventDefault();
    
    var id = event.target.closest('[data-key]').getAttribute('data-key');
    var result = projects.find(item => item.id == id);
    updateProjectDB(
        id,
        updateProjectTitle.value,
        updateProjectType.value,
        updateProjectStatus.value,
        new Date(updateProjectStartDate.value).toDateString(),
        new Date(updateProjectDeadline.value).toDateString(),
        updateProjectUrl.value,
        updateProjectDescription.value
    );

    result.project_title = updateProjectTitle.value;
    result.project_type = updateProjectType.value;
    result.project_status = updateProjectStatus.value;
    result.project_start_date = new Date(updateProjectStartDate.value).toDateString();
    result.project_deadline = new Date(updateProjectDeadline.value).toDateString();
    result.project_url = updateProjectUrl.value;
    result.project_description = updateProjectDescription.value;

    updateProjectTitle.value = '';
    updateProjectType.value = 'Select project type...';
    updateProjectStatus.value = 'Select project status...';
    updateProjectStartDate.value = '';
    updateProjectDeadline.value = '';
    updateProjectUrl.value = '';
    updateProjectDescription.value = '';
    
    closeEditor(document.querySelector('#updateProjectEditor'));
    initProjects(projects);
});

async function updateProjectDB(id, p_title, p_type, p_status, p_startDate, p_deadline, p_url, p_description) {
    const { data, error } = await supabase.from('Projects').update({
        project_title: p_title,
        project_type: p_type,
        project_status: p_status,
        project_start_date: p_startDate,
        project_deadline: p_deadline,
        project_url: p_url,
        project_description: p_description,
    }).match({ id: id });
    return data
}
