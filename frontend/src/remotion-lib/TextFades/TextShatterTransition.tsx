import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { zColor } from "@remotion/zod-types";
import { z } from "zod";

import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import { fitText } from "@remotion/layout-utils";

export const textShatterSchema = z.object({
  text: z.string(),
  bgColor: zColor(),
});

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const TextShatterTransition: React.FC<z.infer<typeof textShatterSchema>> = ({
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

  const maxWidth = 1536;
  const fontWeight = 550;
  const { fontSize } = fitText({
    text,
    withinWidth: maxWidth,
    fontFamily,
    fontWeight,
  });

  // Container style using flex to align characters in a row
  const container: React.CSSProperties = useMemo(() => ({
    justifyContent: "center",  // Center the content
    alignItems: "center",      // Align vertically
    backgroundColor: bgColor,
    display: "flex",
    flexDirection: "row",
    position: "relative",
  }), [bgColor]);

  // The pieces (characters) of the text
  const pieces = text.split("").map((char, index) => {
    const angle = (random(index) * 120) - 60 * (Math.PI / 180); // Random angle for each character
    const distance = interpolate(progress, [0, 1], [0, random(index) * 300]);
    const offsetX = Math.sin(angle) * distance;
    const offsetY = Math.cos(angle) * distance;

    return (
      <span
        key={index}
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          opacity: interpolate(progress, [0, 1], [1, 0]),
          whiteSpace: 'pre',
          fontSize,
          fontFamily,
          fontWeight,
        }}
      >
        {char}
      </span>
    );
  });

  return (
    <AbsoluteFill style={container}>
      <div style={{
        width: maxWidth,
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        fontSize,
        fontFamily,
        fontWeight,
        textAlign: "center",
      }}>
        {pieces}
      </div>
    </AbsoluteFill>
  );
};
