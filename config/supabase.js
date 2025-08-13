// Supabase Configuration for Frontend
console.log('🔧 Supabase Config Loading...');

// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'https://hfrijjfeorzpibzqnmeg.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcmlqamZlb3J6cGlienFubWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNzg1NjQsImV4cCI6MjA3MDY1NDU2NH0.ZhpkeDiwJkbm-CqdeyCMLTSIlBFw6urTWn8csXmDu_k'
};

// Make config available globally
window.SUPABASE_CONFIG = SUPABASE_CONFIG;

console.log('✅ Supabase Config Ready');