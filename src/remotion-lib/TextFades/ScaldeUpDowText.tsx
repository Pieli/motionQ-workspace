import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { z } from "zod";
import { zColor } from "@remotion/zod-types";

import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const scaleUpDownSchema = z.object({
  text: z.string(),
  bgColor: zColor(),
});


export const ScaleUpDownTransition: React.FC<z.infer<typeof scaleUpDownSchema>> = ({
  text,
  bgColor,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 400,
    },
    durationInFrames: 20,
  });

  // Scale Up/Down Transition: Scale from 0.5 to 1
  const scale = interpolate(progress, [0, 1], [0.5, 1]);

  const container: React.CSSProperties = useMemo(() => {
    return {
      justifyContent: "center",
      alignItems: "center",
      transform: `scale(${scale})`,
    };
  }, [ scale]);

  const outer: React.CSSProperties = useMemo(() => {
    return {
      backgroundColor: bgColor,
    };
  }, [bgColor]);

  return (
    <AbsoluteFill style={outer}>
      <AbsoluteFill style={container}>
        <h1 style={{
          fontSize: 100,
          fontFamily,
        }}> {text} </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};