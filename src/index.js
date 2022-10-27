import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://xeqakifqoncvitlrbymn.supabase.co', 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcWFraWZxb25jdml0bHJieW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYyNDE5ODUsImV4cCI6MTk4MTgxNzk4NX0.7k5szeNRkhhbIf7sEUpp7oL0-HDoIhsTK_U8r42YM7A');

async function getProjects() {
    let { data, error } = await supabase.from('Projects').select('*')
    return data
}
  
/*const supabaseUrl = 'https://xeqakifqoncvitlrbymn.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)*/
