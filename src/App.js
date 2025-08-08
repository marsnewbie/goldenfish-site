// Main application controller
import Router from './utils/Router.js';
import AuthService from './services/AuthService.js';
import CartService from './services/CartService.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

// Pages
import HomePage from './pages/HomePage.js';
import MenuPage from './pages/MenuPage.js';
import CartPage from './pages/CartPage.js';
import CheckoutPage from './pages/CheckoutPage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import OrderConfirmationPage from './pages/OrderConfirmationPage.js';

class App {
  constructor(config) {
    this.config = config;
    this.router = new Router();
    this.authService = new AuthService(config);
    this.cartService = new CartService();
    
    this.setupRoutes();
    this.initializeServices();
  }

  setupRoutes() {
    this.router.addRoute('/', HomePage);
    this.router.addRoute('/menu', MenuPage);
    this.router.addRoute('/cart', CartPage);
    this.router.addRoute('/checkout', CheckoutPage);
    this.router.addRoute('/login', LoginPage);
    this.router.addRoute('/register', RegisterPage);
    this.router.addRoute('/order-confirmation/:orderId', OrderConfirmationPage);
    
    // 404 fallback
    this.router.setNotFoundRoute(() => {
      window.location.href = '/';
    });
  }

  async initializeServices() {
    // Initialize auth service
    await this.authService.init();
    
    // Initialize cart service
    this.cartService.init();
    
    // Setup global event listeners
    this.setupGlobalEvents();
  }

  setupGlobalEvents() {
    // Handle authentication state changes
    document.addEventListener('auth:login', (event) => {
      this.handleAuthChange(event.detail);
    });

    document.addEventListener('auth:logout', () => {
      this.handleAuthChange(null);
    });

    // Handle cart updates
    document.addEventListener('cart:updated', (event) => {
      this.updateCartDisplay(event.detail);
    });
  }

  handleAuthChange(user) {
    // Update header to show/hide login/logout
    const header = document.querySelector('.navbar');
    if (header) {
      const headerComponent = new Header();
      headerComponent.updateAuthState(user);
    }
  }

  updateCartDisplay(cartData) {
    // Update cart count in header
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      cartCount.textContent = cartData.totalItems;
      cartCount.style.display = cartData.totalItems > 0 ? 'inline' : 'none';
    }
  }

  async init() {
    console.log('🚀 Golden Fish App initializing...');
    
    // Render main layout
    this.renderLayout();
    
    // Start router
    this.router.init();
    
    console.log('✅ Golden Fish App ready');
  }

  renderLayout() {
    const app = document.getElementById('app') || document.body;
    
    app.innerHTML = `
      <div id="app-container">
        <header id="header-container"></header>
        <main id="main-content"></main>
        <footer id="footer-container"></footer>
      </div>
    `;

    // Initialize header and footer
    const header = new Header();
    header.render(document.getElementById('header-container'));

    const footer = new Footer();
    footer.render(document.getElementById('footer-container'));
  }
}

export default App;