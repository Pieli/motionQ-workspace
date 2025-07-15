import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { SlideInProps } from "@/remotion-lib/TextFades/schemas";
import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";

import { fitText } from "@remotion/layout-utils";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const SlideInTransition: React.FC<SlideInProps> = ({
  text,
  textColor,
  fontSize: customFontSize,
  fontWeight = 550,
  fontFamily: customFontFamily = fontFamily,
  slideDistance,
  slideDuration,
  damping,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    config: {
      damping,
    },
    durationInFrames: slideDuration,
  });

  const slideX = interpolate(progress, [0, 0.9, 1], [-slideDistance, 80, 0]);

  const maxWidth = 1536;
  const { fontSize } = fitText({
    text,
    withinWidth: maxWidth,
    fontFamily: customFontFamily,
    fontWeight,
  });

  const container: React.CSSProperties = useMemo(() => {
    return {
      opacity: Math.min(progress, 1),
      transform: `translateX(${slideX}px)`,
      color: textColor,
      fontSize: customFontSize || fontSize,
      fontFamily: customFontFamily,
      fontWeight,
      width: maxWidth,
      margin: "0 auto",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
    };
  }, [
    progress,
    slideX,
    textColor,
    fontSize,
    customFontSize,
    customFontFamily,
    fontWeight,
  ]);

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
