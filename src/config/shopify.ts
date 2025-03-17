
// Get environment variables or use fallback values based on environment
const isProd = import.meta.env.PROD;

// Determine base URL based on environment
const getBaseUrl = () => {
  // In production, use the deployed URL (could be Netlify or other host)
  if (isProd) {
    return import.meta.env.VITE_DEPLOYED_URL || "https://revoa.app";
  }
  // In development, use localhost
  return "http://localhost:5173";
};

export const SHOPIFY_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_SHOPIFY_CLIENT_ID || "21f747d6719351a523236f5481e5a60c",
  CLIENT_SECRET: import.meta.env.VITE_SHOPIFY_CLIENT_SECRET || "8b8630af8cead966607dddb7ab5abee0",
  SCOPES: import.meta.env.VITE_SHOPIFY_SCOPES || "read_products,write_products,read_orders,write_orders",
  REDIRECT_URI: import.meta.env.VITE_SHOPIFY_REDIRECT_URI || `${getBaseUrl()}/auth/callback`,
  APP_URL: import.meta.env.VITE_SHOPIFY_APP_URL || getBaseUrl()
};

// For local development you might want to use a proxy
export const API_PROXY_URL = import.meta.env.VITE_API_PROXY_URL || 
  (import.meta.env.PROD ? undefined : "http://localhost:8080/proxy");

// For debugging purposes
console.log("Shopify Config:", {
  ...SHOPIFY_CONFIG,
  CLIENT_SECRET: SHOPIFY_CONFIG.CLIENT_SECRET ? "[REDACTED]" : undefined,
  ENV: import.meta.env.PROD ? "production" : "development",
  BASE_URL: getBaseUrl()
});
