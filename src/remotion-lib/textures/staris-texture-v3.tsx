import { zColor } from "@remotion/zod-types";
import React from "react";
import { useVideoConfig } from "remotion";
import { z } from "zod";
import { StairsTextureBase, type AnimationConfig } from "./stairs-texture-base";

export const StairsMeshPropsSchemaV3 = z.object({
  backgroundColor: zColor().default("#262234"),
  blob_1_background_color: zColor().default("#5C4B9F"),
  blob_2_background_color: zColor().default("#444D9E"),
});

export type StairsMeshPropsV3 = z.infer<typeof StairsMeshPropsSchemaV3>;

export const StairsMeshV3: React.FC<StairsMeshPropsV3> = ({
  backgroundColor,
  blob_1_background_color,
  blob_2_background_color,
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
      blob1Color={blob_1_background_color}
      blob2Color={blob_2_background_color}
      animationConfig={animationConfig}
    />
  );
};
