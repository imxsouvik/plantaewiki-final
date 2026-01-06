import { useState, useEffect } from "react";
import { Search, BookOpen, MapPin, Thermometer, Leaf, ChevronDown, X, Globe, TreeDeciduous } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

interface Plant {
  id: string;
  common_name: string;
  scientific_name: string;
  species: string;
  family: string;
  origin: string;
  description: string;
  care_level: string;
  water_needs: string;
  light_needs: string;
  image_url: string;

  // New fields you need
  subspecies: string;
  total_species_in_genus: number;
  primary_growing_region: string;
  best_growing_season: string;
  weather_climate_requirements: string;
  care_maintenance_guidelines: string;
  long_description: string;

  // Taxonomy fields
  kingdom: string;
  phylum: string;
  class: string;
  plant_order: string;
  genus: string;
}


export default function Encyclopedia() {
  const [search, setSearch] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [plantImage, setPlantImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [plantImages, setPlantImages] = useState<Record<string, string | null>>({});

  const { data: plants = [], isLoading } = useQuery({
    queryKey: ["plants", search],
    queryFn: async () => {
      let query = supabase.from("plants").select("*").order("common_name");
      if (search) {
        query = query.or(`common_name.ilike.%${search}%,scientific_name.ilike.%${search}%,family.ilike.%${search}%,genus.ilike.%${search}%`);
      }
      const { data, error } = await query.limit(200);
      if (error) throw error;
      return data as Plant[];
    },
  });

  // Auto load all images for grid
  useEffect(() => {
    const fetchAllImages = async () => {
      const images: Record<string, string | null> = {};

      await Promise.all(
        plants.map(async (plant) => {
          const plantName = plant.scientific_name || plant.common_name;
          try {
            const res = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&titles=${plantName}&prop=pageimages&format=json&piprop=original&origin=*`
            );
            const data = await res.json();
            const page = Object.values(data.query.pages)[0] as any;
            images[plant.id] = page?.original?.source || null;
          } catch {
            images[plant.id] = null;
          }
        })
      );

      setPlantImages(images);
    };

    if (plants.length > 0) fetchAllImages();
  }, [plants]);

  // Detail view image (unchanged except DB skip)
  useEffect(() => {
    const fetchImageFromWikipedia = async () => {
      if (!selectedPlant) {
        setPlantImage(null);
        return;
      }

      setLoadingImage(true);
      const plantName = selectedPlant.scientific_name || selectedPlant.common_name;

      try {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${plantName}&prop=pageimages&format=json&piprop=original&origin=*`
        );
        const wikiData = await wikiRes.json();
        const wikiPage = Object.values(wikiData.query.pages)[0] as any;
        const imageUrl = wikiPage?.original?.source || null;

        setPlantImage(imageUrl);
      } catch {
        setPlantImage(null);
      } finally {
        setLoadingImage(false);
      }
    };

    fetchImageFromWikipedia();
  }, [selectedPlant]);

  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closePlantDetail = () => {
    setSelectedPlant(null);
    setPlantImage(null);
  };

  const getDisplayValue = (value: string | number | null | undefined, fallback = "Information not available") => {
    if (!value) return fallback;
    return value;
  };

  return (
    <PageLayout>
      {/* Plant detail view — unchanged UI */}
      {selectedPlant && (
        <section className="bg-card border-b border-border animate-fade-in">
          <div className="container py-8">
            <Button variant="ghost" size="sm" onClick={closePlantDetail} className="mb-6 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4 mr-2" /> Close Details
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                {loadingImage ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" />
                  </div>
                ) : plantImage ? (
                  <img src={plantImage} alt={selectedPlant.common_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <TreeDeciduous className="h-24 w-24 mb-4 opacity-50" />
                    <p className="text-sm">Image not available</p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{selectedPlant.common_name}</h1>
                  <p className="text-xl italic text-plant-green-light">{selectedPlant.scientific_name}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-plant-green text-primary-foreground"><Leaf className="h-3 w-3 mr-1" />{getDisplayValue(selectedPlant.care_level, "Care Level Unknown")}</Badge>
                  <Badge variant="secondary">{getDisplayValue(selectedPlant.water_needs, "Water Needs Unknown")}</Badge>
                  <Badge variant="outline">{getDisplayValue(selectedPlant.light_needs, "Light Needs Unknown")}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-xl p-4"><MapPin className="h-4 w-4 mb-1" />{getDisplayValue(selectedPlant.origin)}</div>
                  <div className="bg-muted/50 rounded-xl p-4"><Globe className="h-4 w-4 mb-1" />{getDisplayValue(selectedPlant.primary_growing_region)}</div>
                  <div className="bg-muted/50 rounded-xl p-4">{getDisplayValue(selectedPlant.best_growing_season)}</div>
                  <div className="bg-muted/50 rounded-xl p-4"><Thermometer className="h-4 w-4 mb-1" />{getDisplayValue(selectedPlant.weather_climate_requirements)}</div>
                </div>

                <p className="text-muted-foreground whitespace-pre-line">{getDisplayValue(selectedPlant.description)}</p>
              </div>
            </div>

            {/* Taxonomy Section */}
            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2"><BookOpen className="h-6 w-6 text-plant-green" />Taxonomy Classification</h2>
              <div className="rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
                {[
                  { label: "Kingdom", value: selectedPlant.kingdom },
                  { label: "Phylum", value: selectedPlant.phylum },
                  { label: "Class", value: selectedPlant.class },
                  { label: "Order", value: selectedPlant.plant_order },
                  { label: "Family", value: selectedPlant.family },
                  { label: "Genus", value: selectedPlant.genus },
                  { label: "Species", value: selectedPlant.species },
                  { label: "Subspecies", value: selectedPlant.subspecies },
                ].map((t, i) => (
                  <div key={t.label}>
                    <div className="text-xs font-semibold text-plant-green uppercase mb-1">{t.label}</div>
                    <div className="text-sm font-medium">{getDisplayValue(t.value, "Not identified")}</div>
                    {i < 7 && <ChevronDown className="h-4 w-4 mx-auto mt-2 rotate-[-90deg] hidden sm:block" />}
                  </div>
                ))}
              </div>

              {selectedPlant.total_species_in_genus && (
                <p className="text-center text-sm mt-4 text-muted-foreground">
                  <span className="font-semibold text-plant-green">{selectedPlant.total_species_in_genus}</span> species in the genus <i>{selectedPlant.genus || "Unknown"}</i>
                </p>
              )}
            </div>

            {/* Long Description */}
            {selectedPlant.long_description && (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold mb-4">About This Plant</h2>
                <p className="text-muted-foreground whitespace-pre-line">{selectedPlant.long_description}</p>
              </div>
            )}

            {/* Care Guidelines */}
            {selectedPlant.care_maintenance_guidelines && (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2"><Leaf className="h-6 w-6 text-plant-green" />Care & Maintenance Guidelines</h2>
                <p className="whitespace-pre-line">{selectedPlant.care_maintenance_guidelines}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Grid View with Auto Wikipedia Images */}
      <section className="py-12 md:py-16">
        <div className="container text-center max-w-3xl mx-auto mb-10">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Plant <span className="text-plant-green">Encyclopedia</span>
          </h1>

          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search by name, family, or genus..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-12 h-14 text-lg rounded-2xl border-2 transition" />
          </div>

          <p className="text-sm text-muted-foreground mt-3">
            {plants.length} plants available in our encyclopedia
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-lg text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plants
              .slice() // Create a shallow copy to avoid modifying the original array directly
              .sort((a, b) => {
                const hasImageA = !!plantImages[a.id];
                const hasImageB = !!plantImages[b.id];
                if (hasImageA && !hasImageB) return -1;
                if (!hasImageA && hasImageB) return 1;
                return 0; // Maintain original order if both have/don't have images
              })
              .map((plant) => (
              <div key={plant.id} onClick={() => handlePlantClick(plant)} className="group bg-card rounded-2xl border border-border p-4 cursor-pointer hover:-translate-y-1 transition-all">
                {/* 🌍 AUTO LOADED WIKIPEDIA IMAGE */}
                <div className="aspect-square bg-muted rounded-xl mb-4 overflow-hidden relative">
                  {plantImages[plant.id] ? (
                    <img
                      src={plantImages[plant.id] as string}
                      alt={plant.common_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <TreeDeciduous className="h-12 w-12 mb-2 opacity-50" />
                      <span className="text-xs">Image not available</span>
                    </div>
                  )}
                </div>

                <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-plant-green transition-colors">
                  {plant.common_name}
                </h3>

                <p className="text-sm text-muted-foreground italic mb-3">
                  {plant.scientific_name}
                </p>

                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="text-xs">
                    {getDisplayValue(plant.care_level, "Unknown")}
                  </Badge>

                  {plant.family && (
                    <Badge variant="outline" className="text-xs">
                      {plant.family}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
