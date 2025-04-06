import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the Service Role Key
);

async function deleteSupabaseUser(userId: string) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
        console.error('Error deleting user from Supabase Auth:', error.message);
        throw new Error('Failed to delete user from Supabase Auth');
    }

    console.log(`User with ID ${userId} deleted from Supabase Auth`);
}

async function deleteUserProfile(userId: string) {
    const { error } = await supabaseAdmin
        .from('user_profiles')
        .delete()
        .eq('id', userId);

    if (error) {
        console.error('Error deleting user profile:', error.message);
        throw new Error('Failed to delete user profile');
    }

    console.log(`User profile with ID ${userId} deleted successfully`);
}

export async function deleteUserAndData(userId: string) {
    try {
        // Step 1: Delete the user from Supabase Auth
        await deleteSupabaseUser(userId);

        // Step 2: Delete the user profile (and cascade delete related data)
        await deleteUserProfile(userId);

        console.log(`User with ID ${userId} and all related data deleted successfully`);
    } catch (error) {
        console.error('Error deleting user and data:', error);
        throw new Error('Failed to delete user and data');
    }
}