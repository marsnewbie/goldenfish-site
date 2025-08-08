// Cart management service
class CartService {
  constructor() {
    this.cart = [];
    this.storageKey = 'goldenfish_cart';
    this.deliveryFee = 0;
    this.deliveryType = 'delivery';
  }

  init() {
    // Load cart from localStorage
    this.loadFromStorage();
    
    // Setup storage event listener for cross-tab sync
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey) {
        this.loadFromStorage();
        this.dispatchCartEvent('updated');
      }
    });
  }

  // Load cart from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.cart = data.items || [];
        this.deliveryFee = data.deliveryFee || 0;
        this.deliveryType = data.deliveryType || 'delivery';
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.cart = [];
    }
  }

  // Save cart to localStorage
  saveToStorage() {
    try {
      const data = {
        items: this.cart,
        deliveryFee: this.deliveryFee,
        deliveryType: this.deliveryType,
        timestamp: Date.now()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  // Add item to cart
  addItem(item, quantity = 1, selectedOptions = null, selectedVariant = null) {
    // Create unique item ID based on base item and options
    const itemId = this.generateItemId(item, selectedOptions, selectedVariant);
    
    // Check if item already exists in cart
    const existingItem = this.cart.find(cartItem => cartItem.uniqueId === itemId);
    
    if (existingItem) {
      // Update quantity
      existingItem.qty += quantity;
    } else {
      // Add new item
      const cartItem = {
        uniqueId: itemId,
        id: item.id,
        name: item.name,
        price: item.price,
        qty: quantity,
        selectedOptions: selectedOptions,
        selectedVariant: selectedVariant,
        image: item.image,
        description: item.description
      };
      
      this.cart.push(cartItem);
    }
    
    this.saveToStorage();
    this.dispatchCartEvent('itemAdded', { item, quantity });
    this.dispatchCartEvent('updated');
    
    return true;
  }

  // Update item quantity
  updateItemQuantity(uniqueId, newQuantity) {
    const itemIndex = this.cart.findIndex(item => item.uniqueId === uniqueId);
    
    if (itemIndex !== -1) {
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        this.removeItem(uniqueId);
      } else {
        this.cart[itemIndex].qty = newQuantity;
        this.saveToStorage();
        this.dispatchCartEvent('itemUpdated', { uniqueId, newQuantity });
        this.dispatchCartEvent('updated');
      }
      return true;
    }
    
    return false;
  }

  // Remove item from cart
  removeItem(uniqueId) {
    const initialLength = this.cart.length;
    this.cart = this.cart.filter(item => item.uniqueId !== uniqueId);
    
    if (this.cart.length !== initialLength) {
      this.saveToStorage();
      this.dispatchCartEvent('itemRemoved', { uniqueId });
      this.dispatchCartEvent('updated');
      return true;
    }
    
    return false;
  }

  // Clear entire cart
  clear() {
    this.cart = [];
    this.deliveryFee = 0;
    this.saveToStorage();
    this.dispatchCartEvent('cleared');
    this.dispatchCartEvent('updated');
  }

  // Get cart items
  getItems() {
    return [...this.cart]; // Return copy to prevent direct manipulation
  }

  // Get cart item count
  getItemCount() {
    return this.cart.reduce((total, item) => total + item.qty, 0);
  }

  // Calculate subtotal
  getSubtotal() {
    return this.cart.reduce((total, item) => {
      let itemPrice = item.price;
      
      // Add option prices
      if (item.selectedOptions) {
        Object.values(item.selectedOptions).forEach(option => {
          if (Array.isArray(option)) {
            option.forEach(opt => itemPrice += opt.price || 0);
          } else {
            itemPrice += option.price || 0;
          }
        });
      }
      
      // Add variant price difference
      if (item.selectedVariant && item.selectedVariant.price !== undefined) {
        itemPrice = item.selectedVariant.price;
      }
      
      return total + (itemPrice * item.qty);
    }, 0);
  }

  // Get total including delivery
  getTotal() {
    return this.getSubtotal() + this.deliveryFee;
  }

  // Set delivery info
  setDeliveryInfo(type, fee = 0) {
    this.deliveryType = type;
    this.deliveryFee = fee;
    this.saveToStorage();
    this.dispatchCartEvent('deliveryUpdated', { type, fee });
    this.dispatchCartEvent('updated');
  }

  // Generate unique item ID based on item and options
  generateItemId(item, selectedOptions, selectedVariant) {
    let id = `${item.id}`;
    
    if (selectedVariant) {
      id += `_variant_${selectedVariant.name}`;
    }
    
    if (selectedOptions) {
      const optionKeys = Object.keys(selectedOptions).sort();
      optionKeys.forEach(key => {
        const option = selectedOptions[key];
        if (Array.isArray(option)) {
          option.forEach(opt => {
            id += `_${key}_${opt.name}`;
          });
        } else {
          id += `_${key}_${option.name}`;
        }
      });
    }
    
    return id.replace(/\s+/g, '_').toLowerCase();
  }

  // Check if cart is empty
  isEmpty() {
    return this.cart.length === 0;
  }

  // Validate cart items (check if items still exist and prices are correct)
  async validateCart(menuService) {
    const invalidItems = [];
    const updatedItems = [];
    
    for (const cartItem of this.cart) {
      try {
        const currentItem = await menuService.getMenuItem(cartItem.id);
        
        if (!currentItem || !currentItem.available) {
          invalidItems.push(cartItem);
        } else if (currentItem.price !== cartItem.price) {
          // Price has changed - update cart item
          cartItem.price = currentItem.price;
          updatedItems.push(cartItem);
        }
      } catch (error) {
        console.error('Error validating cart item:', cartItem.id, error);
        invalidItems.push(cartItem);
      }
    }
    
    // Remove invalid items
    invalidItems.forEach(item => {
      this.removeItem(item.uniqueId);
    });
    
    // Update cart if there were changes
    if (updatedItems.length > 0 || invalidItems.length > 0) {
      this.saveToStorage();
      this.dispatchCartEvent('validated', { updatedItems, invalidItems });
      this.dispatchCartEvent('updated');
    }
    
    return {
      isValid: invalidItems.length === 0,
      invalidItems,
      updatedItems
    };
  }

  // Get cart data formatted for checkout
  getCheckoutData() {
    return {
      items: this.cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        selectedOptions: item.selectedOptions,
        selectedVariant: item.selectedVariant
      })),
      totals: {
        subtotal: this.getSubtotal(),
        deliveryFee: this.deliveryFee,
        discount: 0, // TODO: Implement discounts
        total: this.getTotal()
      },
      deliveryType: this.deliveryType
    };
  }

  // Dispatch cart events
  dispatchCartEvent(type, data = null) {
    const eventData = {
      cart: this.getItems(),
      totalItems: this.getItemCount(),
      subtotal: this.getSubtotal(),
      total: this.getTotal(),
      deliveryFee: this.deliveryFee,
      deliveryType: this.deliveryType,
      ...data
    };
    
    const event = new CustomEvent(`cart:${type}`, { detail: eventData });
    document.dispatchEvent(event);
  }
}

export default CartService;