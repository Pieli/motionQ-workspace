import { z } from "zod";
import { AvailableAnimations, UnionAvailableSchemas } from "@/api/animation-factories";

export const Composition = z.object({
  id: z.string(),
  duration: z.number(),
  animationName: AvailableAnimations,
  animationSettings: UnionAvailableSchemas, 
  text: z.string()
});

export const Response = z.object({
  compositions: z.array(Composition),
  comment: z.string()
});

export type CompositionType = z.infer<typeof Composition>;
export type ResponseType = z.infer<typeof Response>;
