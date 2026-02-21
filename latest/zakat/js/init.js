// ================= INITIALIZATION =================
import { initSupabase, onAuthStateChange, renderUserProfile, renderLoginButton } from '../../assets/js/auth.js';
import { initSidebar } from '../../assets/js/components/sidebar.js';
import './config.js';
import './api.js';
import './ui.js';
import './calculator.js';
import './reports.js';
import './fiqh.js';
import './history.js';
// 1. Initialize Supabase (Using shared logic)
import './auth.js'; // Critical: Loads Zakat-specific auth logic (handleAuth, uploadData)
const supabaseClient = initSupabase(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
window.supabaseClient = supabaseClient;
window.supabaseInstance = supabaseClient;

// 2. Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Sidebar
    initSidebar('zakat');

    // Initialize Auth System (Shared Sidebar Profile)
    if (supabaseClient) {
        // Initial Check
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) renderUserProfile(session.user);
            else renderLoginButton();
        });

        // Listen for changes
        onAuthStateChange((user) => {
            if (user) renderUserProfile(user);
            else renderLoginButton();
        });
    }

    // Initialize Data (Calculator)
    if (typeof window.initData === 'function') {
        window.initData().then(() => {
            if (typeof window.restoreDraft === 'function') window.restoreDraft();
        });
    }
});

// Save draft before page unload to preserve data
window.addEventListener('beforeunload', function() {
    if (typeof window.saveDraft === 'function') {
        window.saveDraft();
    }
});
