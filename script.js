// Data for categories and menu items. Each category contains an array of menu items
const menuData = [
  {
    id: 'specialcurry',
    name: 'Signature Curries (招牌咖喱)',
    items: [
      {
        id: 'specialCurry',
        name: 'Special Curry (招牌咖喱)',
        description: 'Our signature curry with tender meat and aromatic spices, served with your choice of side',
        price: 12.80,
        options: [
          {
            groupName: 'Choose Your Side',
            required: true,
            multiple: false,
            choices: [
              { name: 'Boiled Rice', price: 0.50 },
              { name: 'Chips', price: 1.00 },
              { name: 'Salt & Pepper Chips', price: 2.00 },
              { name: 'Fried Rice', price: 2.50 },
              { name: 'Soft Noodles', price: 2.80 },
              { name: 'Crispy Noodles', price: 3.00 }
            ]
          },
          {
            groupName: 'Spice Level',
            required: true,
            multiple: false,
            choices: [
              { name: 'Mild', price: 0 },
              { name: 'Medium', price: 0 },
              { name: 'Hot', price: 0 },
              { name: 'Extra Hot', price: 0 }
            ]
          },
          {
            groupName: 'Extra Additions (Optional)',
            required: false,
            multiple: true,
            choices: [
              { name: 'Extra Meat', price: 3.50 },
              { name: 'Extra Vegetables', price: 2.00 },
              { name: 'Prawn Crackers', price: 1.50 }
            ]
          }
        ]
      },
      {
        id: 'sweetSourCurry',
        name: 'Sweet & Sour Curry',
        description: 'Traditional sweet and sour curry with pineapple and peppers',
        price: 11.50,
        options: [
          {
            groupName: 'Choose Your Side',
            required: true,
            multiple: false,
            choices: [
              { name: 'Boiled Rice', price: 0.50 },
              { name: 'Chips', price: 1.00 },
              { name: 'Salt & Pepper Chips', price: 2.00 },
              { name: 'Fried Rice', price: 2.50 },
              { name: 'Soft Noodles', price: 2.80 },
              { name: 'Crispy Noodles', price: 3.00 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'setdinner',
    name: 'Special Set Dinner',
    items: [
      {
        id: 'setA',
        name: 'A Set Dinner for Two',
        price: 28.00,
        options: [
          {
            groupName: 'Choose Sauce',
            required: true,
            multiple: false,
            choices: [
              { name: 'Sweet & Sour', price: 0 },
              { name: 'Black Bean', price: 1 },
              { name: 'Satay', price: 1.5 }
            ]
          },
          {
            groupName: 'Choose Side',
            required: false,
            multiple: true,
            choices: [
              { name: 'Egg Fried Rice', price: 0 },
              { name: 'Chips', price: 2 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'duck',
    name: 'Duck Dishes',
    items: [
      {
        id: 'crispyDuck',
        name: '19. Crispy Aromatic Duck',
        description: 'Served with Wheaten Pancakes, Cucumber, Spring Onion & Plum Sauce',
        variants: [
          { name: 'Quarter', price: 11.80 },
          { name: 'Half', price: 21.00 },
          { name: 'Whole', price: 40.00 }
        ],
        options: [
          {
            groupName: 'Choose Sauce',
            required: true,
            multiple: false,
            choices: [
              { name: 'Plum Sauce', price: 0 },
              { name: 'Hoisin Sauce', price: 0.5 }
            ]
          }
        ]
      }
    ]
  },
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

// Enhanced configuration with flexible delivery pricing and opening hours
const config = {
  // Restaurant basic information
  shopPostcode: 'YO10 3BP',
  shopAddress: '123 Golden Fish Street, York YO10 3BP',
  
  // Opening hours configuration - more flexible system
  openingHours: {
    // Regular weekly hours (0 = Sunday, 1 = Monday, etc.)
    weekly: {
      0: { open: '17:00', close: '22:30', enabled: true },  // Sunday
      1: { open: '17:00', close: '23:00', enabled: false }, // Monday - CLOSED
      2: { open: '17:00', close: '23:00', enabled: true },  // Tuesday
      3: { open: '17:00', close: '23:00', enabled: true },  // Wednesday
      4: { open: '17:00', close: '23:30', enabled: true },  // Thursday
      5: { open: '17:00', close: '00:00', enabled: true },  // Friday
      6: { open: '17:00', close: '00:00', enabled: true }   // Saturday
    },
    
    // Special dates (format: 'YYYY-MM-DD')
    special: {
      '2024-12-25': { open: null, close: null, enabled: false, reason: 'Christmas Day' },
      '2024-12-26': { open: '18:00', close: '22:00', enabled: true, reason: 'Boxing Day - Limited Hours' },
      '2024-01-01': { open: null, close: null, enabled: false, reason: 'New Year\'s Day' },
      '2024-12-31': { open: '17:00', close: '21:00', enabled: true, reason: 'New Year\'s Eve - Early Close' }
    }
  },
  
  // Lead times for preparation
  collectionLeadTime: 20, // minutes
  deliveryLeadTime: 45,   // minutes
  timeInterval: 15,       // minutes for time slot intervals
  
  // Holiday/closure management
  temporaryClosure: {
    enabled: false,
    reason: '',
    startDate: null,
    endDate: null
  },
  
  // Advance ordering settings - allows customers to order during closed hours
  advanceOrdering: {
    enabled: true, // Merchant can toggle this feature
    allowClosedHourOrders: true, // Allow orders when restaurant is closed
    showWarningMessage: true, // Show warning popup when ordering during closed hours
    warningMessage: {
      title: 'Restaurant Currently Closed',
      content: 'We are currently closed, but you can place an advance order. Your order will be prepared when we reopen.',
      confirmText: 'Continue with advance order',
      cancelText: 'Order later'
    },
    minimumAdvanceTime: 30, // Minimum minutes before opening to accept orders
    maxAdvanceDays: 2 // Maximum days in advance customers can order
  },
  
  // Delivery pricing configuration
  deliveryPricingMode: 'postcode', // 'postcode' or 'distance'
  
  // Postcode-based delivery zones (exact match and prefix matching)
  deliveryZones: {
    // Exact postcode matches (highest priority)
    'YO10 3BP': { fee: 0.00, name: 'Same building' },
    'YO10 3BA': { fee: 1.50, name: 'Same street' },
    
    // Prefix matches (by area)
    'YO10 3': { fee: 2.00, name: 'Local area' },
    'YO10': { fee: 2.50, name: 'York YO10 area' },
    'YO11': { fee: 3.50, name: 'York YO11 area' },
    'YO12': { fee: 4.00, name: 'York YO12 area' },
    'YO23': { fee: 3.00, name: 'York YO23 area' },
    'YO24': { fee: 3.50, name: 'York YO24 area' },
    'YO30': { fee: 4.50, name: 'York YO30 area' },
    'YO31': { fee: 5.00, name: 'York YO31 area' },
    
    // Special postcode ranges
    'LS1': { fee: 8.00, name: 'Leeds city center' },
    'LS2': { fee: 8.50, name: 'Leeds LS2' },
    'HU1': { fee: 12.00, name: 'Hull city center' },
    'HU2': { fee: 12.50, name: 'Hull HU2' }
  },
  
  // Distance-based pricing (when deliveryPricingMode = 'distance')
  distancePricing: {
    baseDeliveryFee: 2.00,
    pricePerMile: 1.50,
    maxDeliveryDistance: 10, // miles
    freeDeliveryDistance: 0.5, // miles - free delivery within this distance
    minimumOrderForDelivery: 15.00
  },
  
  // Third-party API configuration for distance calculation
  distanceAPI: {
    provider: 'google', // 'google', 'mapbox', or 'manual'
    googleMapsAPIKey: '', // To be configured
    mapboxAPIKey: '', // To be configured
    manualCalculation: true // Fallback to manual calculation if APIs unavailable
  },
  
  // Promotional discount system
  promotions: {
    enabled: true,
    rules: [
      {
        id: 'amount_off_20',
        type: 'amount_off',
        name: '£5 off orders over £20',
        description: 'Save £5 when you spend £20 or more',
        minAmount: 20.00,
        discount: 5.00,
        active: true
      },
      {
        id: 'percent_off_30',
        type: 'percent_off',
        name: '10% off orders over £30',
        description: 'Get 10% discount when you spend £30 or more',
        minAmount: 30.00,
        discount: 10, // percentage
        maxDiscount: 8.00, // maximum discount amount
        active: true
      },
      {
        id: 'free_item_25',
        type: 'free_item',
        name: 'Free Prawn Crackers over £25',
        description: 'Get free prawn crackers when you spend £25 or more',
        minAmount: 25.00,
        freeItem: {
          name: 'Prawn Crackers',
          price: 1.50,
          category: 'starters'
        },
        active: true
      }
    ]
  }
};

// Promotional discount calculation functions
function calculatePromotions(subtotal, cart = []) {
  if (!config.promotions.enabled) {
    return { discounts: [], totalDiscount: 0, freeItems: [] };
  }
  
  const appliedDiscounts = [];
  const freeItems = [];
  let totalDiscount = 0;
  
  // Sort promotions by priority (highest minimum amount first to avoid stacking lower tier promotions)
  const activePromotions = config.promotions.rules
    .filter(promo => promo.active && subtotal >= promo.minAmount)
    .sort((a, b) => b.minAmount - a.minAmount);
  
  // Apply the best qualifying promotion (no stacking for now)
  if (activePromotions.length > 0) {
    const bestPromo = activePromotions[0];
    
    switch (bestPromo.type) {
      case 'amount_off':
        totalDiscount = bestPromo.discount;
        appliedDiscounts.push({
          ...bestPromo,
          discountAmount: bestPromo.discount
        });
        break;
        
      case 'percent_off':
        let percentDiscount = (subtotal * bestPromo.discount) / 100;
        if (bestPromo.maxDiscount && percentDiscount > bestPromo.maxDiscount) {
          percentDiscount = bestPromo.maxDiscount;
        }
        totalDiscount = percentDiscount;
        appliedDiscounts.push({
          ...bestPromo,
          discountAmount: percentDiscount
        });
        break;
        
      case 'free_item':
        freeItems.push({
          ...bestPromo.freeItem,
          qty: 1,
          promotionId: bestPromo.id,
          isFreeItem: true
        });
        appliedDiscounts.push({
          ...bestPromo,
          discountAmount: 0 // Free items don't reduce subtotal
        });
        // Don't add to totalDiscount - free items are added as separate items
        break;
    }
  }
  
  return {
    discounts: appliedDiscounts,
    totalDiscount: Math.round(totalDiscount * 100) / 100, // Round to 2 decimal places
    freeItems: freeItems
  };
}

function getActivePromotions() {
  if (!config.promotions.enabled) return [];
  
  return config.promotions.rules.filter(promo => promo.active);
}

function displayPromotionsBanner() {
  const banner = document.getElementById('promotionsBanner');
  if (!banner) return;
  
  // Promotions are only shown on homepage, not on menu page
  banner.style.display = 'none';
}

// Enhanced opening hours management functions

// Get current restaurant status and opening hours
function getRestaurantStatus(date = new Date()) {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Check for temporary closure
  if (config.temporaryClosure.enabled) {
    const startDate = config.temporaryClosure.startDate ? new Date(config.temporaryClosure.startDate) : null;
    const endDate = config.temporaryClosure.endDate ? new Date(config.temporaryClosure.endDate) : null;
    
    if ((!startDate || date >= startDate) && (!endDate || date <= endDate)) {
      return {
        isOpen: false,
        reason: config.temporaryClosure.reason || 'Temporarily closed',
        nextOpen: endDate ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000) : null,
        hoursToday: null
      };
    }
  }
  
  // Check for special date hours
  if (config.openingHours.special[dateStr]) {
    const specialHours = config.openingHours.special[dateStr];
    if (!specialHours.enabled) {
      return {
        isOpen: false,
        reason: specialHours.reason || 'Closed for special day',
        nextOpen: getNextOpenTime(date),
        hoursToday: null
      };
    }
    return {
      isOpen: isCurrentlyOpen(date, specialHours),
      reason: specialHours.reason || null,
      hoursToday: specialHours,
      nextOpen: isCurrentlyOpen(date, specialHours) ? null : getNextOpenTime(date)
    };
  }
  
  // Check regular weekly hours
  const weeklyHours = config.openingHours.weekly[dayOfWeek];
  if (!weeklyHours.enabled) {
    return {
      isOpen: false,
      reason: 'Closed on ' + ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      nextOpen: getNextOpenTime(date),
      hoursToday: null
    };
  }
  
  return {
    isOpen: isCurrentlyOpen(date, weeklyHours),
    reason: null,
    hoursToday: weeklyHours,
    nextOpen: isCurrentlyOpen(date, weeklyHours) ? null : getNextOpenTime(date)
  };
}

// Check if restaurant is currently open based on hours
function isCurrentlyOpen(date, hoursConfig) {
  if (!hoursConfig.enabled || !hoursConfig.open || !hoursConfig.close) {
    return false;
  }
  
  const now = new Date(date);
  const openTime = getTimeOnDate(date, hoursConfig.open);
  let closeTime = getTimeOnDate(date, hoursConfig.close);
  
  // Handle midnight closing (00:00 means next day)
  if (hoursConfig.close === '00:00' || closeTime <= openTime) {
    closeTime = new Date(closeTime.getTime() + 24 * 60 * 60 * 1000);
  }
  
  return now >= openTime && now <= closeTime;
}

// Get next opening time from given date
function getNextOpenTime(fromDate = new Date()) {
  const checkDate = new Date(fromDate);
  
  // Check next 14 days to find next opening
  for (let i = 0; i < 14; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const dayOfWeek = checkDate.getDay();
    
    // Skip if temporary closure covers this date
    if (config.temporaryClosure.enabled) {
      const startDate = config.temporaryClosure.startDate ? new Date(config.temporaryClosure.startDate) : null;
      const endDate = config.temporaryClosure.endDate ? new Date(config.temporaryClosure.endDate) : null;
      
      if ((!startDate || checkDate >= startDate) && (!endDate || checkDate <= endDate)) {
        checkDate.setDate(checkDate.getDate() + 1);
        continue;
      }
    }
    
    // Check special date first
    if (config.openingHours.special[dateStr]) {
      const specialHours = config.openingHours.special[dateStr];
      if (specialHours.enabled && specialHours.open) {
        return getTimeOnDate(checkDate, specialHours.open);
      }
    } else {
      // Check regular weekly hours
      const weeklyHours = config.openingHours.weekly[dayOfWeek];
      if (weeklyHours.enabled && weeklyHours.open) {
        const openTime = getTimeOnDate(checkDate, weeklyHours.open);
        
        // If it's today and we haven't passed opening time yet, return it
        if (i === 0 && new Date() < openTime) {
          return openTime;
        }
        // If it's a future day, return the opening time
        if (i > 0) {
          return openTime;
        }
      }
    }
    
    checkDate.setDate(checkDate.getDate() + 1);
  }
  
  return null; // No opening found in next 14 days
}

// Utility: Convert time string to Date object on specific date
function getTimeOnDate(date, timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

// Enhanced available times generation
function getAvailableTimes(type, date = new Date()) {
  const status = getRestaurantStatus(date);
  
  if (!status.isOpen || !status.hoursToday) {
    return [];
  }
  
  const now = new Date();
  const leadTime = type === 'delivery' ? config.deliveryLeadTime : config.collectionLeadTime;
  
  const openTime = getTimeOnDate(date, status.hoursToday.open);
  let closeTime = getTimeOnDate(date, status.hoursToday.close);
  
  // Handle midnight closing
  if (status.hoursToday.close === '00:00' || closeTime <= openTime) {
    closeTime = new Date(closeTime.getTime() + 24 * 60 * 60 * 1000);
  }
  
  // Calculate earliest available time (now + lead time, but not before opening)
  const earliestTime = new Date(Math.max(
    now.getTime() + leadTime * 60 * 1000,
    openTime.getTime()
  ));
  
  const times = [];
  const currentTime = new Date(earliestTime);
  
  // Round up to next interval
  const intervalMs = config.timeInterval * 60 * 1000;
  const remainder = currentTime.getTime() % intervalMs;
  if (remainder > 0) {
    currentTime.setTime(currentTime.getTime() + (intervalMs - remainder));
  }
  
  // Generate time slots until closing
  while (currentTime <= closeTime) {
    times.push(new Date(currentTime));
    currentTime.setTime(currentTime.getTime() + intervalMs);
  }
  
  return times;
}

// Generate available advance order times for closed hours
function getAdvanceOrderTimes(type, fromDate = new Date()) {
  if (!config.advanceOrdering.enabled || !config.advanceOrdering.allowClosedHourOrders) {
    return [];
  }
  
  const times = [];
  const leadTime = type === 'delivery' ? config.deliveryLeadTime : config.collectionLeadTime;
  const maxAdvanceDays = config.advanceOrdering.maxAdvanceDays;
  const minimumAdvanceTime = config.advanceOrdering.minimumAdvanceTime;
  
  // Check next few days for available slots
  for (let dayOffset = 0; dayOffset <= maxAdvanceDays; dayOffset++) {
    const checkDate = new Date(fromDate);
    checkDate.setDate(checkDate.getDate() + dayOffset);
    
    const status = getRestaurantStatus(checkDate);
    
    // Skip if restaurant is not operating on this day
    if (!status.hoursToday) continue;
    
    const openTime = getTimeOnDate(checkDate, status.hoursToday.open);
    let closeTime = getTimeOnDate(checkDate, status.hoursToday.close);
    
    // Handle midnight closing
    if (status.hoursToday.close === '00:00' || closeTime <= openTime) {
      closeTime = new Date(closeTime.getTime() + 24 * 60 * 60 * 1000);
    }
    
    // For today, start from next opening time + minimum advance time
    // For future days, start from opening time
    let earliestTime;
    if (dayOffset === 0) {
      const nextOpen = getNextOpenTime(fromDate);
      if (nextOpen) {
        earliestTime = new Date(nextOpen.getTime() + minimumAdvanceTime * 60 * 1000);
      } else {
        continue; // Skip if no opening found today
      }
    } else {
      earliestTime = new Date(openTime.getTime() + leadTime * 60 * 1000);
    }
    
    // Generate time slots for this day
    const currentTime = new Date(earliestTime);
    
    // Round up to next interval
    const intervalMs = config.timeInterval * 60 * 1000;
    const remainder = currentTime.getTime() % intervalMs;
    if (remainder > 0) {
      currentTime.setTime(currentTime.getTime() + (intervalMs - remainder));
    }
    
    // Add time slots until closing
    while (currentTime <= closeTime && times.length < 50) { // Limit to 50 slots total
      times.push(new Date(currentTime));
      currentTime.setTime(currentTime.getTime() + intervalMs);
    }
  }
  
  return times;
}

// Enhanced time formatting functions
function formatTimeOption(date) {
  const pad = n => n < 10 ? '0' + n : n;
  const h = pad(date.getHours());
  const m = pad(date.getMinutes());
  const day = date.toLocaleDateString('en-GB', { weekday: 'long' });
  return `${h}:${m} ${day}`;
}

function formatTime(date) {
  const pad = n => n < 10 ? '0' + n : n;
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateTime(date) {
  const day = date.toLocaleDateString('en-GB', { weekday: 'long' });
  const time = formatTime(date);
  return `${day} at ${time}`;
}

// Function to display opening hours for footer/about section
function getOpeningHoursDisplay() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = [];
  
  days.forEach((day, index) => {
    const dayHours = config.openingHours.weekly[index];
    if (dayHours.enabled) {
      let timeStr = `${dayHours.open} - ${dayHours.close === '00:00' ? 'Midnight' : dayHours.close}`;
      hours.push(`${day}: ${timeStr}`);
    } else {
      hours.push(`${day}: Closed`);
    }
  });
  
  return hours;
}

// Enhanced delivery fee calculation with flexible pricing
async function calcDeliveryFee(postcode, address = '') {
  if (!postcode) return { fee: '', display: '', zone: '' };
  
  const cleanPostcode = postcode.trim().toUpperCase();
  
  if (config.deliveryPricingMode === 'postcode') {
    return calcPostcodeBasedDeliveryFee(cleanPostcode);
  } else if (config.deliveryPricingMode === 'distance') {
    return await calcDistanceBasedDeliveryFee(cleanPostcode, address);
  }
  
  return { fee: '', display: 'Configuration error', zone: '' };
}

// Postcode-based delivery fee calculation
function calcPostcodeBasedDeliveryFee(postcode) {
  // Try exact match first
  if (config.deliveryZones[postcode]) {
    const zone = config.deliveryZones[postcode];
    return {
      fee: zone.fee,
      display: zone.fee === 0 ? 'FREE' : `£${zone.fee.toFixed(2)}`,
      zone: zone.name,
      valid: true
    };
  }
  
  // Try prefix matches (from longest to shortest)
  const prefixes = Object.keys(config.deliveryZones)
    .filter(key => postcode.startsWith(key) && key !== postcode)
    .sort((a, b) => b.length - a.length); // Sort by length descending
  
  if (prefixes.length > 0) {
    const matchedPrefix = prefixes[0];
    const zone = config.deliveryZones[matchedPrefix];
    return {
      fee: zone.fee,
      display: zone.fee === 0 ? 'FREE' : `£${zone.fee.toFixed(2)}`,
      zone: zone.name,
      valid: true
    };
  }
  
  // No matching zone found
  return {
    fee: null,
    display: 'Out of delivery area',
    zone: 'Not served',
    valid: false
  };
}

// Distance-based delivery fee calculation
async function calcDistanceBasedDeliveryFee(postcode, address) {
  try {
    let distance = 0;
    
    // Try to get distance from API
    if (config.distanceAPI.provider === 'google' && config.distanceAPI.googleMapsAPIKey) {
      distance = await getGoogleMapsDistance(address || postcode);
    } else if (config.distanceAPI.provider === 'mapbox' && config.distanceAPI.mapboxAPIKey) {
      distance = await getMapboxDistance(address || postcode);
    } else if (config.distanceAPI.manualCalculation) {
      // Fallback: manual calculation based on postcode patterns
      distance = getManualDistanceEstimate(postcode);
    }
    
    // Calculate fee based on distance
    if (distance > config.distancePricing.maxDeliveryDistance) {
      return {
        fee: null,
        display: `Too far (${distance.toFixed(1)} miles)`,
        zone: 'Out of delivery area',
        valid: false
      };
    }
    
    let fee = 0;
    if (distance > config.distancePricing.freeDeliveryDistance) {
      fee = config.distancePricing.baseDeliveryFee + 
            (distance * config.distancePricing.pricePerMile);
    }
    
    return {
      fee: fee,
      display: fee === 0 ? 'FREE' : `£${fee.toFixed(2)}`,
      zone: `${distance.toFixed(1)} miles away`,
      valid: true,
      distance: distance
    };
    
  } catch (error) {
    console.error('Error calculating distance-based delivery fee:', error);
    return {
      fee: null,
      display: 'Unable to calculate delivery fee',
      zone: 'Error',
      valid: false
    };
  }
}

// Manual distance estimation based on postcode patterns (fallback)
function getManualDistanceEstimate(postcode) {
  const area = postcode.substring(0, 2);
  const district = postcode.substring(0, 3);
  
  // Simple distance estimation based on postcode areas
  const areaDistances = {
    'YO': { base: 0, districts: { 'YO1': 0.5, 'YO10': 1, 'YO11': 2, 'YO12': 3 }},
    'LS': { base: 15, districts: { 'LS1': 15, 'LS2': 16, 'LS3': 17 }},
    'HU': { base: 25, districts: { 'HU1': 25, 'HU2': 26, 'HU3': 27 }},
    'BD': { base: 20, districts: { 'BD1': 20, 'BD2': 21 }},
    'WF': { base: 18, districts: { 'WF1': 18, 'WF2': 19 }}
  };
  
  if (areaDistances[area]) {
    const areaData = areaDistances[area];
    return areaData.districts[district] || areaData.base;
  }
  
  // Default for unknown areas
  return 50; // Assume very far for unknown postcodes
}

// Google Maps Distance Matrix API integration (placeholder)
async function getGoogleMapsDistance(destination) {
  // This would integrate with Google Maps Distance Matrix API
  // For now, return manual estimate
  console.log('Google Maps API integration needed for:', destination);
  return getManualDistanceEstimate(destination);
}

// Mapbox Distance API integration (placeholder)
async function getMapboxDistance(destination) {
  // This would integrate with Mapbox Distance API
  // For now, return manual estimate
  console.log('Mapbox API integration needed for:', destination);
  return getManualDistanceEstimate(destination);
}

// 配送方式和时间选择逻辑
function setupOrderOptions() {
  const deliveryRadios = document.getElementsByName('deliveryType');
  const storeStatus = document.getElementById('storeStatus');
  const timeSelectGroup = document.getElementById('timeSelectGroup');
  const orderTime = document.getElementById('orderTime');
  const postcodeGroup = document.getElementById('postcodeGroup');
  const postcodeInput = document.getElementById('postcodeInput');
  const deliveryFee = document.getElementById('deliveryFee');

  function updateOptions() {
    const now = new Date();
    const status = getRestaurantStatus(now);
    let selectedType = 'collection';
    deliveryRadios.forEach(r => { if (r.checked) selectedType = r.value; });
    
    // Check if restaurant is open or if advance ordering is enabled
    if (!status.isOpen) {
      let statusMessage = status.reason;
      
      if (status.nextOpen) {
        const nextOpen = new Date(status.nextOpen);
        const isToday = nextOpen.toDateString() === now.toDateString();
        const isTomorrow = nextOpen.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
        
        if (isToday) {
          statusMessage += `. Opens today at ${formatTime(status.nextOpen)}`;
        } else if (isTomorrow) {
          statusMessage += `. Opens tomorrow at ${formatTime(status.nextOpen)}`;
        } else {
          statusMessage += `. Next opening: ${formatDateTime(status.nextOpen)}`;
        }
      }
      
      // Check if advance ordering is enabled
      if (config.advanceOrdering.enabled && config.advanceOrdering.allowClosedHourOrders) {
        storeStatus.innerHTML = `
          <span style="color: var(--warning); font-weight: 600;">${statusMessage}</span>
          <br><small style="color: var(--success); font-weight: 500;">Advance ordering available</small>
        `;
        
        // Generate advance time slots
        const advanceTimes = getAdvanceOrderTimes(selectedType);
        orderTime.innerHTML = '';
        
        if (advanceTimes.length > 0) {
          advanceTimes.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.toISOString();
            opt.textContent = formatTimeOption(t);
            orderTime.appendChild(opt);
          });
          timeSelectGroup.style.display = '';
          
          // Enable checkout for advance orders
          const checkoutBtn = document.getElementById('checkoutBtn');
          if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Place Advance Order';
            checkoutBtn.setAttribute('data-advance-order', 'true');
          }
        } else {
          const opt = document.createElement('option');
          opt.value = '';
          opt.textContent = 'No advance slots available';
          opt.disabled = true;
          orderTime.appendChild(opt);
          timeSelectGroup.style.display = '';
          
          const checkoutBtn = document.getElementById('checkoutBtn');
          if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'No advance slots available';
          }
        }
        
        // Handle delivery options for advance orders
        if (selectedType === 'delivery') {
          postcodeGroup.style.display = '';
          updateDeliveryFeeDisplay(postcodeInput.value);
        } else {
          postcodeGroup.style.display = 'none';
          deliveryFee.textContent = '';
        }
        
      } else {
        // Traditional closed behavior - no advance ordering
        storeStatus.innerHTML = `<span style="color: var(--danger); font-weight: 600;">${statusMessage}</span>`;
        timeSelectGroup.style.display = 'none';
        postcodeGroup.style.display = 'none';
        
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
          checkoutBtn.disabled = true;
          checkoutBtn.textContent = 'Restaurant Closed';
          checkoutBtn.removeAttribute('data-advance-order');
        }
      }
      return;
    }
    
    // Restaurant is open - show status if there's a special reason
    if (status.reason) {
      storeStatus.innerHTML = `<span style=\"color: var(--warning); font-weight: 500;\">${status.reason}</span>`;
    } else {
      const hoursToday = status.hoursToday;
      let closeTime = hoursToday.close === '00:00' ? 'Midnight' : hoursToday.close;
      storeStatus.innerHTML = `<span style=\"color: var(--success); font-weight: 500;\">Open until ${closeTime}</span>`;
    }
    
    // Generate available time slots
    const times = getAvailableTimes(selectedType);
    orderTime.innerHTML = '';
    
    if (times.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No time slots available today';
      opt.disabled = true;
      orderTime.appendChild(opt);
      timeSelectGroup.style.display = '';
      
      // Disable checkout if no times available
      const checkoutBtn = document.getElementById('checkoutBtn');
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'No delivery slots available';
      }
    } else {
      times.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.toISOString();
        opt.textContent = formatTimeOption(t);
        orderTime.appendChild(opt);
      });
      timeSelectGroup.style.display = '';
      
      // Re-enable checkout
      const checkoutBtn = document.getElementById('checkoutBtn');
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Checkout';
      }
    }
    
    // Handle delivery options
    if (selectedType === 'delivery') {
      postcodeGroup.style.display = '';
      updateDeliveryFeeDisplay(postcodeInput.value);
    } else {
      postcodeGroup.style.display = 'none';
      deliveryFee.textContent = '';
    }
  }

  deliveryRadios.forEach(r => r.addEventListener('change', () => {
    updateOptions();
    // 更新购物车总价（包含送餐费）
    updateCart();
  }));
  postcodeInput && postcodeInput.addEventListener('input', () => {
    updateDeliveryFeeDisplay(postcodeInput.value);
  });
  updateOptions();
}

// Update delivery fee display with enhanced information
async function updateDeliveryFeeDisplay(postcode) {
  const deliveryFee = document.getElementById('deliveryFee');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (!postcode) {
    deliveryFee.textContent = '';
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = 'Checkout';
    }
    updateCart();
    return;
  }
  
  try {
    // Show loading state
    deliveryFee.textContent = 'Calculating...';
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Calculating delivery...';
    }
    
    const feeResult = await calcDeliveryFee(postcode);
    
    if (feeResult.valid) {
      deliveryFee.innerHTML = `
        <span class="delivery-fee-amount">${feeResult.display}</span>
        <br><small class="delivery-zone">${feeResult.zone}</small>
      `;
      deliveryFee.className = 'delivery-fee-valid';
      
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Checkout';
      }
    } else {
      deliveryFee.innerHTML = `
        <span class="delivery-fee-invalid">${feeResult.display}</span>
        <br><small class="delivery-zone">${feeResult.zone}</small>
      `;
      deliveryFee.className = 'delivery-fee-invalid';
      
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = feeResult.display;
      }
    }
    
    // Store the fee result for cart calculations
    window.currentDeliveryFee = feeResult;
    
    // Update cart total with new delivery fee
    updateCart();
    
  } catch (error) {
    console.error('Error updating delivery fee display:', error);
    deliveryFee.textContent = 'Error calculating delivery fee';
    deliveryFee.className = 'delivery-fee-error';
    
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Delivery calculation error';
    }
  }
}

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
      const nameContainer = document.createElement('div');
      nameContainer.className = 'item-name';
      
      const nameEl = document.createElement('div');
      nameEl.textContent = item.name;
      nameContainer.appendChild(nameEl);
      
      // Add description if available
      if (item.description) {
        const descEl = document.createElement('div');
        descEl.className = 'item-description';
        descEl.textContent = item.description;
        nameContainer.appendChild(descEl);
      }
      
      // 处理多规格菜品
      let priceText = '';
      if (item.variants) {
        priceText = `From ${formatCurrency(item.variants[0].price)}`;
      } else {
        priceText = formatCurrency(item.price);
      }
      
      const priceEl = document.createElement('span');
      priceEl.className = 'item-price';
      priceEl.textContent = priceText;
      
      const btn = document.createElement('button');
      btn.className = 'add-btn';
      btn.textContent = '+';
      btn.addEventListener('click', () => {
        if (item.variants || item.options) {
          showItemOptions(item);
        } else {
          addToCart(item);
        }
      });
      
      // Create info container for price and button
      const infoContainer = document.createElement('div');
      infoContainer.className = 'menu-item-info';
      infoContainer.appendChild(priceEl);
      infoContainer.appendChild(btn);
      
      itemRow.appendChild(nameContainer);
      itemRow.appendChild(infoContainer);
      itemsContainer.appendChild(itemRow);
    });
    section.appendChild(itemsContainer);
    menuContent.appendChild(section);
  });
}

