const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: './.env.test', override: true });
// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedUsers() {
  const users = [
    {
      email: 'testemail123@example.com',
      password: 'password123',
      user_metadata: { display_name: 'Will Henshaw' }
    },
    {
      email: 'testemail1234@example.com',
      password: 'password123',
      user_metadata: { display_name: 'Will Henshaw' }
    }
  ];

  for (const user of users) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: user.user_metadata
      }
    });

    if (error) {
      console.error('Error creating user:', error);
    } else {
      console.log('User created:', data);
    }
  }
}

// Run the seed function
seedUsers();
