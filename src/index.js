// Modern frontend entry point
import App from './App.js';
import './styles/global.css';

// Environment configuration
const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://goldenfish-backend-production.up.railway.app/api'
    : 'http://localhost:3000/api',
  SUPABASE_URL: 'https://cyitrtjkoqxkolvtsydx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aXRydGprb3F4a29sdnRzeWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzMxMDIsImV4cCI6MjA3MDEwOTEwMn0.3t6mSgDMEj70C40mXuL4C0OxPvntbf-pPAcav9aLU6M'
};

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const app = new App(config);
  app.init();
});

export { config };