// 显示菜品选项弹窗
function showItemOptions(item) {
  // 创建弹窗
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.setAttribute('data-item', JSON.stringify(item));
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${item.name}</h3>
        <button class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
        <div id="itemOptions"></div>
      </div>
      <div class="modal-footer">
        <button class="add-to-cart-btn" disabled>Add to Cart</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // 关闭弹窗
  modal.querySelector('.close-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // 点击背景关闭弹窗
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // 渲染选项
  renderItemOptions(item, modal);
}

// 渲染菜品选项
function renderItemOptions(item, modal) {
  const optionsContainer = modal.querySelector('#itemOptions');
  let totalPrice = item.price || (item.variants ? item.variants[0].price : 0);
  
  // 将selectedOptions存储到modal中
  modal.selectedOptions = {};
  
  // 处理多规格选择
  if (item.variants) {
    const variantSection = document.createElement('div');
    variantSection.className = 'option-section';
    variantSection.innerHTML = '<h4>Choose Size:</h4>';
    
    item.variants.forEach((variant, index) => {
      const label = document.createElement('label');
      label.innerHTML = `
        <input type="radio" name="variant" value="${index}" ${index === 0 ? 'checked' : ''}>
        ${variant.name} - ${formatCurrency(variant.price)}
      `;
      label.addEventListener('change', () => {
        totalPrice = variant.price;
        updateTotalPrice(modal, totalPrice);
      });
      variantSection.appendChild(label);
    });
    
    optionsContainer.appendChild(variantSection);
  }
  
  // 处理多级选项
  if (item.options) {
    item.options.forEach((optionGroup, groupIndex) => {
      const optionSection = document.createElement('div');
      optionSection.className = 'option-section';
      optionSection.innerHTML = `<h4>${optionGroup.groupName}:</h4>`;
      
      optionGroup.choices.forEach((choice, choiceIndex) => {
        const label = document.createElement('label');
        const inputType = optionGroup.multiple ? 'checkbox' : 'radio';
        const inputName = optionGroup.multiple ? `option_${groupIndex}_${choiceIndex}` : `option_${groupIndex}`;
        
        label.innerHTML = `
          <input type="${inputType}" name="${inputName}" value="${choiceIndex}">
          ${choice.name} ${choice.price > 0 ? `(+${formatCurrency(choice.price)})` : ''}
        `;
        
        label.addEventListener('change', () => {
          updateSelectedOptions(item, optionGroup, choiceIndex, choice, modal.selectedOptions);
          updateTotalPrice(modal, totalPrice);
        });
        
        optionSection.appendChild(label);
      });
      
      optionsContainer.appendChild(optionSection);
    });
  }
  
  // 更新总价显示
  updateTotalPrice(modal, totalPrice);
  
  // 添加到购物车按钮
  const addBtn = modal.querySelector('.add-to-cart-btn');
  addBtn.addEventListener('click', () => {
    const selectedVariant = item.variants ? 
      item.variants[parseInt(modal.querySelector('input[name="variant"]:checked')?.value || 0)] : 
      null;
    
    const cartItem = {
      ...item,
      selectedVariant,
      selectedOptions: modal.selectedOptions,
      price: totalPrice,
      qty: 1
    };
    
    addToCart(cartItem);
    document.body.removeChild(modal);
  });
}

// 更新选中的选项
function updateSelectedOptions(item, optionGroup, choiceIndex, choice, selectedOptions) {
  if (optionGroup.multiple) {
    if (!selectedOptions[optionGroup.groupName]) {
      selectedOptions[optionGroup.groupName] = [];
    }
    const index = selectedOptions[optionGroup.groupName].findIndex(c => c.name === choice.name);
    if (index > -1) {
      selectedOptions[optionGroup.groupName].splice(index, 1);
    } else {
      selectedOptions[optionGroup.groupName].push(choice);
    }
  } else {
    selectedOptions[optionGroup.groupName] = choice;
  }
}

// 更新总价显示
function updateTotalPrice(modal, basePrice) {
  let total = basePrice;
  
  // 计算选项价格
  modal.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked').forEach(input => {
    if (input.name !== 'variant') {
      const choiceIndex = parseInt(input.value);
      const optionGroupIndex = parseInt(input.name.split('_')[1]);
      // 从modal的data属性获取item信息
      const itemData = modal.getAttribute('data-item');
      if (itemData) {
        const item = JSON.parse(itemData);
        if (item.options && item.options[optionGroupIndex]) {
          const choice = item.options[optionGroupIndex].choices[choiceIndex];
          if (choice) {
            total += choice.price;
          }
        }
      }
    }
  });
  
  const addBtn = modal.querySelector('.add-to-cart-btn');
  addBtn.textContent = `Add to Cart - ${formatCurrency(total)}`;
  addBtn.disabled = false;
}

