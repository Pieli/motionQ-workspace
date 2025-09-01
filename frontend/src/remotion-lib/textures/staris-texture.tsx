import React from "react";
import { useVideoConfig } from "remotion";
import { StairsTextureBase, type AnimationConfig } from "./stairs-texture-base";
import { type StairsMeshProps } from "./schemas";

export const StairsMesh: React.FC<StairsMeshProps> = ({
  backgroundColor,
  blob_one_color,
  blob_two_color,
  type: _type, // Accept discriminator but don't use it
}) => {
  const { fps } = useVideoConfig();

  const animationConfig: AnimationConfig = {
    damping: 200,
    durationInFrames: 1 * fps,
    blob1Animation: {
      xKeyframes: [-370, 0],
      yKeyframes: [-370, 0],
      progressKeyframes: [0, 1],
    },
    blob2Animation: {
      xKeyframes: [270, 0],
      yKeyframes: [270, 0],
      progressKeyframes: [0, 1],
    },
  };

  return (
    <StairsTextureBase
      backgroundColor={backgroundColor}
      blob1Color={blob_one_color}
      blob2Color={blob_two_color}
      animationConfig={animationConfig}
    />
  );
};
