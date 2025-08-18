import * as zodTypes from "@remotion/zod-types";
import { z } from "zod";

import { FadeInTransition } from "@/remotion-lib/TextFades/FadeInText";
import { ScaleUpDownTransition } from "@/remotion-lib/TextFades/ScaleUpDownText";
import { SimpleTextTyping } from "@/remotion-lib/TextFades/SimpleTextTyping";
import { SlideInTransition } from "@/remotion-lib/TextFades/SlideInText";

import {
  fadeInSchema,
  scaleUpDownSchema,
  simpleTypingSchema,
  slideInSchema,
  typographySchema,
} from "@/remotion-lib/TextFades/schemas";

import { GradientMesh, SingleColorGradientMesh, MultiColorGradientMesh } from "./textures/GradientMesh";
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

const exceptions = ["typo_textColor", "typo_text"];
const blacklist = Object.keys(typographySchema.shape).filter(
  (key) => !exceptions.includes(key),
);

function getFilteredSchema(schema: z.AnyZodObject): z.AnyZodObject {
  // filter out blacklist + remove defaults / optionals
  const filteredShape = Object.entries(schema.shape)
    .filter(([key]) => !blacklist.includes(key))
    .reduce(
      (acc, [key, value]) => {
        let processedValue = value as z.ZodTypeAny;

        // Remove defaults
        if (processedValue instanceof z.ZodDefault) {
          processedValue = processedValue.removeDefault();
        }

        // Remove optionals
        if (processedValue instanceof z.ZodOptional) {
          processedValue = processedValue.unwrap();
        }

        acc[key] = processedValue;
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>,
    );

  return z.object(filteredShape);
}

// Create a map for animations
// schema -> contains all the possilbe changeable pareameters with defaults etc.
// llm_schema -> should not contain the blacklisted keys, or defaults, optionals
export const animationMap = {
  slideInTransition: {
    component: SlideInTransition,
    schema: slideInSchema,
    llm_schema: getFilteredSchema(slideInSchema),
  },
  fadeInTransition: {
    component: FadeInTransition,
    schema: fadeInSchema,
    llm_schema: getFilteredSchema(fadeInSchema),
  },
  simpleTextTyping: {
    component: SimpleTextTyping,
    schema: simpleTypingSchema,
    llm_schema: getFilteredSchema(simpleTypingSchema),
  },
  scaleUpDownTransition: {
    component: ScaleUpDownTransition,
    schema: scaleUpDownSchema,
    llm_schema: getFilteredSchema(scaleUpDownSchema),
  },
} as const;

export const backgroundMap = {
  gradientMesh: {
    component: GradientMesh,
    schema: gradientMeshSchema,
  },
  singleColorGradientMesh: {
    component: SingleColorGradientMesh,
    schema: singleColorGradientMeshSchema,
  },
  multiColorGradientMesh: {
    component: MultiColorGradientMesh,
    schema: multiColorGradientMeshSchema,
  },
  plainBackground: {
    component: PlainBackground,
    schema: plainBackgroundSchema,
  },
  twinTexture: {
    component: TwinMesh,
    schema: twinMeshSchema,
  },
  stairsTexture: {
    component: StairsMesh,
    schema: stairsMeshSchema,
  },
  stairsTextureV2: {
    component: StairsMeshV2,
    schema: stairsMeshSchemaV2,
  },
  stairsTextureV3: {
    component: StairsMeshV3,
    schema: stairsMeshSchemaV3,
  },
  growingDark: {
    component: GrowingDark,
    schema: growingDarkSchema,
  },
} as const;

// add binding here and to the animation map
export const bindings: AnimationBinding[] = [
  {
    name: "slideInTransition",
    usecase:
      "Moving text into frame from left to right direction. Best for dramatic entrances or sequential reveals.",
    settings: getSchemaDescription(slideInSchema),
  },
  {
    name: "fadeInTransition",
    usecase:
      "Smooth fade in effects. Ideal for subtle transitions or gentle text appearances. soft.",
    settings: getSchemaDescription(fadeInSchema),
  },
  {
    name: "scaleUpDownTransition",
    usecase:
      "Text scales up from the center. Text jumps out to present something. This is used to specifically emphazise a word.",
    settings: getSchemaDescription(scaleUpDownSchema),
  },
  {
    name: "simpleTextTyping",
    usecase:
      "Reveals text gradually. For points that visualize typing, manual entry, but also to highlight the longer written text, because the viewers wait to see the content unveiled.",
    settings: getSchemaDescription(simpleTypingSchema),
  },
];

export const backgroundTexturesBindings: AnimationBinding[] = [
  {
    name: "plainBackground",
    usecase:
      "use this sparingly, it is just a simple background, if you use it use also other colors than white",
    settings: getSchemaDescription(plainBackgroundSchema),
  },
  {
    name: "gradientMesh",
    usecase: "gradients are aesthetic. more on the techy side. modern feel.",
    settings: getSchemaDescription(gradientMeshSchema),
  },
  {
    name: "singleColorGradientMesh",
    usecase: "Single color gradient mesh - modern, minimalistic aesthetic. Uses one color for all blobs.",
    settings: getSchemaDescription(singleColorGradientMeshSchema),
  },
  {
    name: "multiColorGradientMesh",
    usecase: "Multi-color gradient mesh - vibrant, dynamic aesthetic. Cycles through multiple colors for visual variety.",
    settings: getSchemaDescription(multiColorGradientMeshSchema),
  },
  {
    name: "twinTexture",
    usecase: "gradients are aesthetic. more on the techy side. modern feel.",
    settings: getSchemaDescription(twinMeshSchema),
  },
  {
    name: "stairsTexture",
    usecase: "gradients are aesthetic. more on the techy side. modern feel.",
    settings: getSchemaDescription(stairsMeshSchema),
  },
  {
    name: "stairsTextureV2",
    usecase: "gradients are aesthetic. more on the techy side. modern feel.",
    settings: getSchemaDescription(stairsMeshSchemaV2),
  },
  {
    name: "stairsTextureV3",
    usecase: "gradients are aesthetic. more on the techy side. modern feel.",
    settings: getSchemaDescription(stairsMeshSchemaV3),
  },
  {
    name: "growingDark",
    usecase:
      "gradients are aesthetic. more on the techy side. modern feel. Only use white fonts to write on it. Should be 60 frames long",
    settings: getSchemaDescription(growingDarkSchema),
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

export function getSchemaDescription(schema: z.AnyZodObject) {
  return Object.entries(schema.shape)
    .filter(([key]) => !blacklist.includes(key))
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
