// Golden Fish Menu System - Updated for new API structure
console.log('🍽️ Golden Fish Menu System Loading...');

// Configuration
const CONFIG = {
  apiUrl: 'https://goldenfish-backend-production.up.railway.app/api',
  restaurantId: 1 // Default restaurant ID
};

// Global state
let menuData = {
  categories: [],
  products: [],
  options: []
};

let cartItems = [];
let deliveryType = 'delivery';
let postcode = '';
let deliveryFee = 0;

class MenuManager {
  constructor() {
    this.currentCategoryId = null;
    this.isLoading = false;
    this.init();
  }

  async init() {
    console.log('🚀 Initializing Menu Manager...');
    
    // Load cart from localStorage
    this.loadCart();
    
    // Load menu data from API
    await this.loadMenuData();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Render initial UI
    this.render();
    
    console.log('✅ Menu Manager initialized');
  }

  async loadMenuData() {
    try {
      this.isLoading = true;
      this.showLoading();
      
      console.log('📡 Fetching menu data from API...');
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
        
        console.log(`✅ Loaded ${menuData.categories.length} categories, ${menuData.products.length} products, ${menuData.options.length} options`);
      } else {
        throw new Error('Invalid menu data format');
      }
      
    } catch (error) {
      console.error('❌ Error loading menu data:', error);
      this.showError('Failed to load menu. Please refresh the page.');
    } finally {
      this.isLoading = false;
      this.hideLoading();
    }
  }

  render() {
    this.renderCategories();
    this.renderProducts();
    this.renderCart();
  }

  renderCategories() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;

    if (menuData.categories.length === 0) {
      categoryList.innerHTML = '<li><p>No categories available</p></li>';
      return;
    }

    categoryList.innerHTML = menuData.categories
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map(category => `
        <li>
          <button class="category-btn ${this.currentCategoryId === category.id ? 'active' : ''}" 
                  data-category-id="${category.id}">
            ${category.name}
          </button>
        </li>
      `).join('');

    // Set first category as active by default
    if (!this.currentCategoryId && menuData.categories.length > 0) {
      this.currentCategoryId = menuData.categories[0].id;
      this.renderProducts();
    }
  }

  renderProducts() {
    const menuContent = document.getElementById('menuContent');
    if (!menuContent) return;

    if (!this.currentCategoryId) {
      menuContent.innerHTML = '<p>Please select a category</p>';
      return;
    }

    // Filter products by current category
    const categoryProducts = menuData.products.filter(
      product => product.category_id === this.currentCategoryId
    );

    if (categoryProducts.length === 0) {
      menuContent.innerHTML = '<p>No products available in this category</p>';
      return;
    }

    // Find current category name
    const currentCategory = menuData.categories.find(cat => cat.id === this.currentCategoryId);
    const categoryName = currentCategory ? currentCategory.name : 'Menu Items';

    menuContent.innerHTML = `
      <div class="category-section">
        <h2>${categoryName}</h2>
        <div class="products-grid">
          ${categoryProducts.map(product => this.renderProductCard(product)).join('')}
        </div>
      </div>
    `;
  }

  renderProductCard(product) {
    // Get options for this product
    const productOptions = menuData.options.filter(opt => opt.product_id === product.id);
    const hasOptions = productOptions.length > 0;

    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">£${parseFloat(product.price).toFixed(2)}</p>
          ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
          ${hasOptions ? '<span class="has-options">🔧 Customizable</span>' : ''}
        </div>
        <div class="product-actions">
          ${hasOptions ? 
            `<button class="customize-btn" data-product-id="${product.id}">Customize</button>` :
            `<button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>`
          }
        </div>
      </div>
    `;
  }

  renderCart() {
    const cartContent = document.getElementById('cartContent');
    const cartSummary = document.getElementById('cartSummary');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cartContent) return;

    if (cartItems.length === 0) {
      cartContent.innerHTML = `
        <div class="empty-cart-message">
          <div class="empty-icon">🍽️</div>
          <h4>Start your order</h4>
          <p>Add items from the menu</p>
        </div>
      `;
      
      if (cartSummary) cartSummary.style.display = 'none';
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<span>Add items to checkout</span>';
      }
      return;
    }

    // Render cart items
    cartContent.innerHTML = cartItems.map((item, index) => `
      <div class="cart-item" data-cart-index="${index}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          ${item.options && item.options.length > 0 ? 
            `<p class="cart-item-options">${item.options.map(opt => opt.name).join(', ')}</p>` : ''
          }
          <p class="cart-item-price">£${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn decrease" data-cart-index="${index}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn increase" data-cart-index="${index}">+</button>
          <button class="remove-btn" data-cart-index="${index}">×</button>
        </div>
      </div>
    `).join('');

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee;

    // Show cart summary
    if (cartSummary) cartSummary.style.display = 'block';
    if (cartTotal) {
      cartTotal.innerHTML = `
        <div class="total-row">
          <span>Subtotal:</span>
          <span>£${subtotal.toFixed(2)}</span>
        </div>
        ${deliveryFee > 0 ? `
          <div class="total-row">
            <span>Delivery:</span>
            <span>£${deliveryFee.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="total-row total-final">
          <span>Total:</span>
          <span>£${total.toFixed(2)}</span>
        </div>
      `;
    }

    // Update checkout button
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = `<span>Checkout (£${total.toFixed(2)})</span>`;
    }

    // Save cart to localStorage
    this.saveCart();
  }

  setupEventListeners() {
    // Category selection
    document.addEventListener('click', (e) => {
      if (e.target.matches('.category-btn')) {
        const categoryId = parseInt(e.target.dataset.categoryId);
        this.selectCategory(categoryId);
      }
    });

    // Product actions
    document.addEventListener('click', (e) => {
      if (e.target.matches('.add-to-cart-btn')) {
        const productId = parseInt(e.target.dataset.productId);
        this.addToCart(productId);
      }
      
      if (e.target.matches('.customize-btn')) {
        const productId = parseInt(e.target.dataset.productId);
        this.showCustomizeModal(productId);
      }
    });

    // Cart controls
    document.addEventListener('click', (e) => {
      const cartIndex = parseInt(e.target.dataset.cartIndex);
      
      if (e.target.matches('.quantity-btn.increase')) {
        this.updateCartQuantity(cartIndex, 1);
      }
      
      if (e.target.matches('.quantity-btn.decrease')) {
        this.updateCartQuantity(cartIndex, -1);
      }
      
      if (e.target.matches('.remove-btn')) {
        this.removeFromCart(cartIndex);
      }
    });

    // Delivery type toggle
    document.addEventListener('click', (e) => {
      if (e.target.matches('.delivery-option')) {
        const type = e.target.dataset.type;
        this.setDeliveryType(type);
      }
    });

    // Postcode validation
    const postcodeInput = document.getElementById('postcodeInput');
    const postcodeBtn = document.getElementById('postcodeCheckBtn');
    
    if (postcodeInput && postcodeBtn) {
      postcodeBtn.addEventListener('click', () => {
        this.validatePostcode(postcodeInput.value);
      });
      
      postcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.validatePostcode(postcodeInput.value);
        }
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.proceedToCheckout();
      });
    }
  }

  selectCategory(categoryId) {
    this.currentCategoryId = categoryId;
    
    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-category-id="${categoryId}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Re-render products
    this.renderProducts();
  }

  addToCart(productId, selectedOptions = []) {
    const product = menuData.products.find(p => p.id === productId);
    if (!product) return;

    // Calculate price with options
    let totalPrice = parseFloat(product.price);
    selectedOptions.forEach(option => {
      if (option.additional_price) {
        totalPrice += parseFloat(option.additional_price);
      }
    });

    // Check if identical item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => 
      item.product_id === productId && 
      JSON.stringify(item.options) === JSON.stringify(selectedOptions)
    );

    if (existingItemIndex >= 0) {
      // Increase quantity of existing item
      cartItems[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      cartItems.push({
        product_id: productId,
        name: product.name,
        price: totalPrice,
        quantity: 1,
        options: selectedOptions
      });
    }

    this.renderCart();
    console.log('✅ Added to cart:', product.name);
  }

  updateCartQuantity(cartIndex, change) {
    if (cartIndex < 0 || cartIndex >= cartItems.length) return;
    
    cartItems[cartIndex].quantity += change;
    
    if (cartItems[cartIndex].quantity <= 0) {
      this.removeFromCart(cartIndex);
    } else {
      this.renderCart();
    }
  }

  removeFromCart(cartIndex) {
    if (cartIndex < 0 || cartIndex >= cartItems.length) return;
    
    cartItems.splice(cartIndex, 1);
    this.renderCart();
  }

  setDeliveryType(type) {
    deliveryType = type;
    
    // Update UI
    document.querySelectorAll('.delivery-option').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-type="${type}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Show/hide delivery section
    const deliverySection = document.getElementById('deliverySection');
    if (deliverySection) {
      deliverySection.style.display = type === 'delivery' ? 'block' : 'none';
    }
    
    // Reset delivery fee for collection
    if (type === 'collection') {
      deliveryFee = 0;
      this.renderCart();
    }
  }

  async validatePostcode(postcodeValue) {
    if (!postcodeValue) return;
    
    const postcodeBtn = document.getElementById('postcodeCheckBtn');
    const deliveryFeeDiv = document.getElementById('deliveryFee');
    
    try {
      if (postcodeBtn) {
        postcodeBtn.textContent = '...';
        postcodeBtn.disabled = true;
      }
      
      // Normalize postcode format
      const normalizedPostcode = this.normalizePostcode(postcodeValue);
      
      // Validate with postcodes.io API
      const response = await fetch(`https://api.postcodes.io/postcodes/${normalizedPostcode}`);
      const isValid = response.ok;
      
      if (isValid) {
        postcode = normalizedPostcode;
        document.getElementById('postcodeInput').value = normalizedPostcode;
        
        // Set delivery fee (simplified - in reality this would be from API)
        deliveryFee = 2.50; // Default delivery fee
        
        if (deliveryFeeDiv) {
          deliveryFeeDiv.innerHTML = `<span class="delivery-fee-amount">Delivery: £${deliveryFee.toFixed(2)}</span>`;
          deliveryFeeDiv.className = 'delivery-fee success';
        }
        
        this.renderCart();
        console.log('✅ Postcode validated:', normalizedPostcode);
      } else {
        throw new Error('Invalid postcode');
      }
      
    } catch (error) {
      console.error('❌ Postcode validation failed:', error);
      
      if (deliveryFeeDiv) {
        deliveryFeeDiv.innerHTML = '<span class="error">Invalid postcode</span>';
        deliveryFeeDiv.className = 'delivery-fee error';
      }
      
      deliveryFee = 0;
      this.renderCart();
    } finally {
      if (postcodeBtn) {
        postcodeBtn.textContent = '✓';
        postcodeBtn.disabled = false;
      }
    }
  }

  normalizePostcode(postcode) {
    // Remove spaces and convert to uppercase
    const cleaned = postcode.trim().toUpperCase().replace(/\s/g, '');
    // Add space before last 3 characters
    return cleaned.slice(0, -3) + ' ' + cleaned.slice(-3);
  }

  showCustomizeModal(productId) {
    const product = menuData.products.find(p => p.id === productId);
    const productOptions = menuData.options.filter(opt => opt.product_id === productId);
    
    if (!product || productOptions.length === 0) {
      // No options, add directly to cart
      this.addToCart(productId, []);
      return;
    }

    // Create advanced modal HTML with proper options support
    const modal = document.createElement('div');
    modal.className = 'customize-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Customize ${product.name}</h3>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="product-base-info">
            <p class="base-price">Base price: £${parseFloat(product.price).toFixed(2)}</p>
            <p class="product-desc">${product.description || ''}</p>
          </div>
          
          <div class="product-options">
            ${productOptions.map(option => this.renderProductOption(option)).join('')}
          </div>
          
          <div class="quantity-section">
            <label>Quantity:</label>
            <div class="quantity-controls">
              <button class="qty-btn decrease" disabled>-</button>
              <span class="qty-display">1</span>
              <button class="qty-btn increase">+</button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <div class="modal-total">
            Total: <span class="modal-total-price">£${parseFloat(product.price).toFixed(2)}</span>
          </div>
          <div class="modal-actions">
            <button class="modal-cancel">Cancel</button>
            <button class="modal-add-to-cart" data-product-id="${productId}">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup modal state
    let modalQuantity = 1;
    let selectedOptions = [];
    
    // Update total price based on selections
    const updateModalTotal = () => {
      let totalPrice = parseFloat(product.price);
      selectedOptions.forEach(opt => {
        if (opt.additional_price) {
          totalPrice += parseFloat(opt.additional_price);
        }
      });
      const finalTotal = totalPrice * modalQuantity;
      modal.querySelector('.modal-total-price').textContent = `£${finalTotal.toFixed(2)}`;
    };
    
    // Quantity controls
    const qtyDecrease = modal.querySelector('.qty-btn.decrease');
    const qtyIncrease = modal.querySelector('.qty-btn.increase');
    const qtyDisplay = modal.querySelector('.qty-display');
    
    qtyDecrease.addEventListener('click', () => {
      if (modalQuantity > 1) {
        modalQuantity--;
        qtyDisplay.textContent = modalQuantity;
        qtyDecrease.disabled = modalQuantity === 1;
        updateModalTotal();
      }
    });
    
    qtyIncrease.addEventListener('click', () => {
      modalQuantity++;
      qtyDisplay.textContent = modalQuantity;
      qtyDecrease.disabled = false;
      updateModalTotal();
    });
    
    // Option selection handlers
    modal.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', () => {
        selectedOptions = this.collectSelectedOptions(modal);
        updateModalTotal();
      });
    });
    
    // Modal close handlers
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('.modal-cancel').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('.modal-add-to-cart').addEventListener('click', () => {
      // Add multiple items if quantity > 1
      for (let i = 0; i < modalQuantity; i++) {
        this.addToCart(productId, [...selectedOptions]);
      }
      document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  renderProductOption(option) {
    if (!option.product_option_choices || option.product_option_choices.length === 0) {
      return '';
    }

    const choices = option.product_option_choices
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    
    const inputType = option.required ? 'radio' : 'checkbox';
    const isMultiSelect = !option.required && choices.length > 2;
    
    return `
      <div class="option-group" data-option-id="${option.id}">
        <div class="option-header">
          <h4>${option.name}</h4>
          ${option.required ? '<span class="required">*Required</span>' : '<span class="optional">Optional</span>'}
        </div>
        <div class="option-choices">
          ${choices.map((choice, index) => `
            <div class="choice-item">
              <label class="choice-label">
                <input 
                  type="${inputType}" 
                  name="option_${option.id}" 
                  value="${choice.id}"
                  data-choice-name="${choice.name}"
                  data-additional-price="${choice.additional_price || 0}"
                  ${option.required && index === 0 ? 'checked' : ''}
                >
                <span class="choice-text">${choice.name}</span>
                ${choice.additional_price && parseFloat(choice.additional_price) > 0 ? 
                  `<span class="choice-price">+£${parseFloat(choice.additional_price).toFixed(2)}</span>` : 
                  ''}
              </label>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  collectSelectedOptions(modal) {
    const selectedOptions = [];
    const checkedInputs = modal.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
    
    checkedInputs.forEach(input => {
      selectedOptions.push({
        option_id: parseInt(input.name.replace('option_', '')),
        choice_id: parseInt(input.value),
        name: input.dataset.choiceName,
        additional_price: parseFloat(input.dataset.additionalPrice || 0)
      });
    });
    
    return selectedOptions;
  }

  proceedToCheckout() {
    if (cartItems.length === 0) return;
    
    // Prepare comprehensive checkout data
    const checkoutData = {
      items: cartItems.map(item => ({
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        options: item.options || [],
        // Format options summary for display
        optionsText: item.options && item.options.length > 0 
          ? item.options.map(opt => opt.name).join(', ') 
          : ''
      })),
      delivery: {
        type: deliveryType,
        postcode: postcode,
        fee: deliveryFee
      },
      totals: {
        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: deliveryFee,
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + deliveryFee
      },
      // Add any active promotions/discounts
      promotions: this.getActivePromotions()
    };
    
    // Save comprehensive data to localStorage
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    // Save individual pieces for backward compatibility
    this.saveCart();
    localStorage.setItem('deliveryType', deliveryType);
    localStorage.setItem('postcode', postcode);
    localStorage.setItem('deliveryFee', deliveryFee.toString());
    
    console.log('🛒 Proceeding to checkout with data:', checkoutData);
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
  }

  getActivePromotions() {
    // Simple promotion logic - extend as needed
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const promotions = [];
    
    // Example promotions (can be made configurable)
    if (subtotal >= 25.00) {
      promotions.push({
        id: 'free_crackers_25',
        type: 'free_item',
        name: 'Free Prawn Crackers (£1.50 value)',
        discount: 1.50,
        description: 'Free with orders over £25'
      });
    }
    
    if (subtotal >= 20.00) {
      promotions.push({
        id: 'discount_5_off_20',
        type: 'amount_off',
        name: '£5 off your order',
        discount: 5.00,
        description: '£5 off orders over £20'
      });
    }
    
    return promotions;
  }

  loadCart() {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        cartItems = JSON.parse(savedCart);
      }
      
      const savedDeliveryType = localStorage.getItem('deliveryType');
      if (savedDeliveryType) {
        deliveryType = savedDeliveryType;
      }
      
      const savedPostcode = localStorage.getItem('postcode');
      if (savedPostcode) {
        postcode = savedPostcode;
        const input = document.getElementById('postcodeInput');
        if (input) input.value = postcode;
      }
      
      const savedDeliveryFee = localStorage.getItem('deliveryFee');
      if (savedDeliveryFee) {
        deliveryFee = parseFloat(savedDeliveryFee);
      }
      
    } catch (error) {
      console.error('❌ Error loading cart from localStorage:', error);
      cartItems = [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('❌ Error saving cart to localStorage:', error);
    }
  }

  showLoading() {
    const menuContent = document.getElementById('menuContent');
    if (menuContent) {
      menuContent.innerHTML = '<div class="loading">Loading menu...</div>';
    }
  }

  hideLoading() {
    // Loading will be hidden when content is rendered
  }

  showError(message) {
    const menuContent = document.getElementById('menuContent');
    if (menuContent) {
      menuContent.innerHTML = `<div class="error-message">❌ ${message}</div>`;
    }
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MenuManager();
  });
} else {
  new MenuManager();
}

console.log('✅ Golden Fish Menu System Loaded');