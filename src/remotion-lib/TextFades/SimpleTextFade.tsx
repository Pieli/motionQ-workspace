import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { z } from "zod";

import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import { fitText } from "@remotion/layout-utils";

export const simpleFadeSchema = z.object({
  text: z.string(),
});


loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});


const outer: React.CSSProperties = {};

export const SimpleTextFade: React.FC<z.infer<typeof simpleFadeSchema>> = ({
  text,
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

  const rightStop = interpolate(progress, [0, 1], [200, 0]);

  const leftStop = Math.max(0, rightStop - 60);

  const maskImage = `linear-gradient(-45deg, transparent ${leftStop}%, black ${rightStop}%)`;

  const container: React.CSSProperties =  {
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
        <div style={content}>
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
            {text}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};