// Checkout Service
class CheckoutService {
    constructor() {
        this.currentOrder = null;
        this.deliveryFee = 0;
        this.minimumOrder = 15;
        this.deliveryRadius = 5; // miles
        this.init();
    }
    
    // 初始化
    init() {
        this.loadSavedData();
        this.setupEventListeners();
    }
    
    // 加载保存的数据
    loadSavedData() {
        try {
            const savedData = localStorage.getItem('checkoutData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.currentOrder = data.order || null;
                this.deliveryFee = data.deliveryFee || 0;
            }
        } catch (error) {
            console.error('Error loading checkout data:', error);
        }
    }
    
    // 保存数据
    saveData() {
        try {
            const data = {
                order: this.currentOrder,
                deliveryFee: this.deliveryFee
            };
            localStorage.setItem('checkoutData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving checkout data:', error);
        }
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 配送类型切换
        document.addEventListener('change', (e) => {
            if (e.target.name === 'deliveryType') {
                this.handleDeliveryTypeChange(e.target.value);
            }
        });
        
        // 邮编检查
        const postcodeCheckBtn = document.getElementById('postcodeCheck');
        if (postcodeCheckBtn) {
            postcodeCheckBtn.addEventListener('click', () => {
                this.checkPostcode();
            });
        }
        
        // 表单提交
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder();
            });
        }
    }
    
    // 处理配送类型变化
    handleDeliveryTypeChange(type) {
        const postcodeSection = document.getElementById('postcodeSection');
        const timeSection = document.getElementById('timeSelectionSection');
        
        if (type === 'delivery') {
            if (postcodeSection) postcodeSection.style.display = 'block';
            if (timeSection) timeSection.style.display = 'block';
            this.calculateDeliveryFee();
        } else {
            if (postcodeSection) postcodeSection.style.display = 'none';
            if (timeSection) timeSection.style.display = 'none';
            this.deliveryFee = 0;
            this.updateTotals();
        }
    }
    
    // 检查邮编
    async checkPostcode() {
        const postcodeInput = document.getElementById('postcodeInput');
        const postcodeResult = document.getElementById('postcodeResult');
        const postcode = postcodeInput.value.trim().toUpperCase();
        
        if (!postcode) {
            this.showPostcodeResult('Please enter a postcode', 'error');
            return;
        }
        
        try {
            this.showPostcodeResult('Checking postcode...', 'loading');
            
            const response = await apiService.post('/delivery/check-postcode', {
                postcode: postcode
            });
            
            if (response.success) {
                this.showPostcodeResult('✓ Delivery available', 'success');
                this.deliveryFee = response.deliveryFee;
                this.updateTotals();
                this.loadDeliveryTimes();
            } else {
                this.showPostcodeResult(response.message || 'Delivery not available', 'error');
            }
        } catch (error) {
            console.error('Error checking postcode:', error);
            this.showPostcodeResult('Error checking postcode', 'error');
        }
    }
    
    // 显示邮编检查结果
    showPostcodeResult(message, type) {
        const postcodeResult = document.getElementById('postcodeResult');
        if (!postcodeResult) return;
        
        postcodeResult.textContent = message;
        postcodeResult.className = `postcode-result ${type}`;
    }
    
    // 加载配送时间
    async loadDeliveryTimes() {
        const timeSelect = document.getElementById('deliveryTimeSelect');
        if (!timeSelect) return;
        
        try {
            const response = await apiService.get('/delivery/times');
            
            if (response.success) {
                timeSelect.innerHTML = '<option value="">Select a time...</option>';
                response.times.forEach(time => {
                    const option = document.createElement('option');
                    option.value = time.value;
                    option.textContent = time.label;
                    timeSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading delivery times:', error);
        }
    }
    
    // 计算配送费
    calculateDeliveryFee() {
        // 这里可以根据距离、时间等因素计算配送费
        const subtotal = cartService.getSubtotal();
        
        if (subtotal >= 25) {
            this.deliveryFee = 0; // 免费配送
        } else if (subtotal >= 15) {
            this.deliveryFee = 2.50; // 标准配送费
        } else {
            this.deliveryFee = 3.50; // 高配送费
        }
        
        this.updateTotals();
    }
    
    // 更新总价
    updateTotals() {
        const subtotal = cartService.getSubtotal();
        const total = subtotal + this.deliveryFee;
        
        // 更新显示
        const subtotalElement = document.getElementById('subtotalAmount');
        const deliveryElement = document.getElementById('deliveryAmount');
        const totalElement = document.getElementById('totalAmount');
        
        if (subtotalElement) subtotalElement.textContent = `£${subtotal.toFixed(2)}`;
        if (deliveryElement) deliveryElement.textContent = `£${this.deliveryFee.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `£${total.toFixed(2)}`;
        
        // 检查最低订单金额
        this.checkMinimumOrder(subtotal);
    }
    
    // 检查最低订单金额
    checkMinimumOrder(subtotal) {
        const checkoutBtn = document.getElementById('checkoutBtn');
        const minimumNotice = document.getElementById('minimumNotice');
        
        if (subtotal < this.minimumOrder) {
            const remaining = this.minimumOrder - subtotal;
            if (minimumNotice) {
                minimumNotice.textContent = `Add £${remaining.toFixed(2)} more to meet minimum order`;
                minimumNotice.style.display = 'block';
            }
            if (checkoutBtn) {
                checkoutBtn.disabled = true;
                checkoutBtn.textContent = `Minimum order £${this.minimumOrder}`;
            }
        } else {
            if (minimumNotice) minimumNotice.style.display = 'none';
            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.textContent = 'Place Order';
            }
        }
    }
    
    // 处理订单
    async processOrder() {
        const form = document.getElementById('checkoutForm');
        const submitBtn = document.getElementById('checkoutBtn');
        
        if (!form || !submitBtn) return;
        
        // 验证表单
        if (!this.validateForm(form)) {
            return;
        }
        
        // 验证购物车
        const cartValidation = await cartService.validateCart();
        if (!cartValidation.isValid) {
            this.showError('Some items in your cart are no longer available');
            return;
        }
        
        try {
            // 禁用提交按钮
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
            
            // 收集表单数据
            const formData = this.collectFormData(form);
            
            // 创建订单
            const orderData = {
                customer: formData.customer,
                items: cartService.exportForCheckout().items,
                delivery: formData.delivery,
                totals: {
                    subtotal: cartService.getSubtotal(),
                    deliveryFee: this.deliveryFee,
                    total: cartService.getSubtotal() + this.deliveryFee
                },
                payment: formData.payment
            };
            
            // 提交订单
            const response = await apiService.post('/orders', orderData);
            
            if (response.success) {
                // 清空购物车
                cartService.clearCart();
                
                // 跳转到确认页面
                window.location.href = `order-confirmation.html?orderId=${response.orderId}`;
            } else {
                this.showError(response.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error processing order:', error);
            this.showError('An error occurred while processing your order');
        } finally {
            // 恢复提交按钮
            submitBtn.disabled = false;
            submitBtn.textContent = 'Place Order';
        }
    }
    
    // 验证表单
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        // 验证邮箱
        const emailField = form.querySelector('[name="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // 验证电话
        const phoneField = form.querySelector('[name="phone"]');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phoneField.value)) {
                this.showFieldError(phoneField, 'Please enter a valid phone number');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // 收集表单数据
    collectFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return {
            customer: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone
            },
            delivery: {
                type: data.deliveryType,
                address: data.deliveryType === 'delivery' ? {
                    postcode: data.postcode,
                    address: data.address,
                    city: data.city
                } : null,
                time: data.deliveryTime
            },
            payment: {
                method: data.paymentMethod,
                cardToken: data.cardToken
            }
        };
    }
    
    // 显示字段错误
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    // 清除字段错误
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // 显示错误消息
    showError(message) {
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.style.display = 'block';
            
            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }
    
    // 显示成功消息
    showSuccess(message) {
        const successContainer = document.getElementById('successContainer');
        if (successContainer) {
            successContainer.textContent = message;
            successContainer.style.display = 'block';
            
            setTimeout(() => {
                successContainer.style.display = 'none';
            }, 3000);
        }
    }
}

// 创建结账服务实例
const checkoutService = new CheckoutService();

// 导出服务
window.checkoutService = checkoutService;

// 兼容性导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CheckoutService,
        checkoutService
    };
}
