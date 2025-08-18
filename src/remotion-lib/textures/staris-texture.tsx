import React from "react";
import { useVideoConfig } from "remotion";
import { StairsTextureBase, type AnimationConfig } from "./stairs-texture-base";
import { type StairsMeshProps } from "./schemas";

export const StairsMesh: React.FC<StairsMeshProps> = ({
  backgroundColor,
  blob_1_background_color,
  blob_2_background_color,
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
      blob1Color={blob_1_background_color}
      blob2Color={blob_2_background_color}
      animationConfig={animationConfig}
    />
  );
};
