import * as zodTypes from "@remotion/zod-types";
import { z } from "zod";

import {
    FadeInTransition,
    fadeInSchema,
} from "@/remotion-lib/TextFades/FadeInText";

import {
    SlideInTransition,
    slideInSchema,
} from "@/remotion-lib/TextFades/SlideInText";


import {
    SimpleTextTyping,
    simpleTypingSchema,
} from "@/remotion-lib/TextFades/SimpleTextTyping";


import {
    ScaleUpDownTransition,
    scaleUpDownSchema,
} from "@/remotion-lib/TextFades/ScaldeUpDowText";

import { GradientMesh, GradientMeshPropsSchema } from "./textures/GradientMesh";
import { PlainBackground, PlainBackgroundSchema } from "./textures/PlainBackground";



export interface AnimationBinding {
    name: string,
    usecase: string,
    settings: string,
}


// Create a map for animations
export const animationMap = {
    slideInTransition: {
        component: SlideInTransition,
        schema: slideInSchema,
    },
    fadeInTransition: {
        component: FadeInTransition,
        schema: fadeInSchema,
    },
    simpleTextTyping: {
        component: SimpleTextTyping,
        schema: simpleTypingSchema,
    }, 
    scaleUpDownTransition: {
        component: ScaleUpDownTransition,
        schema: scaleUpDownSchema,
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
    }
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
        usecase: "Text scales up from the center. Text jumps out to present something.",
        settings: getSchemaDescription(scaleUpDownSchema)
    },
    {
        name: "simpleTextTyping",
        usecase: "Reveals text gradually. For points that visualize typing, manual entry, but also to highlight the written text, because the viewers wait to see the content unveiled.",
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

]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSchemaDescription(schema: z.ZodObject<any>) {
    return Object.entries(schema.shape).map(([key, value]) => {

        let type: string;
        let constraints = "";
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
        } else {
            type = "unknown";
        }

        return `${key}: ${type}${constraints}`;
    }).join(', ');
}
