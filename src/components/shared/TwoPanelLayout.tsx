import { ReactNode } from "react";

interface TwoPanelLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  className?: string;
}

export function TwoPanelLayout({ leftPanel, rightPanel, className = "" }: TwoPanelLayoutProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${className}`}>
      {/* Left Panel - Image Upload */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
        {leftPanel}
      </div>

      {/* Right Panel - Video Placeholder */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
        {rightPanel}
      </div>
    </div>
  );
}
