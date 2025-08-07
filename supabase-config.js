/**
 * Supabase Configuration and Setup Instructions
 * Modern Multi-Tenant Restaurant Ordering System (2025)
 */

// ================================
// SUPABASE PROJECT SETUP GUIDE
// ================================

/*
FRONTEND CONFIGURATION ONLY
This handles user authentication UI and tokens.
All business logic is handled by the backend API.

Architecture:
- Frontend: Supabase Auth (UI only)
- Backend: Railway API + Supabase Database
- Data Flow: Frontend → Railway Backend → Supabase DB
*/

// ================================
// PRODUCTION CONFIGURATION
// ================================

// Replace these with your actual Supabase project credentials
const SUPABASE_CONFIG = {
    url: 'https://cyitrtjkoqxkolvtsydx.supabase.co', // Your Supabase project URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aXRydGprb3F4a29sdnRzeWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzMxMDIsImV4cCI6MjA3MDEwOTEwMn0.3t6mSgDMEj70C40mXuL4C0OxPvntbf-pPAcav9aLU6M', // Your Supabase anon key
    
    // Auth configuration
    auth: {
        // Enable magic link authentication
        magicLink: true,
        
        // OAuth providers (enable as needed)
        providers: {
            google: true,
            apple: false, // Enable when Apple credentials are configured
        },
        
        // WebAuthn/Passkey settings
        webAuthn: {
            enabled: true,
            rpName: 'Golden Fish Restaurant',
            rpId: window?.location?.hostname || 'test-ordering-page.vercel.app',
        },
        
        // Session configuration
        session: {
            persistSession: true,
            autoRefreshToken: true,
        }
    },
    
    // Multi-tenant configuration
    multiTenant: {
        defaultTenantId: null, // Set if you have a default tenant
        tenantHeader: 'x-tenant-id', // Custom header for tenant identification
        enforceRLS: true, // Always true for production
    },
    
    // Feature flags
    features: {
        guestCheckout: true,
        socialAuth: true,
        passkeys: true,
        multiTenant: true,
        analytics: true,
    }
};

// ================================
// SUPABASE CLIENT INITIALIZATION
// ================================

class SupabaseManager {
    constructor(config = SUPABASE_CONFIG) {
        this.config = config;
        this.client = null;
        this.currentTenant = null;
        this.init();
    }

    async init() {
        // Simplified Supabase client initialization - minimal config
        if (typeof window !== 'undefined' && window.supabase) {
            this.client = window.supabase.createClient(
                this.config.url,
                this.config.anonKey,
                {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true
                        // Removed complex PKCE configuration that might cause issues
                    }
                }
            );

            console.log('✅ Supabase client initialized (simplified)');
            // Removed complex auth setup that depends on database tables
        } else {
            console.error('❌ Supabase library not loaded');
        }
    }

    async setupAuth() {
        if (!this.client) return;

        // Listen for auth state changes
        this.client.auth.onAuthStateChange(async (event, session) => {
            console.log('🔐 Auth state changed:', event);
            
            switch (event) {
                case 'SIGNED_IN':
                    await this.handleSignIn(session);
                    break;
                case 'SIGNED_OUT':
                    await this.handleSignOut();
                    break;
                case 'TOKEN_REFRESHED':
                    console.log('🔄 Token refreshed');
                    break;
                case 'USER_UPDATED':
                    console.log('👤 User profile updated');
                    break;
                case 'PASSWORD_RECOVERY':
                    console.log('🔑 Password recovery initiated');
                    break;
            }
        });

        // Check for existing session
        const { data: { session } } = await this.client.auth.getSession();
        if (session) {
            await this.handleSignIn(session);
        }
    }

    async handleSignIn(session) {
        const user = session.user;
        console.log('✅ User signed in:', user.email);

        // Simplified user handling - just store in localStorage
        localStorage.setItem('auth_user', JSON.stringify({
            id: user.id,
            email: user.email,
            signed_in_at: new Date().toISOString()
        }));

        // Set default tenant for single restaurant
        this.currentTenant = {
            id: 'golden-fish-default',
            name: 'Golden Fish',
            slug: 'golden-fish',
            type: 'restaurant'
        };

        // Update UI
        this.updateAuthUI(true, user);
    }

    async handleSignOut() {
        console.log('👋 User signed out');
        this.currentTenant = null;
        localStorage.removeItem('current_tenant_id');
        this.updateAuthUI(false, null);
    }

    async ensureUserProfile(user) {
        // Simplified profile handling - just log the user info
        // Database table creation will be handled by backend API
        console.log('✅ User signed in:', {
            id: user.id,
            email: user.email,
            auth_method: this.getAuthMethod(user)
        });
        
        // Store user info in localStorage for frontend use
        localStorage.setItem('auth_user', JSON.stringify({
            id: user.id,
            email: user.email,
            auth_method: this.getAuthMethod(user),
            signed_in_at: new Date().toISOString()
        }));
    }

    async loadUserTenants(userId) {
        // Simplified tenant loading - use default Golden Fish tenant
        console.log('🏢 Setting default tenant for user:', userId);
        
        // Set default Golden Fish tenant for single restaurant
        this.currentTenant = {
            id: 'golden-fish-default',
            name: 'Golden Fish',
            slug: 'golden-fish',
            type: 'restaurant'
        };
        
        localStorage.setItem('current_tenant_id', this.currentTenant.id);
        console.log('✅ Default tenant set:', this.currentTenant.name);
    }

    getAuthMethod(user) {
        const provider = user.app_metadata?.provider;
        switch (provider) {
            case 'google': return 'oauth_google';
            case 'apple': return 'oauth_apple';
            case 'email': return 'magic_link';
            default: return 'unknown';
        }
    }

    updateAuthUI(isSignedIn, user) {
        // This will be implemented in the main auth system
        if (window.modernAuth && window.modernAuth.updateUI) {
            window.modernAuth.updateUI(isSignedIn, user);
        }
    }

    // Utility method to get client with tenant context
    getClient(tenantId = null) {
        if (!this.client) return null;

        const tenant = tenantId || this.currentTenant?.id;
        if (tenant) {
            // Add tenant header for RLS
            return {
                ...this.client,
                rest: {
                    ...this.client.rest,
                    headers: {
                        ...this.client.rest.headers,
                        [this.config.multiTenant.tenantHeader]: tenant
                    }
                }
            };
        }

        return this.client;
    }

    // Public getters
    get isReady() { return !!this.client; }
    get user() { return this.client?.auth?.user; }
    get tenant() { return this.currentTenant; }
}

