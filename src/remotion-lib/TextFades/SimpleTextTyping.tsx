import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import { fitText } from "@remotion/layout-utils";
import type { SimpleTypingProps } from "./schemas";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

const outer: React.CSSProperties = {};

export const SimpleTextTyping: React.FC<SimpleTypingProps> = ({
  text,
  textColor,
  fontSize: customFontSize,
  fontWeight = 550,
  fontFamily: customFontFamily = fontFamily,
  typingDuration,
  damping,
}) => {
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

  const visibleCharacters = Math.floor(progress * text.length);

  const container: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
  };

  const maxWidth = 1536;
  const { fontSize } = fitText({
    text,
    withinWidth: maxWidth,
    fontFamily: customFontFamily,
    fontWeight,
  });

  return (
    <AbsoluteFill style={outer}>
      <AbsoluteFill style={container}>
        <div style={{
          fontSize: customFontSize || fontSize,
          width: maxWidth,
          margin: "0 auto",
          fontFamily: customFontFamily,
          fontWeight,
          color: textColor,
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
