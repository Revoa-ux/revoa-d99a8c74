
export const SHOPIFY_CONFIG = {
  CLIENT_ID: "21f747d6719351a523236f5481e5a60c",
  CLIENT_SECRET: "8b8630af8cead966607dddb7ab5abee0",
  SCOPES: "read_products,write_products,read_orders,write_orders",
  REDIRECT_URI: "https://my.revoa.app/auth/callback",
  APP_URL: "https://my.revoa.app"
};

// For local development you might want to use a proxy
export const API_PROXY_URL = import.meta.env.PROD 
  ? undefined 
  : "http://localhost:8080/proxy";