// Add item to cart
function addToCart(item) {
  // 对于有选项的菜品，需要创建唯一标识
  let itemKey = item.id;
  if (item.selectedVariant) {
    itemKey += `_${item.selectedVariant.name}`;
  }
  if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
    const optionsKey = Object.entries(item.selectedOptions)
      .map(([groupName, choice]) => {
        if (Array.isArray(choice)) {
          return choice.map(c => c.name).sort().join(',');
        }
        return choice.name;
      })
      .sort()
      .join('|');
    itemKey += `_${optionsKey}`;
  }
  
  const existing = cart.find(c => {
    let cKey = c.id;
    if (c.selectedVariant) {
      cKey += `_${c.selectedVariant.name}`;
    }
    if (c.selectedOptions && Object.keys(c.selectedOptions).length > 0) {
      const optionsKey = Object.entries(c.selectedOptions)
        .map(([groupName, choice]) => {
          if (Array.isArray(choice)) {
            return choice.map(c => c.name).sort().join(',');
          }
          return choice.name;
        })
        .sort()
        .join('|');
      cKey += `_${optionsKey}`;
    }
    return cKey === itemKey;
  });
  
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCart();
}

// Remove item from cart
function removeFromCart(itemId) {
  // 移除指定索引的商品
  cart.splice(itemId, 1);
  updateCart();
}

