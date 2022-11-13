// singleton variables
var interactivePanel = document.querySelector('#interactivePanel');

// color select style
const colorInput = document.querySelectorAll(".color-select");

colorInput.forEach(function(item){
    var color = item.getAttribute('value');
    item.style.background = color;
});

// dark and light mode
const modeInit = document.querySelector('#darkMode');
var darkModeEngaged = 0;

modeInit.addEventListener('click', function(event){
    if(darkModeEngaged == 0){
        document.body.classList.add('darkMode');
        darkModeEngaged = 1;
        localStorage.setItem("darkMode", darkModeEngaged);
    }
    else if(darkModeEngaged == 1){
        document.body.classList.remove('darkMode');
        darkModeEngaged = 0;
        localStorage.setItem("darkMode", darkModeEngaged);
    }
});
localStorage.getItem("darkMode");
if(localStorage.getItem("darkMode") == 1){
    document.body.classList.add('darkMode');
}
else if(localStorage.getItem("darkMode") == 0){
    document.body.classList.remove('darkMode');
}

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


// authentication switch
if(window.location.pathname == '/pages/authentication.html'){
    const createAccountSection = document.querySelector('#createAccountContainer');
    const signInSection = document.querySelector('#signInContainer');
    const signInSwitcher = document.querySelector('#alreadyMember');
    const createAccountSwitcher = document.querySelector('#notAMember');

    const forgotPasswordSection = document.querySelector('#forgotPasswordContainer');
    const returnToSignUpSwitcher = document.querySelector('#goBackToSignIn');
    const forgotPasswordSwitcher = document.querySelector('#forgottenPassword');


    signInSwitcher.addEventListener('click', function(event){
        event.preventDefault();
        createAccountSection.classList.remove('active');
        createAccountSection.classList.add('inactive');
        signInSection.classList.remove('inactive');
        signInSection.classList.add('active');
    });
    
    createAccountSwitcher.addEventListener('click', function(event){
        event.preventDefault();
        createAccountSection.classList.remove('inactive');
        createAccountSection.classList.add('active');
        signInSection.classList.remove('active');
        signInSection.classList.add('inactive');
    });

    forgotPasswordSwitcher.addEventListener('click', function(event){
        event.preventDefault();
        forgotPasswordSection.classList.remove('inactive');
        forgotPasswordSection.classList.add('active');
        signInSection.classList.remove('active');
        signInSection.classList.add('inactive');
        
    });

    returnToSignUpSwitcher.addEventListener('click', function(event){
        event.preventDefault();
        signInSection.classList.add('active');
        signInSection.classList.remove('inactive');
        forgotPasswordSection.classList.add('inactive');
        forgotPasswordSection.classList.remove('active');
    });
}

// account tabs
const tabs = document.querySelectorAll('.settings-panel-tab');
const panels = document.querySelectorAll('.settings-panel');

tabs.forEach(function(item){
    item.addEventListener('click', function(event){
        event.preventDefault();
        openTab(item);
    });
})

function openTab(initiator){
    const target = initiator.getAttribute('data-target');
    const thisPanel = document.querySelector('#' + target);
    
    panels.forEach(function(panel){
        if(panel.classList.contains('active')){
            panel.classList.remove('active');
            panel.classList.add('inactive');
        }
    });

    tabs.forEach(function(tab){
        if(tab.classList.contains('active')){
            tab.classList.remove('active');
            tab.classList.add('inactive');
        }
    });

    initiator.classList.remove('inactive');
    thisPanel.classList.remove('inactive');
    initiator.classList.add('active');
    thisPanel.classList.add('active');
}