/**
 * Supabase Configuration and Setup Instructions
 * Modern Multi-Tenant Restaurant Ordering System (2025)
 */

// ================================
// SUPABASE PROJECT SETUP GUIDE
// ================================

/*
STEP 1: Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose organization: Create new or select existing
4. Project name: "Golden Fish Ordering System"
5. Database password: Generate strong password
6. Region: Choose closest to your users (e.g., "West Europe")
7. Pricing plan: Start with Free tier (100K MAU included)

STEP 2: Configure Authentication
1. Go to Authentication > Settings
2. Enable "Email" provider (for magic links)
3. Configure "Site URL": https://test-ordering-page.vercel.app
4. Add "Redirect URLs":
   - https://test-ordering-page.vercel.app/
   - https://test-ordering-page.vercel.app/checkout.html
   - https://test-ordering-page.vercel.app/menu.html
   - http://localhost:3000 (for development)

STEP 3: Enable Social OAuth (Optional)
1. Go to Authentication > Providers
2. Enable "Google":
   - Get credentials from Google Cloud Console
   - Add authorized origins: https://test-ordering-page.vercel.app
3. Enable "Apple" (if needed):
   - Configure Apple Developer account credentials

STEP 4: Set Up Database Schema
1. Go to SQL Editor
2. Run the schema from supabase-schema.sql
3. Verify all tables are created with proper RLS policies

STEP 5: Configure Row Level Security
1. Ensure RLS is enabled for all tables
2. Test policies with different user roles
3. Verify tenant isolation works correctly

STEP 6: Get Project Credentials
1. Go to Settings > API
2. Copy "Project URL" and "anon public" key
3. Update the configuration below
*/

// ================================
// PRODUCTION CONFIGURATION
// ================================

// Replace these with your actual Supabase project credentials
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL', // e.g., 'https://xyzcompany.supabase.co'
    anonKey: 'YOUR_SUPABASE_ANON_KEY', // Your project's anonymous key
    
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
        // Initialize Supabase client
        if (typeof window !== 'undefined' && window.supabase) {
            this.client = window.supabase.createClient(
                this.config.url,
                this.config.anonKey,
                {
                    auth: {
                        persistSession: this.config.auth.session.persistSession,
                        autoRefreshToken: this.config.auth.session.autoRefreshToken,
                        detectSessionInUrl: true,
                        flowType: 'pkce' // OAuth 2.1 with PKCE for security
                    },
                    global: {
                        headers: {
                            'X-Client-Info': 'golden-fish-ordering@1.0.0'
                        }
                    }
                }
            );

            console.log('✅ Supabase client initialized');
            await this.setupAuth();
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

        // Load or create user profile
        await this.ensureUserProfile(user);

        // Load user's tenants
        await this.loadUserTenants(user.id);

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
        const { data: profile, error } = await this.client
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { data: newProfile, error: createError } = await this.client
                .from('user_profiles')
                .insert({
                    id: user.id,
                    first_name: user.user_metadata?.first_name,
                    last_name: user.user_metadata?.last_name,
                    auth_method: this.getAuthMethod(user),
                    last_sign_in_at: new Date().toISOString(),
                    sign_in_count: 1
                })
                .select()
                .single();

            if (createError) {
                console.error('❌ Error creating user profile:', createError);
            } else {
                console.log('✅ User profile created:', newProfile);
            }
        } else if (!error) {
            // Update existing profile
            await this.client
                .from('user_profiles')
                .update({
                    last_sign_in_at: new Date().toISOString(),
                    sign_in_count: profile.sign_in_count + 1
                })
                .eq('id', user.id);
        }
    }

    async loadUserTenants(userId) {
        const { data: userTenants, error } = await this.client
            .from('user_tenants')
            .select(`
                tenant_id,
                role,
                tenants (
                    id,
                    name,
                    slug,
                    type,
                    settings
                )
            `)
            .eq('user_id', userId)
            .eq('status', 'active');

        if (error) {
            console.error('❌ Error loading user tenants:', error);
            return;
        }

        if (userTenants && userTenants.length > 0) {
            // Set default tenant (first one or from localStorage)
            const savedTenantId = localStorage.getItem('current_tenant_id');
            const defaultTenant = userTenants.find(ut => ut.tenant_id === savedTenantId) || userTenants[0];
            
            this.currentTenant = defaultTenant.tenants;
            console.log('🏢 Current tenant:', this.currentTenant.name);
        }
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