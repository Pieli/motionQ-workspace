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
import { fitText } from "@remotion/layout-utils";

export const slideInSchema = z.object({
  text: z.string(),
  textColor: zColor(),
});

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const SlideInTransition: React.FC<z.infer<typeof slideInSchema>> = ({
  text,
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

  const maxWidth = 1536;
  const fontWeight = 550;
  const { fontSize } = fitText({
    text,
    withinWidth: maxWidth,
    fontFamily,
    fontWeight,
  });

  const container: React.CSSProperties = useMemo(() => {
    return {
      opacity: Math.min(progress, 1),
      transform: `translateX(${slideX}px)`,
      color: textColor,
      fontSize,
      fontFamily,
      fontWeight,
      width: maxWidth,
      margin: "0 auto",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
    };
  }, [progress, slideX, textColor, fontSize]);

  const outer: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <AbsoluteFill style={outer}>
      <div style={container}>{text}</div>
    </AbsoluteFill>
  );
};
