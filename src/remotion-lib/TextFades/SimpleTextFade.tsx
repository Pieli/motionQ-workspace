import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import { fitText } from "@remotion/layout-utils";
import type { SimpleFadeProps } from "./schemas";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

const outer: React.CSSProperties = {};

export const SimpleTextFade: React.FC<SimpleFadeProps> = ({
  text,
  textColor,
  fontSize: customFontSize,
  fontWeight = 550,
  fontFamily: customFontFamily = fontFamily,
  fadeDuration,
  fadeAngle,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: fadeDuration,
  });

  const rightStop = interpolate(progress, [0, 1], [200, 0]);
  const leftStop = Math.max(0, rightStop - 60);
  const maskImage = `linear-gradient(${fadeAngle}deg, transparent ${leftStop}%, black ${rightStop}%)`;

  const container: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
  };

  const content: React.CSSProperties = useMemo(() => {
    return {
      maskImage,
      WebkitMaskImage: maskImage,
    };
  }, [maskImage]);

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
        <div style={content}>
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
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};