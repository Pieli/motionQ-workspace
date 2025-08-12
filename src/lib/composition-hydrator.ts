import type { CompositionConfig } from "@/components/interfaces/compositions";
import type { Composition } from "@/client/types.gen";
import {
  animationFactory,
  backgroundFactory,
  backgroundSchemaFactory,
  schemaFactory,
} from "@/remotion-lib/animation-factories";
import type {
  AnimationComponents,
  BackgroundComponents,
} from "@/remotion-lib/animation-factories";
import type { 
  animationMap, 
  backgroundMap 
} from "@/remotion-lib/animation-bindings";

/**
 * Converts backend Composition objects to CompositionConfig objects
 * that can be used in the frontend with React components and Zod schemas
 */
export function hydrateCompositions(
  backendCompositions: Composition[],
): CompositionConfig[] {
  return backendCompositions.map((comp) => {
    // Get component and schema from factories with proper null checking
    const component = animationFactory(comp.name as keyof typeof animationMap);
    const schema = schemaFactory(comp.name);
    
    // Assert that we got valid component and schema
    if (!component || !schema) {
      throw new Error(`Invalid animation name: ${comp.name}. Component or schema not found.`);
    }

    const hydratedComp: CompositionConfig = {
      id: comp.id,
      name: comp.name, // Use backend componentType as animationName
      component: component as AnimationComponents,
      schema: schema,
      props: comp.props,
      duration: comp.duration,
    };

    // Add background if it exists
    if (comp.background) {
      // Get background component and schema with proper null checking
      const backgroundComponent = backgroundFactory(comp.background.name as keyof typeof backgroundMap);
      const backgroundSchema = backgroundSchemaFactory(comp.background.name);
      
      // Assert that we got valid background component and schema
      if (!backgroundComponent || !backgroundSchema) {
        throw new Error(`Invalid background name: ${comp.background.name}. Component or schema not found.`);
      }

      hydratedComp.background = {
        id: comp.background.id,
        name: comp.background.name, // Use backend componentType as animationName
        component: backgroundComponent as BackgroundComponents,
        schema: backgroundSchema,
        props: comp.background.props,
        duration: comp.background.duration,
      };
    }

    return hydratedComp;
  });
}

/**
 * Converts CompositionConfig objects back to backend Composition format
 * for saving to the database (removes React components and Zod schemas)
 */
export function dehydrateCompositions(
  compositions: CompositionConfig[],
): Composition[] {
  return compositions.map((comp) => {
    const dehydratedComp: Composition = {
      id: comp.id,
      name: comp.name,
      props: comp.props,
      duration: comp.duration,
    };

    // Add background if it exists
    if (comp.background) {
      dehydratedComp.background = {
        id: comp.background.id,
        name: comp.background.name,
        props: comp.background.props,
        duration: comp.background.duration,
      };
    }

    return dehydratedComp;
  });
}
