/**
 * Sparkllex - Secure Authentication Guard
 * Prevents unauthorized access and handles session security
 */

// Prevent browser back button access after logout
(function() {
    // Disable caching for protected pages
    if (window.history && window.history.pushState) {
        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', function() {
            window.history.pushState(null, null, window.location.href);
        });
    }
    
    // Add no-cache meta tags dynamically
    const metaCache = document.createElement('meta');
    metaCache.httpEquiv = 'Cache-Control';
    metaCache.content = 'no-cache, no-store, must-revalidate';
    document.head.appendChild(metaCache);
    
    const metaPragma = document.createElement('meta');
    metaPragma.httpEquiv = 'Pragma';
    metaPragma.content = 'no-cache';
    document.head.appendChild(metaPragma);
    
    const metaExpires = document.createElement('meta');
    metaExpires.httpEquiv = 'Expires';
    metaExpires.content = '0';
    document.head.appendChild(metaExpires);
})();

/**
 * Determine required role based on current page path
 */
function getRequiredRole() {
    const path = window.location.pathname.toLowerCase();
    
    // Admin-only pages
    if (path.includes('04_admin_metrics') || 
        path.includes('team-manager') || 
        path.includes('crm-clients')) {
        return 'admin';
    }
    
    // Staff & Admin pages
    if (path.includes('03_operations')) {
        return 'staff'; // staff or admin can access
    }
    
    // Member pages
    if (path.includes('02_members_app')) {
        return 'client'; // any authenticated user
    }
    
    return null; // public page
}

/**
 * Check if user role has access to required role level
 */
function hasAccess(userRole, requiredRole) {
    const roleHierarchy = { admin: 3, staff: 2, client: 1 };
    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    return userLevel >= requiredLevel;
}

/**
 * Main authentication check
 */
async function checkAuth() {
    // Check if Supabase is loaded
    if (typeof supabaseClient === 'undefined') {
        console.error("Supabase not configured");
        return;
    }

    const lang = window.getActiveLanguage ? window.getActiveLanguage() : 'en';
    const loginUrl = "../login.html?lang=" + lang;

    try {
        // Get current session
        const { data: { session }, error } = await supabaseClient.auth.getSession();

        // No session = redirect to login
        if (!session || error) {
            console.warn("No active session. Redirecting to login...");
            window.location.replace(loginUrl);
            return;
        }

        // Get user profile with role
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('role, is_verified')
            .eq('id', session.user.id)
            .single();

        // No profile = account deleted
        if (profileError || !profile) {
            console.warn("Profile not found. Signing out...");
            await supabaseClient.auth.signOut();
            window.location.replace(loginUrl);
            return;
        }

        // Staff not yet approved
        if (profile.role === 'staff' && !profile.is_verified) {
            console.warn("Staff account pending approval");
            await supabaseClient.auth.signOut();
            alert(lang === 'es' ? 'Su cuenta está pendiente de aprobación.' : 'Your account is pending approval.');
            window.location.replace(loginUrl);
            return;
        }

        // Check role access
        const requiredRole = getRequiredRole();
        const userRole = (profile.role || 'client').toLowerCase();

        if (requiredRole && !hasAccess(userRole, requiredRole)) {
            console.warn(`Access denied. User role: ${userRole}, Required: ${requiredRole}`);
            
            // Redirect to appropriate dashboard based on actual role
            let correctDashboard;
            if (userRole === 'admin') {
                correctDashboard = '../03_OPERATIONS/agenda.html';
            } else if (userRole === 'staff') {
                correctDashboard = '../03_OPERATIONS/staff-dashboard.html';
            } else {
                correctDashboard = '../02_MEMBERS_APP/membership-status.html';
            }
            
            alert(lang === 'es' ? 'No tiene acceso a esta sección.' : 'You do not have access to this section.');
            window.location.replace(correctDashboard + '?lang=' + lang);
            return;
        }

        // Success - user is authenticated and authorized
        console.log("Access granted for:", session.user.email, "Role:", userRole);
        
        // Display user name if element exists
        const userNameElement = document.getElementById('user-name-display');
        if (userNameElement) {
            userNameElement.textContent = session.user.user_metadata?.full_name || session.user.email;
        }

        // Store role for other scripts to use
        window.currentUserRole = userRole;
        
    } catch (err) {
        console.error("Auth check failed:", err);
        window.location.replace(loginUrl);
    }
}

/**
 * Secure logout function - clears all session data
 */
async function secureLogout() {
    try {
        // Clear Supabase session
        await supabaseClient.auth.signOut();
        
        // Clear any stored data
        sessionStorage.clear();
        
        // Redirect and prevent back button
        const lang = window.getActiveLanguage ? window.getActiveLanguage() : 'en';
        window.location.replace("../login.html?lang=" + lang);
    } catch (err) {
        console.error("Logout error:", err);
        window.location.replace("../login.html");
    }
}

// Run auth check immediately
checkAuth();