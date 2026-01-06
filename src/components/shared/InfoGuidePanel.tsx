import { ReactNode } from "react";
import { Info, CheckCircle, Lightbulb, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoGuidePanelProps {
  title: string;
  tips: string[];
  instructions: string[];
  icon?: ReactNode;
  className?: string;
}

export function InfoGuidePanel({
  title,
  tips,
  instructions,
  icon,
  className,
}: InfoGuidePanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 h-full flex flex-col",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon || <Info className="h-5 w-5" />}
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">
          {title}
        </h3>
      </div>

      <div className="space-y-6 flex-1">
        {/* How to Use Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Camera className="h-4 w-4 text-primary" />
            <h4 className="font-medium text-sm text-foreground">How to Use</h4>
          </div>
          <ul className="space-y-2">
            {instructions.map((instruction, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                {instruction}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-plant-yellow-dark" />
            <h4 className="font-medium text-sm text-foreground">Tips for Best Results</h4>
          </div>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-plant-green flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
