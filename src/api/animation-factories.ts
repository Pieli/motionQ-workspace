import * as zodTypes from "@remotion/zod-types";
import { z } from "zod";

import {
    FadeInTransition,
    fadeInOutSchema,
} from "@/remotion-lib/TextFades/FadeInText";

import {
    SlideInTransition,
    slideInSchema,
} from "@/remotion-lib/TextFades/SlideInText";

import type { AnimationBinding } from "@/components/interfaces/llm";

// Create a map for animations
export const animationMap = {
    slideInTransition: {
        component: SlideInTransition,
        schema: slideInSchema,
    },
    fadeInOutTransition: {
        component: FadeInTransition,
        schema: fadeInOutSchema,
    },
} as const;

export type AnimationComponents = (typeof animationMap)[keyof typeof animationMap]['component'];


// Create the AvailableAnimations enum dynamically from the keys of the map
export const AvailableAnimations = z.enum(
    Object.keys(animationMap) as [keyof typeof animationMap, ...Array<keyof typeof animationMap>]
);

export type AnimationType = z.infer<typeof AvailableAnimations>;

// Define AnimationProps using a mapped type
export type AnimationProps = {
    [K in keyof typeof animationMap]: z.infer<typeof animationMap[K]['schema']>
};

// Updated factories using the map dynamically
export function schemaFactory(name: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const record = animationMap as Record<string, { schema: z.ZodObject<any> }>;
    return record[name]?.schema ?? null;
}

export function animationFactory<T extends AnimationType>(
    name: T
): React.FC<AnimationProps[T]> | null {
    const record = animationMap as Record<string, { component: AnimationComponents }>;
    return record[name]?.component ?? null;
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

export function generateAnimationContext(bindings: AnimationBinding[]): string {
    return bindings.map(animation =>
        `Animation: ${animation.name}\nUse case: ${animation.usecase}\nParameters: ${animation.settings}\n`
    ).join('\n');
}
