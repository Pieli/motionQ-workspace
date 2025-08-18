import * as zodTypes from "@remotion/zod-types";
import { z } from "zod";

import { getFilteredSchema, getBlacklistedFields } from "@/remotion-lib/schema-config";

import { FadeInTransition } from "@/remotion-lib/TextFades/FadeInText";
import { ScaleUpDownTransition } from "@/remotion-lib/TextFades/ScaleUpDownText";
import { SimpleTextTyping } from "@/remotion-lib/TextFades/SimpleTextTyping";
import { SlideInTransition } from "@/remotion-lib/TextFades/SlideInText";

import {
  fadeInSchema,
  scaleUpDownSchema,
  simpleTypingSchema,
  slideInSchema,
} from "@/remotion-lib/TextFades/schemas";

import {
  GradientMesh,
  SingleColorGradientMesh,
  MultiColorGradientMesh,
} from "./textures/gradientMesh";
import { GrowingDark } from "./textures/growing-darkess";
import { PlainBackground } from "./textures/PlainBackground";
import { StairsMesh } from "./textures/staris-texture";
import { StairsMeshV2 } from "./textures/staris-texture-v2";
import { StairsMeshV3 } from "./textures/staris-texture-v3";
import { TwinMesh } from "./textures/twins-texture";
import {
  gradientMeshSchema,
  singleColorGradientMeshSchema,
  multiColorGradientMeshSchema,
  growingDarkSchema,
  plainBackgroundSchema,
  stairsMeshSchema,
  stairsMeshSchemaV2,
  stairsMeshSchemaV3,
  twinMeshSchema,
} from "./textures/schemas";

export interface AnimationBinding {
  name: string;
  usecase: string;
  settings: string;
}


// Create a map for animations
// schema -> contains all the possilbe changeable pareameters with defaults etc.
// llm_schema -> should not contain the blacklisted keys, or defaults, optionals
export const animationMap = {
  slideInTransition: {
    component: SlideInTransition,
    schema: slideInSchema,
    llm_schema: getFilteredSchema(slideInSchema, "typography"),
  },
  fadeInTransition: {
    component: FadeInTransition,
    schema: fadeInSchema,
    llm_schema: getFilteredSchema(fadeInSchema, "typography"),
  },
  simpleTextTyping: {
    component: SimpleTextTyping,
    schema: simpleTypingSchema,
    llm_schema: getFilteredSchema(simpleTypingSchema, "typography"),
  },
  scaleUpDownTransition: {
    component: ScaleUpDownTransition,
    schema: scaleUpDownSchema,
    llm_schema: getFilteredSchema(scaleUpDownSchema, "typography"),
  },
} as const;

export const backgroundMap = {
  gradientMesh: {
    component: GradientMesh,
    schema: gradientMeshSchema,
    llm_schema: getFilteredSchema(gradientMeshSchema, "gradientMesh"),
  },
  singleColorGradientMesh: {
    component: SingleColorGradientMesh,
    schema: singleColorGradientMeshSchema,
    llm_schema: getFilteredSchema(singleColorGradientMeshSchema, "singleColorGradientMesh"),
  },
  multiColorGradientMesh: {
    component: MultiColorGradientMesh,
    schema: multiColorGradientMeshSchema,
    llm_schema: getFilteredSchema(multiColorGradientMeshSchema, "multiColorGradientMesh"),
  },
  plainBackground: {
    component: PlainBackground,
    schema: plainBackgroundSchema,
    llm_schema: getFilteredSchema(plainBackgroundSchema, "plainBackground"),
  },
  twinTexture: {
    component: TwinMesh,
    schema: twinMeshSchema,
    llm_schema: getFilteredSchema(twinMeshSchema, "twinTexture"),
  },
  stairsTexture: {
    component: StairsMesh,
    schema: stairsMeshSchema,
    llm_schema: getFilteredSchema(stairsMeshSchema, "stairsTexture"),
  },
  stairsTextureV2: {
    component: StairsMeshV2,
    schema: stairsMeshSchemaV2,
    llm_schema: getFilteredSchema(stairsMeshSchemaV2, "stairsTextureV2"),
  },
  stairsTextureV3: {
    component: StairsMeshV3,
    schema: stairsMeshSchemaV3,
    llm_schema: getFilteredSchema(stairsMeshSchemaV3, "stairsTextureV3"),
  },
  growingDark: {
    component: GrowingDark,
    schema: growingDarkSchema,
    llm_schema: getFilteredSchema(growingDarkSchema, "growingDark"),
  },
} as const;

