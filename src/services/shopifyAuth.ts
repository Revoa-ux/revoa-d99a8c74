
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
  
  // Build the authorization URL
  const params = new URLSearchParams({
    client_id: SHOPIFY_CONFIG.CLIENT_ID,
    scope: SHOPIFY_CONFIG.SCOPES,
    redirect_uri: SHOPIFY_CONFIG.REDIRECT_URI,
    state: generateRandomState(),
    shop: shopUrl,
  });
  
  return `https://${shopUrl}/admin/oauth/authorize?${params.toString()}`;
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
  let url = `https://${shop}/admin/oauth/access_token`;
  
  // If in development, use the proxy
  if (API_PROXY_URL) {
    url = `${API_PROXY_URL}/access_token`;
  }
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: SHOPIFY_CONFIG.CLIENT_ID,
        client_secret: SHOPIFY_CONFIG.CLIENT_SECRET,
        code,
        shop: shop,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to exchange code: ${errorData.error_description || response.statusText}`);
    }
    
    const data = await response.json();
    return {
      accessToken: data.access_token,
      scope: data.scope,
    };
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
};
