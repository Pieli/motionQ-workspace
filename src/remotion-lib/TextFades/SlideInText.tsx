import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { SlideInProps } from "@/remotion-lib/TextFades/schemas";
import { Typography } from "@/components/Typography/Typography";
import { loadFont } from "@remotion/google-fonts/Inter";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const SlideInTransition: React.FC<SlideInProps> = (props) => {
  const { slideDistance, slideDuration, damping, ...typoProps } = props;
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

  const container: React.CSSProperties = useMemo(() => {
    return {
      opacity: Math.min(progress, 1),
      transform: `translateX(${slideX}px)`,
      width: 1536,
      margin: "0 auto",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
    };
  }, [progress, slideX]);

  const outer: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <AbsoluteFill style={outer}>
      <div style={container}>
        <Typography {...typoProps} />
      </div>
    </AbsoluteFill>
  );
};
