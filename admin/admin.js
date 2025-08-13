// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.restaurantData = null;
        this.init();
    }
    
    // 初始化
    async init() {
        await this.checkAuth();
        await this.loadDashboardData();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }
    
    // 检查认证
    async checkAuth() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                window.location.href = '../signin.html';
                return;
            }
            
            const response = await apiService.get('/users/profile');
            if (response.success) {
                this.currentUser = response.user;
                if (!this.currentUser.isAdmin) {
                    this.showNotification('Access denied. Admin privileges required.', 'error');
                    window.location.href = '../index.html';
                }
            } else {
                window.location.href = '../signin.html';
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = '../signin.html';
        }
    }
    
    // 加载仪表板数据
    async loadDashboardData() {
        try {
            await Promise.all([
                this.loadStats(),
                this.loadRecentOrders(),
                this.loadRestaurantStatus()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Failed to load dashboard data', 'error');
        }
    }
    
    // 加载统计数据
    async loadStats() {
        try {
            const response = await apiService.get('/admin/dashboard/stats');
            if (response.success) {
                this.updateStats(response.stats);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
    
    // 更新统计数据
    updateStats(stats) {
        document.getElementById('todayOrders').textContent = stats.todayOrders || 0;
        document.getElementById('todayRevenue').textContent = `£${(stats.todayRevenue || 0).toFixed(2)}`;
        document.getElementById('avgOrderTime').textContent = `${stats.avgOrderTime || 0} min`;
        document.getElementById('avgRating').textContent = (stats.avgRating || 0).toFixed(1);
    }
    
    // 加载最近订单
    async loadRecentOrders() {
        try {
            const response = await apiService.get('/admin/orders?limit=10');
            if (response.success) {
                this.updateRecentOrders(response.orders);
            }
        } catch (error) {
            console.error('Error loading recent orders:', error);
        }
    }
    
    // 更新最近订单表格
    updateRecentOrders(orders) {
        const tbody = document.getElementById('recentOrdersTable');
        if (!tbody) return;
        
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">No recent orders</td></tr>';
            return;
        }
        
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer.firstName} ${order.customer.lastName}</td>
                <td>${order.items.length} items</td>
                <td>£${order.totals.total.toFixed(2)}</td>
                <td><span class="order-status status-${order.status.toLowerCase()}">${order.status}</span></td>
                <td>${this.formatTime(order.createdAt)}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="viewOrder(${order.id})">View</button>
                    <button class="btn btn-primary btn-sm" onclick="updateOrderStatus(${order.id})">Update</button>
                </td>
            </tr>
        `).join('');
    }
    
    // 加载餐厅状态
    async loadRestaurantStatus() {
        try {
            const response = await apiService.get('/admin/restaurant/status');
            if (response.success) {
                this.updateRestaurantStatus(response.status);
            }
        } catch (error) {
            console.error('Error loading restaurant status:', error);
        }
    }
    
    // 更新餐厅状态
    updateRestaurantStatus(status) {
        const toggle = document.getElementById('restaurantOpen');
        const currentStatus = document.getElementById('currentStatus');
        const nextOpening = document.getElementById('nextOpening');
        
        if (toggle) toggle.checked = status.isOpen;
        if (currentStatus) currentStatus.textContent = status.isOpen ? 'Open' : 'Closed';
        if (nextOpening) nextOpening.textContent = status.nextOpening;
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 实时更新按钮
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn btn-secondary';
        refreshBtn.textContent = 'Refresh';
        refreshBtn.onclick = () => this.loadDashboardData();
        
        const sectionHeader = document.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.appendChild(refreshBtn);
        }
    }
    
    // 开始实时更新
    startRealTimeUpdates() {
        // 每30秒更新一次数据
        setInterval(() => {
            this.loadStats();
            this.loadRecentOrders();
        }, 30000);
        
        // 监听新订单通知
        this.setupOrderNotifications();
    }
    
    // 设置订单通知
    setupOrderNotifications() {
        // 这里可以集成WebSocket或Server-Sent Events
        // 目前使用轮询方式
        setInterval(async () => {
            try {
                const response = await apiService.get('/admin/orders/new');
                if (response.success && response.newOrders > 0) {
                    this.showNotification(`You have ${response.newOrders} new order(s)!`, 'success');
                    this.loadRecentOrders();
                }
            } catch (error) {
                console.error('Error checking new orders:', error);
            }
        }, 10000);
    }
    
    // 切换餐厅状态
    async toggleRestaurantStatus() {
        const toggle = document.getElementById('restaurantOpen');
        const isOpen = toggle.checked;
        
        try {
            const response = await apiService.put('/admin/restaurant/status', {
                isOpen: isOpen
            });
            
            if (response.success) {
                this.showNotification(
                    `Restaurant is now ${isOpen ? 'open' : 'closed'}`, 
                    'success'
                );
                this.updateRestaurantStatus(response.status);
            } else {
                toggle.checked = !isOpen; // 恢复原状态
                this.showNotification('Failed to update restaurant status', 'error');
            }
        } catch (error) {
            console.error('Error updating restaurant status:', error);
            toggle.checked = !isOpen; // 恢复原状态
            this.showNotification('Failed to update restaurant status', 'error');
        }
    }
    
    // 显示通知
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        // 5秒后自动移除
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // 格式化时间
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// 全局函数
window.toggleRestaurantStatus = function() {
    adminDashboard.toggleRestaurantStatus();
};

window.viewOrder = function(orderId) {
    window.location.href = `orders.html?orderId=${orderId}`;
};

window.updateOrderStatus = function(orderId) {
    // 这里可以实现订单状态更新逻辑
    console.log('Update order status:', orderId);
};

window.printOrders = function() {
    window.open('print-orders.html', '_blank');
};

window.logout = function() {
    localStorage.removeItem('authToken');
    window.location.href = '../signin.html';
};

// 创建管理后台实例
const adminDashboard = new AdminDashboard();