// Update cart UI and persist to localStorage
function updateCart() {
  localStorage.setItem('goldenfish_cart', JSON.stringify(cart));
  const cartItemsList = document.getElementById('cartContent'); // This now maps to cart-items-list
  const cartSummary = document.getElementById('cartSummary');
  const checkoutSection = document.getElementById('checkoutSection');
  if (!cartItemsList) return;
  
  // Clear existing content
  cartItemsList.innerHTML = '';
  let total = 0;
  
  if (cart.length === 0) {
    // Show empty cart message with new structure
    cartItemsList.innerHTML = `
      <div class="empty-cart-message">
        <div class="empty-icon">🍽️</div>
        <h4>Start your order</h4>
        <p>Add items from the menu</p>
      </div>
    `;
    
    // Hide cart summary but show checkout section with disabled button
    if (cartSummary) cartSummary.style.display = 'none';
    if (checkoutSection) {
      const checkoutBtn = document.getElementById('checkoutBtn');
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<span>Add items to checkout</span>';
        checkoutBtn.style.background = '#ccc';
        checkoutBtn.style.cursor = 'not-allowed';
      }
    }
  } else {
    cart.forEach(item => {
      // 计算包含选项的总价
      let itemTotalPrice = item.price;
      
      // 加上选项的价格
      if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
        Object.entries(item.selectedOptions).forEach(([groupName, choice]) => {
          if (Array.isArray(choice)) {
            choice.forEach(c => {
              itemTotalPrice += c.price;
            });
          } else {
            itemTotalPrice += choice.price;
          }
        });
      }
      
      total += itemTotalPrice * item.qty;
      const row = document.createElement('div');
      row.className = 'cart-item';
      
      // Create item details container
      const detailsContainer = document.createElement('div');
      detailsContainer.className = 'cart-item-details';
      
      // Item name with quantity
      const nameEl = document.createElement('div');
      nameEl.className = 'cart-item-name';
      let itemName = item.name;
      if (item.selectedVariant) {
        itemName += ` (${item.selectedVariant.name})`;
      }
      nameEl.textContent = `${itemName} x${item.qty}`;
      detailsContainer.appendChild(nameEl);
      
      // Options display
      if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
        const optionsEl = document.createElement('div');
        optionsEl.className = 'cart-item-options';
        const optionsText = Object.entries(item.selectedOptions)
          .map(([groupName, choice]) => {
            if (Array.isArray(choice)) {
              return choice.map(c => c.name).join(', ');
            }
            return choice.name;
          })
          .join(' • ');
        optionsEl.textContent = optionsText;
        detailsContainer.appendChild(optionsEl);
      }
      
      // Price
      const priceEl = document.createElement('span');
      priceEl.className = 'cart-item-price';
      priceEl.textContent = formatCurrency(itemTotalPrice * item.qty);
      
      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => removeFromCart(cart.indexOf(item)));
      
      row.appendChild(detailsContainer);
      row.appendChild(priceEl);
      row.appendChild(removeBtn);
      cartItemsList.appendChild(row);
    });
    
    // Show cart summary and checkout button
    if (cartSummary) {
      cartSummary.style.display = 'block';
      const cartTotal = document.getElementById('cartTotal');
      if (cartTotal) {
        cartTotal.innerHTML = '';
        
        // Calculate and display promotions
        const promotions = calculatePromotions(total, cart);
        
        // Save promotions to localStorage for checkout page
        if (promotions.discounts.length > 0) {
          localStorage.setItem('goldenfish_applied_promotions', JSON.stringify(promotions.discounts));
        } else {
          localStorage.removeItem('goldenfish_applied_promotions');
        }
        
        // Add free items to cart array and save
        const currentCartItems = cart.filter(item => !item.isFreeItem);
        const cartWithFreeItems = [...currentCartItems, ...promotions.freeItems];
        cart = cartWithFreeItems;
        localStorage.setItem('goldenfish_cart', JSON.stringify(cart));
        
        // Display subtotal
        const subtotalRow = document.createElement('p');
        subtotalRow.innerHTML = `<span>Subtotal:</span><span>${formatCurrency(total)}</span>`;
        cartTotal.appendChild(subtotalRow);
        
        // Display delivery fee if applicable
        const deliveryType = document.querySelector('input[name="deliveryType"]:checked');
        if (deliveryType && deliveryType.value === 'delivery' && window.currentDeliveryFee) {
          const feeResult = window.currentDeliveryFee;
          
          if (feeResult.valid && feeResult.fee !== null) {
            const deliveryRow = document.createElement('p');
            deliveryRow.className = 'cart-delivery-fee';
            const deliveryLabel = document.createElement('span');
            deliveryLabel.textContent = 'Delivery Fee:';
            const deliveryValue = document.createElement('span');
            deliveryValue.textContent = feeResult.display;
            
            // Add zone information
            if (feeResult.zone) {
              const zoneInfo = document.createElement('small');
              zoneInfo.textContent = ` (${feeResult.zone})`;
              zoneInfo.style.color = '#666';
              deliveryValue.appendChild(zoneInfo);
            }
            
            deliveryRow.appendChild(deliveryLabel);
            deliveryRow.appendChild(deliveryValue);
            cartTotal.appendChild(deliveryRow);
            
            // Add delivery fee to total (only if it's a valid number)
            if (typeof feeResult.fee === 'number') {
              total += feeResult.fee;
            }
          } else if (!feeResult.valid) {
            // Show delivery area message
            const deliveryRow = document.createElement('p');
            deliveryRow.className = 'cart-delivery-error';
            deliveryRow.innerHTML = `<span style="color: #f44336;">${feeResult.display}</span>`;
            cartTotal.appendChild(deliveryRow);
          }
        }
        
        // Display promotion discounts
        if (promotions.discounts.length > 0) {
          promotions.discounts.forEach(discount => {
            const discountRow = document.createElement('p');
            discountRow.className = 'cart-promotion';
            discountRow.style.color = 'var(--success)';
            discountRow.innerHTML = `
              <span style="font-size: 0.9rem;">${discount.name}:</span>
              <span>-${formatCurrency(discount.discountAmount)}</span>
            `;
            cartTotal.appendChild(discountRow);
          });
          
          total -= promotions.totalDiscount;
        }
        
        // Add free items to cart display (above total)
        if (promotions.freeItems.length > 0) {
          promotions.freeItems.forEach(freeItem => {
            const freeItemDiv = document.createElement('div');
            freeItemDiv.className = 'cart-item cart-free-item';
            freeItemDiv.innerHTML = `
              <div class="cart-item-details">
                <div class="cart-item-name">${freeItem.name} (FREE)</div>
                <div class="cart-item-options" style="color: var(--success);">Promotional item</div>
              </div>
              <div class="cart-item-price" style="color: var(--success);">FREE</div>
            `;
            cartItemsList.appendChild(freeItemDiv);
          });
        }
        
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
    
    // Ensure checkout button is properly enabled
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = '<span>Checkout</span><span class="checkout-arrow">→</span>';
      checkoutBtn.style.background = 'linear-gradient(135deg, var(--success) 0%, #388e3c 100%)';
      checkoutBtn.style.cursor = 'pointer';
    }
  }
}

