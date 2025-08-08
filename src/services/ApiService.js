// Centralized API service
class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL || 'https://goldenfish-backend-production.up.railway.app/api';
    this.timeout = 10000; // 10 seconds
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      console.log(`📡 API Request: ${config.method} ${url}`);
      
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ API Response: ${config.method} ${url}`, data);
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`❌ API Error: ${config.method} ${url}`, error);
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection.');
      }
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : null
    });
  }

  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : null
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Utility method to handle authentication headers
  withAuth(token) {
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  // Health check endpoint
  async healthCheck() {
    try {
      const response = await this.get('/health');
      return response.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Error handler for common API errors
  handleApiError(error, context = '') {
    console.error(`API Error ${context}:`, error);
    
    // Common error messages for user feedback
    if (error.message.includes('401')) {
      return 'Authentication required. Please log in.';
    }
    
    if (error.message.includes('403')) {
      return 'Access denied. You do not have permission.';
    }
    
    if (error.message.includes('404')) {
      return 'Resource not found.';
    }
    
    if (error.message.includes('500')) {
      return 'Server error. Please try again later.';
    }
    
    if (error.message.includes('Network error')) {
      return 'Network error. Please check your connection.';
    }
    
    if (error.message.includes('timeout')) {
      return 'Request timeout. Please try again.';
    }
    
    return error.message || 'An unexpected error occurred.';
  }
}

export default ApiService;