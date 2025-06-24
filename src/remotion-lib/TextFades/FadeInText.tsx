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

export const fadeInSchema = z.object({
  text: z.string(),
  textColor: zColor(),
});

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});


export const FadeInTransition: React.FC<z.infer<typeof fadeInSchema>> = ({
  text,
  textColor,
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
    durationInFrames: 1.5 * fps,
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
  const fontWeight = 550;
  const { fontSize } = fitText({
    text,
    withinWidth: maxWidth,
    fontFamily,
    fontWeight,
  });

  return (
      <AbsoluteFill style={container}>
        <div style={{
          fontSize,
          width: maxWidth,
          margin: "0 auto",
          fontFamily,
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