// Handle checkout button click
function handleCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  // Check if delivery or collection is selected
  const deliveryBtn = document.getElementById('deliveryBtn');
  const collectionBtn = document.getElementById('collectionBtn');
  
  if (!deliveryBtn || !collectionBtn) {
    alert('Unable to determine delivery/collection option. Please refresh the page.');
    return;
  }
  
  const deliverySelected = deliveryBtn.classList.contains('active');
  const collectionSelected = collectionBtn.classList.contains('active');
  
  if (!deliverySelected && !collectionSelected) {
    alert('Please select either Delivery or Collection before proceeding to checkout.');
    return;
  }
  
  // For delivery orders, check if we have valid delivery details
  if (deliverySelected) {
    const deliveryFee = window.currentDeliveryFee;
    const postcodeInput = document.getElementById('postcodeInput');
    
    if (!postcodeInput || !postcodeInput.value.trim()) {
      alert('Please enter your postcode for delivery orders.');
      postcodeInput?.focus();
      return;
    }
    
    if (deliveryFee && !deliveryFee.valid) {
      alert('Sorry, we do not deliver to this postcode. Please choose Collection or try a different postcode.');
      return;
    }
  }
  
  // Store order data in localStorage for checkout page
  localStorage.setItem('goldenfish_order_type', deliverySelected ? 'delivery' : 'collection');
  
  if (deliverySelected) {
    const postcodeInput = document.getElementById('postcodeInput');
    if (postcodeInput && postcodeInput.value.trim()) {
      localStorage.setItem('goldenfish_postcode', postcodeInput.value.trim().toUpperCase());
    }
    
    if (window.currentDeliveryFee) {
      localStorage.setItem('goldenfish_delivery_fee', JSON.stringify(window.currentDeliveryFee));
    }
  } else {
    // Clear delivery-related data for collection orders
    localStorage.removeItem('goldenfish_postcode');
    localStorage.removeItem('goldenfish_delivery_fee');
  }
  
  // Check if this is an advance order
  const checkoutBtn = document.getElementById('checkoutBtn');
  const isAdvanceOrder = checkoutBtn && checkoutBtn.getAttribute('data-advance-order') === 'true';
  
  if (isAdvanceOrder && config.advanceOrdering.showWarningMessage) {
    showAdvanceOrderWarning().then(confirmed => {
      if (confirmed) {
        window.location.href = 'checkout.html';
      }
    });
  } else {
    window.location.href = 'checkout.html';
  }
}

