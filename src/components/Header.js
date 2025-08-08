// Header navigation component
class Header {
  constructor() {
    this.currentUser = null;
  }

  render(container) {
    container.innerHTML = this.getHTML();
    this.attachEventListeners();
    this.updateAuthState();
  }

  getHTML() {
    return `
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-left">
            <a href="/" class="logo">
              <img src="/assets/fish_and_chips.jpg" alt="Golden Fish" class="logo-img">
              <span>Golden Fish</span>
            </a>
          </div>
          
          <div class="nav-center">
            <a href="/" class="nav-link" data-route="/">Home</a>
            <a href="/menu" class="nav-link" data-route="/menu">Order Online</a>
            <a href="#about" class="nav-link">About</a>
            <a href="#contact" class="nav-link">Contact</a>
          </div>
          
          <div class="nav-right">
            <a href="/cart" class="cart-link" data-route="/cart">
              <span class="cart-icon">🛒</span>
              <span class="cart-count" style="display: none;">0</span>
            </a>
            
            <div class="auth-section">
              <div class="auth-loading" style="display: none;">
                <span>Loading...</span>
              </div>
              
              <div class="auth-guest">
                <a href="/login" class="nav-link" data-route="/login">Login</a>
                <span class="separator">/</span>
                <a href="/register" class="nav-link" data-route="/register">Register</a>
              </div>
              
              <div class="auth-user" style="display: none;">
                <div class="user-menu">
                  <button class="user-button">
                    <span class="user-avatar">👤</span>
                    <span class="user-name"></span>
                  </button>
                  <div class="user-dropdown" style="display: none;">
                    <a href="#" class="dropdown-item" id="profileLink">Profile</a>
                    <a href="#" class="dropdown-item" id="ordersLink">My Orders</a>
                    <button class="dropdown-item" id="logoutBtn">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  attachEventListeners() {
    // Handle navigation clicks
    document.querySelectorAll('[data-route]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = e.currentTarget.getAttribute('data-route');
        window.history.pushState({}, '', route);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    });

    // User menu toggle
    const userButton = document.querySelector('.user-button');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userButton && userDropdown) {
      userButton.addEventListener('click', () => {
        const isVisible = userDropdown.style.display !== 'none';
        userDropdown.style.display = isVisible ? 'none' : 'block';
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
          userDropdown.style.display = 'none';
        }
      });
    }

    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.handleLogout();
      });
    }
  }

  updateAuthState(user) {
    this.currentUser = user;
    
    const authLoading = document.querySelector('.auth-loading');
    const authGuest = document.querySelector('.auth-guest');
    const authUser = document.querySelector('.auth-user');
    const userName = document.querySelector('.user-name');

    // Hide loading
    if (authLoading) authLoading.style.display = 'none';

    if (user) {
      // Show user menu
      if (authGuest) authGuest.style.display = 'none';
      if (authUser) authUser.style.display = 'block';
      if (userName) userName.textContent = user.firstName || user.name;
    } else {
      // Show guest links
      if (authGuest) authGuest.style.display = 'block';
      if (authUser) authUser.style.display = 'none';
    }

    // Update active nav link
    this.updateActiveNavLink();
  }

  updateActiveNavLink() {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-route') === currentPath) {
        link.classList.add('active');
      }
    });
  }

  async handleLogout() {
    try {
      // Import auth service dynamically to avoid circular imports
      const { default: AuthService } = await import('../services/AuthService.js');
      const authService = new AuthService();
      await authService.logout();
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  }

  // Method to update cart count from external calls
  updateCartCount(count) {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'inline' : 'none';
    }
  }
}

export default Header;