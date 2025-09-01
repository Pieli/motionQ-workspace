import {
  AbsoluteFill,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { FONT_FAMILY } from "./constants";

const outer: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "white",
};

const title: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  fontWeight: "bold",
  fontSize: 160,
  whiteSpace: "normal",
};

const word: React.CSSProperties = {
  marginLeft: 10,
  marginRight: 10,
  display: "inline-block",
};

export const Emphasis: React.FC = () => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps: videoConfig.fps,
    frame: frame,
    config: {
      damping: 200,
    },
    durationInFrames: 0.5 * videoConfig.fps,
  });

  const deg = interpolate(progress, [0, 1], [0, 20]);
  const scale = interpolate(progress, [0, 0.5, 1], [1, 1.2, 1]);

  const words = "IS HAAARD!".split("");

  return (
    <AbsoluteFill style={outer}>
      <h1 style={title}>
        {words.map((t) => {
          return (
            <span
              key={t}
              style={{
                ...word,
                transform: `rotate3d(4, 4, 4, ${deg}deg) scale(${scale})`,
              }}
            >
              {t}
            </span>
          );
        })}
      </h1>
    </AbsoluteFill>
  );
};