// Show advance order warning on menu page
function showAdvanceOrderWarning() {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.zIndex = '2000';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header" style="background: var(--warning); color: white;">
          <h3>${config.advanceOrdering.warningMessage.title}</h3>
          <button class="close-btn" type="button">&times;</button>
        </div>
        <div class="modal-body">
          <p style="margin-bottom: 1rem; line-height: 1.6;">${config.advanceOrdering.warningMessage.content}</p>
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button class="cancel-advance-btn" style="padding: 0.75rem 1.5rem; background: var(--gray); border: none; border-radius: 4px; cursor: pointer;">
              ${config.advanceOrdering.warningMessage.cancelText}
            </button>
            <button class="confirm-advance-btn" style="padding: 0.75rem 1.5rem; background: var(--warning); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
              ${config.advanceOrdering.warningMessage.confirmText}
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle confirm
    modal.querySelector('.confirm-advance-btn').addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(true);
    });
    
    // Handle cancel
    const cancelHandler = () => {
      document.body.removeChild(modal);
      resolve(false);
    };
    
    modal.querySelector('.cancel-advance-btn').addEventListener('click', cancelHandler);
    modal.querySelector('.close-btn').addEventListener('click', cancelHandler);
    
    // Click outside to cancel
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cancelHandler();
      }
    });
  });
}

