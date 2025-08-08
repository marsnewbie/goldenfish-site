// Authentication service
import ApiService from './ApiService.js';

class AuthService {
  constructor(config = {}) {
    this.apiService = new ApiService(config.API_BASE_URL);
    this.currentUser = null;
    this.token = null;
  }

  async init() {
    // Check for existing token in localStorage
    this.token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (this.token && userData) {
      try {
        this.currentUser = JSON.parse(userData);
        // Verify token is still valid
        await this.verifyToken();
        this.dispatchAuthEvent('login', this.currentUser);
      } catch (error) {
        console.warn('Stored token invalid:', error);
        this.clearAuth();
      }
    }
  }

  async verifyToken() {
    if (!this.token) throw new Error('No token to verify');
    
    try {
      const response = await this.apiService.get('/auth/verify', {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      
      if (!response.success) {
        throw new Error('Token verification failed');
      }
      
      return response.data.user;
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }

  async login(email, password) {
    try {
      const response = await this.apiService.post('/auth/signin', {
        email: email.toLowerCase().trim(),
        password
      });

      if (response.success) {
        this.token = response.data.token;
        this.currentUser = response.data.user;
        
        // Store in localStorage
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('user_data', JSON.stringify(this.currentUser));
        
        // Dispatch login event
        this.dispatchAuthEvent('login', this.currentUser);
        
        return { success: true, user: this.currentUser };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please check your credentials.' 
      };
    }
  }

  async register(userData) {
    try {
      const response = await this.apiService.post('/auth/signup', {
        firstName: userData.firstName?.trim(),
        lastName: userData.lastName?.trim(),
        email: userData.email?.toLowerCase().trim(),
        phone: userData.phone?.trim(),
        password: userData.password
      });

      if (response.success) {
        // Auto-login after successful registration
        return await this.login(userData.email, userData.password);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.'
      };
    }
  }

  async logout() {
    try {
      if (this.token) {
        // Inform server about logout (optional)
        await this.apiService.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${this.token}` }
        }).catch(() => {
          // Ignore server errors on logout
        });
      }
    } finally {
      this.clearAuth();
      this.dispatchAuthEvent('logout');
    }
  }

  clearAuth() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  isAuthenticated() {
    return !!this.token && !!this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getToken() {
    return this.token;
  }

  // Get authenticated request headers
  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  // Dispatch authentication events
  dispatchAuthEvent(type, data) {
    const event = new CustomEvent(`auth:${type}`, { detail: data });
    document.dispatchEvent(event);
  }

  // Password validation
  validatePassword(password) {
    const errors = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Email validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation (UK format)
  validatePhone(phone) {
    const phoneRegex = /^(\+44|0)[1-9]\d{8,10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
}

export default AuthService;