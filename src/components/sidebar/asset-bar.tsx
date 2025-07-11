import React, { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreatePalette } from "@/components/sidebar/create-palette";

type Palette = {
  name: string;
  primary: string;
  secondary: string;
  additional: string[]; // up to 3
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

export const AssetBar: React.FC = () => {
  const [palettes, setPalettes] = useState<Palette[]>(PREMADE_PALETTES);
  const [selected, setSelected] = useState<number>(0);

  const isPremade = (idx: number) => idx < PREMADE_PALETTES.length;

  const handlePaletteSelect = (idx: number) => setSelected(idx);

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
    setSelected(palettes.length);
  };

  const removePalette = (idx: number) => {
    if (isPremade(idx)) return;
    const newPalettes = palettes.filter((_, i) => i !== idx);
    setPalettes(newPalettes);
    setSelected((prev) => (prev === idx ? 0 : prev > idx ? prev - 1 : prev));
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-2">Color Palettes</h3>
      <div className="space-y-2">
        {palettes.map((p, idx) => (
          <div
            key={p.name + idx}
            className={`flex items-center gap-2 rounded border px-2 py-2 cursor-pointer ${
              selected === idx ? "border-primary" : "border-muted"
            }`}
            onClick={() => handlePaletteSelect(idx)}
          >
            <span className="font-medium min-w-[80px]">{p.name}</span>
            <span
              className="inline-block rounded-full border"
              style={{
                width: 20,
                height: 20,
                background: p.primary,
                marginRight: 4,
              }}
              title="Primary"
            />
            <span
              className="inline-block rounded-full border"
              style={{
                width: 20,
                height: 20,
                background: p.secondary,
                marginRight: 4,
              }}
              title="Secondary"
            />
            {p.additional.map((color, i) => (
              <span
                key={color + i}
                className="inline-block rounded-full border"
                style={{
                  width: 40,
                  height: 20,
                  background: color,
                  marginRight: 4,
                }}
                title={`Additional ${i + 1}`}
              />
            ))}
            {!isPremade(idx) && (
              <Button
                size="icon"
                variant="ghost"
                className="ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  removePalette(idx);
                }}
                aria-label="Remove palette"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <hr className="my-8" />
      <h4 className="font-semibold mb-2">Create Custom Palette</h4>
      <CreatePalette onCreate={addCustomPalette} />
    </div>
  );
};
