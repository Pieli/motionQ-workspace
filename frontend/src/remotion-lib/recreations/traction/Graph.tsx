import { evolvePath } from "@remotion/paths";
import { useVideoConfig, useCurrentFrame, spring } from "remotion";

const path =
  "M-4.05981 945.008L159.171 782.856L250.641 851.459L647.705 475.183L903.406 653.966L1090.5 666.44L1188.21 595.758L1782.77 -9.19287";

export const Element: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 400,
    },
    durationInFrames: 1 * fps,
  });

  const evolution = evolvePath(progress, path);

  return (
    <>
      <svg viewBox={`0 0 ${width} ${height}`}>
        <path
          d={path}
          fill="none"
          id="evolution"
          strokeDasharray={evolution.strokeDasharray}
          strokeDashoffset={evolution.strokeDashoffset}
          stroke="rgba(163, 90, 243, 0.1)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={250}
        />
        <path
          d={path}
          fill="none"
          id="evolution"
          strokeDasharray={evolution.strokeDasharray}
          strokeDashoffset={evolution.strokeDashoffset}
          stroke="rgba(163, 90, 243, 0.2)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={180}
        />
        <path
          d={path}
          fill="none"
          strokeDasharray={evolution.strokeDasharray}
          strokeDashoffset={evolution.strokeDashoffset}
          stroke="rgba(163, 90, 243, 0.25)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={80}
        />
        <path
          d={path}
          fill="none"
          id="evolution"
          strokeDasharray={evolution.strokeDasharray}
          strokeDashoffset={evolution.strokeDashoffset}
          stroke="rgba(163, 90, 243, 1)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={12}
        />
      </svg>
    </>
  );
};
