
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100",
        "shadow-card p-6 transition-all duration-300",
        "hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
