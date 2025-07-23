// Data for categories and menu items. Each category contains an array of menu items
const menuData = [
  {
    id: 'drinks',
    name: 'Drinks',
    items: [
      { id: 'drink1', name: '1.5L Drinks', price: 5.0 },
      { id: 'drink2', name: '2.25L Drinks', price: 6.0 },
      { id: 'drink3', name: 'Can Drinks', price: 2.5 }
    ]
  },
  {
    id: 'deepfried',
    name: 'Deep Fried',
    items: [
      { id: 'df1', name: 'Chips', price: 4.9 },
      { id: 'df2', name: 'Kumara Chips', price: 8.0 },
      { id: 'df3', name: 'Hoki', price: 5.9 },
      { id: 'df4', name: 'Snapper', price: 8.9 },
      { id: 'df5', name: 'Gurnard', price: 8.9 },
      { id: 'df6', name: 'Prawn Cutlet', price: 2.0 },
      { id: 'df7', name: 'Sausage', price: 3.0 },
      { id: 'df8', name: 'Hot Dog', price: 3.9 },
      { id: 'df9', name: 'Mussel', price: 3.0 }
    ]
  },
  {
    id: 'burgers',
    name: 'Burgers',
    items: [
      { id: 'burger1', name: 'Hamburger', price: 5.5 },
      { id: 'burger2', name: 'Cheeseburger', price: 6.0 },
      { id: 'burger3', name: 'Chicken Burger', price: 6.5 }
    ]
  },
  {
    id: 'toasted',
    name: 'Toasted Sandwiches',
    items: [
      { id: 'sand1', name: 'Ham & Cheese', price: 4.0 },
      { id: 'sand2', name: 'Cheese & Onion', price: 3.5 },
      { id: 'sand3', name: 'Chicken & Mayo', price: 4.5 }
    ]
  },
  {
    id: 'soup',
    name: 'Soup',
    items: [
      { id: 'soup1', name: 'Chicken Noodle Soup', price: 4.5 },
      { id: 'soup2', name: 'Vegetable Soup', price: 4.0 }
    ]
  },
  {
    id: 'chowmein',
    name: 'Chow Mein (Noodles)',
    items: [
      { id: 'cm1', name: 'Chicken Chow Mein', price: 9.0 },
      { id: 'cm2', name: 'Beef Chow Mein', price: 9.0 },
      { id: 'cm3', name: 'Vegetable Chow Mein', price: 8.5 }
    ]
  }
];

// Retrieve cart from localStorage or initialize empty array
let cart = JSON.parse(localStorage.getItem('goldenfish_cart') || '[]');

// Utility to format currency
function formatCurrency(value) {
  return '$' + value.toFixed(2);
}

// Render category links in sidebar
function renderCategories() {
  const categoryList = document.getElementById('categoryList');
  if (!categoryList) return;
  categoryList.innerHTML = '';
  menuData.forEach(cat => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${cat.id}`;
    link.textContent = cat.name;
    li.appendChild(link);
    categoryList.appendChild(li);
  });
}

// Render menu sections and items
function renderMenu() {
  const menuContent = document.getElementById('menuContent');
  if (!menuContent) return;
  menuContent.innerHTML = '';
  menuData.forEach(cat => {
    const section = document.createElement('div');
    section.className = 'menu-section';
    section.id = cat.id;
    const heading = document.createElement('h3');
    heading.textContent = cat.name;
    section.appendChild(heading);
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'menu-items';
    cat.items.forEach(item => {
      const itemRow = document.createElement('div');
      itemRow.className = 'menu-item';
      const nameEl = document.createElement('span');
      nameEl.className = 'item-name';
      nameEl.textContent = item.name;
      const priceEl = document.createElement('span');
      priceEl.className = 'item-price';
      priceEl.textContent = formatCurrency(item.price);
      const btn = document.createElement('button');
      btn.className = 'add-btn';
      btn.textContent = '+';
      btn.addEventListener('click', () => addToCart(item));
      itemRow.appendChild(nameEl);
      itemRow.appendChild(priceEl);
      itemRow.appendChild(btn);
      itemsContainer.appendChild(itemRow);
    });
    section.appendChild(itemsContainer);
    menuContent.appendChild(section);
  });
}

// Add item to cart
function addToCart(item) {
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCart();
}

// Remove item from cart
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCart();
}

// Update cart UI and persist to localStorage
function updateCart() {
  localStorage.setItem('goldenfish_cart', JSON.stringify(cart));
  const cartContent = document.getElementById('cartContent');
  const cartTotal = document.getElementById('cartTotal');
  if (!cartContent || !cartTotal) return;
  // Clear existing content
  cartContent.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Your shopping cart is empty!';
    cartContent.appendChild(emptyMsg);
    cartTotal.innerHTML = '';
  } else {
    cart.forEach(item => {
      total += item.price * item.qty;
      const row = document.createElement('div');
      row.className = 'cart-item';
      const name = document.createElement('span');
      name.textContent = `${item.name} x${item.qty}`;
      const price = document.createElement('span');
      price.textContent = formatCurrency(item.price * item.qty);
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => removeFromCart(item.id));
      row.appendChild(name);
      row.appendChild(price);
      row.appendChild(removeBtn);
      cartContent.appendChild(row);
    });
    cartTotal.innerHTML = '';
    const totalRow = document.createElement('p');
    const label = document.createElement('span');
    label.textContent = 'Total:';
    const value = document.createElement('span');
    value.textContent = formatCurrency(total);
    totalRow.appendChild(label);
    totalRow.appendChild(value);
    cartTotal.appendChild(totalRow);
  }
}

// Handle checkout button click
function handleCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  // For demonstration, redirect to a dummy checkout page
  window.location.href = 'checkout.html';
}

// Setup event listeners
function init() {
  if (document.getElementById('checkoutBtn')) {
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
  }
  renderCategories();
  renderMenu();
  updateCart();
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', init);