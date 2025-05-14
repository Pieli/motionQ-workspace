import React, { useMemo } from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { z } from "zod";
import { zColor } from "@remotion/zod-types";

import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

export const simpleTypingSchema = z.object({
  text: z.string(),
  bgColor: zColor(),
});

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

const outer: React.CSSProperties = {};

export const SimpleTextTyping: React.FC<z.infer<typeof simpleTypingSchema>> = ({
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

  // Calculate how many characters should be visible by current frame
  const visibleCharacters = Math.floor(progress * text.length);

  const container: React.CSSProperties = useMemo(() => {
    return {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: bgColor,
    };
  }, [bgColor]);

  return (
    <AbsoluteFill style={outer}>
      <AbsoluteFill style={container}>
        <div>
          <h1 style={{ fontSize: 100, fontFamily }}>
            {text.split("").map((char, index) => {
              const opacity = index <= visibleCharacters ? 1 : 0;
              return (
                <span key={index} style={{ opacity }}>
                  {char}
                </span>
              );
            })}
          </h1>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
