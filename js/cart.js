// Shopping Cart Service
class CartService {
    constructor() {
        this.cartKey = 'shoppingCart';
        this.cart = this.loadCart();
        this.listeners = [];
        this.init();
    }
    
    // 初始化
    init() {
        // 监听存储变化（跨标签页同步）
        window.addEventListener('storage', (e) => {
            if (e.key === this.cartKey) {
                this.cart = JSON.parse(e.newValue || '[]');
                this.notifyListeners();
            }
        });
        
        // 页面卸载前保存购物车
        window.addEventListener('beforeunload', () => {
            this.saveCart();
        });
    }
    
    // 加载购物车
    loadCart() {
        try {
            const cartData = localStorage.getItem(this.cartKey);
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }
    
    // 保存购物车
    saveCart() {
        try {
            localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }
    
    // 添加商品到购物车
    addItem(item, quantity = 1, options = {}) {
        const existingItem = this.findItem(item.id, options);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: quantity,
                options: options,
                specialInstructions: options.specialInstructions || '',
                totalPrice: item.price * quantity
            });
        }
        
        this.updateItemTotals();
        this.saveCart();
        this.notifyListeners();
        
        return this.cart;
    }
    
    // 从购物车移除商品
    removeItem(itemId, options = {}) {
        const index = this.cart.findIndex(item => 
            item.id === itemId && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );
        
        if (index > -1) {
            this.cart.splice(index, 1);
            this.updateItemTotals();
            this.saveCart();
            this.notifyListeners();
        }
        
        return this.cart;
    }
    
    // 更新商品数量
    updateQuantity(itemId, quantity, options = {}) {
        const item = this.findItem(itemId, options);
        
        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId, options);
            } else {
                item.quantity = quantity;
                item.totalPrice = item.price * quantity;
                this.updateItemTotals();
                this.saveCart();
                this.notifyListeners();
            }
        }
        
        return this.cart;
    }
    
    // 更新商品选项
    updateItemOptions(itemId, newOptions, oldOptions = {}) {
        const oldItem = this.findItem(itemId, oldOptions);
        
        if (oldItem) {
            const newItem = {
                ...oldItem,
                options: newOptions,
                specialInstructions: newOptions.specialInstructions || ''
            };
            
            this.removeItem(itemId, oldOptions);
            this.cart.push(newItem);
            this.updateItemTotals();
            this.saveCart();
            this.notifyListeners();
        }
        
        return this.cart;
    }
    
    // 查找商品
    findItem(itemId, options = {}) {
        return this.cart.find(item => 
            item.id === itemId && 
            JSON.stringify(item.options) === JSON.stringify(options)
        );
    }
    
    // 更新商品总价
    updateItemTotals() {
        this.cart.forEach(item => {
            item.totalPrice = item.price * item.quantity;
        });
    }
    
    // 清空购物车
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.notifyListeners();
        return this.cart;
    }
    
    // 获取购物车商品数量
    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    // 获取购物车总价
    getSubtotal() {
        return this.cart.reduce((total, item) => total + item.totalPrice, 0);
    }
    
    // 获取购物车商品
    getItems() {
        return [...this.cart];
    }
    
    // 检查购物车是否为空
    isEmpty() {
        return this.cart.length === 0;
    }
    
    // 添加监听器
    addListener(callback) {
        this.listeners.push(callback);
    }
    
    // 移除监听器
    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
    
    // 通知监听器
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.cart, this.getItemCount(), this.getSubtotal());
            } catch (error) {
                console.error('Error in cart listener:', error);
            }
        });
    }
    
    // 导出购物车数据（用于结账）
    exportForCheckout() {
        return {
            items: this.cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                options: item.options,
                specialInstructions: item.specialInstructions,
                totalPrice: item.totalPrice
            })),
            subtotal: this.getSubtotal(),
            itemCount: this.getItemCount()
        };
    }
    
    // 验证购物车（检查商品是否仍然可用）
    async validateCart() {
        try {
            const response = await apiService.post('/menu/validate-cart', {
                items: this.cart
            });
            
            if (response.success) {
                // 更新价格和可用性
                this.cart = this.cart.map(item => {
                    const validatedItem = response.items.find(v => v.id === item.id);
                    if (validatedItem) {
                        return {
                            ...item,
                            price: validatedItem.price,
                            isAvailable: validatedItem.isAvailable,
                            totalPrice: validatedItem.price * item.quantity
                        };
                    }
                    return item;
                });
                
                this.updateItemTotals();
                this.saveCart();
                this.notifyListeners();
                
                return {
                    isValid: true,
                    cart: this.cart
                };
            } else {
                return {
                    isValid: false,
                    errors: response.errors
                };
            }
        } catch (error) {
            console.error('Error validating cart:', error);
            return {
                isValid: false,
                errors: ['Failed to validate cart']
            };
        }
    }
}

// 创建购物车服务实例
const cartService = new CartService();

// 导出服务
window.cartService = cartService;

// 兼容性导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CartService,
        cartService
    };
}
