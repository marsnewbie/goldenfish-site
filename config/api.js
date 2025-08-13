// API Configuration
const API_CONFIG = {
    // 开发环境
    development: {
        baseURL: 'http://localhost:3000/api',
        timeout: 10000,
        retries: 3
    },
    
    // 生产环境
    production: {
        baseURL: 'https://goldenfish-backend-production.up.railway.app/api',
        timeout: 15000,
        retries: 3
    },
    
    // 测试环境
    staging: {
        baseURL: 'https://goldenfish-backend-staging.up.railway.app/api',
        timeout: 12000,
        retries: 3
    }
};

// 获取当前环境
const getCurrentEnvironment = () => {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'development';
    } else if (hostname.includes('staging') || hostname.includes('test')) {
        return 'staging';
    } else {
        return 'production';
    }
};

// 当前配置
const currentConfig = API_CONFIG[getCurrentEnvironment()];

// API端点
const API_ENDPOINTS = {
    // 认证相关
    auth: {
        login: '/users/login',
        register: '/users/register',
        profile: '/users/profile',
        verify: '/users/verify-token',
        refresh: '/users/refresh-token'
    },
    
    // 菜单相关
    menu: {
        list: '/menu',
        categories: '/menu/categories',
        item: (id) => `/menu/${id}`,
        search: '/menu/search'
    },
    
    // 订单相关
    orders: {
        create: '/orders',
        list: '/orders',
        details: (id) => `/orders/${id}`,
        update: (id) => `/orders/${id}`,
        cancel: (id) => `/orders/${id}/cancel`
    },
    
    // 用户相关
    users: {
        profile: '/users/profile',
        addresses: '/users/addresses',
        preferences: '/users/preferences',
        orders: '/users/orders'
    },
    
    // 支付相关
    payment: {
        createIntent: '/payment/create-intent',
        confirm: '/payment/confirm',
        webhook: '/payment/webhook'
    },
    
    // 配送相关
    delivery: {
        calculate: '/delivery/calculate',
        zones: '/delivery/zones',
        times: '/delivery/times'
    },
    
    // 管理后台
    admin: {
        dashboard: '/admin/dashboard',
        orders: '/admin/orders',
        menu: '/admin/menu',
        analytics: '/admin/analytics',
        settings: '/admin/settings'
    }
};

// API工具类
class ApiService {
    constructor() {
        this.baseURL = currentConfig.baseURL;
        this.timeout = currentConfig.timeout;
        this.retries = currentConfig.retries;
    }
    
    // 获取认证头
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
    
    // 构建完整URL
    buildUrl(endpoint) {
        return `${this.baseURL}${endpoint}`;
    }
    
    // 处理响应
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        return response.json();
    }
    
    // 重试机制
    async retryRequest(fn, retries = this.retries) {
        try {
            return await fn();
        } catch (error) {
            if (retries > 0 && this.isRetryableError(error)) {
                await this.delay(1000);
                return this.retryRequest(fn, retries - 1);
            }
            throw error;
        }
    }
    
    // 判断是否可重试的错误
    isRetryableError(error) {
        return error.message.includes('Network') || 
               error.message.includes('timeout') ||
               error.message.includes('500');
    }
    
    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // GET请求
    async get(endpoint, options = {}) {
        return this.retryRequest(async () => {
            const url = this.buildUrl(endpoint);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                    ...options.headers
                },
                signal: AbortSignal.timeout(this.timeout)
            });
            return this.handleResponse(response);
        });
    }
    
    // POST请求
    async post(endpoint, data = {}, options = {}) {
        return this.retryRequest(async () => {
            const url = this.buildUrl(endpoint);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                    ...options.headers
                },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(this.timeout)
            });
            return this.handleResponse(response);
        });
    }
    
    // PUT请求
    async put(endpoint, data = {}, options = {}) {
        return this.retryRequest(async () => {
            const url = this.buildUrl(endpoint);
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                    ...options.headers
                },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(this.timeout)
            });
            return this.handleResponse(response);
        });
    }
    
    // DELETE请求
    async delete(endpoint, options = {}) {
        return this.retryRequest(async () => {
            const url = this.buildUrl(endpoint);
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                    ...options.headers
                },
                signal: AbortSignal.timeout(this.timeout)
            });
            return this.handleResponse(response);
        });
    }
}

// 创建API服务实例
const apiService = new ApiService();

// 导出配置和服务
window.API_CONFIG = API_CONFIG;
window.API_ENDPOINTS = API_ENDPOINTS;
window.apiService = apiService;

// 兼容性导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        API_ENDPOINTS,
        ApiService,
        apiService
    };
}
