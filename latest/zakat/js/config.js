// ================= CONFIGURATION =================
// API Keys & Constants
window.SUPABASE_URL = 'https://kstknnfyesrthyjlrlle.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdGtubmZ5ZXNydGh5amxybGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NzUyMDksImV4cCI6MjA3OTQ1MTIwOX0.PQRPsv0l9-b7wwwKnnHBJGY6PO0JarcVpihULMOhAeE';
window.STORAGE_KEY = 'zakat_app_data_v1';

// Global Variables
window.basePrices = { gold: 0, silver: 0, sheep: 0, cow: 0, camel: 0, fitr: 0, wheat: 0, rice: 0 };
window.globalConfig = { currency: 'EGP', symbol: 'ج.م', rate: 1 };
window.nisabThreshold = 0;
window.zakatRate = 0.025;
window.liveCryptoPrices = { BTC: 0, ETH: 0, USDT: 0, BNB: 0, SOL: 0 };
window.cashInputRate = 1;
window.visitorId = "unknown_device";
window.reportData = null; // Store report data globally