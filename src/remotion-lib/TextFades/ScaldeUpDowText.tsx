import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { zColor } from "@remotion/zod-types";
import { z } from "zod";

import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import { fitText } from "@remotion/layout-utils";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const scaleUpDownSchema = z.object({
  text: z.string(),
  bgColor: zColor(),
});

export const ScaleUpDownTransition: React.FC<
  z.infer<typeof scaleUpDownSchema>
> = ({ text, bgColor }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 100,
    },
    durationInFrames: 0.5 * fps,
  });

  // Scale Up/Down Transition: Scale from 0.5 to 1
  const scale = interpolate(progress, [0, 1], [0.5, 1]);

  const maxWidth = 1536;
  const fontWeight = 550;
  const { fontSize } = fitText({
    text,
    withinWidth: maxWidth,
    fontFamily,
    fontWeight,
  });

  const container: React.CSSProperties = useMemo(() => {
    return {
      transform: `scale(${scale})`,
    };
  }, [scale]);

  const outer: React.CSSProperties = useMemo(() => {
    return {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: bgColor,
    };
  }, [bgColor]);

  return (
    <AbsoluteFill style={outer}>
      <div style={container}>
        <div
          style={{
            fontSize,
            width: maxWidth,
            margin: "0 auto",
            fontFamily,
            fontWeight,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {text}
        </div>

      </div>
    </AbsoluteFill>
  );
};
