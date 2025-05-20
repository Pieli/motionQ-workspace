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

export const fadeInOutSchema = z.object({
  text: z.string(),
  bgColor: zColor(),
  textColor: zColor(),
});

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});


export const FadeInOutTransition: React.FC<z.infer<typeof fadeInOutSchema>> = ({
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
      damping: 200,
    },
    durationInFrames: 80,
  });

  // Fade In/Out Transition: Fade in and out based on progress
  const opacity = interpolate(progress, [0, 0.5, 1], [0, 1, 0]);

  const container: React.CSSProperties = useMemo(() => {
    return {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: bgColor,
      opacity: opacity,
    };
  }, [bgColor, opacity]);

  const outer: React.CSSProperties = useMemo(() => {
    return {
      backgroundColor: bgColor,
    };
  }, [bgColor]);


  return (
    <AbsoluteFill style={outer}>
      <AbsoluteFill style={container}>
        <h1 style={{ fontSize: 180, fontFamily, fontWeight: 550, color: textColor }}>
          {text}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
