// Global Authentication Manager for all pages
class GlobalAuthManager {
  constructor() {
    this.currentUser = null;
    this.apiBase = 'https://goldenfish-backend-production.up.railway.app/api';
    
    this.init();
  }

  init() {
    // Check for existing authentication on page load
    this.checkExistingAuth();
  }

  async checkExistingAuth() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        // Verify token is still valid
        const response = await fetch(`${this.apiBase}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          this.currentUser = result.data;
          this.updateAuthUI();
          console.log('✅ User authenticated globally:', this.currentUser);
        } else {
          // Token expired, clear auth
          this.clearAuth();
        }
      } catch (error) {
        console.error('❌ Global auth verification failed:', error);
        this.clearAuth();
      }
    }
  }

  updateAuthUI() {
    if (!this.currentUser) {
      // Show default sign in buttons
      this.showSignInButtons();
      return;
    }

    // Update all auth sections on the page
    this.updateNavAuthSection();
    this.updateCheckoutHeaderAuth();
  }

  updateNavAuthSection() {
    // Update main navigation auth section (index.html, menu.html)
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth) {
      const initials = `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
      
      navAuth.innerHTML = `
        <div class="user-dropdown">
          <button class="user-info-btn" onclick="globalAuth.toggleUserDropdown()">
            <div class="user-avatar">${initials}</div>
            <div class="user-details">
              <div class="user-name">${this.currentUser.firstName} ${this.currentUser.lastName}</div>
              <div class="user-email">${this.currentUser.email}</div>
            </div>
          </button>
          <div class="dropdown-menu" id="userDropdownMenu">
            <a href="menu.html" class="dropdown-item">
              <span class="dropdown-icon">🛒</span>
              Order Online
            </a>
            <a href="#" onclick="globalAuth.viewOrderHistory()" class="dropdown-item">
              <span class="dropdown-icon">📋</span>
              Order History
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" onclick="globalAuth.signOut()" class="dropdown-item sign-out">
              <span class="dropdown-icon">👋</span>
              Sign Out
            </a>
          </div>
        </div>
      `;
    }

    // Update auth links (menu.html style)
    const authLinks = document.querySelector('.auth-links');
    if (authLinks) {
      const initials = `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
      
      authLinks.innerHTML = `
        <div class="user-info">
          <div class="user-avatar">${initials}</div>
          <div class="user-details">
            <div class="user-name">${this.currentUser.firstName} ${this.currentUser.lastName}</div>
            <div class="user-email">${this.currentUser.email}</div>
          </div>
          <button class="sign-out-link" onclick="globalAuth.signOut()">Sign Out</button>
        </div>
      `;
    }
  }

  updateCheckoutHeaderAuth() {
    // Update checkout header (already implemented in checkout.html)
    const headerUserInfo = document.getElementById('headerUserInfo');
    if (headerUserInfo) {
      const initials = `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
      
      headerUserInfo.classList.add('active');
      document.getElementById('headerUserAvatar').textContent = initials;
      document.getElementById('headerUserName').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
      document.getElementById('headerUserEmail').textContent = this.currentUser.email;
    }
  }

  showSignInButtons() {
    // Restore default sign in buttons
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth) {
      navAuth.innerHTML = `
        <button class="auth-btn login-btn" onclick="window.location.href='signin.html?return=' + encodeURIComponent(window.location.pathname)">Sign In</button>
        <button class="auth-btn register-btn" onclick="window.location.href='checkout.html'" style="margin-left: 8px;">Register</button>
      `;
    }

    const authLinks = document.querySelector('.auth-links');
    if (authLinks) {
      authLinks.innerHTML = `
        <a href="signin.html?return=menu.html" class="login">Login</a>
        <span class="separator">/</span>
        <a href="checkout.html" class="register">Register</a>
      `;
    }

    // Hide checkout header user info
    const headerUserInfo = document.getElementById('headerUserInfo');
    if (headerUserInfo) {
      headerUserInfo.classList.remove('active');
    }
  }

  toggleUserDropdown() {
    const dropdownMenu = document.getElementById('userDropdownMenu');
    if (dropdownMenu) {
      dropdownMenu.classList.toggle('active');
    }
  }

  viewOrderHistory() {
    // TODO: Implement order history page
    alert('Order history feature coming soon!');
  }

  signOut() {
    this.clearAuth();
    this.updateAuthUI();
    
    // Show success message
    alert('You have been signed out successfully.');
    
    // Redirect to home page if on a protected page
    if (window.location.pathname.includes('checkout.html')) {
      window.location.href = 'index.html';
    }
    
    console.log('👋 User signed out globally');
  }

  clearAuth() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.currentUser = null;
  }

  // Utility method to get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Utility method to check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }
}

// Initialize global auth manager
let globalAuth;
document.addEventListener('DOMContentLoaded', () => {
  globalAuth = new GlobalAuthManager();
});

// Add required styles for user dropdown
const globalAuthStyles = `
  <style>
    .user-dropdown {
      position: relative;
      display: inline-block;
    }

    .user-info-btn {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .user-info-btn:hover {
      background: #e9ecef;
      border-color: #007bff;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #007bff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.8rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
      line-height: 1.2;
    }

    .user-email {
      font-size: 0.75rem;
      color: #666;
      line-height: 1;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      min-width: 200px;
      z-index: 1000;
      display: none;
      margin-top: 0.25rem;
    }

    .dropdown-menu.active {
      display: block;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      color: #333;
      text-decoration: none;
      border-bottom: 1px solid #f8f9fa;
      transition: background-color 0.2s;
    }

    .dropdown-item:hover {
      background: #f8f9fa;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item.sign-out {
      color: #dc3545;
    }

    .dropdown-item.sign-out:hover {
      background: #f8d7da;
    }

    .dropdown-icon {
      font-size: 0.9rem;
    }

    .dropdown-divider {
      height: 1px;
      background: #dee2e6;
      margin: 0.25rem 0;
    }

    /* Menu page auth styles */
    .auth-links .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8f9fa;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
    }

    .auth-links .sign-out-link {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .auth-links .sign-out-link:hover {
      background: #c82333;
    }

    /* Close dropdown when clicking outside */
    @media (max-width: 768px) {
      .user-details {
        display: none;
      }
      
      .dropdown-menu {
        left: 0;
        right: 0;
      }
    }
  </style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', globalAuthStyles);

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
  const userDropdown = document.querySelector('.user-dropdown');
  const dropdownMenu = document.getElementById('userDropdownMenu');
  
  if (userDropdown && dropdownMenu && !userDropdown.contains(event.target)) {
    dropdownMenu.classList.remove('active');
  }
});