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

export const threeDTextSchema = z.object({
  text: z.string(),
  bgColor: zColor(),
});

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const ThreeDTextTransition: React.FC<z.infer<typeof threeDTextSchema>> = ({
  text,
  bgColor,
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

  const rotationX = interpolate(progress, [0, 1], [0, 30]);
  const rotationY = interpolate(progress, [0, 1], [0, 30]);
  const rotationZ = interpolate(progress, [0, 1], [0, 360]);

  const container: React.CSSProperties = useMemo(() => ({
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bgColor,
    transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`,
  }), [bgColor, rotationX, rotationY, rotationZ]);

  return (
    <AbsoluteFill style={container}>
      <h1 style={{ fontSize: 100, fontFamily }}>
        {text}
      </h1>
    </AbsoluteFill>
  );
};
