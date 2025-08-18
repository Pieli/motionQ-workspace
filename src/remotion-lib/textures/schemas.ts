import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// Plain Background Schema
export const plainBackgroundSchema = z.object({
  backgroundColor: zColor().default("#1e1e1e"),
});

// Base Gradient Mesh Schema
const baseGradientMeshSchema = z.object({
  extraPoints: z.number().min(0).default(14),
  size: z.number().min(1).max(150).default(30),
  speed: z.number().min(0).default(12),
  blur: z.number().min(0).max(500).default(200),
  edginess: z.number().min(0).max(300).default(4),
  positionSeed: z.number().min(0).max(1000).default(3),
  directionSeed: z.number().min(0).max(1000).default(47),
  backgroundColor: zColor().default("#1e1e1e"),
});

// Single Color Gradient Mesh Schema
export const singleColorGradientMeshSchema = baseGradientMeshSchema.extend({
  color: zColor().default("#ff0000"),
});

// Multi Color Gradient Mesh Schema  
export const multiColorGradientMeshSchema = baseGradientMeshSchema.extend({
  colors: z.array(zColor()).default(["#6d213c", "#946846", "#baab68", "#e3c16f", "#faff70"]),
});

// Legacy Gradient Mesh Schema (for backward compatibility)
export const gradientMeshSchema = singleColorGradientMeshSchema;

// Twin Mesh Schema
export const twinMeshSchema = z.object({
  backgroundColor: zColor().default("#1e1e1e"),
});

// Growing Dark Schema
export const growingDarkSchema = z.object({
  backgroundColor: zColor().default("#1e1e1e"),
});

// Stairs Mesh Schema (Original)
export const stairsMeshSchema = z.object({
  backgroundColor: zColor().default("#262234"),
  blob_1_background_color: zColor().default("#5C4B9F"),
  blob_2_background_color: zColor().default("#444D9E"),
});

// Stairs Mesh V2 Schema
export const stairsMeshSchemaV2 = z.object({
  backgroundColor: zColor().default("#262234"),
  blob_1_background_color: zColor().default("#5C4B9F"),
  blob_2_background_color: zColor().default("#444D9E"),
});

// Stairs Mesh V3 Schema
export const stairsMeshSchemaV3 = z.object({
  backgroundColor: zColor().default("#262234"),
  blob_1_background_color: zColor().default("#5C4B9F"),
  blob_2_background_color: zColor().default("#444D9E"),
});

// Type exports
export type PlainBackgroundProps = z.infer<typeof plainBackgroundSchema>;
export type SingleColorGradientMeshProps = z.infer<typeof singleColorGradientMeshSchema>;
export type MultiColorGradientMeshProps = z.infer<typeof multiColorGradientMeshSchema>;
export type GradientMeshProps = z.infer<typeof gradientMeshSchema>; // Legacy type
export type TwinMeshProps = z.infer<typeof twinMeshSchema>;
export type GrowingDarkProps = z.infer<typeof growingDarkSchema>;
export type StairsMeshProps = z.infer<typeof stairsMeshSchema>;
export type StairsMeshPropsV2 = z.infer<typeof stairsMeshSchemaV2>;
export type StairsMeshPropsV3 = z.infer<typeof stairsMeshSchemaV3>;

// Legacy exports for backward compatibility
export const StairsMeshPropsSchema = stairsMeshSchema;
export const StairsMeshPropsSchemaV2 = stairsMeshSchemaV2;
export const StairsMeshPropsSchemaV3 = stairsMeshSchemaV3;
