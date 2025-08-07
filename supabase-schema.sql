-- Modern Multi-Tenant Restaurant Ordering System (2025)
-- Supabase Database Schema with Row Level Security (RLS)

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================
-- TENANTS (Restaurant Chains/Franchises)
-- ================================

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'restaurant', -- restaurant, chain, franchise
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    
    -- Business Information
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    tax_id VARCHAR(50),
    
    -- Contact Information
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'United Kingdom',
    
    -- Settings (JSON for flexible configuration)
    settings JSONB DEFAULT '{}',
    
    -- Branding
    logo_url VARCHAR(500),
    brand_colors JSONB DEFAULT '{}',
    
    -- Subscription/Billing
    plan VARCHAR(50) DEFAULT 'free',
    trial_ends_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- RLS for tenants
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- ================================
-- USER_TENANTS (Many-to-Many: Users can belong to multiple tenants)
-- ================================

CREATE TABLE user_tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'customer', -- owner, admin, manager, staff, customer
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    permissions JSONB DEFAULT '[]',
    
    -- Metadata
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    invited_by UUID REFERENCES auth.users(id),
    
    UNIQUE(user_id, tenant_id)
);

-- RLS for user_tenants
ALTER TABLE user_tenants ENABLE ROW LEVEL SECURITY;

-- ================================
-- USER_PROFILES (Extended user information)
-- ================================

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Personal Information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    date_of_birth DATE,
    
    -- Preferences
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Europe/London',
    marketing_consent BOOLEAN DEFAULT FALSE,
    
    -- Authentication Metadata
    auth_method VARCHAR(50), -- magic_link, passkey, oauth_google, oauth_apple
    last_sign_in_at TIMESTAMPTZ,
    sign_in_count INTEGER DEFAULT 0,
    
    -- Address Book (Default addresses)
    default_delivery_address JSONB,
    addresses JSONB DEFAULT '[]',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ================================
-- PASSKEYS (WebAuthn Credentials)
-- ================================

CREATE TABLE user_passkeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- WebAuthn Credential Data
    credential_id BYTEA NOT NULL UNIQUE,
    public_key BYTEA NOT NULL,
    counter BIGINT DEFAULT 0,
    
    -- Metadata
    device_name VARCHAR(255),
    device_type VARCHAR(50), -- platform, cross-platform
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    
    -- Backup Recovery
    backup_eligible BOOLEAN DEFAULT FALSE,
    backup_state VARCHAR(50)
);

-- RLS for user_passkeys
ALTER TABLE user_passkeys ENABLE ROW LEVEL SECURITY;

-- ================================
-- RESTAURANTS (Individual restaurant locations)
-- ================================

CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    cuisine_type VARCHAR(100),
    
    -- Contact Information
    phone VARCHAR(50),
    email VARCHAR(255),
    
    -- Address
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'United Kingdom',
    
    -- Geographic Data
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Operating Information
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, temporarily_closed
    opening_hours JSONB NOT NULL DEFAULT '{}',
    delivery_radius_km DECIMAL(5, 2) DEFAULT 5.0,
    
    -- Delivery Settings
    delivery_zones JSONB DEFAULT '[]',
    minimum_order_amount DECIMAL(10, 2) DEFAULT 15.00,
    delivery_fee DECIMAL(10, 2) DEFAULT 2.50,
    free_delivery_threshold DECIMAL(10, 2),
    
    -- Online Ordering
    online_ordering_enabled BOOLEAN DEFAULT TRUE,
    delivery_enabled BOOLEAN DEFAULT TRUE,
    pickup_enabled BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tenant_id, slug)
);

-- RLS for restaurants
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- ================================
-- MENU CATEGORIES
-- ================================

CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL, -- For RLS
    
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Display Settings
    image_url VARCHAR(500),
    icon VARCHAR(100),
    
    -- Availability
    available_days JSONB DEFAULT '[]', -- ['monday', 'tuesday', ...]
    available_hours JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(restaurant_id, slug)
);

-- RLS for menu_categories
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;

-- ================================
-- MENU ITEMS
-- ================================

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL, -- For RLS
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2), -- For showing discounts
    
    -- Inventory
    is_available BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER,
    track_inventory BOOLEAN DEFAULT FALSE,
    
    -- Dietary Information
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_halal BOOLEAN DEFAULT FALSE,
    allergens JSONB DEFAULT '[]',
    calories INTEGER,
    
    -- Display
    image_url VARCHAR(500),
    images JSONB DEFAULT '[]',
    sort_order INTEGER DEFAULT 0,
    
    -- Customization
    customizations JSONB DEFAULT '[]',
    modifiers JSONB DEFAULT '[]',
    
    -- Availability
    available_days JSONB DEFAULT '[]',
    available_hours JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(restaurant_id, slug)
);

-- RLS for menu_items
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- ================================
-- ORDERS
-- ================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Relationships
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    tenant_id UUID NOT NULL, -- For RLS
    customer_id UUID REFERENCES auth.users(id), -- NULL for guest orders
    
    -- Order Information
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, confirmed, preparing, ready, completed, cancelled
    order_type VARCHAR(20) NOT NULL, -- delivery, pickup
    
    -- Customer Information (for guest orders)
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    
    -- Delivery Information
    delivery_address JSONB,
    delivery_instructions TEXT,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    
    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    
    -- Timing
    estimated_preparation_time INTEGER, -- minutes
    estimated_delivery_time INTEGER, -- minutes
    requested_time TIMESTAMPTZ,
    
    -- Special Instructions
    special_instructions TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- RLS for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ================================
