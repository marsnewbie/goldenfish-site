# Golden Fish - Multi-Restaurant Ordering System

## Project Overview
This project is a comprehensive Chinese takeaway ordering system that reverse engineers mayfairchinesefood.co.uk functionality while building a scalable multi-restaurant platform.

## Repository & Deployment
- **GitHub Repository**: https://github.com/marsnewbie/goldenfish-site
- **Vercel Deploy Hook**: https://api.vercel.com/v1/integrations/deploy/prj_uQ71O2CTm227NMSsddXA0nk8Ur2k/hwlkcOX50j
- **Live Site**: Deployed via Vercel (auto-deploy from main branch)

## Current Status ✅ PHASE 1 COMPLETE
- **Industry-standard homepage** following Uber Eats/DoorDash/Just Eat best practices
- **Professional menu system** with three-column layout (categories, menu, cart)
- **Complete ordering flow** with delivery/collection validation
- **Advanced checkout system** with guest/login/register options
- **Comprehensive UK phone validation** following industry standards
- **Promotional system** with amount/percentage/free item support
- **Opening hours management** with advance ordering capabilities
- **Postcode-based delivery** with flexible pricing zones

## Recently Completed Features

### Homepage Redesign (Industry Standard)
- Modern navigation with brand identity
- Hero section with trust indicators and CTAs
- Featured items showcase with badges and hover effects
- Promotional sections with gradient backgrounds
- Step-by-step ordering process explanation
- Professional footer with comprehensive information
- Simplified trust indicators (removed excessive details)

### Menu System Enhancements
- Removed promotions from menu page (homepage only)
- Fixed free item logic - shows as added items without reducing subtotal
- Enhanced delivery/collection validation before checkout
- Comprehensive postcode validation with error handling
- Industry-standard cart design with proper space allocation

### Checkout Flow Improvements
- Fixed UK phone number validation with proper patterns
- Added account options: Guest Checkout / Sign In / Create Account
- Professional form validation and user feedback
- Enhanced delivery type verification and error messages
- Updated section numbering and improved form flow

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js/Express (to be implemented)
- **Database**: Redis (Railway) + additional storage
- **Email**: Resend API
- **Hosting**: Vercel
- **Version Control**: GitHub
- **Payment**: TBD (Stripe/PayPal integration)

## Current File Structure
```
/
├── index.html              # Modern homepage with industry UX
├── menu.html              # Professional menu with cart system
├── checkout.html          # Enhanced checkout with account options
├── script.js              # Complete ordering system logic
├── style.css              # Comprehensive styling (1800+ lines)
├── assets/
│   └── fish_and_chips.jpg # Main brand image
└── .claude/
    └── settings.local.json # Claude configuration
```

## Key Features Implemented

### Promotional System
```javascript
promotions: {
  enabled: true,
  rules: [
    {
      id: 'amount_off_20',
      type: 'amount_off',
      name: '£5 off orders over £20',
      minAmount: 20.00,
      discount: 5.00
    },
    {
      id: 'free_item_25', 
      type: 'free_item',
      name: 'Free Prawn Crackers over £25',
      minAmount: 25.00,
      freeItem: { name: 'Prawn Crackers', price: 1.50 }
    }
  ]
}
```

### Delivery Pricing System
- Postcode-based zones (YO10 = £2.50, YO10 3 = £3.00)
- Real-time validation and fee calculation
- Support for distance-based pricing (future)
- Configurable minimum order amounts

### Opening Hours Management
```javascript
openingHours: {
  monday: { open: null, close: null }, // Closed
  tuesday: { open: '17:00', close: '23:00' },
  // ... advanced scheduling with holiday support
}
```

## Next Phase Priorities

### Phase 2: Backend Development
1. **Server-side order management system**
2. **Database structure for orders, restaurants, configurations**
3. **User registration/login system with order history**
4. **Email notifications using Resend**
5. **Payment processing integration**

### Phase 3: Multi-Restaurant Architecture
1. **Template-based restaurant site generation**
2. **AI-powered menu processing from PDFs/images**
3. **Centralized admin dashboard**
4. **Order alert software integration**

## Development Commands
```bash
# Deployment
git add . && git commit -m "message" && git push origin main
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_uQ71O2CTm227NMSsddXA0nk8Ur2k/hwlkcOX50j"

# Future commands (to be configured)
npm run dev          # Development server
npm run build        # Production build  
npm run lint         # Code linting
npm test            # Test suite
```

## Integration Requirements
- **GitHub**: Repository management and CI/CD ✅
- **Vercel**: Frontend hosting and serverless functions ✅
- **Railway Redis**: Session storage and caching (pending)
- **Third-party APIs**: Google Maps/MapBox for delivery (pending)
- **Payment Gateway**: Stripe/PayPal integration (pending)
- **Email Service**: Resend API (pending)

## Key Configuration
- Restaurant details (name, address, postcode, hours) ✅
- Delivery zones and pricing rules ✅
- Menu structure and customization options ✅
- Promotional discount system ✅
- Email templates and notification settings (pending)
- Multi-tenant restaurant management (pending)

## Notes for Development
- Code is modular and scalable for multi-restaurant use
- Comprehensive error handling and validation implemented
- Responsive design optimized for mobile users
- Ready for secure payment and customer data handling
- Internationalization support built-in (Chinese/English)
- Industry best practices followed throughout

## Target Site Analysis Reference
**mayfairchinesefood.co.uk** - Successfully reverse engineered:
- ✅ Responsive design patterns
- ✅ Cart management system  
- ✅ Postcode validation
- ✅ Modal customization dialogs
- ✅ Opening hours restrictions
- ⏳ Payment integration (Phase 2)
- ⏳ Order management backend (Phase 2)