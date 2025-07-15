import React from 'react';
import { z } from 'zod';
import { zColor } from "@remotion/zod-types";
import { fontFamily as defaultFontFamily } from "@remotion/google-fonts/Inter";

export const typographySchema = z.object({
  text: z.string().default("Hello World"),
  textColor: zColor().default("#fff"),
  fontSize: z.number().optional(),
  fontWeight: z.number().default(550),
  fontFamily: z.string().default(defaultFontFamily),
  textAlign: z.enum(["left", "center", "right"]).default("center"),
});

export type TypographyProps = z.infer<typeof typographySchema>;

export const Typography: React.FC<TypographyProps> = ({
  text,
  textColor,
  fontSize,
  fontWeight,
  fontFamily,
  textAlign,
}) => {
  return (
    <div
      style={{
        color: textColor,
        fontSize,
        fontWeight,
        fontFamily,
        textAlign,
      }}
    >
      {text}
    </div>
  );
};