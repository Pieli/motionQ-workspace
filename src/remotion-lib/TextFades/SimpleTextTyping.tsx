import React, { useMemo } from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { z } from "zod";

import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import { fitText } from "@remotion/layout-utils";

export const simpleTypingSchema = z.object({
  text: z.string(),
});

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

const outer: React.CSSProperties = {};

export const SimpleTextTyping: React.FC<z.infer<typeof simpleTypingSchema>> = ({
  text,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 100,
    },
    durationInFrames: 2 * fps,
  });

  // Calculate how many characters should be visible by current frame
  const visibleCharacters = Math.floor(progress * text.length);

  const container: React.CSSProperties = {
      justifyContent: "center",
      alignItems: "center",
    };

  const maxWidth = 1536;
  const fontWeight = 550;
  const { fontSize } = fitText({
    text,
    withinWidth: maxWidth,
    fontFamily,
    fontWeight,
  });

  return (
    <AbsoluteFill style={outer}>
      <AbsoluteFill style={container}>
        <div style={{
          fontSize,
          width: maxWidth,
          margin: "0 auto",
          fontFamily,
          fontWeight,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}>
          {text.split("").map((char, index) => {
            const opacity = index <= visibleCharacters ? 1 : 0;
            return (
              <span key={index} style={{ opacity }}>{
                char === " " ? "\u00A0" : char
                }</span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
