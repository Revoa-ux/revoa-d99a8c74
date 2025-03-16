
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getShopifyAuth, clearShopifyAuth, isTokenValid } from "@/services/shopifyAuth";
import { toast } from "@/components/ui/sonner";
import StoreCard from "@/components/StoreCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const authData = getShopifyAuth();

  useEffect(() => {
    // Check if the user is authenticated
    if (!authData || !isTokenValid()) {
      toast.error("Your session has expired. Please reconnect your store.");
      navigate("/");
    }
  }, [authData, navigate]);

  const handleDisconnect = () => {
    clearShopifyAuth();
    toast.success("Store disconnected successfully");
    navigate("/");
  };

  if (!authData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-shopify-light">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10 animate-slide-down">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Manage your Shopify store and access advanced features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="col-span-full md:col-span-1">
            <StoreCard
              shop={authData.shop}
              accessToken={authData.accessToken}
              onDisconnect={handleDisconnect}
            />
          </div>

          <div className="col-span-full md:col-span-2 space-y-6 animate-fade-in">
            <div className="rounded-xl bg-white p-6 border border-gray-100 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-shopify-green/50 hover:bg-shopify-green/5 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-shopify-green/10 flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-shopify-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <span className="font-medium">View Products</span>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-shopify-green/50 hover:bg-shopify-green/5 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-shopify-green/10 flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-shopify-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <span className="font-medium">View Orders</span>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-shopify-green/50 hover:bg-shopify-green/5 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-shopify-green/10 flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-shopify-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="font-medium">Customers</span>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-shopify-green/50 hover:bg-shopify-green/5 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-shopify-green/10 flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-shopify-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="font-medium">Analytics</span>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="rounded-xl bg-white p-6 border border-gray-100 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Connection Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 mb-1">Store URL</p>
                    <p className="font-medium">{authData.shop}</p>
                  </div>
                  
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 mb-1">Connected Since</p>
                    <p className="font-medium">
                      {new Date(authData.timestamp).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 mb-1">Access Scope</p>
                    <p className="font-medium">{authData.scope}</p>
                  </div>
                  
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <p className="font-medium text-green-700">Active</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={handleDisconnect}
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Disconnect Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
