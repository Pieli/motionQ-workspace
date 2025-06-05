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