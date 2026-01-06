import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResultsCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variantStyles = {
  default: "border-border bg-card",
  success: "border-plant-green/30 bg-plant-green/5",
  warning: "border-plant-yellow/30 bg-plant-yellow/5",
  danger: "border-plant-red/30 bg-plant-red/5",
  info: "border-plant-sky/30 bg-plant-sky/5",
};

const iconStyles = {
  default: "text-foreground",
  success: "text-plant-green",
  warning: "text-plant-yellow-dark",
  danger: "text-plant-red",
  info: "text-plant-sky",
};

export function ResultsCard({
  title,
  icon,
  children,
  variant = "default",
  className,
}: ResultsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-all duration-300 animate-fade-in",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div className={cn("flex-shrink-0", iconStyles[variant])}>
            {icon}
          </div>
        )}
        <h4 className="font-display text-lg font-semibold text-foreground">
          {title}
        </h4>
      </div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

interface ResultItemProps {
  label: string;
  value: string | ReactNode;
  className?: string;
}

export function ResultItem({ label, value, className }: ResultItemProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

export function ResultGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  );
}
