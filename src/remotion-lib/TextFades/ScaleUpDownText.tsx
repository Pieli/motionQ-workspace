import { loadFont } from "@remotion/google-fonts/Inter";
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { ScaleUpDownProps } from "@/remotion-lib/TextFades/schemas";
import { Typography } from "@/components/Typography/Typography";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const ScaleUpDownTransition: React.FC<ScaleUpDownProps> = (props) => {
  const { ...typoProps } = props;
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // for the multiline bug
  typoProps.text += " ";

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 100,
    },
    durationInFrames: 0.5 * fps,
  });

  // Scale Up/Down Transition: Scale from 0.5 to 1
  const scale = interpolate(progress, [0, 1], [0.5, 1]);

  const container: React.CSSProperties = useMemo(() => {
    return {
      transform: `scale(${scale})`,
    };
  }, [scale]);

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
