/**
 * Supabase Configuration for Golden Fish Online Ordering
 * Standard email/password authentication with database integration
 */

// Supabase Project Configuration
const SUPABASE_CONFIG = {
    url: 'https://cyitrtjkoqxkolvtsydx.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aXRydGprb3F4a29sdnRzeWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzMxMDIsImV4cCI6MjA3MDEwOTEwMn0.3t6mSgDMEj70C40mXuL4C0OxPvntbf-pPAcav9aLU6M'
};

// Initialize Supabase client for frontend data queries
let supabaseClient = null;

if (typeof window !== 'undefined' && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
}

// Frontend helper class for user data queries
class SupabaseHelper {
    constructor() {
        this.client = supabaseClient;
    }

    // Check if user exists in our users table
    async checkUserExists(email) {
        if (!this.client) return { exists: false, error: 'Supabase not initialized' };
        
        try {
            const { data, error } = await this.client
                .from('users')
                .select('id, first_name, last_name, email, phone')
                .eq('email', email.toLowerCase())
                .eq('status', 'active')
                .single();

            if (error && error.code !== 'PGRST116') { // Not found is ok
                return { exists: false, error: error.message };
            }

            return { exists: !!data, user: data, error: null };
        } catch (error) {
            return { exists: false, error: error.message };
        }
    }

    // Get user's saved addresses
    async getUserAddresses(userId) {
        if (!this.client) return { addresses: [], error: 'Supabase not initialized' };
        
        try {
            const { data, error } = await this.client
                .from('user_addresses')
                .select('*')
                .eq('user_id', userId)
                .order('is_default', { ascending: false });

            return { addresses: data || [], error };
        } catch (error) {
            return { addresses: [], error: error.message };
        }
    }
}

// Make available globally
window.supabaseHelper = new SupabaseHelper();
window.SUPABASE_CONFIG = SUPABASE_CONFIG;