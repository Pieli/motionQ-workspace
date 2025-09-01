import { useMemo } from "react";

import {
  AbsoluteFill,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Gradient: React.FC = () => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps: videoConfig.fps,
    frame: frame,
    config: {
      damping: 800,
    },
    durationInFrames: 2.5 * videoConfig.fps,
  });

  const opacity = interpolate(progress, [0, 0.8, 1], [0, 1, 0]);

  const outer: React.CSSProperties = useMemo(() => {
    return {
      height: "25%",
      backgroundImage:
        "linear-gradient(180deg, rgba(163, 90, 243, 1), rgba(163, 90, 243, 0))",
      opacity: opacity,
    };
  }, [opacity]);

  return <AbsoluteFill style={outer}></AbsoluteFill>;
};
