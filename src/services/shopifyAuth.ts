
import { SHOPIFY_CONFIG, API_PROXY_URL } from "../config/shopify";

// Utility for handling local storage
const SHOPIFY_STORAGE_KEY = "shopify_auth";

interface ShopifyAuthData {
  shop: string;
  accessToken: string;
  scope: string;
  timestamp: number; // Store when the token was obtained
}

export const saveShopifyAuth = (data: ShopifyAuthData): void => {
  localStorage.setItem(SHOPIFY_STORAGE_KEY, JSON.stringify(data));
};

export const getShopifyAuth = (): ShopifyAuthData | null => {
  const data = localStorage.getItem(SHOPIFY_STORAGE_KEY);
  if (!data) return null;
  return JSON.parse(data);
};

export const clearShopifyAuth = (): void => {
  localStorage.removeItem(SHOPIFY_STORAGE_KEY);
};

// Check if token is valid (simplified - in a real app you'd check with Shopify API)
export const isTokenValid = (): boolean => {
  const auth = getShopifyAuth();
  if (!auth) return false;
  
  // Check if token is less than 24 hours old
  const now = Date.now();
  const tokenAge = now - auth.timestamp;
  const ONE_DAY = 24 * 60 * 60 * 1000;
  
  return tokenAge < ONE_DAY;
};

// Generate authorization URL
export const generateAuthUrl = (shop: string): string => {
  if (!shop) throw new Error("Shop URL is required");
  
  // Normalize the shop URL
  let shopUrl = shop.trim().toLowerCase();
  
  // Remove protocol if present
  shopUrl = shopUrl.replace(/^https?:\/\//, "");
  
  // Add .myshopify.com if not present and doesn't already have a TLD
  if (!shopUrl.includes(".")) {
    shopUrl = `${shopUrl}.myshopify.com`;
  }
  
  // Ensure we don't have any trailing slashes that could cause issues
  shopUrl = shopUrl.replace(/\/+$/, "");
  
  // Validate the shopUrl format before proceeding
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shopUrl)) {
    throw new Error("Invalid Shopify store URL format. Expected format: yourstore.myshopify.com");
  }
  
  console.log(`Generating auth URL for shop: ${shopUrl}`);
  console.log(`Using redirect URI: ${SHOPIFY_CONFIG.REDIRECT_URI}`);
  
  // Build the authorization URL with the correctly formatted shop URL
  const params = new URLSearchParams({
    client_id: SHOPIFY_CONFIG.CLIENT_ID,
    scope: SHOPIFY_CONFIG.SCOPES,
    redirect_uri: SHOPIFY_CONFIG.REDIRECT_URI,
    state: generateRandomState(),
    shop: shopUrl,
  });
  
  const authUrl = `https://${shopUrl}/admin/oauth/authorize?${params.toString()}`;
  console.log(`Auth URL: ${authUrl}`);
  return authUrl;
};

// Generate a random state value for CSRF protection
const generateRandomState = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (
  code: string, 
  shop: string
): Promise<{ accessToken: string; scope: string }> => {
  if (!shop) throw new Error("Shop parameter is required");
  
  // Normalize and validate the shop URL
  let shopUrl = shop.trim().toLowerCase();
  shopUrl = shopUrl.replace(/^https?:\/\//, "");
  shopUrl = shopUrl.replace(/\/+$/, "");
  
  let url = `https://${shopUrl}/admin/oauth/access_token`;
  
  // If in development, use the proxy
  if (API_PROXY_URL) {
    url = `${API_PROXY_URL}/access_token`;
    console.log(`Using proxy URL for token exchange: ${url}`);
  }
  
  try {
    console.log(`Exchanging code for token with shop: ${shopUrl}`);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: SHOPIFY_CONFIG.CLIENT_ID,
        client_secret: SHOPIFY_CONFIG.CLIENT_SECRET,
        code,
        shop: shopUrl,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error_description || response.statusText || "Unknown error";
      console.error(`Token exchange failed: ${errorMessage}`);
      throw new Error(`Failed to exchange code: ${errorMessage}`);
    }
    
    const data = await response.json();
    console.log("Token exchange successful");
    return {
      accessToken: data.access_token,
      scope: data.scope,
    };
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
};
