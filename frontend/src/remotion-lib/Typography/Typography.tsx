import React, { useState, useEffect } from "react";
import { z } from "zod";
import { fitText } from "@remotion/layout-utils";
import { typographySchema } from "../TextFades/schemas";

import { top250 as fonts } from "../popular-fonts";
import { fontFamily as defaultFontFamily } from "@remotion/google-fonts/Inter";
export type TypographyProps = z.infer<typeof typographySchema>;

export const Typography: React.FC<TypographyProps> = ({
  typo_text,
  typo_textColor,
  typo_fontSize,
  typo_fontWeight,
  typo_fontFamily,
  typo_textAlign,
  typo_letter_spacing,
  typo_verticalAlign,
}) => {
  const maxWidth = 1536;

  const [fontFamily, setFontFamily] = useState<string>(defaultFontFamily);

  useEffect(() => {
    async function loadFont(fontName: string): Promise<string> {
      try {
        const selectedFont = fonts.find((font) => font.family === fontName);
        if (!selectedFont) {
          return defaultFontFamily;
        }
        const imported = await selectedFont.load();
        const { fontFamily } = imported?.loadFont() ?? {
          fontFamily: defaultFontFamily,
        };
        return fontFamily;
      } catch (error) {
        console.warn(`Failed to load font ${fontName}:`, error);
        return defaultFontFamily;
      }
    }

    loadFont(typo_fontFamily).then(setFontFamily);
  }, [typo_fontFamily]);

  const { fontSize: fittedFontSize } = fitText({
    text: typo_text,
    withinWidth: maxWidth,
    fontFamily: fontFamily,
    fontWeight: typo_fontWeight,
  });

  return (
    <div
      style={{
        color: typo_textColor,
        fontSize: typo_fontSize || fittedFontSize,
        fontWeight: typo_fontWeight,
        fontFamily: fontFamily,
        textAlign: typo_textAlign,
        letterSpacing: `${typo_letter_spacing / 100}rem`,
        verticalAlign: typo_verticalAlign,
      }}
    >
      {typo_text}
    </div>
  );
};
