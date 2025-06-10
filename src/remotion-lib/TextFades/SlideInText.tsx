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
      damping: 400,
    },
    durationInFrames: 1 * fps,
  });

  const slideX = interpolate(progress, [0, 0.9, 1], [-1000, 80, 0]);

  const container: React.CSSProperties = useMemo(() => {
    return {
      opacity: Math.min(progress, 1),
      transform: `translateX(${slideX}px)`,
      color: textColor,
      fontSize: 180,
      fontFamily,
      fontWeight: 550,
    };
  }, [progress, slideX, textColor]);

  const outer: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bgColor,
  };

  return (
    <AbsoluteFill style={outer}>
      <div style={container}>{text}</div>
    </AbsoluteFill>
  );
};
