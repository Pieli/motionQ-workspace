import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";
import { FONT_FAMILY } from "./constants";
import React from "react";

const outer: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "white",
  display: "flex",
};

const titleBase: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  fontWeight: "bold",
  fontSize: 100,
  whiteSpace: "normal",
  display: "flex",
  gap: "0.4em",
  flexWrap: "wrap",
};

const cursorStyle: React.CSSProperties = {
  width: 80,
  height: 80,
  backgroundColor: "black",
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const Cursor: React.FC = () => (
  <svg
    width="auto"
    height="100%"
    viewBox="0 0 66 101"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.69835 8.43791L58.3143 55.8538L37.6413 57.7168L33.8853 58.0623L35.4478 61.5028L47.9928 88.9818L38.738 93.0533L26.7639 65.2738L25.2615 61.7733L22.482 64.3874L7.80352 78.1645L7.69835 8.43791ZM7.69835 0.745605C6.66169 0.745605 5.62504 0.940918 4.63345 1.37662C1.82395 2.59356 0.00604248 5.37301 0.00604248 8.43791L0.111213 78.1645C0.111213 81.2294 1.94414 83.9938 4.73862 85.2107C5.7302 85.6314 6.76686 85.8418 7.7885 85.8418C9.71157 85.8418 11.6046 85.1206 13.0619 83.7684L22.5271 74.8742L31.6767 96.0882C32.488 97.9812 34.0205 99.4535 35.9285 100.205C36.83 100.565 37.7765 100.746 38.738 100.746C39.7897 100.746 40.8414 100.52 41.833 100.085L51.0878 96.013C52.9658 95.1867 54.4532 93.6392 55.1743 91.7162C55.9105 89.7931 55.8504 87.6597 54.994 85.7817L45.3786 64.748L59.0054 63.501C62.0253 63.2306 64.6094 61.2174 65.586 58.3478C66.5776 55.4782 65.7813 52.3081 63.5728 50.2348L12.9568 2.81892C11.4994 1.45174 9.6064 0.745605 7.69835 0.745605Z"
      fill="white"
    />
    <path
      d="M7.69835 8.43791L58.3143 55.8538L37.6413 57.7168L33.8853 58.0623L35.4478 61.5028L47.9928 88.9818L38.738 93.0533L26.7639 65.2738L25.2615 61.7733L22.482 64.3874L7.80352 78.1645L7.69835 8.43791ZM7.69835 0.745605C6.66169 0.745605 5.62504 0.940918 4.63345 1.37662C1.82395 2.59356 0.00604248 5.37301 0.00604248 8.43791L0.111213 78.1645C0.111213 81.2294 1.94414 83.9938 4.73862 85.2107C5.7302 85.6314 6.76686 85.8418 7.7885 85.8418C9.71157 85.8418 11.6046 85.1206 13.0619 83.7684L22.5271 74.8742L31.6767 96.0882C32.488 97.9812 34.0205 99.4535 35.9285 100.205C36.83 100.565 37.7765 100.746 38.738 100.746C39.7897 100.746 40.8414 100.52 41.833 100.085L51.0878 96.013C52.9658 95.1867 54.4532 93.6392 55.1743 91.7162C55.9105 89.7931 55.8504 87.6597 54.994 85.7817L45.3786 64.748L59.0054 63.501C62.0253 63.2306 64.6094 61.2174 65.586 58.3478C66.5776 55.4782 65.7813 52.3081 63.5728 50.2348L12.9568 2.81892C11.4994 1.45174 9.6064 0.745605 7.69835 0.745605Z"
      fill="black"
    />
    <path
      d="M7.69835 8.43791L58.3143 55.8538L37.6413 57.7168L33.8853 58.0623L35.4478 61.5028L47.9928 88.9818L38.738 93.0533L26.7639 65.2738L25.2615 61.7733L22.482 64.3874L7.80352 78.1645L7.69835 8.43791Z"
      fill="white"
    />
  </svg>
);

export const Click: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const text = "find the relevant KEYWORDS for you,";
  const selected_index = 3; // index of word to be clicked (0-based)
  const words = text.split(" ");

  // Cursor animation settings
  const appearStart = 1 * fps;

  const progress = spring({
    frame: frame - appearStart,
    fps,
    config: {
      damping: 200,
      mass: 1,
    },
  });

  const hasClicked = progress > 0.9;

  // Cursor movement from offscreen bottom center to center
  const startX = (width * 3) / 4;
  const startY = height + 100;

  const endX = width / 2 - 250 + selected_index * 60; // rough horizontal offset for selected word
  const endY = height / 2 - 40; // slightly above center for text alignment

  const cursorX = interpolate(progress, [0, 1], [startX, endX]);
  const cursorY = interpolate(progress, [0, 1], [startY, endY]);

  return (
    <AbsoluteFill style={outer}>
      <Sequence>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={titleBase}>
            {words.map((word, index) => (
              <span
                key={index}
                style={{
                  color:
                    hasClicked && index === selected_index ? "red" : "black",
                }}
              >
                {word}
              </span>
            ))}
          </h1>
        </div>
      </Sequence>
      <Sequence from={appearStart}>
        <div
          style={{
            ...cursorStyle,
            left: cursorX,
            top: cursorY,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Cursor />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
