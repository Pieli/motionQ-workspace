import React, { useMemo } from "react";
import {
  AbsoluteFill,
} from "remotion";

import { zColor } from "@remotion/zod-types";
import { z } from "zod";

import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import { fitText } from "@remotion/layout-utils";

export const threeDTextSchema = z.object({
  text: z.string(),
  bgColor: zColor(),
});

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const ThreeDTextTransition: React.FC<z.infer<typeof threeDTextSchema>> = ({
  text,
  bgColor,
}) => {

  /*
  const progress = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: 80,
  });
  */

  const container: React.CSSProperties = useMemo(() => ({
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bgColor,
  }), [bgColor]);

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
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};
