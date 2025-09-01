import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatePalette } from "@/components/sidebar/create-palette";
import { useColorPalette } from "@/lib/ColorPaletteContext";
import { Palette, Wand2 } from "lucide-react";

interface ColorPalettePanelProps {
  onApplyPalette?: (palettePrompt: string) => void;
}

export const ColorPalettePanel: React.FC<ColorPalettePanelProps> = ({ onApplyPalette }) => {
  const { currentPalette, updatePalette } = useColorPalette();
  const [isEditing, setIsEditing] = useState(!currentPalette);

  const handlePaletteCreate = (colors: string[]) => {
    updatePalette(colors);
    setIsEditing(false);
  };

  const handleApplyNow = async () => {
    if (currentPalette && onApplyPalette) {
      const adjustPrompt = `Please adjust the current animations to use the new color palette: ${currentPalette.colors.join(", ")}. Keep the same content and timing but update the colors to match this palette while ensuring good contrast and readability.`;
      onApplyPalette(adjustPrompt);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {currentPalette && !isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Current Palette
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {currentPalette.colors.map((color, index) => (
                <div
                  key={index}
                  className="h-12 rounded-md border border-gray-300 flex items-center justify-center text-xs font-mono"
                  style={{ backgroundColor: color }}
                >
                  <span className="bg-black/20 text-white px-1 rounded text-xs">
                    {color.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex-1"
              >
                Edit Colors
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleApplyNow}
                className="flex-1 flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3" />
                Apply Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {currentPalette ? "Edit Color Palette" : "Create Color Palette"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreatePalette onCreate={handlePaletteCreate} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};