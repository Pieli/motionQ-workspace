import { z } from "zod";

export interface CompositionConfig {
  id: string;
  name: string; // Animation name used for factory methods and backend storage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FC<any>;
  schema: z.ZodTypeAny; // TODO change to any AnyZodObject in the future
  props: Record<string, PropType>;
  duration: number;

  background?: CompositionConfig; // Optional background composition
}

export type PropType = string | number;
