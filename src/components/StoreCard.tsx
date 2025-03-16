
import React from "react";
import { cn } from "@/lib/utils";
import { ShoppingBag, CheckCircle } from "lucide-react";

interface StoreCardProps {
  shop: string;
  accessToken: string;
  onDisconnect: () => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ 
  shop, 
  accessToken,
  onDisconnect
}) => {
  // Extract store name from shop URL
  const storeName = shop.replace('.myshopify.com', '');
  
  // First 6 characters of the access token
  const tokenPreview = accessToken.slice(0, 6) + '...' + accessToken.slice(-4);

  return (
    <div className="w-full animate-slide-up transition-all duration-300">
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-shopify-green/10 text-shopify-green">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold capitalize">{storeName}</h3>
              <p className="text-sm text-gray-500">{shop}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">Connected</span>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
            <span className="text-xs font-medium text-gray-500">Access Token</span>
            <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono">
              {tokenPreview}
            </code>
          </div>
          
          <div className="flex items-center justify-between">
            <a 
              href={`https://${shop}/admin`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-shopify-green hover:underline"
            >
              Open Shopify Admin
            </a>
            
            <button
              onClick={onDisconnect}
              className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
            >
              Disconnect Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
