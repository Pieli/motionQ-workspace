import { z } from "zod";

import type { AnimationBinding } from "@/remotion-lib/animation-bindings";
import { animationMap } from "@/remotion-lib/animation-bindings";


export type AnimationComponents = (typeof animationMap)[keyof typeof animationMap]['component'];

const schemas: z.ZodType[] = Object.values(animationMap).map((animation) => animation.schema); 
if (schemas.length < 2) {
    throw Error("Too few schemas provided... at leas 2 needed");
}
export const UnionAvailableSchemas = z.union(schemas as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]);

// Create the AvailableAnimations enum dynamically from the keys of the map
export const EnumAvailableAnimations = z.enum(
    Object.keys(animationMap) as [keyof typeof animationMap, ...Array<keyof typeof animationMap>]
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

export function animationFactory<T extends keyof typeof animationMap>(
  name: T
): React.FC<AnimationProps[T]> {
  return animationMap[name].component as React.FC<AnimationProps[T]>;
}

export function generateAnimationContext(bindings: AnimationBinding[]): string {
    return bindings.map(animation =>
        `Animation: ${animation.name}\nUse case: ${animation.usecase}\nParameters: ${animation.settings}\n`
    ).join('\n');
}
