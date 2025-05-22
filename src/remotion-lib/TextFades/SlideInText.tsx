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
  textColor: zColor(),
});

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});


export const SlideInTransition: React.FC<z.infer<typeof slideInSchema>> = ({
  text,
  bgColor,
  textColor,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 800,
    },
    durationInFrames: 0.5 * fps,
  });

  const slideX = interpolate(progress, [0, 0.9, 1], [-500, 80, 0]);

  const container: React.CSSProperties = useMemo(() => {
    return {
      justifyContent: "center",
      alignItems: "center",
      opacity: Math.min(progress+0.2, 1),
      transform: `translateX(${slideX}px)`,
    };
  }, [slideX]);
  
  const outer: React.CSSProperties = {
        backgroundColor: bgColor,
  };

  return (
    <AbsoluteFill style={outer}>
      <AbsoluteFill style={container}>
        <h1 style={{ fontSize: 180, fontFamily, fontWeight: 550,  color: textColor }}>
          {text}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
