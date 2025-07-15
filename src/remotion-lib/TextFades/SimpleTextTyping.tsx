import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import type { SimpleTypingProps } from "./schemas";
import { Typography } from "@/components/Typography/Typography";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

const outer: React.CSSProperties = {};

export const SimpleTextTyping: React.FC<SimpleTypingProps> = (props) => {
  const { typingDuration, damping, ...typoProps } = props;
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    config: {
      damping,
    },
    durationInFrames: typingDuration,
  });

  const visibleCharacters = Math.floor(progress * typoProps.text.length);

  const container: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
  };

  const typingText = typoProps.text.split("").map((char, index) => {
    const opacity = index <= visibleCharacters ? 1 : 0;
    return (
      <span key={index} style={{ opacity }}>{
        char === " " ? "\u00A0" : char
      }</span>
    );
  });

  return (
    <AbsoluteFill style={outer}>
      <AbsoluteFill style={container}>
        <Typography {...typoProps} text={typingText} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
