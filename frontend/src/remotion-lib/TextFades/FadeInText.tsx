import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import { fitText } from "@remotion/layout-utils";
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { FadeInProps } from "./schemas";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const FadeInTransition: React.FC<FadeInProps> = ({
  typo_text,
  typo_textColor,
  typo_fontSize: customFontSize,
  typo_fontWeight = 550,
  typo_fontFamily: customFontFamily = fontFamily,
  fadeDuration = 1.5,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // for the multiline bug
  typo_text += " ";

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: fadeDuration * fps,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const container: React.CSSProperties = useMemo(() => {
    return {
      justifyContent: "center",
      alignItems: "center",
      opacity: opacity,
    };
  }, [opacity]);

  const maxWidth = 1536;
  const { fontSize } = fitText({
    text: typo_text,
    withinWidth: maxWidth,
    fontFamily: customFontFamily,
    fontWeight: typo_fontWeight,
  });

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          fontSize: customFontSize || fontSize,
          width: maxWidth,
          margin: "0 auto",
          fontFamily: customFontFamily,
          fontWeight: typo_fontWeight,
          color: typo_textColor,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {typo_text}
      </div>
    </AbsoluteFill>
  );
};
