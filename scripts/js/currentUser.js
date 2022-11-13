import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://xeqakifqoncvitlrbymn.supabase.co', 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcWFraWZxb25jdml0bHJieW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYyNDE5ODUsImV4cCI6MTk4MTgxNzk4NX0.7k5szeNRkhhbIf7sEUpp7oL0-HDoIhsTK_U8r42YM7A');

async function getUser(){
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

async function signOut(){
    const { error } = await supabase.auth.signOut();
    if(window.location.pathname == '/'){
        window.location.href = "./pages/authentication.html";
    }
    else{
        window.location.href = "authentication.html"; 
    }
}

let thisUser = [];

getUser().then((user) => {
    thisUser.push(user);
    if(user == null){
        window.location.href = "./pages/authentication.html";
        console.log('No user found');
    }
    else{
        thisUser = user;
        const userDisplayName = thisUser.user_metadata.first_name + ' ' + thisUser.user_metadata.last_name;
        const displayName = document.querySelector('#displayUserInfo_name');
        displayName.innerHTML = `${userDisplayName}`;
        if(window.location.pathname == '/pages/account.html'){
            accountPageInit(thisUser);
        }
    }
});

// sign out
const signOutInit = document.querySelector('#signOut');

signOutInit.addEventListener('click', function(event){
    event.preventDefault();
    signOut();
});

function accountPageInit(user){
    const fields = document.querySelectorAll('input[data-type="populated"]');
    const firstName = document.querySelector('#userFirstName');
    const lastName = document.querySelector('#userLastName');
    const email = document.querySelector('#userEmail');
    const mobile = document.querySelector('#userMobile');
    const password = document.querySelector('#userPassword');
    const changePasswordInit = document.querySelector('#changePassword');

    const passwordMenu = document.querySelector('#accountPasswordReset');
    const newPassword = document.querySelector('#userNewPassword');
    const confirmPassword = document.querySelector('#userConfirmNewPassword');
    const updatePassword = document.querySelector('#accountSetNewPassword');
    const cancelUpdatePassword = document.querySelector('#cancelPasswordReset');

    const updateAccount = document.querySelector('#updateAccount');

    console.log(user);
    
    firstName.value = user.user_metadata.first_name;
    lastName.value = user.user_metadata.last_name;
    email.value = user.email;
    mobile.value = user.user_metadata.mobile;
    password.value = user.password;

    fields.forEach(function(field){
        if(field.value == 'undefined' && field.getAttribute('type') != 'password'){
            field.value = '';
        }
    });

    changePasswordInit.addEventListener('click', function(event){
        event.preventDefault();
        if(passwordMenu.classList.contains('inactive')){
            passwordMenu.classList.remove('inactive');
            passwordMenu.classList.add('active');
        }
        else if(passwordMenu.classList.contains('active')){
            passwordMenu.classList.add('active');
            passwordMenu.classList.remove('inactive');
        }
    });
    
    cancelUpdatePassword.addEventListener('click', function(event){
        event.preventDefault();
        passwordMenu.classList.remove('active');
        passwordMenu.classList.add('inactive');
    });
    
    updatePassword.addEventListener('click', function(event){
        event.preventDefault();
        if(newPassword.value == confirmPassword.value){
            accountUpdatePassword(newPassword.value);
        }
        else{
            console.log("Passwords do not match!");
        }
    });

    async function accountUpdatePassword(password){
        const { data, error } = await supabase.auth.updateUser({ password: password });
        console.log('Password Reset!');
    }
    
    updateAccount.addEventListener('click', function(event){
        event.preventDefault();
        console.log('Calling to update...');
        const updateFirstName = firstName.value;
        const updateLastName = lastName.value;
        const updateEmail = email.value;
        const updateMobile = mobile.value;
        updateUserAccount(updateFirstName, updateLastName, updateEmail, updateMobile);
    });

    async function updateUserAccount(user_firstName, user_lastName, user_Email, user_Mobile){
        console.log('Updating account...');
        const { data, error } = await supabase.auth.updateUser({
            email: user_Email,
            data: {
                first_name: user_firstName,
                last_name: user_lastName,
                mobile: user_Mobile
            }
        });
    }
}