-- ORDER_ITEMS
-- ================================

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL, -- For RLS
    
    -- Item Information
    menu_item_id UUID REFERENCES menu_items(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Pricing
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Customizations
    customizations JSONB DEFAULT '[]',
    modifiers JSONB DEFAULT '[]',
    special_instructions TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ================================
-- PROMOTIONS
-- ================================

CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL, -- For RLS
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50), -- Promo code (optional)
    description TEXT,
    
    -- Promotion Type
    type VARCHAR(50) NOT NULL, -- percentage, fixed_amount, free_item, free_delivery
    
    -- Discount Rules
    discount_value DECIMAL(10, 2),
    minimum_order_amount DECIMAL(10, 2),
    maximum_discount_amount DECIMAL(10, 2),
    
    -- Free Item (if applicable)
    free_item_id UUID REFERENCES menu_items(id),
    
    -- Usage Limits
    usage_limit INTEGER, -- NULL = unlimited
    usage_count INTEGER DEFAULT 0,
    per_customer_limit INTEGER DEFAULT 1,
    
    -- Validity
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    
    -- Conditions
    applicable_days JSONB DEFAULT '[]',
    applicable_hours JSONB DEFAULT '{}',
    new_customers_only BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for promotions
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- ================================
-- ROW LEVEL SECURITY POLICIES
-- ================================

-- Tenants: Users can only see tenants they belong to
CREATE POLICY "Users can view their own tenants" ON tenants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_tenants ut 
            WHERE ut.tenant_id = tenants.id 
            AND ut.user_id = auth.uid()
            AND ut.status = 'active'
        )
    );

-- User Tenants: Users can only see their own relationships
CREATE POLICY "Users can view their own tenant relationships" ON user_tenants
    FOR SELECT USING (user_id = auth.uid());

-- User Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- User Passkeys: Users can only manage their own passkeys
CREATE POLICY "Users can manage their own passkeys" ON user_passkeys
    FOR ALL USING (user_id = auth.uid());

-- Restaurants: Users can see restaurants from their tenants
CREATE POLICY "Users can view restaurants from their tenants" ON restaurants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_tenants ut 
            WHERE ut.tenant_id = restaurants.tenant_id 
            AND ut.user_id = auth.uid()
            AND ut.status = 'active'
        )
    );

-- Menu Categories: Users can see categories from accessible restaurants
CREATE POLICY "Users can view menu categories from accessible restaurants" ON menu_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_tenants ut 
            WHERE ut.tenant_id = menu_categories.tenant_id 
            AND ut.user_id = auth.uid()
            AND ut.status = 'active'
        )
        OR EXISTS (
            SELECT 1 FROM restaurants r 
            WHERE r.id = menu_categories.restaurant_id 
            AND r.status = 'active'
        )
    );

-- Menu Items: Public read access for active items
CREATE POLICY "Public can view active menu items" ON menu_items
    FOR SELECT USING (
        is_available = true
        AND EXISTS (
            SELECT 1 FROM restaurants r 
            WHERE r.id = menu_items.restaurant_id 
            AND r.status = 'active'
            AND r.online_ordering_enabled = true
        )
    );

-- Orders: Users can see their own orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (
        customer_id = auth.uid()
        OR customer_id IS NULL -- Guest orders (handled by application logic)
    );

CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (
        customer_id = auth.uid()
        OR customer_id IS NULL -- Guest orders
    );

-- Order Items: Users can see items from their orders
CREATE POLICY "Users can view items from their orders" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders o 
            WHERE o.id = order_items.order_id 
            AND (o.customer_id = auth.uid() OR o.customer_id IS NULL)
        )
    );

-- Promotions: Public read access for active promotions
CREATE POLICY "Public can view active promotions" ON promotions
    FOR SELECT USING (
        is_active = true
        AND (valid_from IS NULL OR valid_from <= NOW())
        AND (valid_until IS NULL OR valid_until >= NOW())
        AND EXISTS (
            SELECT 1 FROM restaurants r 
            WHERE r.id = promotions.restaurant_id 
            AND r.status = 'active'
        )
    );

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- Tenants
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_status ON tenants(status);

-- User Tenants
CREATE INDEX idx_user_tenants_user_id ON user_tenants(user_id);
CREATE INDEX idx_user_tenants_tenant_id ON user_tenants(tenant_id);
CREATE INDEX idx_user_tenants_status ON user_tenants(status);

-- User Passkeys
CREATE INDEX idx_user_passkeys_user_id ON user_passkeys(user_id);
CREATE INDEX idx_user_passkeys_credential_id ON user_passkeys(credential_id);

-- Restaurants
CREATE INDEX idx_restaurants_tenant_id ON restaurants(tenant_id);
CREATE INDEX idx_restaurants_status ON restaurants(status);
CREATE INDEX idx_restaurants_postal_code ON restaurants(postal_code);
CREATE INDEX idx_restaurants_location ON restaurants USING GIST(
    POINT(longitude, latitude)
);

-- Menu Items
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_availability ON menu_items(is_available);
CREATE INDEX idx_menu_items_tenant_id ON menu_items(tenant_id);

-- Orders
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);

-- Order Items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);

-- ================================
-- FUNCTIONS AND TRIGGERS
-- ================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'ORD-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || 
                           LPAD((RANDOM() * 999)::INT::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================
-- SAMPLE DATA FOR TESTING
-- ================================

-- Insert sample tenant
INSERT INTO tenants (id, name, slug, business_name, email, plan) VALUES 
(uuid_generate_v4(), 'Golden Fish Group', 'golden-fish', 'Golden Fish Restaurant Group Ltd', 'admin@goldenfish.co.uk', 'premium');

-- The rest of sample data would be inserted after tenant creation...