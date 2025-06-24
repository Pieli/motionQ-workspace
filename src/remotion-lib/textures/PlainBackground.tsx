import { zColor } from "@remotion/zod-types";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { z } from "zod";

export const PlainBackgroundSchema = z.object({
    backgroundColor: zColor().default("#1e1e1e"), // Default to black
});

export type PlainBackgroundProps = z.infer<typeof PlainBackgroundSchema>;

export const PlainBackground: React.FC<PlainBackgroundProps> = ({
    backgroundColor,
}) => {
    const { width, height } = useVideoConfig();
    return (<AbsoluteFill style={{width, height, backgroundColor}} ></AbsoluteFill>)
}