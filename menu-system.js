// Professional Menu System - Fully Compatible with Checkout
console.log('🍽️ Professional Menu System Loading...');

// Configuration
const CONFIG = {
    apiUrl: 'https://goldenfish-backend-production.up.railway.app/api',
    restaurantId: 1
};

// Restaurant Business Configuration
const RESTAURANT_CONFIG = {
    name: 'Golden Fish',
    openingHours: {
        monday: null, // Closed
        tuesday: { open: '17:00', close: '23:00' },
        wednesday: { open: '17:00', close: '23:00' },
        thursday: { open: '17:00', close: '23:00' },
        friday: { open: '17:00', close: '00:00' },
        saturday: { open: '17:00', close: '00:00' },
        sunday: { open: '17:00', close: '22:30' }
    },
    preparationTime: {
        delivery: 45, // minutes
        collection: 15  // minutes
    },
    delivery: {
        fee: 2.50,
        minimumOrder: 15.00,
        zones: [
            'YO10', 'YO23', 'YO24', 'YO30', 'YO31', 'YO32', 'YO1', 'YO8'
        ]
    }
};

// Global State
let menuData = {
    categories: [],
    products: [],
    options: []
};

let cartState = {
    items: [],
    delivery: {
        type: 'delivery', // 'delivery' or 'collection'
        postcode: '',
        fee: 0,
        validated: false,
        selectedTime: '', // Selected delivery/collection time
        availableTimes: [] // Available time slots
    },
    totals: {
        subtotal: 0,
        delivery: 0,
        total: 0
    }
};

class ProfessionalMenuSystem {
    constructor() {
        this.currentCategoryId = null;
        this.currentProduct = null;
        this.modalQuantity = 1;
        this.selectedOptions = [];
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Professional Menu System...');
        
        // Load data from localStorage first
        this.loadCartState();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load menu data from API
        await this.loadMenuData();
        
        // Render initial state
        this.renderCategories();
        this.renderProducts();
        this.renderCart();
        this.updateDeliveryUI();
        
        console.log('✅ Professional Menu System Ready');
    }