// add binding here and to the animation map
export const bindings: AnimationBinding[] = [
  {
    name: "slideInTransition",
    usecase:
      "Moving text into frame from left to right direction. Best for dramatic entrances or sequential reveals.",
    settings: getSchemaDescription(slideInSchema, "typography"),
  },
  {
    name: "fadeInTransition",
    usecase:
      "Smooth fade in effects. Ideal for subtle transitions or gentle text appearances. soft.",
    settings: getSchemaDescription(fadeInSchema, "typography"),
  },
  {
    name: "scaleUpDownTransition",
    usecase:
      "Text scales up from the center. Text jumps out to present something. This is used to specifically emphazise a word.",
    settings: getSchemaDescription(scaleUpDownSchema, "typography"),
  },
  {
    name: "simpleTextTyping",
    usecase:
      "Reveals text gradually. For points that visualize typing, manual entry, but also to highlight the longer written text, because the viewers wait to see the content unveiled.",
    settings: getSchemaDescription(simpleTypingSchema, "typography"),
  },
];

export const backgroundTexturesBindings: AnimationBinding[] = [
  {
    name: "plainBackground",
    usecase:
      "use this sparingly, it is just a simple background, if you use it use also other colors than white",
    settings: getSchemaDescription(plainBackgroundSchema, "plainBackground"),
  },
  {
    name: "gradientMesh",
    usecase: "gradients are aesthetic. more on the techy side. modern feel.",
    settings: getSchemaDescription(gradientMeshSchema, "gradientMesh"),
  },
  {
    name: "singleColorGradientMesh",
    usecase:
      "Single color gradient mesh - modern, minimalistic aesthetic. Uses one color for all blobs.",
    settings: getSchemaDescription(singleColorGradientMeshSchema, "singleColorGradientMesh"),
  },
  {
    name: "multiColorGradientMesh",
    usecase:
      "Multi-color gradient mesh - vibrant, dynamic aesthetic. Cycles through multiple colors for visual variety.",
    settings: getSchemaDescription(multiColorGradientMeshSchema, "multiColorGradientMesh"),
  },
  {
    name: "twinTexture",
    usecase: "gradients are aesthetic. more on the techy side. modern feel.",
    settings: getSchemaDescription(twinMeshSchema, "twinTexture"),
  },
  {
    name: "stairsTexture",
    usecase: "gradients are aesthetic. more on the techy side. modern feel.",
    settings: getSchemaDescription(stairsMeshSchema, "stairsTexture"),
  },
  {
    name: "stairsTextureV2",
    usecase: "gradients are aesthetic. more on the techy side. modern feel.",
    settings: getSchemaDescription(stairsMeshSchemaV2, "stairsTextureV2"),
  },
  {
    name: "stairsTextureV3",
    usecase: "gradients are aesthetic. more on the techy side. modern feel.",
    settings: getSchemaDescription(stairsMeshSchemaV3, "stairsTextureV3"),
  },
  {
    name: "growingDark",
    usecase:
      "gradients are aesthetic. more on the techy side. modern feel. Only use white fonts to write on it. Should be 60 frames long",
    settings: getSchemaDescription(growingDarkSchema, "growingDark"),
  },
];

function getDefault(zodType: z.ZodTypeAny): unknown {
  if (zodType instanceof z.ZodDefault) {
    return zodType._def.defaultValue();
  }
  // If wrapped (e.g. .optional().default()), unwrap recursively
  if ("innerType" in zodType._def) {
    return getDefault(zodType._def.innerType);
  }
  return undefined;
}

export function getSchemaDescription(schema: z.AnyZodObject, componentName?: string) {
  const blacklistedFields = componentName ? getBlacklistedFields(componentName) : [];
  
  return Object.entries(schema.shape)
    .filter(([key]) => !blacklistedFields.includes(key))
    .map(([key, value]) => {
      let type: string;
      let constraints = "";

      // If it's a ZodDefault, unwrap it and use the inner type
      if (value instanceof z.ZodDefault) {
        const defaultValue = getDefault(value);
        constraints = `[default: ${defaultValue}]`;
        let inner = value.removeDefault() as z.ZodAny;

        // remove optional
        if (inner instanceof z.ZodOptional) {
          inner = inner.unwrap();
          constraints += `, optional: true`;
        }
        value = inner;
      }

      if (value instanceof z.ZodType) {
        const typeName = value._def.typeName;

        switch (typeName) {
          case "ZodString":
            type = "string";
            break;
          case "ZodNumber":
            type = "number";
            // Add min/max for numbers only
            if (value._def.minValue !== undefined) {
              constraints += `, min: ${value._def.minValue}`;
            }
            if (value._def.maxValue !== undefined) {
              constraints += `, max: ${value._def.maxValue}`;
            }
            break;
          case "ZodBoolean":
            type = "boolean";
            break;
          case "ZodEffects":
            type =
              value._def.description ===
              zodTypes.ZodZypesInternals.REMOTION_COLOR_BRAND
                ? "color-hex"
                : "unknown";
            break;
          default:
            type = typeName.replace("Zod", "").toLowerCase();
        }

        // Add default value if present
        if (value._def.defaultValue !== undefined) {
          const defaultValue =
            typeof value._def.defaultValue === "function"
              ? value._def.defaultValue()
              : value._def.defaultValue;
          constraints += `, default: ${defaultValue}`;
        }
      } else {
        type = "unknown";
      }

      return `${key}: ${type} ${constraints}`;
    })
    .join(", ");
}
