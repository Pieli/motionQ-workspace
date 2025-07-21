import React from "react";
import { z } from "zod";
import { fitText } from "@remotion/layout-utils";
import { typographySchema } from "@/remotion-lib/TextFades/schemas";

export type TypographyProps = z.infer<typeof typographySchema>;

export const Typography: React.FC<TypographyProps> = ({
  typo_text,
  typo_textColor,
  typo_fontSize,
  typo_fontWeight,
  typo_fontFamily,
  typo_textAlign,
  typo_letter_spacing,
}) => {
  const maxWidth = 1536;
  const { fontSize: fittedFontSize } = fitText({
    text: typo_text,
    withinWidth: maxWidth,
    fontFamily: typo_fontFamily,
    fontWeight: typo_fontWeight,
  });

  return (
    <div
      style={{
        color: typo_textColor,
        fontSize: typo_fontSize || fittedFontSize,
        fontWeight: typo_fontWeight,
        fontFamily: typo_fontFamily,
        textAlign: typo_textAlign,
        letterSpacing: typo_letter_spacing * (typo_fontSize || fittedFontSize),
      }}
    >
      {typo_text}
    </div>
  );
};
