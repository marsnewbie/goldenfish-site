// Supabase Configuration for Frontend
console.log('🔧 Supabase Config Loading...');

// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'https://cyitrtjkoqxkolvtsydx.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aXRydGprb3F4a29sdnRzeWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzMxMDIsImV4cCI6MjA3MDEwOTEwMn0.3t6mSgDMEj70C40mXuL4C0OxPvntbf-pPAcav9aLU6M'
};

// Make config available globally
window.SUPABASE_CONFIG = SUPABASE_CONFIG;

console.log('✅ Supabase Config Ready');