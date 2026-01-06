import { useState } from "react";
import { AlertTriangle, Shield, Thermometer, Pill, Heart, Sun } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { TwoPanelLayout } from "@/components/shared/TwoPanelLayout";
import { ImageUploadPanel } from "@/components/shared/ImageUploadPanel";
import { InfoGuidePanel } from "@/components/shared/InfoGuidePanel";
import { ResultsCard, ResultItem, ResultGrid } from "@/components/shared/ResultsCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DiseaseDetection {
  isHealthy: boolean;
  plantName: string;
  diseaseName: string;
  cause: string;
  severity: "low" | "medium" | "high" | "critical";
  treatments: string[];
  preventiveMeasures: string[];
  recoveryConditions: {
    temperature: string;
    humidity: string;
    light: string;
    water: string;
  };
  };

export default function DiseaseDetection() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiseaseDetection | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<PopularDisease | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (base64Image: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("detect-disease", {
        body: { image: base64Image },
      });

      if (error) throw error;

      const detectedDiseaseData = data;

      setResult(detectedDiseaseData);
      toast({
        title: detectedDiseaseData.isHealthy ? "Plant looks healthy!" : "Disease detected",
        description: detectedDiseaseData.isHealthy
          ? "No visible diseases found."
          : `Found: ${detectedDiseaseData.diseaseName}`,
        variant: detectedDiseaseData.isHealthy ? "default" : "destructive",
      });
    } catch (error: any) {
      console.error("Error detecting disease:", error);
      toast({
        title: "Analysis failed",
        description: error.message || "Please try again with a clearer image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const severityConfig = {
    low: { label: "Low", color: "bg-plant-green text-plant-green-dark" },
    medium: { label: "Medium", color: "bg-plant-yellow text-plant-yellow-dark" },
    high: { label: "High", color: "bg-orange-500 text-white" },
    critical: { label: "Critical", color: "bg-plant-red text-white" },
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-in">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Detect Plant <span className="text-plant-red">Diseases</span>
            </h1>
            <p className="text-muted-foreground">
              Upload a plant image to detect diseases, get treatment recommendations, and learn prevention strategies.
            </p>
          </div>

          {/* Two Panel Layout */}
          <TwoPanelLayout
            leftPanel={
              <ImageUploadPanel
                onImageUpload={handleImageUpload}
                isLoading={isLoading}
                title="Disease Analysis"
                description="Upload a plant photo to check health"
              />
            }
            rightPanel={
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground text-center">
                  Popular Detected Diseases
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {popularDiseases.map((disease, index) => (
                    <div
                      key={index}
                      className="bg-card rounded-xl border border-border p-3 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedDisease(disease);
                        setIsDetailDialogOpen(true);
                      }}
                    >
                      <h3 className="font-semibold text-base mb-1">{disease.diseaseName}</h3>
                      <p className="text-xs text-muted-foreground italic">
                        Affects: {disease.plantName}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{disease.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            }
          />

          {/* Results Section */}
          {result && (
            <div className="mt-8 animate-fade-in-up">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
                Health Report: {result.plantName}
              </h2>

              {result.isHealthy ? (
                <ResultsCard
                  title="Healthy Plant"
                  icon={<Heart className="h-5 w-5" />}
                  variant="success"
                  className="max-w-lg mx-auto"
                >
                  <p className="text-foreground">
                    Great news! Your plant appears to be healthy with no visible signs of disease.
                    Continue with regular care and monitoring.
                  </p>
                </ResultsCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResultsCard
                    title="Disease Identified"
                    icon={<AlertTriangle className="h-5 w-5" />}
                    variant="danger"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground text-lg">
                          {result.diseaseName}
                        </span>
                        <Badge className={severityConfig[result.severity].color}>
                          {severityConfig[result.severity].label} Severity
                        </Badge>
                      </div>
                      <ResultItem label="Root Cause" value={result.cause} />
                    </div>
                  </ResultsCard>

                  <ResultsCard
                    title="Treatment Options"
                    icon={<Pill className="h-5 w-5" />}
                    variant="info"
                  >
                    <ul className="space-y-2">
                      {result.treatments.map((treatment, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-plant-sky/20 text-plant-sky flex items-center justify-center flex-shrink-0 text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="text-foreground">{treatment}</span>
                        </li>
                      ))}
                    </ul>
                  </ResultsCard>

                  <ResultsCard
                    title="Prevention Tips"
                    icon={<Shield className="h-5 w-5" />}
                    variant="warning"
                  >
                    <ul className="space-y-2">
                      {result.preventiveMeasures.map((measure, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground">
                          <span className="text-plant-yellow-dark">•</span>
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </ResultsCard>

                  <ResultsCard
                    title="Recovery Conditions"
                    icon={<Sun className="h-5 w-5" />}
                    variant="success"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <ResultItem
                        label="Temperature"
                        value={
                          <span className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3" />
                            {result.recoveryConditions.temperature}
                          </span>
                        }
                      />
                      <ResultItem label="Humidity" value={result.recoveryConditions.humidity} />
                      <ResultItem label="Light" value={result.recoveryConditions.light} />
                      <ResultItem label="Watering" value={result.recoveryConditions.water} />
                    </div>
                  </ResultsCard>
                </div>
              )}
            </div>
          )}
        </div>
      </section>



      {/* Disease Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-xl">
          {selectedDisease && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDisease.diseaseName}</DialogTitle>
                <DialogDescription>
                  Details about {selectedDisease.diseaseName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Affects:</span>{" "}
                  {selectedDisease.plantName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Description:</span>{" "}
                  {selectedDisease.description}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

interface PopularDisease {
  plantName: string;
  diseaseName: string;
  description: string;
}

const popularDiseases: PopularDisease[] = [
  {
    plantName: "Tomato",
    diseaseName: "Early Blight",
    description: "A common fungal disease causing dark spots with concentric rings on leaves, often leading to defoliation."
  },
  {
    plantName: "Rose",
    diseaseName: "Black Spot",
    description: "A prevalent fungal disease on roses characterized by circular black spots with fringed margins on leaves."
  },
  {
    plantName: "Apple",
    diseaseName: "Apple Scab",
    description: "Fungal disease affecting leaves, fruit, and twigs, causing olive-green to brown spots and scabby lesions."
  },
  {
    plantName: "Cucumber",
    diseaseName: "Powdery Mildew",
    description: "A widespread fungal disease that appears as white, powdery spots on the surface of leaves and stems."
  },
  {
    plantName: "Potato",
    diseaseName: "Late Blight",
    description: "A destructive fungal-like disease causing rapid browning and decay of leaves, stems, and tubers."
  },
  {
    plantName: "Grape",
    diseaseName: "Downy Mildew",
    description: "Oomycete disease producing yellow spots on upper leaf surfaces and white, downy growth on the undersides."
  },
  {
    plantName: "Wheat",
    diseaseName: "Leaf Rust",
    description: "Fungal disease forming reddish-brown pustules on wheat leaves, reducing photosynthesis and yield."
  },
  {
    plantName: "Corn",
    diseaseName: "Common Rust",
    description: "Fungal disease causing small, cinnamon-brown pustules on both upper and lower surfaces of corn leaves."
  },
  {
    plantName: "Strawberry",
    diseaseName: "Gray Mold (Botrytis)",
    description: "A common fungal disease causing grayish-brown fuzzy mold on strawberry fruits, flowers, and leaves."
  },
  {
    plantName: "Pepper",
    diseaseName: "Bacterial Spot",
    description: "Bacterial disease causing small, water-soaked spots on leaves that turn brown and necrotic with yellow halos."
  }
];
