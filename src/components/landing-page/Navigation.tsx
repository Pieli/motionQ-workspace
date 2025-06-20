import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center border-2 border-primary">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Moccasso</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#process"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              How does it work?
            </a>
            <a
              href="#examples"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Examples
            </a>
            <a
              href="#contact"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#waitlist">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg border-2 border-primary">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
