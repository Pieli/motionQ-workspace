import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { zColor } from "@remotion/zod-types";
import { z } from "zod";

import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";

export const slideInSchema = z.object({
  text: z.string(),
  bgColor: zColor(),
});

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});


export const SlideInTransition: React.FC<z.infer<typeof slideInSchema>> = ({
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
    durationInFrames: 30,
  });

  // Slide In Transition: Slide from left to right
  const slideX = interpolate(progress, [0, 1], [-500, 0]);

  const container: React.CSSProperties = useMemo(() => {
    return {
      justifyContent: "center",
      alignItems: "center",
      transform: `translateX(${slideX}px)`,
    };
  }, [slideX]);
  
  const outer: React.CSSProperties = {
        backgroundColor: bgColor,
  };

  return (
    <AbsoluteFill style={outer}>
      <AbsoluteFill style={container}>
        <h1 style={{ fontSize: 100, fontFamily }}>
          {text}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};