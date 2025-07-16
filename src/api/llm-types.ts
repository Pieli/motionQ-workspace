import { z } from "zod";
import { EnumAvailableAnimations, EnumAvailableBackgrounds, UnionAvailableBackSchemas, UnionAvailableSchemas } from "@/api/animation-types";

const Composition = z.object({
  id: z.string(),
  duration: z.number(),
  animationName: EnumAvailableAnimations,
  animationSettings: UnionAvailableSchemas, 
  text: z.string(),
  background: z.object({
    name: EnumAvailableBackgrounds,
    settings: UnionAvailableBackSchemas,
  }),
});

export const Response = z.object({
  compositions: z.array(Composition),
  comment: z.string()
});

export type CompositionType = z.infer<typeof Composition>;
export type ResponseType = z.infer<typeof Response>;
