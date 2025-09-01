import { z } from "zod";

import type { AnimationBinding } from "@/remotion-lib/animation-bindings";
import { animationMap, backgroundMap } from "@/remotion-lib/animation-bindings";


export type AnimationComponents = (typeof animationMap)[keyof typeof animationMap]['component'];
export type BackgroundComponents= (typeof backgroundMap)[keyof typeof backgroundMap]['component'];


// Define AnimationProps using a mapped type
export type AnimationProps = {
    [K in keyof typeof animationMap]: z.infer<typeof animationMap[K]['schema']>
};

// Define AnimationProps using a mapped type
export type BackgroundProps= {
    [K in keyof typeof backgroundMap]: z.infer<typeof backgroundMap[K]['schema']>
};

// factories

// for schemas
export function schemaFactory(name: string) {
    const record = animationMap as Record<string, { schema: z.AnyZodObject }>;
    return record[name]?.schema ?? null;
}

export function backgroundSchemaFactory(name: string) {
    const record = backgroundMap as Record<string, { schema: z.AnyZodObject }>;
    return record[name]?.schema ?? null;
}


// for components
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



// llm context generator
export function generateAnimationContext(bindings: AnimationBinding[]): string {
    return bindings.map(animation =>
        `Animation: ${animation.name}\nUse case: ${animation.usecase}\nParameters: ${animation.settings}\n`
    ).join('\n');
}
