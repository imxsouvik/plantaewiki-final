import { Play, Youtube } from "lucide-react";

interface VideoPlaceholderProps {
  title?: string;
}

export function VideoPlaceholder({ title = "Video Coming Soon" }: VideoPlaceholderProps) {
  return (
    <div className="h-full flex flex-col">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        Learn More
      </h3>
      
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full aspect-video rounded-xl bg-gradient-to-br from-plant-sky/20 via-muted to-plant-green/10 border border-border overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-20 h-20 bg-plant-yellow/20 rounded-full blur-2xl" />
          <div className="absolute bottom-4 right-4 w-32 h-32 bg-plant-green/15 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-plant-red/10 border border-plant-red/20 flex items-center justify-center">
            <Play className="h-8 w-8 text-plant-red ml-1" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-foreground">
              {title}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Tutorial video placeholder
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Youtube className="h-4 w-4" />
            <span>YouTube embed ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
