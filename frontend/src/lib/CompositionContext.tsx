import React, { createContext, useContext, useState, useCallback } from "react";
import type { CompositionConfig } from "@/components/interfaces/compositions";
import type { BaseItem } from "@/components/timeline/Timeline";

interface CompositionContextType {
  compositions: CompositionConfig[] | null;
  setCompositions: React.Dispatch<React.SetStateAction<CompositionConfig[] | null>>;
  selectedItem: BaseItem | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<BaseItem | null>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  clearSelectedProperty: () => void;
}

const CompositionContext = createContext<CompositionContextType | undefined>(undefined);

export function CompositionProvider({ children }: { children: React.ReactNode }) {
  const [compositions, setCompositions] = useState<CompositionConfig[] | null>(null);
  const [selectedItem, setSelectedItem] = useState<BaseItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const clearSelectedProperty = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <CompositionContext.Provider
      value={{
        compositions,
        setCompositions,
        selectedItem,
        setSelectedItem,
        isGenerating,
        setIsGenerating,
        clearSelectedProperty,
      }}
    >
      {children}
    </CompositionContext.Provider>
  );
}

export const useComposition = () => {
  const context = useContext(CompositionContext);
  if (context === undefined) {
    throw new Error("useComposition must be used within a CompositionProvider");
  }
  return context;
};