    // === DATA LOADING ===
    async loadMenuData() {
        try {
            this.showProductsLoading(true);
            
            console.log('📡 Fetching menu data...');
            const response = await fetch(`${CONFIG.apiUrl}/menu`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📋 Menu data received:', data);
            
            if (data.success && data.data) {
                menuData.categories = data.data.categories || [];
                menuData.products = data.data.products || [];
                menuData.options = data.data.options || [];
                
                console.log(`✅ Loaded ${menuData.categories.length} categories, ${menuData.products.length} products`);
                return true;
            } else {
                throw new Error('Invalid menu data format');
            }
            
        } catch (error) {
            console.error('❌ Error loading menu data:', error);
            this.showError('Failed to load menu. Please refresh the page.');
            return false;
        } finally {
            this.showProductsLoading(false);
        }
    }

    // === RENDERING ===
    renderCategories() {
        const categoryList = document.getElementById('categoryList');
        if (!categoryList) return;

        if (menuData.categories.length === 0) {
            categoryList.innerHTML = '<div class="category-loading">No categories available</div>';
            return;
        }

        const categoriesHTML = menuData.categories
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map(category => `
                <button class="category-item ${this.currentCategoryId === category.id ? 'active' : ''}" 
                        data-category-id="${category.id}">
                    ${category.name}
                </button>
            `).join('');

        categoryList.innerHTML = categoriesHTML;

        // Set first category as active by default
        if (!this.currentCategoryId && menuData.categories.length > 0) {
            this.selectCategory(menuData.categories[0].id);
        }
    }

    renderProducts() {
        const productsContainer = document.getElementById('productsContainer');
        const categoryNameEl = document.getElementById('currentCategoryName');
        
        if (!productsContainer) return;

        // Update category name
        if (this.currentCategoryId) {
            const category = menuData.categories.find(cat => cat.id === this.currentCategoryId);
            if (categoryNameEl && category) {
                categoryNameEl.textContent = category.name;
            }
        }

        // Filter products by category
        const categoryProducts = this.currentCategoryId 
            ? menuData.products.filter(product => product.category_id === this.currentCategoryId)
            : menuData.products;

        if (categoryProducts.length === 0) {
            productsContainer.innerHTML = '<div class="products-loading">No products available in this category</div>';
            return;
        }

        const productsHTML = categoryProducts.map(product => this.renderProductCard(product)).join('');
        productsContainer.innerHTML = productsHTML;
    }

    renderProductCard(product) {
        // Check if product has options
        const productOptions = menuData.options.filter(opt => opt.product_id === product.id);
        const hasOptions = productOptions.length > 0;
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    🍜
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
                    
                    <div class="product-footer">
                        <div class="product-price">£${parseFloat(product.price).toFixed(2)}</div>
                        ${hasOptions ? 
                            `<button class="customize-btn" data-product-id="${product.id}">Customize</button>` :
                            `<button class="add-btn" data-product-id="${product.id}">Add to Cart</button>`
                        }
                    </div>
                    ${hasOptions ? '<div class="product-options-hint">Customization available</div>' : ''}
                </div>
            </div>
        `;
    }

    renderCart() {
        const cartItemsEl = document.getElementById('cartItems');
        const cartCountEl = document.getElementById('cartCount');
        const cartSummaryEl = document.getElementById('cartSummary');
        const checkoutBtnEl = document.getElementById('checkoutBtn');

        if (!cartItemsEl) return;

        // Update cart count
        const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountEl) {
            cartCountEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
        }

        // Render cart items
        if (cartState.items.length === 0) {
            cartItemsEl.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-icon">🛒</div>
                    <p>Your cart is empty</p>
                    <span>Add items from the menu</span>
                </div>
            `;
            
            if (cartSummaryEl) cartSummaryEl.style.display = 'none';
            if (checkoutBtnEl) {
                checkoutBtnEl.disabled = true;
                checkoutBtnEl.innerHTML = '<span>Add items to continue</span>';
            }
            return;
        }

        // Render individual cart items
        const cartItemsHTML = cartState.items.map((item, index) => this.renderCartItem(item, index)).join('');
        cartItemsEl.innerHTML = cartItemsHTML;

        // Update totals
        this.calculateTotals();

        // Show cart summary
        if (cartSummaryEl) {
            cartSummaryEl.style.display = 'block';
            this.updateCartSummary();
        }

        // Update checkout button
        if (checkoutBtnEl) {
            checkoutBtnEl.disabled = false;
            checkoutBtnEl.innerHTML = `<span>Checkout - £${cartState.totals.total.toFixed(2)}</span>`;
        }

        // Save to localStorage
        this.saveCartState();
        
        // Update time selection UI
        this.updateTimeSelection();
    }

    renderCartItem(item, index) {
        return `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    ${item.options && item.options.length > 0 ? 
                        `<div class="cart-item-options">${item.options.map(opt => opt.name).join(', ')}</div>` : 
                        ''}
                    <div class="cart-item-price">£${item.price.toFixed(2)} each</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
                    <span class="cart-quantity">${item.quantity}</span>
                    <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
                    <button class="remove-btn" data-action="remove" data-index="${index}">×</button>
                </div>
            </div>
        `;
    }

    // === CART MANAGEMENT ===
    addToCart(productId, selectedOptions = [], quantity = 1, specialInstructions = '') {
        const product = menuData.products.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        // Calculate total price including options
        let totalPrice = parseFloat(product.price);
        selectedOptions.forEach(option => {
            if (option.additional_price) {
                totalPrice += parseFloat(option.additional_price);
            }
        });

        // Create cart item with EXACT format expected by checkout
        const cartItem = {
            product_id: productId,
            name: product.name,
            price: totalPrice,
            base_price: parseFloat(product.price),
            quantity: quantity,
            options: selectedOptions.map(opt => ({
                option_id: opt.option_id,
                choice_id: opt.choice_id,
                name: opt.name,
                additional_price: opt.additional_price || 0
            })),
            special_instructions: specialInstructions || '',
            // Format options text for display
            options_text: selectedOptions.length > 0 
                ? selectedOptions.map(opt => opt.name).join(', ') 
                : ''
        };

        // Check if identical item exists (same product, same options)
        const existingItemIndex = cartState.items.findIndex(item => 
            item.product_id === productId && 
            JSON.stringify(item.options) === JSON.stringify(cartItem.options) &&
            item.special_instructions === specialInstructions
        );

        if (existingItemIndex >= 0) {
            // Update existing item quantity
            cartState.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cartState.items.push(cartItem);
        }

        console.log('✅ Added to cart:', cartItem);
        this.renderCart();
        this.closeModal();
    }

