import { z } from "zod";

import type { AnimationBinding } from "@/remotion-lib/animation-bindings";
import { animationMap, backgroundMap } from "@/remotion-lib/animation-bindings";


export type AnimationComponents = (typeof animationMap)[keyof typeof animationMap]['component'];

export type BackgroundComponents= (typeof backgroundMap)[keyof typeof backgroundMap]['component'];


// Animation Union of Schemas 
const schemas: z.ZodType[] = Object.values(animationMap).map((animation) => animation.schema); 
if (schemas.length < 2) {
    throw Error("Too few schemas provided... at leas 2 needed");
}
export const UnionAvailableSchemas = z.union(schemas as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]);


// Background Union of Schemas
const backSchemas : z.ZodType[] = Object.values(backgroundMap).map((back) => back.schema); 
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

// Define AnimationProps using a mapped type
export type BackgroundProps= {
    [K in keyof typeof backgroundMap]: z.infer<typeof backgroundMap[K]['schema']>
};

// Updated factories using the map dynamically
export function backgroundSchemaFactory(name: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const record = backgroundMap as Record<string, { schema: z.ZodObject<any> }>;
    return record[name]?.schema ?? null;
}




// factories 

export function animationFactory<T extends keyof typeof animationMap>(
  name: T
): React.FC<AnimationProps[T]> {
  return animationMap[name].component as React.FC<AnimationProps[T]>;
}


export function backgroundFactory<T extends keyof typeof backgroundMap>(
  name: T
): React.FC<BackgroundProps[T]> {
  return backgroundMap[name].component as React.FC<BackgroundProps[T]>;
}





export function generateAnimationContext(bindings: AnimationBinding[]): string {
    return bindings.map(animation =>
        `Animation: ${animation.name}\nUse case: ${animation.usecase}\nParameters: ${animation.settings}\n`
    ).join('\n');
}
