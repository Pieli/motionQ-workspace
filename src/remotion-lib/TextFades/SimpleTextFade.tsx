import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import type { SimpleFadeProps } from "./schemas";
import { Typography } from "../Typography/Typography";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

const outer: React.CSSProperties = {};

export const SimpleTextFade: React.FC<SimpleFadeProps> = (props) => {
  const { fadeDuration, fadeAngle, ...typoProps } = props;
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: fadeDuration,
  });

  const rightStop = interpolate(progress, [0, 1], [200, 0]);
  const leftStop = Math.max(0, rightStop - 60);
  const maskImage = `linear-gradient(${fadeAngle}deg, transparent ${leftStop}%, black ${rightStop}%)`;

  const container: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
  };

  const content: React.CSSProperties = useMemo(() => {
    return {
      maskImage,
      WebkitMaskImage: maskImage,
    };
  }, [maskImage]);

  return (
    <AbsoluteFill style={outer}>
      <AbsoluteFill style={container}>
        <div style={content}>
          <Typography {...typoProps} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
