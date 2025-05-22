import React, { useMemo } from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

import { zColor } from "@remotion/zod-types";
import { z } from "zod";

import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";

export const waveEffectSchema = z.object({
  text: z.string(),
  bgColor: zColor(),
});

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const WaveEffectTransition: React.FC<z.infer<typeof waveEffectSchema>> = ({
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

  const container: React.CSSProperties = useMemo(() => ({
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bgColor,
    display: "flex",
    flexDirection: "row",
  }), [bgColor]);

  const waveOffset = (index: number) => {
    // No movement for first 20 frames
    if (progress < 0.25) return 0;
    // Return to 0 for last frames
    // if (progress > 0.75) return 0;
    
    // Map progress from 0.25-0.75 to 0-2PI for one complete wave
    const waveProgress = (progress - 0.25) * 2 * Math.PI * 2;
    const wave = Math.sin((index * 0.5) + waveProgress) * 20;
    return wave;
  };

  const pieces = text.split("").map((char, index) => {
    return (
      <h1
        key={index}
        style={{
          position: "relative",
          transform: `translateY(${waveOffset(index)}px)`,
          fontSize: 100,
          fontFamily: fontFamily,
          whiteSpace: 'pre', 
        }}
      >
        {char}
      </h1>
    );
  });

  return (
    <AbsoluteFill style={container}>
      {pieces}
    </AbsoluteFill>
  );
};
