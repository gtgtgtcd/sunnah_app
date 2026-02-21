import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ==========================================
// ✅ AUTH CONFIGURATION
// ==========================================
const SUPABASE_URL = 'https://kstknnfyesrthyjlrlle.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdGtubmZ5ZXNydGh5amxybGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NzUyMDksImV4cCI6MjA3OTQ1MTIwOX0.PQRPsv0l9-b7wwwKnnHBJGY6PO0JarcVpihULMOhAeE';

let supabaseClient = null;

export function initSupabase(url, key) {
    if (!supabaseClient) {
        supabaseClient = createClient(url, key);
    }
    return supabaseClient;
}

export function getSupabase() {
    if (!supabaseClient) {
        console.error("Supabase not initialized! Call initSupabase() first.");
    }
    return supabaseClient;
}

// ==========================================
// ✅ AUTH LOGIC
// ==========================================

// 1. تسجيل الدخول باستخدام Google (النسخة المعدلة لدعم الأندرويد)
export async function loginWithGoogle(redirectTo = window.location.href) {
    if (!supabaseClient) return;

    // لو إحنا فاتحين من الأندرويد، اطلب الشريط السفلي
    if (window.Android && window.Android.triggerGoogleSignIn) {
        window.Android.triggerGoogleSignIn();
        return;
    }

    // لو فاتحين من متصفح عادي، استخدم الطريقة العادية
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectTo }
    });

    if (error) {
        alert("خطأ في التسجيل: " + error.message);
        console.error(error);
    }
}

// الدالة دي الأندرويد هينادي عليها لما المستخدم يختار حسابه من الشريط
window.handleAndroidGoogleLogin = async function(idToken) {
    if (!supabaseClient) return;
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
        });
        
        if (error) {
            alert("خطأ في تسجيل الدخول: " + error.message);
        } else {
            // ريفرش للصفحة عشان البروفايل يظهر
            window.location.reload();
        }
    } catch (err) {
        console.error(err);
    }
};

// 2. تسجيل الخروج
export async function logout() {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.error('Error logging out:', error);
    else {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.location.replace(cleanUrl);
    }
}

// 3. الحصول على المستخدم الحالي
export async function getCurrentUser() {
    if (!supabaseClient) return null;
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session?.user || null;
}

// 4. مراقبة حالة المصادقة (Listener)
export function onAuthStateChange(callback) {
    if (!supabaseClient) return;
    return supabaseClient.auth.onAuthStateChange((_event, session) => {
        callback(session?.user || null);
    });
}

// 5. تحديث بيانات المستخدم
export async function updateUserProfile(updates) {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient.auth.updateUser({
        data: updates
    });

    if (error) {
        console.error('Error updating profile:', error);
        alert('حدث خطأ أثناء تحديث البيانات: ' + error.message);
        return null;
    }
    return data.user;
}

// ==========================================
// ✅ UI HELPERS (SIDEBAR PROFILE)
// ==========================================

export function renderUserProfile(user, containerId = 'sidebarProfile') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const fullName = user.user_metadata.full_name || user.email.split('@')[0];
    const avatarUrl = user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;

    container.innerHTML = `
        <img src="${avatarUrl}" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--primary); object-fit: cover; background-color: #333; display: block;">
        <div style="display: flex; flex-direction: column; justify-content: center;">
            <h4 style="color: #fff; font-size: 14px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;">${fullName}</h4>
            <p style="color: #4ff0b7; font-size: 11px; margin: 0; display:flex; align-items:center; gap:4px;">
                <i class="fas fa-check-circle"></i> حساب موثق
            </p>
        </div>
        <button onclick="window.logoutApp()" style="background:none; border:none; color:#ef4444; cursor:pointer; margin-right:auto;" title="تسجيل خروج">
            <i class="fas fa-sign-out-alt"></i>
        </button>
    `;

    window.logoutApp = logout;
}

export function renderLoginButton(containerId = 'sidebarProfile') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div style="width: 100%; padding: 5px;">
            <button onclick="window.loginApp()" style="width: 100%; background: rgba(255, 255, 255, 0.05); color: var(--primary); border: 1px solid var(--primary); padding: 10px; border-radius: 12px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s;">
                <i class="fas fa-sign-in-alt"></i> <span>تسجيل الدخول</span>
            </button>
        </div>
    `;

    window.loginApp = loginWithGoogle;
}