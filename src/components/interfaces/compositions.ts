import { z } from 'zod';

export interface CompositionConfig {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FC<any>;
  schema: z.ZodTypeAny;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  duration: number;
}
