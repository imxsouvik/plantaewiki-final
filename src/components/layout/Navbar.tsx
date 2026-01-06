import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu, X, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import plantaewikiLogo from "@/assets/plantaewiki-logo.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Growth Prediction", path: "/growth-prediction" },
  { label: "Disease Detection", path: "/disease-detection" },
  { label: "Plant Encyclopedia", path: "/encyclopedia" },
  { label: "Contact", path: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const location = useLocation();

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices(); // Load immediately if voices are already available
  }, []);

  const speakSelectedText = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.length > 0) {
      const utterance = new SpeechSynthesisUtterance(selectedText);

      let selectedVoice: SpeechSynthesisVoice | null = null;

      // Try to find "Sydney Harbour Blue" voice
      selectedVoice = voices.find(
        (voice) => voice.name.toLowerCase().includes("sydney harbour blue")
      );

      // Fallback to "Google US English" female voices if "Sydney Harbour Blue" is not found
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) => voice.lang === "en-US" && voice.name.toLowerCase().includes("google") && (voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("woman"))
        );
      }

      // Fallback: any "Google" English female voice
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) => voice.lang.startsWith("en") && voice.name.toLowerCase().includes("google") && (voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("woman"))
        );
      }

      // Fallback: any English female voice
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) => voice.lang.startsWith("en") && (voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("woman"))
        ) || null; // Explicitly set to null if not found to avoid issues
      }

      // Final fallback: any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find((voice) => voice.lang.startsWith("en")) || null;
      }

      utterance.voice = selectedVoice;

      utterance.pitch = 1;
      utterance.rate = 0.9;

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-navbar shadow-md">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={plantaewikiLogo} 
            alt="PlantaeWiki Logo" 
            className="h-10 w-10 object-contain group-hover:scale-105 transition-transform"
          />
          <span className="font-display text-2xl font-bold text-navbar-foreground">
            Plantae<span className="text-plant-yellow-light">Wiki</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                "hover:bg-white/10",
                location.pathname === item.path
                  ? "text-plant-yellow-light bg-white/10"
                  : "text-navbar-foreground/90"
              )}
            >
              {item.label}
              {location.pathname === item.path && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-plant-yellow rounded-full" />
              )}
            </Link>
          ))}
          <div className="ml-2 flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-navbar-foreground hover:bg-white/10 mr-2"
                    onClick={speakSelectedText}
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select text and Click me!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-navbar-foreground hover:bg-white/10"
                  onClick={speakSelectedText}
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select text and Click me!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="text-navbar-foreground hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 inset-x-0 bg-navbar border-b border-white/10 shadow-medium animate-fade-in">
          <div className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  "hover:bg-white/10",
                  location.pathname === item.path
                    ? "text-plant-yellow-light bg-white/10"
                    : "text-navbar-foreground/90"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
