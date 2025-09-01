import React, { useMemo } from "react";

import { Series } from "remotion";
import { createElement } from "react";
import type { CompositionConfig } from "@/components/interfaces/compositions";

type ParsedElement = {
  prop: object;
  component: React.FC;
};

function elementParser(comp?: CompositionConfig): ParsedElement {
  if (!comp) {
    return { prop: {}, component: React.Fragment };
  }

  const parsedProps = comp.schema.safeParse(comp.props);
  if (!parsedProps.success) {
    console.error(`Error parsing props for ${comp.id}:`, parsedProps.error);
    return { prop: {}, component: React.Fragment };
  }

  return { prop: parsedProps.data, component: comp.component };
}

export const SequenceBuilder: React.FC<{ comps: CompositionConfig[] }> = ({
  comps,
}) => {
  const renderCompositions = useMemo(() => {
    return comps.map((comp, index: number) => {
      const parsedComp = elementParser(comp);
      const parsedBack = elementParser(comp.background);

      return (
        <Series.Sequence durationInFrames={comp.duration} key={index}>
          <>
            {createElement(parsedBack.component, {
              ...parsedBack.prop,
              key: `background-${index}`,
            })}
            {createElement(parsedComp.component, {
              ...parsedComp.prop,
              key: `foreground-${index}`,
            })}
          </>
        </Series.Sequence>
      );
    });
  }, [comps]);

  return <Series>{renderCompositions}</Series>;
};
