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

import { GradientMesh, GradientMeshPropsSchema } from "./textures/GradientMesh";
import { GrowingDark, GrowingDarkPropsSchema } from "./textures/growing-darkess";
import { PlainBackground, PlainBackgroundSchema } from "./textures/PlainBackground";
import { StairsMesh, StairsMeshPropsSchema } from "./textures/staris-texture";
import { StairsMeshPropsSchemaV2, StairsMeshV2 } from "./textures/staris-texture-v2";
import { StairsMeshPropsSchemaV3, StairsMeshV3 } from "./textures/staris-texture-v3";
import { TwinMesh, TwinMeshPropsSchema } from "./textures/twins-texture";


export interface AnimationBinding {
    name: string,
    usecase: string,
    settings: string,
}


const exceptions = ["typo_textColor", "typo_text"]
const blacklist = Object.keys(typographySchema.shape).filter((key) => !exceptions.includes(key));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFilteredSchema(schema: z.ZodObject<any>): z.ZodObject<any> {
    const filteredShape = Object.entries(schema.shape)
        .filter(([key]) => !blacklist.includes(key))
        .reduce((acc, [key, value ]) => {
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
        }, {} as Record<string, z.ZodTypeAny>);

    return z.object(filteredShape);
}


// Create a map for animations
export const animationMap = {
    slideInTransition: {
        component: SlideInTransition,
        schema: getFilteredSchema(slideInSchema),
    },
    fadeInTransition: {
        component: FadeInTransition,
        schema: getFilteredSchema(fadeInSchema),
    },
    simpleTextTyping: {
        component: SimpleTextTyping,
        schema: getFilteredSchema(simpleTypingSchema),
    },
    scaleUpDownTransition: {
        component: ScaleUpDownTransition,
        schema: getFilteredSchema(scaleUpDownSchema),
    }
} as const;


export const backgroundMap = {
    gradientMesh: {
        component: GradientMesh,
        schema: GradientMeshPropsSchema
    },
    plainBackground: {
        component: PlainBackground,
        schema: PlainBackgroundSchema,
    },
    twinTexture: {
        component: TwinMesh,
        schema: TwinMeshPropsSchema,
    },
    stairsTexture: {
        component: StairsMesh,
        schema: StairsMeshPropsSchema,
    },
    stairsTextureV2: {
        component: StairsMeshV2,
        schema: StairsMeshPropsSchemaV2,
    },
    stairsTextureV3: {
        component: StairsMeshV3,
        schema: StairsMeshPropsSchemaV3,
    },
    growingDark: {
        component: GrowingDark,
        schema: GrowingDarkPropsSchema,
    },
} as const

// add binding here and to the animation map
export const bindings: AnimationBinding[] = [
    {
        name: "slideInTransition",
        usecase: "Moving text into frame from left to right direction. Best for dramatic entrances or sequential reveals.",
        settings: getSchemaDescription(slideInSchema)
    },
    {
        name: "fadeInTransition",
        usecase: "Smooth fade in effects. Ideal for subtle transitions or gentle text appearances. soft.",
        settings: getSchemaDescription(fadeInSchema)
    },
    {
        name: "scaleUpDownTransition",
        usecase: "Text scales up from the center. Text jumps out to present something. This is used to specifically emphazise a word.",
        settings: getSchemaDescription(scaleUpDownSchema)
    },
    {
        name: "simpleTextTyping",
        usecase: "Reveals text gradually. For points that visualize typing, manual entry, but also to highlight the longer written text, because the viewers wait to see the content unveiled.",
        settings: getSchemaDescription(simpleTypingSchema)
    },
];


export const backgroundTexturesBindings: AnimationBinding[] = [
    {

        name: "plainBackground",
        usecase: "use this sparingly, it is just a simple background, if you use it use also other colors than white",
        settings: getSchemaDescription(PlainBackgroundSchema)
    },
    {
        name: "gradientMesh",
        usecase: "gradients are aesthetic. more on the techy side. modern feel.",
        settings: getSchemaDescription(GradientMeshPropsSchema)
    },
    {
        name: "twinTexture",
        usecase: "gradients are aesthetic. more on the techy side. modern feel.",
        settings: getSchemaDescription(TwinMeshPropsSchema)
    },
    {
        name: "stairsTexture",
        usecase: "gradients are aesthetic. more on the techy side. modern feel.",
        settings: getSchemaDescription(StairsMeshPropsSchema)
    },
    {
        name: "stairsTextureV2",
        usecase: "gradients are aesthetic. more on the techy side. modern feel.",
        settings: getSchemaDescription(StairsMeshPropsSchemaV2)
    },
    {
        name: "stairsTextureV3",
        usecase: "gradients are aesthetic. more on the techy side. modern feel.",
        settings: getSchemaDescription(StairsMeshPropsSchemaV3)
    },
    {
        name: "growingDark",
        usecase: "gradients are aesthetic. more on the techy side. modern feel. Only use white fonts to write on it.",
        settings: getSchemaDescription(GrowingDarkPropsSchema)
    },


]

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSchemaDescription(schema: z.ZodObject<any>) {
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
                    type = value._def.description === zodTypes.ZodZypesInternals.REMOTION_COLOR_BRAND
                        ? "color-hex"
                        : "unknown";
                    break;
                default:
                    type = typeName.replace("Zod", "").toLowerCase();
            }

            // Add default value if present
            if (value._def.defaultValue !== undefined) {
                const defaultValue = typeof value._def.defaultValue === 'function' 
                    ? value._def.defaultValue() 
                    : value._def.defaultValue;
                constraints += `, default: ${defaultValue}`;
            }
        } else {
            type = "unknown";
        }

        return `${key}: ${type} ${constraints}`;
    }).join(', ');
}

