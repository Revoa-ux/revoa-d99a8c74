
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ShopifyFormInput from "@/components/ShopifyFormInput";
import ShopifyConnectButton from "@/components/ShopifyConnectButton";
import ShopifyLogo from "@/components/ShopifyLogo";
import GlassCard from "@/components/GlassCard";
import StoreCard from "@/components/StoreCard";
import { generateAuthUrl, getShopifyAuth, clearShopifyAuth, isTokenValid } from "@/services/shopifyAuth";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const [shopUrl, setShopUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authData, setAuthData] = useState(getShopifyAuth());
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we have valid auth data on mount
    const auth = getShopifyAuth();
    setAuthData(auth);
    
    // Check if we need to redirect to the dashboard
    if (auth && isTokenValid() && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [navigate, location.pathname]);

  const handleShopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShopUrl(e.target.value);
    setError("");
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopUrl.trim()) {
      setError("Please enter your Shopify store URL");
      return;
    }

    try {
      setIsLoading(true);
      
      // Generate and redirect to Shopify OAuth URL
      const authUrl = generateAuthUrl(shopUrl);
      
      // In a real app, you might want to save the shop URL to session storage
      // to retrieve it later in the callback
      sessionStorage.setItem("shop_url", shopUrl);
      
      // Redirect to Shopify for authorization
      window.location.href = authUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to Shopify";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    clearShopifyAuth();
    setAuthData(null);
    toast.success("Store disconnected successfully");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-shopify-light">
      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Header with nice subtle animation */}
        <div className="mb-12 text-center animate-slide-down">
          <div className="flex items-center justify-center mb-6">
            <ShopifyLogo size="lg" className="mr-3" />
            <div className="h-5 w-px bg-gray-300 mx-3"></div>
            <span className="text-xl font-medium text-gray-800">
              App Integration
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Connect Your Shopify Store
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your Shopify store URL to authorize our app and start managing your products and orders with advanced tools.
          </p>
        </div>
        
        <div className="max-w-md mx-auto w-full animate-fade-in">
          {authData && isTokenValid() ? (
            <StoreCard 
              shop={authData.shop}
              accessToken={authData.accessToken}
              onDisconnect={handleDisconnect}
            />
          ) : (
            <GlassCard>
              <form onSubmit={handleConnect} className="space-y-5">
                <ShopifyFormInput 
                  id="shop-url"
                  label="Shopify Store URL"
                  placeholder="yourstore.myshopify.com"
                  value={shopUrl}
                  onChange={handleShopChange}
                  error={error}
                  autoComplete="off"
                  autoFocus
                />
                
                <div className="pt-2">
                  <ShopifyConnectButton 
                    type="submit" 
                    loading={isLoading}
                  >
                    Connect to Shopify
                  </ShopifyConnectButton>
                </div>
                
                <div className="text-xs text-center text-gray-500 pt-2">
                  By connecting, you agree to the{" "}
                  <a href="#" className="text-shopify-green hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-shopify-green hover:underline">
                    Privacy Policy
                  </a>
                </div>
              </form>
            </GlassCard>
          )}
        </div>
        
        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="p-5 rounded-lg bg-white/50 border border-gray-100 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Integration</h3>
            <p className="text-gray-600 text-sm">Connect your store in seconds and get started immediately without complicated setup.</p>
          </div>
          
          <div className="p-5 rounded-lg bg-white/50 border border-gray-100 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
            <p className="text-gray-600 text-sm">Your data is protected with industry-standard OAuth 2.0 and secure token management.</p>
          </div>
          
          <div className="p-5 rounded-lg bg-white/50 border border-gray-100 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center mb-4">
              <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Powerful Features</h3>
            <p className="text-gray-600 text-sm">Access advanced tools for managing products, orders, and customers from a single dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
