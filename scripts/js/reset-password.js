import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://xeqakifqoncvitlrbymn.supabase.co', 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcWFraWZxb25jdml0bHJieW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYyNDE5ODUsImV4cCI6MTk4MTgxNzk4NX0.7k5szeNRkhhbIf7sEUpp7oL0-HDoIhsTK_U8r42YM7A');

const resetPasswordForm = document.querySelector('#resetPasswordForm');
const newPassword = document.querySelector('#resetMeta_password');
const confirmPassword = document.querySelector('#resetMeta_confirmPassword');

resetPasswordForm.addEventListener('submit', function(event){
    event.preventDefault();
    const password = newPassword.value;
    const passwordConfirmation = confirmPassword.value;
    if(password == passwordConfirmation){
        console.log('Passwords match!');
        resetPassword(password);

    }
    else{
        console.log('Passwords do not match!');
    }
});

async function resetPassword(userPassword){
    const { data, error } = await supabase.auth
  .updateUser({ password: userPassword });
  console.log('Password reset to: ' + userPassword);
  window.location.href = "/";
}
