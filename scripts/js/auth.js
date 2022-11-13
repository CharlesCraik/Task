import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://xeqakifqoncvitlrbymn.supabase.co', 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcWFraWZxb25jdml0bHJieW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYyNDE5ODUsImV4cCI6MTk4MTgxNzk4NX0.7k5szeNRkhhbIf7sEUpp7oL0-HDoIhsTK_U8r42YM7A');


// create account
const createAccountForm = document.querySelector('#createAccountForm');
const newUserEmail = document.querySelector('#newUser_email');
const newUserPassword = document.querySelector('#newUser_password');
const newUserFirstName = document.querySelector('#newUser_firstName');
const newUserLastName = document.querySelector('#newUser_lastName');

createAccountForm.addEventListener('submit', function(event){
    event.preventDefault();
    console.log('Creating account...');
    
    const email = newUserEmail.value;
    const password = newUserPassword.value;
    const firstName = newUserFirstName.value;
    const lastName = newUserLastName.value;
    createAccount(email, password, firstName, lastName);
});

async function createAccount(userEmail, userPassword, userFirstName, userLastName){
    const { data, error } = await supabase.auth.signUp({
        email: userEmail,
        password: userPassword,
        options: {
            data: {
              first_name: userFirstName,
              last_name: userLastName
            }
          }
    });
    window.location.href = "/";
}


// sign in
const signInForm = document.querySelector('#signInForm');
const signInEmail = document.querySelector('#signIn_email');
const signInPassword = document.querySelector('#signIn_password');

signInForm.addEventListener('submit', function(event){
    event.preventDefault();
    console.log('Signing in...');
    const email = signInEmail.value;
    const password = signInPassword.value;
    signIn(email, password);
});

async function signIn(userEmail, userPassword){
    const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
    });
    window.location.href = "/";
}


// forgot password
const forgotPasswordForm = document.querySelector('#forgotPasswordForm');
const forgotPasswordEmail = document.querySelector('#fg_email');

forgotPasswordForm.addEventListener('submit', function(event){
    event.preventDefault();
    console.log('Sending Email...');
    const email = forgotPasswordEmail.value;
    recoverPassword(email);
});

async function recoverPassword(userEmail){
    const { data, error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: '/pages/recover-password.html',
    });
}