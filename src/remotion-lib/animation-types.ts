import { z } from "zod";

import { animationMap, backgroundMap } from "@/remotion-lib/animation-bindings";

// Animation Union of Schemas
const schemas: z.ZodType[] = Object.values(animationMap).map((animation) => animation.llm_schema);
if (schemas.length < 2) {
    throw Error("Too few schemas provided... at leas 2 needed");
}
export const UnionAvailableSchemas = z.union(schemas as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]);

// Background Union of Schemas
const backSchemas: z.ZodType[] = Object.values(backgroundMap).map((back) => back.schema);
if (backSchemas.length < 2) {
    throw Error("Too few schemas provided... at leas 2 needed");
}
export const UnionAvailableBackSchemas = z.union(backSchemas as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]);

// Create the AvailableAnimations enum dynamically from the keys of the map
export const EnumAvailableAnimations = z.enum(
    Object.keys(animationMap) as [keyof typeof animationMap, ...Array<keyof typeof animationMap>]
);

export const EnumAvailableBackgrounds = z.enum(
    Object.keys(backgroundMap) as [keyof typeof backgroundMap, ...Array<keyof typeof backgroundMap>]
);


export type EnumAvailableAnimationsType = z.infer<typeof EnumAvailableAnimations>;