// Setup event listeners
function init() {
  if (document.getElementById('checkoutBtn')) {
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
  }
  renderCategories();
  renderMenu();
  updateCart();
  displayPromotionsBanner(); // Show active promotions
  
  // Setup order options - check for both old and new layouts
  if (document.getElementById('orderOptions')) {
    setupOrderOptions();
  } else {
    setupNewOrderOptions(); // New sidebar layout
  }
}

// Setup new sidebar delivery/collection toggle
function setupNewOrderOptions() {
  const collectionBtn = document.getElementById('collectionBtn');
  const deliveryBtn = document.getElementById('deliveryBtn');
  const deliverySection = document.getElementById('deliverySection');
  const timeSelectSection = document.getElementById('timeSelectSection');
  const hiddenDeliveryRadio = document.getElementById('hiddenDeliveryRadio');
  const hiddenCollectionRadio = document.getElementById('hiddenCollectionRadio');
  const postcodeInput = document.getElementById('postcodeInput');
  const postcodeCheckBtn = document.getElementById('postcodeCheckBtn');
  
  if (!collectionBtn || !deliveryBtn) return;
  
  // Initial state - delivery is active by default
  updateDeliveryToggleUI('delivery');
  hiddenDeliveryRadio.checked = true;
  
  // Collection button click
  collectionBtn.addEventListener('click', () => {
    updateDeliveryToggleUI('collection');
    hiddenCollectionRadio.checked = true;
    updateOrderOptionsDisplay();
  });
  
  // Delivery button click  
  deliveryBtn.addEventListener('click', () => {
    updateDeliveryToggleUI('delivery');
    hiddenDeliveryRadio.checked = true;
    updateOrderOptionsDisplay();
  });
  
  // Postcode check button
  if (postcodeCheckBtn && postcodeInput) {
    postcodeCheckBtn.addEventListener('click', () => {
      updateDeliveryFeeDisplay(postcodeInput.value);
    });
    
    // Auto-check postcode on input
    postcodeInput.addEventListener('input', () => {
      if (postcodeInput.value.length >= 5) {
        updateDeliveryFeeDisplay(postcodeInput.value);
      }
    });
  }
  
  // Initial load
  updateOrderOptionsDisplay();
}

