import { z } from "zod";
import * as  zodTypes from "@remotion/zod-types"

import {
    FadeInOutTransition,
    fadeInOutSchema,
} from "@/remotion-lib/TextFades/FadeInText";


import {
    SlideInTransition,
    slideInSchema,
} from "@/remotion-lib/TextFades/SlideInText";


export const AvailableAnimations = z.enum(['slideInTransition', 'fadeInOutTransition'])
export const UnionOfAvailableSchemas = z.union([slideInSchema, fadeInOutSchema])
export type AnimationType = z.infer<typeof AvailableAnimations>;

type AnimationProps = {
    slideInTransition: z.infer<typeof slideInSchema>;
    fadeInOutTransition: z.infer<typeof fadeInOutSchema>;
};

export function schemaFactory(name: string) {
    switch(name) {
        case "slideInTransition":
            return slideInSchema;
        case "fadeInOutTransition":
            return fadeInOutSchema;
        default:
            return null;
    }
}

export function AnimationFactory<T extends AnimationType>(
    name: T
): React.FC<AnimationProps[T]> | null {
    switch(name) {
        case "slideInTransition":
            return SlideInTransition as React.FC<AnimationProps[T]>;
        case "fadeInOutTransition":
            return FadeInOutTransition as React.FC<AnimationProps[T]>;
        default:
            console.error("No Animation found for", name);
            return null;
    }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSchemaDescription(schema: z.ZodObject<any>) {
    return Object.entries(schema.shape).map(([key, value]) => {

        let type: string;
        if (value instanceof z.ZodType) {
            const typeName = value._def.typeName;

            switch (typeName) {
            case "ZodString":
                type = "string";
                break;
            case "ZodNumber":
                type = "number";
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

        return `${key}: ${type}`;
    }).join(', ');
}


