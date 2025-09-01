import React, { createContext, useContext, useState, useCallback } from "react";

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

interface ColorPaletteContextType {
  currentPalette: ColorPalette | null;
  setCurrentPalette: React.Dispatch<React.SetStateAction<ColorPalette | null>>;
  updatePalette: (colors: string[]) => void;
  clearPalette: () => void;
  formatPaletteForPrompt: () => string;
}

const ColorPaletteContext = createContext<ColorPaletteContextType | undefined>(undefined);


export function ColorPaletteProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette | null>(null);

  const updatePalette = useCallback((colors: string[]) => {
    const newPalette: ColorPalette = {
      id: `palette-${Date.now()}`,
      name: "Custom Palette",
      colors: colors
    };
    setCurrentPalette(newPalette);
  }, []);

  const clearPalette = useCallback(() => {
    setCurrentPalette(null);
  }, []);

  const formatPaletteForPrompt = useCallback(() => {
    if (!currentPalette || currentPalette.colors.length === 0) {
      return "";
    }
    
    return `Use this color palette for the animation: ${currentPalette.colors.join(", ")}. Apply these colors appropriately to text, backgrounds, and other elements to create a cohesive visual design.`;
  }, [currentPalette]);

  return (
    <ColorPaletteContext.Provider
      value={{
        currentPalette,
        setCurrentPalette,
        updatePalette,
        clearPalette,
        formatPaletteForPrompt,
      }}
    >
      {children}
    </ColorPaletteContext.Provider>
  );
}

export const useColorPalette = () => {
  const context = useContext(ColorPaletteContext);
  if (context === undefined) {
    throw new Error("useColorPalette must be used within a ColorPaletteProvider");
  }
  return context;
};