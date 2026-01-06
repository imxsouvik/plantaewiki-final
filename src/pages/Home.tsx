import { useState } from "react";
import { MapPin, Sprout, BookOpen, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { TwoPanelLayout } from "@/components/shared/TwoPanelLayout";
import { ImageUploadPanel } from "@/components/shared/ImageUploadPanel";
import { VideoPlaceholder } from "@/components/shared/VideoPlaceholder";
import { ResultsCard, ResultItem, ResultGrid } from "@/components/shared/ResultsCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PlantIdentification {
  commonName: string;
  scientificName: string;
  species: string;
  varieties: string[];
  geographicalOrigin: string;
  description: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlantIdentification | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (base64Image: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("identify-plant", {
        body: { image: base64Image },
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Plant identified!",
        description: `Found: ${data.commonName}`,
      });
    } catch (error: any) {
      console.error("Error identifying plant:", error);
      toast({
        title: "Identification failed",
        description: error.message || "Please try again with a clearer image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Discover the World of{" "}
              <span className="text-primary">Plants</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload a plant image and let our AI identify its species, origin, and characteristics in seconds.
            </p>
          </div>

          {/* Two Panel Layout */}
          <TwoPanelLayout
            leftPanel={
              <ImageUploadPanel
                onImageUpload={handleImageUpload}
                isLoading={isLoading}
                title="Plant Identification"
                description="Upload a plant photo to identify"
              />
            }
            rightPanel={
  <div className="w-full h-full">
    <div className="rounded-2xl overflow-hidden shadow-lg h-[420px] md:h-full w-full">
      <video
        src="/videos/demo.mp4"
        controls
        autoPlay
        loop
        muted
        className="w-full h-full object-cover"
      />
    </div>
  </div>
}

          />

          {/* Results Section */}
          {result && (
            <div className="mt-8 animate-fade-in-up">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
                Identification Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ResultsCard
                  title="Plant Identity"
                  icon={<Sparkles className="h-5 w-5" />}
                  variant="success"
                >
                  <ResultGrid>
                    <ResultItem label="Common Name" value={result.commonName} />
                    <ResultItem label="Scientific Name" value={<em>{result.scientificName}</em>} />
                  </ResultGrid>
                </ResultsCard>

                <ResultsCard
                  title="Classification"
                  icon={<Sprout className="h-5 w-5" />}
                  variant="info"
                >
                  <ResultGrid>
                    <ResultItem label="Species" value={result.species} />
                    <ResultItem
                      label="Varieties"
                      value={result.varieties.length > 0 ? result.varieties.join(", ") : "Standard"}
                    />
                  </ResultGrid>
                </ResultsCard>

                <ResultsCard
                  title="Origin"
                  icon={<MapPin className="h-5 w-5" />}
                  variant="warning"
                >
                  <ResultItem label="Geographical Origin" value={result.geographicalOrigin} />
                </ResultsCard>

                <ResultsCard
                  title="Description"
                  icon={<BookOpen className="h-5 w-5" />}
                  className="md:col-span-2 lg:col-span-3"
                >
                  <p className="text-foreground leading-relaxed">{result.description}</p>
                </ResultsCard>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
            Explore More Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/growth-prediction">
              <FeatureCard
                icon={<TrendingUp className="h-6 w-6" />}
                title="Growth Prediction"
                description="Forecast your plant's development with AI-powered growth modeling."
                color="green"
              />
            </Link>
            <Link to="/disease-detection">
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Disease Detection"
                description="Identify plant diseases early and get treatment recommendations."
                color="red"
              />
            </Link>
            <Link to="/encyclopedia">
              <FeatureCard
                icon={<BookOpen className="h-6 w-6" />}
                title="Plant Encyclopedia"
                description="Browse our comprehensive database of plants from around the world."
                color="sky"
              />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "green" | "red" | "sky";
}) {
  const colorStyles = {
    green: "bg-plant-green/10 text-plant-green border-plant-green/20",
    red: "bg-plant-red/10 text-plant-red border-plant-red/20",
    sky: "bg-plant-sky/10 text-plant-sky border-plant-sky/20",
  };

  return (
    <div className="group bg-card rounded-xl p-6 border border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <div
        className={`w-12 h-12 rounded-lg ${colorStyles[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