// Update delivery toggle UI
function updateDeliveryToggleUI(selectedType) {
  const collectionBtn = document.getElementById('collectionBtn');
  const deliveryBtn = document.getElementById('deliveryBtn');
  
  if (selectedType === 'collection') {
    collectionBtn.classList.add('active');
    deliveryBtn.classList.remove('active');
  } else {
    deliveryBtn.classList.add('active');
    collectionBtn.classList.remove('active');
  }
}

// Update order options display for new layout
function updateOrderOptionsDisplay() {
  const selectedType = document.querySelector('input[name="deliveryType"]:checked')?.value || 'delivery';
  const deliverySection = document.getElementById('deliverySection');
  const timeSelectSection = document.getElementById('timeSelectSection');
  const storeStatus = document.getElementById('storeStatus');
  const orderTime = document.getElementById('orderTime');
  
  // Update time section label based on delivery type
  const timeLabel = timeSelectSection?.querySelector('label[for="orderTime"]');
  if (timeLabel) {
    timeLabel.textContent = selectedType === 'collection' ? 'Collection Time:' : 'Delivery Time:';
  }
  
  const now = new Date();
  const status = getRestaurantStatus(now);
  
  // Show/hide delivery section based on selection
  if (deliverySection) {
    deliverySection.style.display = selectedType === 'delivery' ? 'block' : 'none';
  }
  
  // Update store status
  if (storeStatus) {
    if (!status.isOpen) {
      let statusMessage = status.reason;
      
      if (status.nextOpen) {
        const nextOpen = new Date(status.nextOpen);
        const isToday = nextOpen.toDateString() === now.toDateString();
        const isTomorrow = nextOpen.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
        
        if (isToday) {
          statusMessage += `. Opens today at ${formatTime(status.nextOpen)}`;
        } else if (isTomorrow) {
          statusMessage += `. Opens tomorrow at ${formatTime(status.nextOpen)}`;
        } else {
          statusMessage += `. Next opening: ${formatDateTime(status.nextOpen)}`;
        }
      }
      
      // Check if advance ordering is enabled
      if (config.advanceOrdering.enabled && config.advanceOrdering.allowClosedHourOrders) {
        storeStatus.innerHTML = `
          <span style="color: var(--warning); font-weight: 600;">${statusMessage}</span>
          <br><small style="color: var(--success); font-weight: 500;">Advance ordering available</small>
        `;
        
        // Generate advance time slots
        const advanceTimes = getAdvanceOrderTimes(selectedType);
        if (orderTime) {
          orderTime.innerHTML = '';
          
          if (advanceTimes.length > 0) {
            advanceTimes.forEach(t => {
              const opt = document.createElement('option');
              opt.value = t.toISOString();
              opt.textContent = formatTimeOption(t);
              orderTime.appendChild(opt);
            });
          } else {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No advance slots available';
            opt.disabled = true;
            orderTime.appendChild(opt);
          }
        }
        
      } else {
        // Traditional closed behavior
        storeStatus.innerHTML = `<span style="color: var(--danger); font-weight: 600;">${statusMessage}</span>`;
        if (orderTime) {
          orderTime.innerHTML = '<option disabled>Restaurant closed</option>';
        }
      }
    } else {
      // Restaurant is open
      if (status.reason) {
        storeStatus.innerHTML = `<span style="color: var(--warning); font-weight: 500;">${status.reason}</span>`;
      } else {
        const hoursToday = status.hoursToday;
        let closeTime = hoursToday.close === '00:00' ? 'Midnight' : hoursToday.close;
        storeStatus.innerHTML = `<span style="color: var(--success); font-weight: 500;">Open until ${closeTime}</span>`;
      }
      
      // Generate regular time slots
      const times = getAvailableTimes(selectedType);
      if (orderTime) {
        orderTime.innerHTML = '';
        
        if (times.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.textContent = 'No time slots available today';
          opt.disabled = true;
          orderTime.appendChild(opt);
        } else {
          times.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.toISOString();
            opt.textContent = formatTimeOption(t);
            orderTime.appendChild(opt);
          });
        }
      }
    }
  }
  
  // Update cart display
  updateCart();
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', init);