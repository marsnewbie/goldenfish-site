// Global Authentication State Management
console.log('🔐 Global Auth Loading...');

// Simple authentication state management
class GlobalAuth {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.init();
  }

  init() {
    // Check for existing session
    this.loadFromStorage();
    
    // Update UI based on auth state
    this.updateUI();
    
    console.log('🔐 Global Auth initialized:', this.isAuthenticated ? 'Authenticated' : 'Guest');
  }

  loadFromStorage() {
    try {
      const userData = localStorage.getItem('user');
      const authToken = localStorage.getItem('authToken');
      
      if (userData && authToken) {
        this.user = JSON.parse(userData);
        this.isAuthenticated = true;
      }
    } catch (error) {
      console.error('❌ Error loading auth from storage:', error);
      this.logout(); // Clear invalid data
    }
  }

  login(user, token) {
    this.user = user;
    this.isAuthenticated = true;
    
    // Save to localStorage
    try {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error('❌ Error saving auth to storage:', error);
    }
    
    this.updateUI();
    console.log('✅ User logged in:', user.email);
  }

  logout() {
    this.user = null;
    this.isAuthenticated = false;
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    
    this.updateUI();
    console.log('👋 User logged out');
  }

  updateUI() {
    // Update auth links in navbar
    const authLinks = document.querySelector('.auth-links');
    if (authLinks) {
      if (this.isAuthenticated) {
        authLinks.innerHTML = `
          <span class="user-greeting">Hello, ${this.user?.name || this.user?.email}</span>
          <a href="#" class="logout" id="logoutBtn">Logout</a>
        `;
        
        // Add logout event listener
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
          });
        }
      } else {
        // Preserve original HTML structure
        authLinks.innerHTML = `
          <a href="signin.html?return=menu.html" class="login">Login</a>
          <span class="separator">/</span>
          <a href="register.html" class="register">Register</a>
        `;
      }
    }
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }

  getUser() {
    return this.user;
  }
}

// Create global instance
window.globalAuth = new GlobalAuth();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlobalAuth;
}

console.log('✅ Global Auth Loaded');