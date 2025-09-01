import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";

// Zod schema for validation (if needed, can be modified based on the use case)
import { z } from "zod";

export const svgTransitionSchema = z.object({
  asset: z.string(),
  scale: z.number().min(0).max(2).default(1), 
  duration: z.number().min(0).max(120).default(80),
});

export const SvgTransition: React.FC<React.PropsWithChildren<z.infer<typeof svgTransitionSchema>>> = ({
  asset,
  scale = 1,
  duration = 80,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: duration,
  });

  // Vertical movement: Translate from bottom (-500px) to top (0px)
  const translateY = interpolate(progress, [0, 1], [500, 0]);

  // Opacity transition: From 0 to 1
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  // Scale effect: Scale from the initial scale factor to the desired scale
  const scaleTransform = interpolate(progress, [0, 1], [0.5, scale]);

  // Container styling
  const container: React.CSSProperties = useMemo(() => ({
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    transform: `translateY(${translateY}px) scale(${scaleTransform})`,
    opacity: opacity,
    width: "100%", // Ensure it takes the full width
    height: "100%", // Ensure it takes the full height
  }), [translateY, scaleTransform, opacity]);

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Img src={asset} style={{ width: "100%", height: "100%" }} />
      </div>
    </AbsoluteFill>
  );
};