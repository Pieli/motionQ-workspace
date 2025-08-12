import React from "react";
import { Player } from "@remotion/player";
import { animationMap, backgroundMap } from "@/remotion-lib/animation-bindings";
import type { CompositionConfig } from "@/components/interfaces/compositions";
import { FPS } from "@/globals";

import { SequenceBuilder } from "@/components/tree-builder/sequence";

const compositionWidth = 1920;
const compositionHeight = 1080;

const animationKeys = Object.keys(
  animationMap,
) as (keyof typeof animationMap)[];
const backgroundKeys = Object.keys(
  backgroundMap,
) as (keyof typeof backgroundMap)[];

const getCompositionsForBackground = (
  backgroundKey: keyof typeof backgroundMap,
): CompositionConfig[] => {
  const background = backgroundMap[backgroundKey];
  return animationKeys.map((animKey) => {
    const anim = animationMap[animKey];
    // Use default props from schema if possible, else empty
    const animProps = anim.schema.safeParse({}).success ? {} : {};
    const bgProps = background.schema.safeParse({}).success ? {} : {};
    return {
      id: `${backgroundKey}-${animKey}`,
      component: anim.component,
      name: animKey,
      schema: anim.schema,
      props: animProps,
      duration: 60,
      background: {
        id: `${backgroundKey}-bg`,
        component: background.component,
        name: backgroundKey,
        schema: background.schema,
        props: bgProps,
        duration: 60,
      },
    };
  });
};

const DevAnimationTest: React.FC = () => {
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 32, marginBottom: 32 }}>
        Animation & Background Dev Playground
      </h1>
      {backgroundKeys.map((bgKey) => (
        <section key={bgKey} style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>{bgKey}</h2>
          <Player
            component={SequenceBuilder}
            durationInFrames={animationKeys.length * 60}
            fps={FPS}
            compositionWidth={compositionWidth}
            compositionHeight={compositionHeight}
            inputProps={{ comps: getCompositionsForBackground(bgKey) }}
            style={{
              width: "100%",
              maxWidth: 900,
              borderRadius: 12,
              boxShadow: "0 2px 16px #0002",
            }}
            acknowledgeRemotionLicense
            controls
            autoPlay
            loop
          />
        </section>
      ))}
    </div>
  );
};

export default DevAnimationTest;
