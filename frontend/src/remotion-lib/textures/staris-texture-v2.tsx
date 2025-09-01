import React from "react";
import { useVideoConfig } from "remotion";
import { StairsTextureBase, type AnimationConfig } from "./stairs-texture-base";
import { type StairsMeshPropsV2 } from "./schemas";

export const StairsMeshV2: React.FC<StairsMeshPropsV2> = ({
  backgroundColor,
  blob_one_color,
  blob_two_color,
  type: _type, // Accept discriminator but don't use it
}) => {
  const { fps } = useVideoConfig();

  const animationConfig: AnimationConfig = {
    damping: 1000,
    durationInFrames: 2 * fps,
    blob1Animation: {
      xKeyframes: [-800, 0, 200],
      yKeyframes: [400, 600, -900],
      progressKeyframes: [0, 0.6, 1],
    },
    blob2Animation: {
      xKeyframes: [400, -200, -600],
      yKeyframes: [-100, -400, 900],
      progressKeyframes: [0, 0.6, 1],
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
