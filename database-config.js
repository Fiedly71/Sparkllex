/**
 * SPARKLLEX SUPABASE DATABASE CONFIGURATION
 * 
 * This file initializes the Supabase client for real-time database operations.
 * Supabase provides:
 * - Real-time sync for client orders and service requests
 * - Staff agenda and scheduling synchronization
 * - Secure authentication and user management
 * - RESTful API for CRUD operations
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Copy your Project URL and Anon Key from Settings > API
 * 3. Replace the placeholders below with your actual credentials
 * 4. Load Supabase: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 */

// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_CONFIG = {
    // Supabase Project URL
    url: 'https://xpdmvmxdqfnvrzetoxlz.supabase.co',
    
    // Supabase Anon/Public Key
    anonKey: 'sb_publishable_vp3nKradP4s8lK6BHB0Tng_1MYvPvW5'
};

let supabaseClient = null;

/**
 * Initialize Supabase client
 */
function initializeSupabase() {
    try {
        if (typeof supabase === 'undefined') {
            console.warn('Supabase library not loaded. Working in demo mode.');
            return null;
        }
        
        if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_PROJECT_URL' || 
            SUPABASE_CONFIG.anonKey === 'YOUR_SUPABASE_ANON_KEY') {
            console.log('%c DEMO MODE: Supabase not configured. Using mock data.', 'color: #D4AF37; font-weight: bold;');
            return null;
        }
        
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('✓ Supabase client initialized successfully');
        return supabaseClient;
        
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        return null;
    }
}

// ==========================================
// DATABASE OPERATIONS
// ==========================================

/**
 * Fetch all client orders with real-time sync
 */
async function fetchClientOrders() {
    if (!supabaseClient) {
        return getMockOrders();
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return getMockOrders();
    }
}

/**
 * Fetch staff agenda with real-time sync
 */
async function fetchStaffAgenda(staffId = null) {
    if (!supabaseClient) {
        return getMockAgenda();
    }
    
    try {
        let query = supabaseClient
            .from('agenda')
            .select('*')
            .order('scheduled_date', { ascending: true });
        
        if (staffId) {
            query = query.eq('staff_id', staffId);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching agenda:', error);
        return getMockAgenda();
    }
}

/**
 * Subscribe to real-time order updates
 */
function subscribeToOrderUpdates(callback) {
    if (!supabaseClient) {
        console.log('Real-time sync not available in demo mode');
        return null;
    }
    
    const subscription = supabaseClient
        .channel('orders-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'orders' },
            callback
        )
        .subscribe();
    
    return subscription;
}

/**
 * User authentication with Supabase
 */
async function signInWithEmail(email, password) {
    if (!supabaseClient) {
        console.log('Demo mode: Using mock authentication');
        return { user: { email }, session: null, error: null };
    }
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        return { user: data.user, session: data.session, error: null };
    } catch (error) {
        console.error('Sign in error:', error);
        return { user: null, error: error.message };
    }
}

// ==========================================
// MOCK DATA FOR DEMO MODE
// ==========================================

function getMockOrders() {
    return [
        {
            id: '001',
            user_id: 'user-001',
            service_type: 'Limpieza',
            scheduled_date: '2026-01-20T10:00:00',
            address: 'Av. Principal 123, Madrid',
            status: 'In Progress',
            created_at: '2026-01-19T08:00:00'
        },
        {
            id: '002',
            user_id: 'user-002',
            service_type: 'Lavado',
            scheduled_date: '2026-01-20T14:00:00',
            address: 'Calle Serrano 45, Madrid',
            status: 'Pending',
            created_at: '2026-01-19T09:30:00'
        }
    ];
}

function getMockAgenda() {
    return [
        {
            id: 'agenda-001',
            staff_id: 'staff-001',
            order_id: '001',
            scheduled_date: '2026-01-20T10:00:00',
            status: 'Assigned',
            staff_name: 'María García'
        }
    ];
}

// ==========================================
// DATABASE SCHEMA REFERENCE
// ==========================================

/**
 * RECOMMENDED SUPABASE TABLES:
 * 
 * 1. users
 *    - id (uuid, primary key)
 *    - email (text, unique)
 *    - full_name (text)
 *    - phone (text)
 *    - plan (text: 'Básico', 'Pro', 'Familiar')
 *    - member_since (timestamp)
 *    - created_at (timestamp)
 * 
 * 2. orders (ENABLE REAL-TIME)
 *    - id (uuid, primary key)
 *    - user_id (uuid, foreign key)
 *    - service_type (text)
 *    - scheduled_date (timestamp)
 *    - address (text)
 *    - status (text)
 *    - created_at (timestamp)
 * 
 * 3. agenda (ENABLE REAL-TIME)
 *    - id (uuid, primary key)
 *    - staff_id (uuid, foreign key)
 *    - order_id (uuid, foreign key)
 *    - scheduled_date (timestamp)
 *    - status (text)
 *    - created_at (timestamp)
 * 
 * 4. staff
 *    - id (uuid, primary key)
 *    - full_name (text)
 *    - role (text: 'Driver', 'Cleaner', 'Tailor')
 *    - status (text: 'Available', 'On Service', 'Off Duty')
 *    - created_at (timestamp)
 * 
 * ENABLE REAL-TIME IN SUPABASE SQL EDITOR:
 * ALTER PUBLICATION supabase_realtime ADD TABLE orders;
 * ALTER PUBLICATION supabase_realtime ADD TABLE agenda;
 */

// ==========================================
// INITIALIZATION
// ==========================================

initializeSupabase();

console.log('%c SPARKLLEX Supabase Configuration Loaded', 'color: #D4AF37; font-size: 14px; font-weight: bold;');
console.log('%c Ready for real-time sync: Client orders & Staff agenda', 'color: #4CAF50; font-size: 12px;');

// Export for modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG,
        initializeSupabase,
        fetchClientOrders,
        fetchStaffAgenda,
        subscribeToOrderUpdates,
        signInWithEmail
    };
}
