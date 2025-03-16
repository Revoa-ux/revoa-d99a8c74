
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { LockIcon, ShoppingBag } from "lucide-react";

interface ShopifyFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const ShopifyFormInput = React.forwardRef<HTMLInputElement, ShopifyFormInputProps>(
  ({ className, label, error, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [filled, setFilled] = useState(!!props.value);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilled(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="space-y-2 w-full">
        {label && (
          <label 
            htmlFor={props.id} 
            className={cn(
              "text-sm font-medium transition-colors duration-150",
              focused ? "text-black" : "text-gray-500"
            )}
          >
            {label}
          </label>
        )}
        
        <div className={cn(
          "relative w-full group transition-all duration-200",
          error ? "mb-1" : "mb-0"
        )}>
          <div className={cn(
            "absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground transition-all duration-200",
            focused ? "text-black" : "text-gray-400"
          )}>
            {props.type === "password" ? (
              <LockIcon className="h-4 w-4" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
          </div>
          
          <input
            ref={ref}
            {...props}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm placeholder:text-muted-foreground",
              "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shopify-green/30 focus-visible:border-shopify-green",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200 shadow-sm",
              error
                ? "border-red-300 focus-visible:ring-red-500/40 focus-visible:border-red-500"
                : "border-input hover:border-gray-300",
              className
            )}
          />
          
          {filled && !error && !focused && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-subtle" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm font-medium text-red-500 mt-1 ml-1 animate-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

ShopifyFormInput.displayName = "ShopifyFormInput";

export default ShopifyFormInput;
