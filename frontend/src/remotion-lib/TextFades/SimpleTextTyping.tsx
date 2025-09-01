import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import type { SimpleTypingProps } from "./schemas";
import { fitText } from "@remotion/layout-utils";

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

  const visibleCharacters = Math.floor(progress * typoProps.typo_text.length);

  const maxWidth = 1536;
  const { fontSize } = fitText({
    text: typoProps.typo_text,
    withinWidth: maxWidth,
    fontFamily: typoProps.typo_fontFamily,
    fontWeight: typoProps.typo_fontWeight,
  });

  const container: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
  };

  const typingText = typoProps.typo_text.split("").map((char, index) => {
    const opacity = index <= visibleCharacters ? 1 : 0;
    return (
      <span key={index} style={{ opacity }}>
        {char === " " ? "\u00A0" : char}
      </span>
    );
  });

  return (
    <AbsoluteFill style={outer}>
      <AbsoluteFill style={container}>
        <div
          style={{
            color: typoProps.typo_textColor,
            fontSize: typoProps.typo_fontSize || fontSize,
            fontWeight: typoProps.typo_fontWeight,
            fontFamily: typoProps.typo_fontFamily,
            textAlign: typoProps.typo_textAlign,
            width: maxWidth,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {typingText}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
