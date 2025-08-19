import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { type PlainBackgroundProps } from "./schemas";

export const PlainBackground: React.FC<PlainBackgroundProps> = ({
    backgroundColor,
    type: _type, // Accept discriminator but don't use it
}) => {
    const { width, height } = useVideoConfig();
    return (<AbsoluteFill style={{width, height, backgroundColor}} ></AbsoluteFill>)
}