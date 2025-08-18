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
 * Check if a field should be blacklisted for a component
 */
export function isFieldBlacklisted(
  componentName: string,
  fieldName: string,
): boolean {
  const blacklistedFields = getBlacklistedFields(componentName);
  return blacklistedFields.includes(fieldName);
}