// ================================
// ENVIRONMENT-SPECIFIC CONFIGS
// ================================

const ENVIRONMENTS = {
    development: {
        ...SUPABASE_CONFIG,
        url: 'http://localhost:54321', // Local Supabase
        redirectUrls: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5500', // Live Server
        ]
    },
    
    staging: {
        ...SUPABASE_CONFIG,
        redirectUrls: [
            'https://test-ordering-page.vercel.app',
            'https://staging-golden-fish.vercel.app'
        ]
    },
    
    production: {
        ...SUPABASE_CONFIG,
        redirectUrls: [
            'https://test-ordering-page.vercel.app',
            'https://goldenfish.co.uk',
            'https://www.goldenfish.co.uk'
        ],
        features: {
            ...SUPABASE_CONFIG.features,
            analytics: true,
            monitoring: true
        }
    }
};

// Auto-detect environment
function getEnvironmentConfig() {
    const hostname = window?.location?.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return ENVIRONMENTS.development;
    } else if (hostname.includes('test-') || hostname.includes('staging')) {
        return ENVIRONMENTS.staging;
    } else {
        return ENVIRONMENTS.production;
    }
}

// ================================
// EXPORT CONFIGURATION
// ================================

// Use environment-specific config
const currentConfig = getEnvironmentConfig();

// Global Supabase manager instance
window.supabaseManager = new SupabaseManager(currentConfig);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SupabaseManager,
        SUPABASE_CONFIG: currentConfig,
        ENVIRONMENTS
    };
}

// ================================
// SETUP VERIFICATION
// ================================

/**
 * Run this function to verify your Supabase setup
 */
async function verifySupabaseSetup() {
    const manager = window.supabaseManager;
    
    console.group('🔍 Supabase Setup Verification');
    
    try {
        // Test 1: Client initialization
        console.log('1. Client initialization:', manager.isReady ? '✅' : '❌');
        
        // Test 2: Database connection
        const { data, error } = await manager.client
            .from('tenants')
            .select('count')
            .limit(1);
        
        console.log('2. Database connection:', error ? '❌' : '✅');
        if (error) console.error('   Error:', error.message);
        
        // Test 3: Authentication configuration
        const authConfig = manager.client.auth;
        console.log('3. Auth configuration:', authConfig ? '✅' : '❌');
        
        // Test 4: RLS policies
        console.log('4. RLS policies: Run manual test after authentication');
        
        console.log('\n🎉 Supabase setup verification complete!');
        
    } catch (error) {
        console.error('❌ Setup verification failed:', error);
    }
    
    console.groupEnd();
}

// Auto-verify setup in development
if (currentConfig === ENVIRONMENTS.development) {
    setTimeout(verifySupabaseSetup, 2000);
}

// Make verification available globally
window.verifySupabaseSetup = verifySupabaseSetup;

console.log('🚀 Supabase configuration loaded. Environment:', 
    currentConfig === ENVIRONMENTS.development ? 'Development' :
    currentConfig === ENVIRONMENTS.staging ? 'Staging' : 'Production'
);