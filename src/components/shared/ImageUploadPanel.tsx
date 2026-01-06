import { useState, useCallback, useRef } from "react";
import { Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadPanelProps {
  onImageUpload: (base64Image: string) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export function ImageUploadPanel({
  onImageUpload,
  isLoading = false,
  title = "Upload Plant Image",
  description = "Drag and drop or click to upload",
}: ImageUploadPanelProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setPreview(base64);
        onImageUpload(base64);
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearImage = useCallback(() => {
    setPreview(null);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        {title}
      </h3>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex-1 min-h-[200px] rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden",
          "flex flex-col items-center justify-center gap-4 p-6",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          preview && "border-solid border-primary/30"
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">
                Analyzing image...
              </p>
            </div>
          </div>
        )}

        {preview ? ( // Display uploaded/captured image preview
          <>
            <img
              src={preview}
              alt="Uploaded plant"
              className="max-h-full max-w-full object-contain rounded-lg"
            />
            {!isLoading && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-3 right-3"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          // Initial state: upload or camera option
          <div className="flex flex-col items-center gap-4">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              {description}
            </p>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <Button variant="default" className="gap-2" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInputChange}
                  onClick={(event) => {
                    // This is to allow re-uploading the same file if needed
                    (event.target as HTMLInputElement).value = "";
                  }}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