    updateCartQuantity(index, change) {
        if (index < 0 || index >= cartState.items.length) return;
        
        cartState.items[index].quantity += change;
        
        if (cartState.items[index].quantity <= 0) {
            this.removeCartItem(index);
        } else {
            this.renderCart();
        }
    }

    removeCartItem(index) {
        if (index < 0 || index >= cartState.items.length) return;
        
        cartState.items.splice(index, 1);
        this.renderCart();
    }

    calculateTotals() {
        cartState.totals.subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartState.totals.delivery = cartState.delivery.type === 'delivery' ? cartState.delivery.fee : 0;
        cartState.totals.total = cartState.totals.subtotal + cartState.totals.delivery;
    }

    updateCartSummary() {
        document.getElementById('subtotalAmount').textContent = `£${cartState.totals.subtotal.toFixed(2)}`;
        document.getElementById('deliveryAmount').textContent = `£${cartState.totals.delivery.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `£${cartState.totals.total.toFixed(2)}`;
        
        // Show/hide delivery row
        const deliveryRow = document.getElementById('deliveryRow');
        if (deliveryRow) {
            deliveryRow.style.display = cartState.delivery.type === 'delivery' ? 'flex' : 'none';
        }
    }

    // === PRODUCT OPTIONS MODAL ===
    showProductModal(productId) {
        const product = menuData.products.find(p => p.id === productId);
        if (!product) return;

        const productOptions = menuData.options.filter(opt => opt.product_id === productId);
        
        // If no options, add directly to cart
        if (productOptions.length === 0) {
            this.addToCart(productId, [], 1);
            return;
        }

        // Set current product and reset modal state
        this.currentProduct = product;
        this.modalQuantity = 1;
        this.selectedOptions = [];

        // Update modal content
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalBasePrice').textContent = `£${parseFloat(product.price).toFixed(2)}`;
        document.getElementById('qtyValue').textContent = '1';

        // Render options
        const optionsContainer = document.getElementById('modalOptions');
        optionsContainer.innerHTML = productOptions.map(option => this.renderOptionGroup(option)).join('');

        // Show modal
        document.getElementById('optionsModal').style.display = 'flex';
        
        // Update modal total
        this.updateModalTotal();
    }

    renderOptionGroup(option) {
        if (!option.product_option_choices || option.product_option_choices.length === 0) {
            return '';
        }

        const choices = option.product_option_choices.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        const inputType = option.required ? 'radio' : 'checkbox';

        return `
            <div class="option-group" data-option-id="${option.id}">
                <div class="option-title">
                    <span>${option.name}</span>
                    <span class="${option.required ? 'required-badge' : 'optional-badge'}">
                        ${option.required ? 'Required' : 'Optional'}
                    </span>
                </div>
                <div class="option-choices">
                    ${choices.map((choice, index) => `
                        <div class="choice-item">
                            <input 
                                type="${inputType}" 
                                id="choice_${choice.id}"
                                name="option_${option.id}" 
                                value="${choice.id}"
                                data-option-id="${option.id}"
                                data-choice-name="${choice.name}"
                                data-additional-price="${choice.additional_price || 0}"
                                ${option.required && index === 0 ? 'checked' : ''}
                            >
                            <label for="choice_${choice.id}" class="choice-label">${choice.name}</label>
                            ${choice.additional_price && parseFloat(choice.additional_price) > 0 ? 
                                `<span class="choice-price">+£${parseFloat(choice.additional_price).toFixed(2)}</span>` : 
                                ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    updateModalTotal() {
        if (!this.currentProduct) return;

        let totalPrice = parseFloat(this.currentProduct.price);
        this.selectedOptions.forEach(option => {
            if (option.additional_price) {
                totalPrice += parseFloat(option.additional_price);
            }
        });

        const finalTotal = totalPrice * this.modalQuantity;
        document.getElementById('modalTotal').textContent = `£${finalTotal.toFixed(2)}`;
    }

    collectSelectedOptions() {
        this.selectedOptions = [];
        const checkedInputs = document.querySelectorAll('#modalOptions input:checked');
        
        checkedInputs.forEach(input => {
            this.selectedOptions.push({
                option_id: parseInt(input.dataset.optionId),
                choice_id: parseInt(input.value),
                name: input.dataset.choiceName,
                additional_price: parseFloat(input.dataset.additionalPrice || 0)
            });
        });

        this.updateModalTotal();
    }

    closeModal() {
        document.getElementById('optionsModal').style.display = 'none';
        this.currentProduct = null;
        this.modalQuantity = 1;
        this.selectedOptions = [];
    }

    // === DELIVERY & POSTCODE ===
    setDeliveryType(type) {
        cartState.delivery.type = type;
        
        // Update UI
        document.querySelectorAll('.delivery-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        this.updateDeliveryUI();
        this.updateTimeSelection();
        this.renderCart();
        this.saveCartState();
    }

    updateDeliveryUI() {
        const postcodeSection = document.getElementById('postcodeSection');
        if (postcodeSection) {
            postcodeSection.style.display = cartState.delivery.type === 'delivery' ? 'block' : 'none';
        }

        // Reset delivery fee for collection
        if (cartState.delivery.type === 'collection') {
            cartState.delivery.fee = 0;
            cartState.delivery.validated = true;
            
            // 重新计算总价（不包含送餐费）
            this.calculateTotals();
            this.updateCartSummary();
        }
    }

    async validatePostcode() {
        const postcodeInput = document.getElementById('postcodeInput');
        const postcodeResult = document.getElementById('postcodeResult');
        const checkBtn = document.getElementById('postcodeCheck');
        
        if (!postcodeInput || !postcodeInput.value.trim()) return;

        const postcode = postcodeInput.value.trim();
        
        try {
            checkBtn.textContent = 'Checking...';
            checkBtn.disabled = true;
            
            // Normalize postcode
            const normalizedPostcode = this.normalizePostcode(postcode);
            
            // Validate with postcodes.io API
            const response = await fetch(`https://api.postcodes.io/postcodes/${normalizedPostcode}`);
            const isValid = response.ok;
            
            if (isValid) {
                // Check if postcode is in delivery area
                const isInDeliveryArea = this.isPostcodeInDeliveryArea(normalizedPostcode);
                
                if (isInDeliveryArea) {
                    cartState.delivery.postcode = normalizedPostcode;
                    cartState.delivery.fee = 2.50; // Default delivery fee
                    cartState.delivery.validated = true;
                    
                    postcodeInput.value = normalizedPostcode;
                    postcodeResult.innerHTML = `<span class="success">✓ Delivery available - £${cartState.delivery.fee.toFixed(2)}</span>`;
                    postcodeResult.className = 'postcode-result success';
                    
                    // 重新计算总价包含送餐费
                    this.calculateTotals();
                    this.updateCartSummary();
                    
                    console.log('✅ Postcode validated:', normalizedPostcode);
                } else {
                    throw new Error('Outside delivery area');
                }
            } else {
                throw new Error('Invalid postcode format');
            }
            
        } catch (error) {
            console.error('❌ Postcode validation failed:', error);
            
            let errorMessage = '';
            if (error.message === 'Outside delivery area') {
                errorMessage = '✗ Sorry, we don\'t deliver to this postcode. Please try collection instead.';
            } else if (error.message === 'Invalid postcode format') {
                errorMessage = '✗ Please enter a valid UK postcode (e.g. YO10 3BP)';
            } else {
                errorMessage = '✗ Unable to validate postcode. Please try again.';
            }
            postcodeResult.innerHTML = `<span class="error">${errorMessage}</span>`;
            postcodeResult.className = 'postcode-result error';
            
            cartState.delivery.postcode = '';
            cartState.delivery.fee = 0;
            cartState.delivery.validated = false;
            
            this.renderCart();
        } finally {
            checkBtn.textContent = 'Check';
            checkBtn.disabled = false;
        }
    }

    normalizePostcode(postcode) {
        const cleaned = postcode.trim().toUpperCase().replace(/\s/g, '');
        return cleaned.slice(0, -3) + ' ' + cleaned.slice(-3);
    }

    // === NAVIGATION ===
    selectCategory(categoryId) {
        this.currentCategoryId = categoryId;
        
        // Update active button
        document.querySelectorAll('.category-item').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-category-id="${categoryId}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        // Re-render products
        this.renderProducts();
    }

    proceedToCheckout() {
        if (cartState.items.length === 0) {
            alert('Your cart is empty. Please add items before checkout.');
            return;
        }

        // Enhanced delivery validation
        if (cartState.delivery.type === 'delivery') {
            const postcodeInput = document.getElementById('postcodeInput');
            const currentPostcode = postcodeInput ? postcodeInput.value.trim() : '';
            
            if (!currentPostcode) {
                alert('Please enter your postcode for delivery.');
                if (postcodeInput) postcodeInput.focus();
                return;
            }
            
            if (!cartState.delivery.validated) {
                alert('Please click "Check" to validate your postcode for delivery.');
                return;
            }
            
            if (!cartState.delivery.postcode || cartState.delivery.fee <= 0) {
                alert('Postcode validation incomplete. Please check your delivery area.');
                return;
            }
        }

        // Check if time is selected (required for both delivery and collection)
        if (!cartState.delivery.selectedTime) {
            const timeType = cartState.delivery.type === 'delivery' ? 'delivery' : 'collection';
            alert(`Please select a ${timeType} time before proceeding to checkout.`);
            
            // Highlight time selection
            const timeSelect = document.getElementById('deliveryTimeSelect');
            const timeInfo = document.getElementById('timeInfo');
            if (timeSelect) timeSelect.focus();
            if (timeInfo) {
                timeInfo.className = 'time-info required';
                timeInfo.innerHTML = `<small>⚠️ ${timeType} time selection is required</small>`;
                setTimeout(() => {
                    timeInfo.className = 'time-info';
                    const prepTime = RESTAURANT_CONFIG.preparationTime[cartState.delivery.type];
                    const typeText = cartState.delivery.type === 'delivery' ? 'Delivery' : 'Collection';
                    timeInfo.innerHTML = `<small>${typeText} usually takes ${prepTime} minutes</small>`;
                }, 3000);
            }
            return;
        }

        // Prepare checkout data in EXACT format expected by checkout page
        const checkoutData = {
            items: cartState.items.map(item => ({
                product_id: item.product_id,
                name: item.name,
                price: item.price,
                base_price: item.base_price,
                quantity: item.quantity,
                options: item.options,
                special_instructions: item.special_instructions,
                options_text: item.options_text,
                // Calculate line total
                line_total: item.price * item.quantity
            })),
            delivery: {
                type: cartState.delivery.type,
                postcode: cartState.delivery.postcode,
                fee: cartState.delivery.fee,
                validated: cartState.delivery.validated,
                selectedTime: cartState.delivery.selectedTime,
                availableTimes: cartState.delivery.availableTimes
            },
            totals: {
                subtotal: cartState.totals.subtotal,
                delivery: cartState.totals.delivery,
                total: cartState.totals.total
            },
            promotions: this.getActivePromotions(),
            timestamp: new Date().toISOString()
        };

        // 确保总价计算最新
        this.calculateTotals();
        
        // 更新保存的数据以包含最新的总价
        checkoutData.totals = {
            subtotal: cartState.totals.subtotal,
            delivery: cartState.totals.delivery,
            total: cartState.totals.total
        };

        console.log('🛒 Proceeding to checkout with data:', checkoutData);

        // Save to localStorage for checkout page
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        localStorage.setItem('cartItems', JSON.stringify(cartState.items)); // Backward compatibility
        localStorage.setItem('deliveryType', cartState.delivery.type);
        localStorage.setItem('postcode', cartState.delivery.postcode);
        localStorage.setItem('deliveryFee', cartState.delivery.fee.toString());

        // Navigate to checkout
        window.location.href = 'checkout.html';
    }

    getActivePromotions() {
        const promotions = [];
        const subtotal = cartState.totals.subtotal;
        
        // Add promotions based on order value
        if (subtotal >= 25.00) {
            promotions.push({
                id: 'free_crackers_25',
                type: 'free_item',
                name: 'Free Prawn Crackers',
                description: 'Free prawn crackers with orders over £25',
                discount: 1.50
            });
        }
        
        if (subtotal >= 30.00) {
            promotions.push({
                id: 'discount_5_off_30',
                type: 'amount_off',
                name: '£5 off your order',
                description: '£5 discount on orders over £30',
                discount: 5.00
            });
        }
        
        return promotions;
    }

    // === DATA PERSISTENCE ===
    loadCartState() {
        try {
            // Try to load from new format first
            const savedCheckoutData = localStorage.getItem('checkoutData');
            if (savedCheckoutData) {
                const checkoutData = JSON.parse(savedCheckoutData);
                cartState.items = checkoutData.items || [];
                if (checkoutData.delivery) {
                    cartState.delivery = { ...cartState.delivery, ...checkoutData.delivery };
                }
                console.log('📥 Loaded cart from checkoutData');
                return;
            }

            // Fallback to old format
            const savedCart = localStorage.getItem('cartItems');
            const savedDeliveryType = localStorage.getItem('deliveryType');
            const savedPostcode = localStorage.getItem('postcode');
            const savedDeliveryFee = localStorage.getItem('deliveryFee');

            if (savedCart) {
                cartState.items = JSON.parse(savedCart);
            }
            if (savedDeliveryType) {
                cartState.delivery.type = savedDeliveryType;
            }
            if (savedPostcode) {
                cartState.delivery.postcode = savedPostcode;
                cartState.delivery.validated = true;
                document.getElementById('postcodeInput').value = savedPostcode;
            }
            if (savedDeliveryFee) {
                cartState.delivery.fee = parseFloat(savedDeliveryFee);
            }

            console.log('📥 Loaded cart from legacy format');
        } catch (error) {
            console.error('❌ Error loading cart state:', error);
            // Reset to default state
            cartState = {
                items: [],
                delivery: { type: 'delivery', postcode: '', fee: 0, validated: false },
                totals: { subtotal: 0, delivery: 0, total: 0 }
            };
        }
    }

    saveCartState() {
        try {
            // Prepare complete checkout data for consistency
            const checkoutData = {
                items: cartState.items,
                delivery: {
                    type: cartState.delivery.type,
                    postcode: cartState.delivery.postcode,
                    fee: cartState.delivery.fee,
                    validated: cartState.delivery.validated,
                    selectedTime: cartState.delivery.selectedTime,
                    availableTimes: cartState.delivery.availableTimes
                },
                totals: {
                    subtotal: cartState.totals.subtotal,
                    delivery: cartState.totals.delivery,
                    total: cartState.totals.total
                }
            };

            // Save in ALL formats for full compatibility
            localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
            localStorage.setItem('goldenfish_cart', JSON.stringify(cartState.items));
            localStorage.setItem('cartItems', JSON.stringify(cartState.items)); // Legacy
            localStorage.setItem('deliveryType', cartState.delivery.type);
            localStorage.setItem('postcode', cartState.delivery.postcode);
            localStorage.setItem('deliveryFee', cartState.delivery.fee.toString());
            
            console.log('💾 Cart state saved:', checkoutData);
        } catch (error) {
            console.error('❌ Error saving cart state:', error);
        }
    }

    // === EVENT HANDLERS ===
    setupEventListeners() {
        // Category selection
        document.addEventListener('click', (e) => {
            if (e.target.matches('.category-item')) {
                const categoryId = parseInt(e.target.dataset.categoryId);
                this.selectCategory(categoryId);
            }
        });

        // Product actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-btn')) {
                const productId = parseInt(e.target.dataset.productId);
                this.addToCart(productId, [], 1);
            }
            
            if (e.target.matches('.customize-btn')) {
                const productId = parseInt(e.target.dataset.productId);
                this.showProductModal(productId);
            }
        });

        // Cart controls
        document.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            
            if (e.target.matches('[data-action="increase"]')) {
                this.updateCartQuantity(index, 1);
            }
            
            if (e.target.matches('[data-action="decrease"]')) {
                this.updateCartQuantity(index, -1);
            }
            
            if (e.target.matches('[data-action="remove"]')) {
                this.removeCartItem(index);
            }
        });

        // Delivery type buttons - Fix event handling for reliable clicking
        document.addEventListener('click', (e) => {
            // Handle clicks on button or its children (span, i elements)
            const deliveryBtn = e.target.closest('.delivery-btn');
            if (deliveryBtn && deliveryBtn.dataset.type) {
                e.preventDefault();
                const type = deliveryBtn.dataset.type;
                console.log('🔄 Delivery type clicked:', type);
                this.setDeliveryType(type);
            }
        });

        // Postcode validation
        const postcodeCheck = document.getElementById('postcodeCheck');
        const postcodeInput = document.getElementById('postcodeInput');
        
        if (postcodeCheck) {
            postcodeCheck.addEventListener('click', () => this.validatePostcode());
        }
        
        if (postcodeInput) {
            postcodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.validatePostcode();
                }
            });
        }

        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.matches('#modalClose') || e.target.matches('.modal-overlay')) {
                this.closeModal();
            }
        });

        // Modal quantity controls
        document.getElementById('qtyMinus').addEventListener('click', () => {
            if (this.modalQuantity > 1) {
                this.modalQuantity--;
                document.getElementById('qtyValue').textContent = this.modalQuantity;
                this.updateModalTotal();
            }
        });

        document.getElementById('qtyPlus').addEventListener('click', () => {
            this.modalQuantity++;
            document.getElementById('qtyValue').textContent = this.modalQuantity;
            this.updateModalTotal();
        });

        // Option selection
        document.addEventListener('change', (e) => {
            if (e.target.matches('#modalOptions input[type="radio"], #modalOptions input[type="checkbox"]')) {
                this.collectSelectedOptions();
            }
        });

        // Add to cart from modal
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            if (!this.currentProduct) return;
            
            const specialInstructions = document.getElementById('specialInstructions').value;
            this.addToCart(this.currentProduct.id, this.selectedOptions, this.modalQuantity, specialInstructions);
        });

        // Checkout button
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.proceedToCheckout();
        });

        // Time selection
        document.addEventListener('change', (e) => {
            if (e.target.id === 'deliveryTimeSelect') {
                cartState.delivery.selectedTime = e.target.value;
                this.saveCartState();
                this.updateCheckoutButton();
                console.log('🕐 Time selected:', e.target.value);
            }
        });
    }

    // === TIME MANAGEMENT METHODS ===
    
    generateAvailableTimes(deliveryType) {
        const now = new Date();
        const times = ['asap'];
        
        // Get preparation time based on delivery type
        const prepTime = RESTAURANT_CONFIG.preparationTime[deliveryType];
        
        // Calculate earliest available time (current time + prep time)
        const earliestTime = new Date(now.getTime() + prepTime * 60000);
        
        // Check if restaurant is currently open
        if (!this.isRestaurantOpen(now)) {
            const nextOpenTime = this.getNextOpenTime(now);
            if (nextOpenTime) {
                earliestTime.setTime(Math.max(earliestTime.getTime(), nextOpenTime.getTime() + prepTime * 60000));
            } else {
                // Restaurant is closed for extended period
                return ['Restaurant currently closed'];
            }
        }
        
        // Generate time slots every 15 minutes
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 0, 0, 0); // Until 11 PM
        
        let currentSlot = new Date(earliestTime);
        currentSlot.setMinutes(Math.ceil(currentSlot.getMinutes() / 15) * 15); // Round up to next 15-minute slot
        
        while (currentSlot <= endOfDay) {
            times.push(this.formatTime(currentSlot));
            currentSlot = new Date(currentSlot.getTime() + 15 * 60000); // Add 15 minutes
        }
        
        return times;
    }
    
    isRestaurantOpen(dateTime = new Date()) {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[dateTime.getDay()];
        const todayHours = RESTAURANT_CONFIG.openingHours[dayName];
        
        if (!todayHours) return false; // Restaurant closed
        
        const currentTime = dateTime.getHours() * 60 + dateTime.getMinutes();
        const [openHour, openMin] = todayHours.open.split(':').map(Number);
        const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
        
        const openTime = openHour * 60 + openMin;
        let closeTime = closeHour * 60 + closeMin;
        
        // Handle next day close (midnight)
        if (closeTime <= openTime) closeTime += 24 * 60;
        
        return currentTime >= openTime && currentTime < closeTime;
    }
    
    getNextOpenTime(dateTime = new Date()) {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        let checkDate = new Date(dateTime);
        
        // Check next 7 days
        for (let i = 0; i < 7; i++) {
            const dayName = dayNames[checkDate.getDay()];
            const dayHours = RESTAURANT_CONFIG.openingHours[dayName];
            
            if (dayHours) {
                const [openHour, openMin] = dayHours.open.split(':').map(Number);
                const openTime = new Date(checkDate);
                openTime.setHours(openHour, openMin, 0, 0);
                
                if (openTime > dateTime) {
                    return openTime;
                }
            }
            
            checkDate.setDate(checkDate.getDate() + 1);
        }
        
        return null; // No opening time found in next 7 days
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }
    
    updateTimeSelection() {
        const timeSection = document.getElementById('timeSelectionSection');
        const timeSelect = document.getElementById('deliveryTimeSelect');
        const timeLabel = document.getElementById('timeSelectionLabel');
        const timeInfo = document.getElementById('timeInfo');
        
        if (!timeSection || !timeSelect) return;
        
        // Show/hide time selection based on delivery type and validation
        const showTimeSelection = cartState.items.length > 0 && 
                                 ((cartState.delivery.type === 'delivery' && cartState.delivery.validated) ||
                                  cartState.delivery.type === 'collection');
        
        timeSection.style.display = showTimeSelection ? 'block' : 'none';
        
        if (showTimeSelection) {
            // Update label based on delivery type
            const isDelivery = cartState.delivery.type === 'delivery';
            timeLabel.textContent = isDelivery ? 'Delivery Time:' : 'Collection Time:';
            
            // Generate available times
            const times = this.generateAvailableTimes(cartState.delivery.type);
            cartState.delivery.availableTimes = times;
            
            // Populate select options
            timeSelect.innerHTML = '<option value="">Select a time...</option>';
            times.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time === 'asap' ? 'ASAP' : time;
                timeSelect.appendChild(option);
            });
            
            // Update info text
            const prepTime = RESTAURANT_CONFIG.preparationTime[cartState.delivery.type];
            timeInfo.innerHTML = `<small>${isDelivery ? 'Delivery' : 'Collection'} usually takes ${prepTime} minutes</small>`;
        }
    }

    isPostcodeInDeliveryArea(postcode) {
        // Extract area code from postcode (e.g. 'YO10' from 'YO10 3BP')
        const areaCode = postcode.replace(/\s+/g, '').substring(0, postcode.indexOf(' ') > 0 ? postcode.indexOf(' ') : 4);
        
        // Check if area code is in our delivery zones
        const inDeliveryZone = RESTAURANT_CONFIG.delivery.zones.some(zone => 
            areaCode.toUpperCase().startsWith(zone.toUpperCase())
        );
        
        console.log(`🚚 Checking delivery area: ${postcode} (${areaCode}) - ${inDeliveryZone ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
        return inDeliveryZone;
    }

    // === UTILITY METHODS ===
    showProductsLoading(show) {
        const container = document.getElementById('productsContainer');
        if (!container) return;

        if (show) {
            container.innerHTML = `
                <div class="products-loading">
                    <div class="loading-spinner"></div>
                    <p>Loading menu items...</p>
                </div>
            `;
        }
    }

    showError(message) {
        const container = document.getElementById('productsContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="products-loading">
                <p>❌ ${message}</p>
            </div>
        `;
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.menuSystem = new ProfessionalMenuSystem();
    });
} else {
    window.menuSystem = new ProfessionalMenuSystem();
}

console.log('✅ Professional Menu System Loaded');