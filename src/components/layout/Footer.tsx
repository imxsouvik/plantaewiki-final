import { Link } from "react-router-dom";
import plantaewikiLogo from "@/assets/plantaewiki-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navbar">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src={plantaewikiLogo} 
                alt="PlantaeWiki Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="font-display text-xl font-bold text-navbar-foreground">
                Plantae<span className="text-plant-yellow-light">Wiki</span>
              </span>
            </Link>
            <p className="text-sm text-navbar-foreground/80 text-center md:text-left max-w-xs">
              Your intelligent companion for plant identification, growth forecasting, and disease analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="text-navbar-foreground/80 hover:text-navbar-foreground transition-colors">
              Home
            </Link>
            <Link to="/growth-prediction" className="text-navbar-foreground/80 hover:text-navbar-foreground transition-colors">
              Growth Prediction
            </Link>
            <Link to="/disease-detection" className="text-navbar-foreground/80 hover:text-navbar-foreground transition-colors">
              Disease Detection
            </Link>
            <Link to="/encyclopedia" className="text-navbar-foreground/80 hover:text-navbar-foreground transition-colors">
              Encyclopedia
            </Link>
            <Link to="/contact" className="text-navbar-foreground/80 hover:text-navbar-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}