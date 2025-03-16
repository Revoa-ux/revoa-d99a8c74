
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeCodeForToken, saveShopifyAuth } from "@/services/shopifyAuth";
import { toast } from "@/components/ui/sonner";
import ShopifyLogo from "@/components/ShopifyLogo";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get("code");
        const shop = searchParams.get("shop") || sessionStorage.getItem("shop_url");

        if (!code) {
          throw new Error("Authorization code is missing");
        }

        if (!shop) {
          throw new Error("Shop parameter is missing");
        }

        // Clean up session storage
        sessionStorage.removeItem("shop_url");

        // Exchange the code for an access token
        const { accessToken, scope } = await exchangeCodeForToken(code, shop);

        // Save the authentication data
        saveShopifyAuth({
          shop,
          accessToken,
          scope,
          timestamp: Date.now(),
        });

        // Update UI state
        setStatus("success");
        
        // Show success message
        toast.success("Successfully connected to Shopify!");
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (error) {
        console.error("Auth error:", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Authentication failed"
        );
        toast.error("Failed to connect to Shopify");
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-shopify-light p-4">
      <div className="w-full max-w-md text-center">
        <ShopifyLogo className="mx-auto mb-6" size="lg" />
        
        <div className="bg-white rounded-xl shadow-card p-8 w-full">
          {status === "loading" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full border-4 border-shopify-green/30 border-t-shopify-green animate-spin mb-4"></div>
                <h2 className="text-xl font-semibold">Connecting to Shopify</h2>
              </div>
              <p className="text-gray-600">
                Please wait while we securely connect your store...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4 animate-slide-up">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <svg 
                    className="h-8 w-8 text-green-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">Connection Successful!</h2>
              </div>
              <p className="text-gray-600">
                Your Shopify store has been successfully connected. Redirecting to the dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4 animate-slide-up">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <svg 
                    className="h-8 w-8 text-red-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">Connection Failed</h2>
              </div>
              <p className="text-gray-600">
                {errorMessage || "There was an error connecting to Shopify. Please try again."}
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 w-full px-4 py-2 bg-shopify-green text-white rounded-md hover:bg-shopify-green/90 transition-colors"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
