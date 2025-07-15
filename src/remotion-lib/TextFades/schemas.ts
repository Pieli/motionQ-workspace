import { fontFamily as defaultFontFamily } from "@remotion/google-fonts/Inter";
import { zColor } from "@remotion/zod-types";
import { z } from 'zod';

export const typographySchema = z.object({
  text: z.string().default("Hello World"),
  textColor: zColor().default("#fff"),
  fontSize: z.number().optional(),
  fontWeight: z.number().default(550),
  fontFamily: z.string().default(defaultFontFamily),
  textAlign: z.enum(["left", "center", "right"]).default("center"),
});

export const simpleFadeSchema = typographySchema.extend({
  fadeDuration: z.number().default(80),
  fadeAngle: z.number().default(-45),
});

export const simpleTypingSchema = typographySchema.extend({
  typingDuration: z.number().default(60),
  damping: z.number().default(100),
});

export const slideInSchema = typographySchema.extend({
  slideDistance: z.number().default(1000),
  slideDuration: z.number().default(30),
  damping: z.number().default(400),
});

export const fadeInSchema = typographySchema.extend({
  fadeDuration: z.number().default(1.5),
});

export const scaleUpDownSchema = typographySchema.extend({
});

export type TypographyProps = z.infer<typeof typographySchema>;
export type SimpleFadeProps = z.infer<typeof simpleFadeSchema>;
export type SimpleTypingProps = z.infer<typeof simpleTypingSchema>;
export type SlideInProps = z.infer<typeof slideInSchema>;
export type FadeInProps = z.infer<typeof fadeInSchema>;
export type ScaleUpDownProps = z.infer<typeof scaleUpDownSchema>;
