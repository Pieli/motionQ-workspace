import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatePalette } from "@/components/sidebar/create-palette";
import { useColorPalette } from "@/lib/ColorPaletteContext";
import { Palette, Wand2, Trash2 } from "lucide-react";

type Palette = {
  name: string;
  primary: string;
  secondary: string;
  additional: string[];
};

const PREMADE_PALETTES: Palette[] = [
  {
    name: "Sunset",
    primary: "#FF5733",
    secondary: "#FFC300",
    additional: ["#C70039", "#900C3F", "#581845"],
  },
  {
    name: "Ocean",
    primary: "#0077B6",
    secondary: "#00B4D8",
    additional: ["#90E0EF", "#CAF0F8"],
  },
  {
    name: "Forest",
    primary: "#2D6A4F",
    secondary: "#95D5B2",
    additional: ["#52B788"],
  },
];

interface ColorPalettePanelProps {
  onApplyPalette?: (palettePrompt: string) => void;
}

export const ColorPalettePanel: React.FC<ColorPalettePanelProps> = ({
  onApplyPalette,
}) => {
  const { currentPalette, updatePalette, setCurrentPalette } =
    useColorPalette();
  const [palettes, setPalettes] = useState<Palette[]>(PREMADE_PALETTES);
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number>(0);

  // Sync selectedPaletteIndex with currentPalette when component mounts or currentPalette changes
  useEffect(() => {
    console.log(currentPalette);
    if (currentPalette) {
      // Find matching palette in premade palettes
      const matchingIndex = palettes.findIndex((p) => {
        const paletteColors = [p.primary, p.secondary, ...p.additional];
        return (
          currentPalette.colors.length === paletteColors.length &&
          currentPalette.colors.every(
            (color, idx) => color === paletteColors[idx],
          )
        );
      });

      if (matchingIndex !== -1) {
        setSelectedPaletteIndex(matchingIndex);
      } else {
        // Check if it's a custom palette that was added
        const customIndex = palettes.findIndex((p) => p.name === "Custom");
        if (customIndex !== -1) {
          setSelectedPaletteIndex(customIndex);
        }
      }
    }
  }, [currentPalette, palettes]);

  const isPremade = (idx: number) => idx < PREMADE_PALETTES.length;

  const handlePaletteSelect = (idx: number) => {
    setSelectedPaletteIndex(idx);
    const selectedPalette = palettes[idx];
    if (selectedPalette) {
      const colors = [
        selectedPalette.primary,
        selectedPalette.secondary,
        ...selectedPalette.additional,
      ];
      const newPalette = {
        id: isPremade(idx)
          ? `${selectedPalette.name.toLowerCase()}-premade`
          : `palette-${Date.now()}`,
        name: selectedPalette.name,
        colors: colors,
      };
      setCurrentPalette(newPalette);
    }
  };

  const addCustomPalette = (colors: string[]) => {
    const [primary, secondary, ...additional] = colors;
    setPalettes([
      ...palettes,
      {
        name: "Custom",
        primary,
        secondary,
        additional,
      },
    ]);
    setSelectedPaletteIndex(palettes.length);
    updatePalette(colors);
  };

  const removePalette = (idx: number) => {
    if (isPremade(idx)) return;
    const newPalettes = palettes.filter((_, i) => i !== idx);
    setPalettes(newPalettes);
    setSelectedPaletteIndex((prev) =>
      prev === idx ? 0 : prev > idx ? prev - 1 : prev,
    );
  };

  const handleApplyNow = async () => {
    if (currentPalette && onApplyPalette) {
      const adjustPrompt = `Please adjust the current animations to use the new color palette: ${currentPalette.colors.join(", ")}. Keep the same content and timing but update the colors to match this palette while ensuring good contrast and readability.`;
      onApplyPalette(adjustPrompt);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Premade Palettes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Premade Palettes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {palettes.map((p, idx) => (
              <div
                key={p.name + idx}
                className={`flex items-center gap-2 rounded border px-2 py-2 cursor-pointer ${
                  selectedPaletteIndex === idx
                    ? "border-primary"
                    : "border-muted"
                }`}
                onClick={() => handlePaletteSelect(idx)}
              >
                <span className="font-medium min-w-[60px] text-xs">
                  {p.name}
                </span>
                <span
                  className="inline-block rounded-full"
                  style={{
                    width: 20,
                    height: 20,
                    background: p.primary,
                    marginRight: 2,
                  }}
                  title="Primary"
                />
                <span
                  className="inline-block rounded-full"
                  style={{
                    width: 20,
                    height: 20,
                    background: p.secondary,
                    marginRight: 2,
                  }}
                  title="Secondary"
                />
                {p.additional.map((color, i) => (
                  <span
                    key={color + i}
                    className="inline-block rounded-full"
                    style={{
                      width: 20,
                      height: 20,
                      background: color,
                      marginRight: 2,
                    }}
                    title={`Additional ${i + 1}`}
                  />
                ))}
                {!isPremade(idx) && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-auto h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePalette(idx);
                    }}
                    aria-label="Remove palette"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Active Palette */}
      {currentPalette && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Active Palette
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
            <Button
              variant="default"
              size="sm"
              onClick={handleApplyNow}
              className="w-full flex items-center gap-1"
            >
              <Wand2 className="w-3 h-3" />
              Apply to Animations
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Custom Palette Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Create Custom Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePalette onCreate={addCustomPalette} />
        </CardContent>
      </Card>
    </div>
  );
};
