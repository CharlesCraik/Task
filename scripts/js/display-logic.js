// singleton variables
var interactivePanel = document.querySelector('#interactivePanel');

// color select style
const colorInput = document.querySelectorAll(".color-select");

colorInput.forEach(function(item){
    var color = item.getAttribute('value');
    item.style.background = color;
});

// select placeholder
const selectInput = document.querySelectorAll('select.place_holder');

selectInput.forEach(function(item){
    item.addEventListener("change", () => {
        item.classList.remove('place_holder');
    });
});

// close editor
function closeEditor(target){
    interactivePanel.classList.remove('active');
    target.classList.remove('active');
    interactivePanel.classList.add('inactive');
    target.classList.add('inactive');
}

// open editor
function openEditor(target){
    interactivePanel.classList.add('active');
    target.classList.add('active');
    interactivePanel.classList.remove('inactive');
    target.classList.remove('inactive');
}


// display logic : project editor
if(window.location.pathname == '/'){
    var newProjectEditor = document.querySelector('#newProjectEditor');
    var newProjectInit = document.querySelector('#newProject');
    var newProjectCanc = document.querySelector('#cancelProject');
    
    var updateProjectEditor = document.querySelector('#updateProjectEditor');
    var updateProjectCancel = document.querySelector('#f2_cancelProject');
    
    newProjectInit.addEventListener('click', function(){
        openEditor(newProjectEditor);
    });
    newProjectCanc.addEventListener('click', function(){
        closeEditor(newProjectEditor);
    });
    updateProjectCancel.addEventListener('click', function(){
        closeEditor(updateProjectEditor);
    });
    
    function updateProject(id){
        hideOptions(id);
        openEditor(updateProjectEditor);
    }
}

// display logic : task editor
if(window.location.pathname == '/pages/tasks.html'){
    var newTaskEditor = document.querySelector('#newTaskEditor');
    var newTaskInit = document.querySelector('#newTask');
    var newTaskCanc = document.querySelector('#cancelTask');

    var updateTaskEditor = document.querySelector('#updateTaskEditor');
    var updateTaskCanc = document.querySelector('#f2_cancelTask');
    
    newTaskInit.addEventListener('click', function(){
        openEditor(newTaskEditor);
    });
    newTaskCanc.addEventListener('click', function(){
        closeEditor(newTaskEditor);
    });
    updateTaskCanc.addEventListener('click', function(){
        closeEditor(updateTaskEditor);
    });

    function updateTask(id){
        hideTaskOptions(id);
        openEditor(updateTaskEditor);
    }
}


// project options menu
function viewOptions(id){
    var ref = 'li.project-item[data-key="' + id + '"]';
    var target = document.querySelector(ref);
    target.classList.add('editing');    
}

function hideOptions(id){
    var ref = 'li.project-item[data-key="' + id + '"]';
    var target = document.querySelector(ref);
    target.classList.remove('editing'); 
}


// task option menu
function viewTaskOptions(id){
    var ref = 'li.task-item[data-key="' + id + '"]';
    var target = document.querySelector(ref);
    target.classList.add('editing');  
}

function hideTaskOptions(id){
    var ref = 'li.task-item[data-key="' + id + '"]';
    var target = document.querySelector(ref);
    target.classList.remove('editing');  
}
