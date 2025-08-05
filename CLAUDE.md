# Golden Fish - Multi-Restaurant Ordering System

## Project Overview
This project is a comprehensive Chinese takeaway ordering system that reverse engineers mayfairchinesefood.co.uk functionality while building a scalable multi-restaurant platform.

## Current Status
- Basic static website with menu system (Golden Fish)
- JavaScript-based cart functionality
- Delivery/collection options with postcode validation
- Modal-based item customization

## Target Features to Implement

### Core Ordering System
- Advanced menu system with customizable options (e.g., Special Curry with rice/chip choices)
- Flexible delivery pricing (by mile or postcode zones)
- Complete checkout and payment processing
- Opening hours management with ordering restrictions

### Multi-Restaurant Architecture
- Template-based restaurant site generation
- AI-powered menu processing from PDFs/images
- Dynamic branding and theming system
- Centralized order management

### Backend Services
- Email notifications via Resend
- Server-side order management API
- Restaurant order alert software with sound/printing
- Database integration for orders and configurations

### Delivery Pricing Examples
- Postcode-based: YO10 = £2.50, YO10 3 = £3.00
- Distance-based: Using third-party APIs for address-to-shop calculations
- Configurable by restaurant owners

### Menu Customization Example
**Special Curry (招牌咖喱)**
- Boiled Rice (+£0.50)
- Chips (+£1.00)
- Salt & Pepper Chips (+£2.00)
- Fried Rice (+£2.50)
- Soft Noodles (+£2.80)
- Crispy Noodles (+£3.00)

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js/Express (to be implemented)
- **Database**: Redis (Railway) + additional storage
- **Email**: Resend API
- **Hosting**: Vercel
- **Version Control**: GitHub
- **Payment**: TBD (Stripe/PayPal integration)

## Development Commands
- `npm run dev` - Start development server (to be configured)
- `npm run build` - Build production version
- `npm run lint` - Run code linting
- `npm test` - Run test suite

## File Structure
```
/
├── assets/                 # Static assets (images, logos)
├── src/                   # Source code (to be organized)
│   ├── components/        # Reusable UI components
│   ├── utils/            # Utility functions
│   ├── api/              # API integration
│   └── config/           # Configuration files
├── server/               # Backend services (to be created)
├── restaurant-app/       # Order alert software (to be created)
├── admin/               # Restaurant management interface
└── templates/           # Multi-restaurant templates

Current files:
├── index.html           # Homepage
├── menu.html           # Menu/ordering page
├── checkout.html       # Checkout page
├── script.js           # Main JavaScript functionality
└── style.css           # Styles
```

## Integration Requirements
- **GitHub**: Repository management and CI/CD
- **Vercel**: Frontend hosting and serverless functions
- **Railway Redis**: Session storage and caching
- **Third-party Distance APIs**: Google Maps/MapBox for delivery calculations

## Key Configuration
- Restaurant details (name, address, postcode, hours)
- Delivery zones and pricing rules
- Menu structure and customization options
- Email templates and notification settings
- Multi-tenant restaurant management

## Development Phases
1. **Phase 1**: Enhanced frontend matching target site
2. **Phase 2**: Backend API and database setup
3. **Phase 3**: Multi-restaurant architecture
4. **Phase 4**: AI menu processing system
5. **Phase 5**: Restaurant order alert software
6. **Phase 6**: Advanced features and optimizations

## Notes for Development
- Keep code modular for multi-restaurant scalability
- Implement comprehensive error handling and validation
- Focus on responsive design for mobile users
- Ensure secure handling of customer data and payments
- Build with internationalization in mind (Chinese/English)

## Target Site Analysis
Reference: mayfairchinesefood.co.uk
- Single-page responsive design
- jQuery-based cart management
- Postcode validation system
- Modal customization dialogs
- Payment integration
- Opening hours restrictions