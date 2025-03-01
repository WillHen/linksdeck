require('dotenv').config({ path: './.env.test', override: true });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedList() {
  const userEmail = 'whenshaw87@outlook.com';

  try {
    // Look up user ID from email
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError) {
      throw new Error(
        `Error fetching user UUID for ${userEmail}: ${userError.message}`
      );
    }

    if (!user) {
      throw new Error(`No user found with email ${userEmail}`);
    }

    const userId = user.id;
    console.log(`User ID for ${userEmail}: ${userId}`);

    // Insert a new list for the user
    const { data: list, error: listError } = await supabase
      .from('lists')
      .insert([
        {
          user_id: userId,
          title: 'My List',
          description: 'This is a test list'
        }
      ])
      .select('*')
      .single();

    if (listError) {
      throw new Error(`Error inserting list: ${listError.message}`);
    }

    const { data: link, error: linkError } = await supabase
      .from('links')
      .insert([
        {
          title: 'Example Link',
          description: 'This is an example link',
          url: 'https://example.com',
          list_id: list.id,
          user_id: userId
        }
      ])
      .select('*')
      .single();

    if (linkError) {
      throw new Error(`Error inserting link: ${linkError.message}`);
    }

    console.log('Link inserted successfully:', link);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

seedList();
