import React from "react";
import {
  Composition,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

export const SearchBarAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Convert ms to frames helper
  const msToFrames = (ms: number) => ms / (1000 / fps);

  // Animation timings (in frames)
  const growInStart = msToFrames(0);
  const growInEnd = msToFrames(400);
  const growIn2Start = msToFrames(100);
  const growIn2End = msToFrames(500);
  const resizeStart = msToFrames(400);
  const resizeEnd = msToFrames(1100);
  const textInStart = msToFrames(900);
  const nodeDuration = msToFrames(500);
  const travelDistance = 20; // px
  const letterOffset = msToFrames(50);
  const shrinkStart = msToFrames(3200);
  const shrinkEnd = msToFrames(3500);

  // Main scale in and out
  const mainScaleIn = interpolate(frame, [growInStart, growInEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mainScaleOut = interpolate(frame, [shrinkStart, shrinkEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = frame < shrinkStart ? mainScaleIn : mainScaleOut;

  // Icon scale
  const iconScale = interpolate(frame, [growIn2Start, growIn2End], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Resize width
  const resizedWidth = interpolate(frame, [resizeStart, resizeEnd], [80, 640], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          width: resizedWidth,
          height: 80,
          borderRadius: 40,
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          padding: 20,
          overflow: "hidden",
        }}
      >
        {/* Icon */}
        <div
          style={{
            transform: `scale(${iconScale})`,
            width: 40,
            height: 40,
            marginRight: 20,
          }}
        >
          <img
            src="/path/to/Icon.svg"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Text letters */}
        <div
          style={{
            display: "flex",
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontFamily: "Inter, sans-serif",
            fontSize: 24,
            fontWeight: 500,
            color: "#404040",
          }}
        >
          {"Best motion design tool".split("").map((char, index) => {
            const delay = letterOffset * index;
            const letterY = interpolate(
              frame,
              [textInStart + delay, textInStart + delay + nodeDuration],
              [travelDistance, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  transform: `translateY(${letterY}px)`,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Remotion Composition
export const RemotionVideo: React.FC = () => (
  <>
    <Composition
      id="SearchBarAnimation"
      component={SearchBarAnimation}
      width={680}
      height={120}
      fps={60}
      durationInFrames={4 * 60}
    />
  </>
);
