import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://xeqakifqoncvitlrbymn.supabase.co', 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcWFraWZxb25jdml0bHJieW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYyNDE5ODUsImV4cCI6MTk4MTgxNzk4NX0.7k5szeNRkhhbIf7sEUpp7oL0-HDoIhsTK_U8r42YM7A');

async function getUser(){
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

var thisUser = [];

getUser().then((user) => {
    if(user == null){
        window.location.href = "/pages/sign-up.html";
    }
    else{
        thisUser = user;
        const userDisplayName = thisUser.user_metadata.first_name + ' ' + thisUser.user_metadata.last_name;
        const displayName = document.querySelector('#displayUserInfo_name');
        displayName.innerHTML = `${userDisplayName}`;
    }
});
