import React from "react";
import { useVideoConfig } from "remotion";
import { StairsTextureBase, type AnimationConfig } from "./stairs-texture-base";
import { type StairsMeshPropsV3 } from "./schemas";

export const StairsMeshV3: React.FC<StairsMeshPropsV3> = ({
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
      xKeyframes: (width: number) => [
        width / 2 - 200,
        width / 2 - 200,
        width / 2 - 200,
      ],
      yKeyframes: [-800, -400, -600],
      progressKeyframes: [0, 0.6, 1],
    },
    blob2Animation: {
      xKeyframes: (width: number) => [
        -width / 2 + 200,
        -width / 2 + 200,
        -width / 2 + 200,
      ],
      yKeyframes: [800, 400, 600],
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
