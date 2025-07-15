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
  text,
  textColor,
  fontSize: customFontSize,
  fontWeight = 550,
  fontFamily: customFontFamily = fontFamily,
  fadeDuration = 1.5,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // for the multiline bug
  text += " ";

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
    text,
    withinWidth: maxWidth,
    fontFamily: customFontFamily,
    fontWeight,
  });

  return (
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
        {text}
      </div>
    </AbsoluteFill>
  );
};
