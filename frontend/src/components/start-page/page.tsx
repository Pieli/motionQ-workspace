import React, { useState } from "react";

import { Navbar } from "@/components/navbar/navbar";
import { ChatInput } from "@/components/chat/chat-input";
import ProjectsSection from "@/components/start-page/projects-section";
import { CreatePalette } from "@/components/sidebar/create-palette";

import { useNavigate } from "react-router-dom";
import {
  ColorPaletteProvider,
  useColorPalette,
} from "@/lib/ColorPaletteContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

const StartPageContent: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [showPaletteSelector, setShowPaletteSelector] = useState(false);
  const { currentPalette, updatePalette, formatPaletteForPrompt } =
    useColorPalette();
  const navigate = useNavigate();

  const handleSend = () => {
    if (!prompt.trim()) return;

    const palettePrompt = formatPaletteForPrompt();
    const fullPrompt = palettePrompt ? `${prompt}\n\n${palettePrompt}` : prompt;

    navigate("/workspace", {
      state: {
        initialPrompt: fullPrompt,
        initialPalette: currentPalette,
      },
    });
  };

  const handlePaletteCreate = (colors: string[]) => {
    updatePalette(colors);
    setShowPaletteSelector(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="flex flex-col justify-center items-center px-6 pt-20 pb-12 min-h-[70vh]">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
              Build{" "}
              <span className="relative inline-block min-w-[400px] text-left">
                <span className="text-primary font-bold">
                  {"the world"}
                  <span className="animate-pulse text-primary">|</span>
                </span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Transform your ideas into animated videos.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <ChatInput
              prompt={prompt}
              setPrompt={setPrompt}
              onSend={handleSend}
              onStop={() => {}}
              isGenerating={false}
            />
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPaletteSelector(!showPaletteSelector)}
                className="flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                {currentPalette ? "Change Colors" : "Set Color Palette"}
              </Button>
              {currentPalette && (
                <div className="flex gap-1">
                  {currentPalette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>

            {showPaletteSelector && (
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Choose Color Palette
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CreatePalette
                    onCreate={handlePaletteCreate}
                    startingPalette={currentPalette?.colors}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
      <ProjectsSection />
    </div>
  );
};

const StartPage: React.FC = () => {
  return (
    <ColorPaletteProvider>
      <StartPageContent />
    </ColorPaletteProvider>
  );
};

export default StartPage;
