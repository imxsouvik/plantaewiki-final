import { useState } from "react";
import { TrendingUp, Ruler, Leaf, Heart, Calendar, X } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { TwoPanelLayout } from "@/components/shared/TwoPanelLayout";
import { ImageUploadPanel } from "@/components/shared/ImageUploadPanel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ResultsCard, ResultItem, ResultGrid } from "@/components/shared/ResultsCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface GrowthPrediction {
  plantName: string;
  currentHeight: string;
  estimatedHeight: string;
  leafSpread: string;
  survivalProbability: number;
  growthTimeline: {
    phase: string;
    duration: string;
    description: string;
  }[];
  recommendations: string[];
}

interface PopularPlant {
  name: string;
  description: string;
  care: string;
  funFact: string;
}

export default function GrowthPrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GrowthPrediction | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PopularPlant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (base64Image: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("predict-growth", {
        body: { image: base64Image },
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Growth analysis complete!",
        description: `Analyzed: ${data.plantName}`,
      });
    } catch (error: any) {
      console.error("Error predicting growth:", error);
      toast({
        title: "Analysis failed",
        description: error.message || "Please try again with a clearer image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlantClick = (plant: PopularPlant) => {
    setSelectedPlant(plant);
    setIsDialogOpen(true);
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-in">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Predict Your Plant's <span className="text-primary">Growth</span>
            </h1>
            <p className="text-muted-foreground">
              Upload a plant image to receive AI-powered growth predictions and care recommendations.
            </p>
          </div>

          {/* Two Panel Layout */}
          <TwoPanelLayout
            leftPanel={
              <ImageUploadPanel
                onImageUpload={handleImageUpload}
                isLoading={isLoading}
                title="Growth Analysis"
                description="Upload a plant photo to predict growth"
              />
            }
            rightPanel={
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground text-center">
                  Popular Plants
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {popularPlants.map((plant, index) => (
                    <div
                      key={index}
                      className="bg-card rounded-xl border border-border p-3 cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handlePlantClick(plant)}
                    >
                      <h3 className="font-semibold text-base mb-1">{plant.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{plant.description}</p>
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
                Growth Prediction for {result.plantName}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <ResultsCard
                  title="Height Estimate"
                  icon={<Ruler className="h-5 w-5" />}
                  variant="success"
                >
                  <ResultGrid>
                    <ResultItem label="Current" value={result.currentHeight} />
                    <ResultItem label="Projected" value={result.estimatedHeight} />
                  </ResultGrid>
                </ResultsCard>

                <ResultsCard
                  title="Leaf Spread"
                  icon={<Leaf className="h-5 w-5" />}
                  variant="info"
                >
                  <ResultItem label="Expected Spread" value={result.leafSpread} />
                </ResultsCard>

                <ResultsCard
                  title="Survival Rate"
                  icon={<Heart className="h-5 w-5" />}
                  variant={result.survivalProbability >= 70 ? "success" : result.survivalProbability >= 40 ? "warning" : "danger"}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Probability</span>
                      <span className="text-foreground font-bold">{result.survivalProbability}%</span>
                    </div>
                    <Progress value={result.survivalProbability} className="h-2" />
                  </div>
                </ResultsCard>

                <ResultsCard
                  title="Recommendations"
                  icon={<TrendingUp className="h-5 w-5" />}
                  variant="warning"
                >
                  <ul className="space-y-1">
                    {result.recommendations.slice(0, 3).map((rec, i) => (
                      <li key={i} className="text-xs">• {rec}</li>
                    ))}
                  </ul>
                </ResultsCard>
              </div>

              {/* Growth Timeline */}
              <ResultsCard
                title="Growth Timeline"
                icon={<Calendar className="h-5 w-5" />}
                variant="info"
                className="max-w-4xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {result.growthTimeline.map((phase, index) => (
                    <div
                      key={index}
                      className="relative pl-6 border-l-2 border-plant-sky/30 pb-4 last:pb-0"
                    >
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-plant-sky" />
                      <h5 className="font-semibold text-foreground text-sm">{phase.phase}</h5>
                      <p className="text-xs text-plant-sky-dark font-medium">{phase.duration}</p>
                      <p className="text-xs text-muted-foreground mt-1">{phase.description}</p>
                    </div>
                  ))}
                </div>
              </ResultsCard>
            </div>
          )}
        </div>
      </section>

      {/* Plant Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedPlant && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">{selectedPlant.name}</DialogTitle>
                <DialogDescription>{selectedPlant.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Care Tips</h4>
                  <p className="text-sm text-muted-foreground">{selectedPlant.care}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Fun Fact</h4>
                  <p className="text-sm text-muted-foreground">{selectedPlant.funFact}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

const popularPlants: PopularPlant[] = [
  { 
    name: "Monstera Deliciosa", 
    description: "Known for its iconic split leaves, this tropical plant is a popular and relatively low-maintenance houseplant.",
    care: "Prefers bright, indirect light and watering every 1-2 weeks. Allow soil to dry out between waterings. Loves humidity!",
    funFact: "The 'Deliciosa' part of its name comes from the delicious, edible fruit it produces in the wild, which tastes like a mix of pineapple, banana, and mango."
  },
  { 
    name: "Fiddle Leaf Fig", 
    description: "A trendy indoor tree with large, violin-shaped leaves. It requires bright, indirect light and consistent watering.",
    care: "Thrives in bright, consistent light. Water when the top inch of soil is dry. Avoid drafts and sudden temperature changes.",
    funFact: "They are native to West Africa, where they can grow up to 50 feet tall in their natural rainforest habitat."
  },
  { 
    name: "Snake Plant", 
    description: "Extremely tolerant and easy to care for, known for its air-purifying qualities and upright, sword-like leaves.",
    care: "Tolerates a wide range of light conditions, from low light to bright indirect sun. Water sparingly, as it's susceptible to root rot.",
    funFact: "Also known as 'Mother-in-Law's Tongue,' it's one of the few plants that convert CO2 into oxygen at night."
  },
  { 
    name: "Pothos", 
    description: "A forgiving and fast-growing vine that can thrive in a variety of light conditions, perfect for beginners.",
    care: "Can handle low light but shows more variegation in brighter spots. Water when the soil feels dry. Very easy to propagate from cuttings.",
    funFact: "It's often called 'Devil's Ivy' because it's almost impossible to kill and stays green even when kept in the dark."
  },
  { 
    name: "ZZ Plant", 
    description: "Drought-tolerant and requires very little light, making it one of the hardiest houseplants available.",
    care: "The ultimate low-maintenance plant. Prefers bright, indirect light but tolerates low light. Water only when the soil is completely dry.",
    funFact: "The ZZ plant's scientific name, Zamioculcas zamiifolia, is a mouthful! It has underground rhizomes that store water, which is why it's so drought-tolerant."
  },
  { 
    name: "Spider Plant", 
    description: "Produces arching leaves and small plantlets, or 'spiderettes,' and is very easy to propagate.",
    care: "Prefers bright, indirect light. Keep soil evenly moist. It's non-toxic to pets, making it a great choice for animal lovers.",
    funFact: "The 'spiderettes' that dangle from the mother plant can be easily repotted to grow new plants, making it a gift that keeps on giving."
  },
  { 
    name: "Peace Lily", 
    description: "Features elegant white flowers and is known for its ability to thrive in low-light conditions.",
    care: "Loves medium to low light. Keep the soil consistently moist but not waterlogged. It will dramatically droop when it needs water, but perks up quickly after a drink.",
    funFact: "The 'flower' is actually a specialized leaf bract that grows hooded over the real, smaller flowers."
  },
  { 
    name: "Rubber Plant", 
    description: "A robust plant with large, glossy, dark green leaves. It prefers bright, indirect light.",
    care: "Prefers bright, indirect light and consistent moisture. Wipe the leaves with a damp cloth to keep them shiny and dust-free.",
    funFact: "In its native Southeast Asia, it can grow into a massive tree over 100 feet tall. The milky sap was once used to make rubber."
  },
  { 
    name: "Calathea", 
    description: "Known for its stunningly patterned leaves that often fold up at night. Requires high humidity.",
    care: "Requires high humidity, bright indirect light, and consistently moist soil. Use distilled or rainwater to prevent brown leaf tips.",
    funFact: "Calatheas are known as 'prayer plants' because their leaves fold up at night, resembling hands in prayer."
  },
  { 
    name: "Orchid", 
    description: "A diverse family of flowering plants prized for their beautiful and often fragrant blooms.",
    care: "Care varies widely by species. Most common orchids (Phalaenopsis) need bright, indirect light and chunky bark mix that allows for great air circulation.",
    funFact: "Vanilla extract comes from the seed pod of a species of orchid, Vanilla planifolia. It's the only orchid that produces an edible fruit."
  }
];
