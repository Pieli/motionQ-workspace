import { z } from "zod";

/**
 * Configuration for blacklisting schema fields from LLM input
 * Fields listed here will be excluded from the llm_schema used for AI generation
 */

export interface BlacklistConfig {
  // Global fields to exclude from all schemas
  global: string[];

  // Per-component blacklists - key should match the component name in animationMap
  [componentName: string]: string[];
}

export const schemaBlacklistConfig: BlacklistConfig = {
  // Global blacklist - fields excluded from all components
  global: [],

  // Typography-based components (text animations)
  typography: [
    "typo_fontSize",
    "typo_fontWeight",
    "typo_fontFamily",
    "typo_letter_spacing",
    "typo_textAlign",
    "typo_verticalAlign",
  ],

  // Background texture components
  gradientMesh: ["positionSeed", "directionSeed", "extraPoints"],

  singleColorGradientMesh: ["positionSeed", "directionSeed", "extraPoints"],

  multiColorGradientMesh: ["positionSeed", "directionSeed", "extraPoints"],

  twinTexture: [],

  stairsTexture: [],

  stairsTextureV2: [],

  stairsTextureV3: [],

  plainBackground: [],

  growingDark: [],
};

/**
 * Get blacklisted fields for a specific component
 * Combines global blacklist with component-specific blacklist
 */
export function getBlacklistedFields(componentName: string): string[] {
  const globalBlacklist = schemaBlacklistConfig.global || [];
  const componentBlacklist = schemaBlacklistConfig[componentName] || [];

  return [...globalBlacklist, ...componentBlacklist];
}

/**
 * Create filtered schema for LLM by removing blacklisted fields, defaults, and optionals
 */
export function getFilteredSchema(
  schema: z.AnyZodObject,
  componentName: string,
): z.AnyZodObject {
  const blacklistedFields = getBlacklistedFields(componentName);

  const filteredShape = Object.entries(schema.shape)
    .filter(([key]) => !blacklistedFields.includes(key))
    .reduce(
      (acc, [key, value]) => {
        let processedValue = value as z.ZodTypeAny;

        // Recursively remove defaults and optionals
        processedValue = removeDefaultsAndOptionals(processedValue);

        acc[key] = processedValue;
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>,
    );

  return z.object(filteredShape);
}

/**
 * Remove defaults and optionals from a Zod type
 */
function removeDefaultsAndOptionals(zodType: z.ZodTypeAny): z.ZodTypeAny {
  let current = zodType;
  let hasChanges = true;

  // Keep processing until no more changes
  while (hasChanges) {
    hasChanges = false;

    // Remove defaults
    if (current instanceof z.ZodDefault) {
      current = current.removeDefault();
      hasChanges = true;
    }

    // Remove optionals
    if (current instanceof z.ZodOptional) {
      current = current.unwrap();
      hasChanges = true;
    }
  }

  return current;
}
