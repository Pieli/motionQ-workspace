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

export const countingStarsSchema = z.object({
  text: z.string().default("Github stars"),
  bgColor: zColor(),
  textColor: zColor(),
  startingNumber: z.number(),
  goalNumber: z.number(),
  prefixText: z.string().optional(),
  suffixText: z.string().optional(),
});

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const CountingStars: React.FC<z.infer<typeof countingStarsSchema>> = ({
  text,
  bgColor,
  textColor,
  startingNumber,
  goalNumber,
  prefixText,
  suffixText,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
  });

  const currentNumber = useMemo(() => {
    const interpolatedValue = interpolate(progress, [0, 1], [0, goalNumber + 1 - startingNumber]);
    return Number.isFinite(interpolatedValue)
      ? Math.min(startingNumber + Math.floor(interpolatedValue), goalNumber)
      : startingNumber;
  }, [progress, startingNumber, goalNumber]);

  const xTrans = interpolate(progress, [0, 1], [0,80])

  const zeroStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "100px",
    fontWeight: "bold",
  };


  const zeroMotion: React.CSSProperties = useMemo(() => ({
      color: textColor,
      transform: `translate(-${xTrans}ch)`,
    }), [textColor, xTrans])

  const numberStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    position: "absolute",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, fontFamily }}>
      <div style={zeroMotion}>
        <div style={zeroStyle}>{prefixText}{currentNumber}{suffixText}</div>
      </div>
      <div
        style={{
          color: textColor,
          fontSize: "100px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div style={numberStyle}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};
