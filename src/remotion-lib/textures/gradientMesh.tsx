import * as blobs2 from "blobs/v2";
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  type SingleColorGradientMeshProps,
  type MultiColorGradientMeshProps,
} from "./schemas";

interface BaseGradientMeshProps {
  extraPoints: number;
  size: number;
  speed: number;
  blur: number;
  edginess: number;
  positionSeed: number;
  directionSeed: number;
  backgroundColor: string;
}

const BaseGradientMesh: React.FC<
  BaseGradientMeshProps & { getBlobColor: (index: number) => string }
> = ({
  extraPoints,
  size,
  speed,
  blur,
  edginess,
  positionSeed,
  directionSeed,
  backgroundColor,
  getBlobColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const num_blobs = 5;

  // const colors = ["6d213c", "946846", "baab68", "e3c16f","faff70"]
  const blobSize = useMemo(
    () => (Math.max(width, height) * size) / 100,
    [width, height, size],
  );

  const generateBlob = useMemo(
    () => (seed: number) =>
      blobs2.svgPath({
        seed: seed,
        extraPoints: extraPoints,
        randomness: edginess,
        size: blobSize,
      }),
    [extraPoints, edginess, blobSize],
  );

  const blobs = useMemo(
    () => Array.from({ length: num_blobs }, (_, index) => generateBlob(index)),
    [generateBlob],
  );

  const initialPositions = useMemo(
    () =>
      blobs.map((_, index) => {
        const x =
          random(`${positionSeed}-blob-x-${index}`) * (width - blobSize);
        const y =
          random(`${positionSeed}-blob-y-${index}`) * (height - blobSize);
        return { x, y };
      }),
    [blobs, positionSeed, width, height, blobSize],
  );

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          filter: `blur(${blur}px)`,
          zIndex: 0,
        }}
      >
        {blobs.map((blob, index) => {
          const directionX =
            random(`${directionSeed}-blob-direction-x-${index}`) * 2 - 1;
          const directionY =
            random(`${directionSeed}-blob-direction-y-${index}`) * 2 - 1;

          const x = initialPositions[index].x + frame * speed * directionX;
          const y = initialPositions[index].y + frame * speed * directionY;

          return (
            <svg
              key={index}
              width={blobSize}
              height={blobSize}
              style={{
                position: "absolute",
                left: x,
                top: y,
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={blob} fill={getBlobColor(index)} />
            </svg>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const SingleColorGradientMesh: React.FC<
  SingleColorGradientMeshProps
> = ({ color, ...baseProps }) => {
  const getBlobColor = () => color;
  return <BaseGradientMesh {...baseProps} getBlobColor={getBlobColor} />;
};

export const MultiColorGradientMesh: React.FC<MultiColorGradientMeshProps> = ({
  colors,
  ...baseProps
}) => {
  const getBlobColor = (index: number) => colors[index % colors.length];
  return <BaseGradientMesh {...baseProps} getBlobColor={getBlobColor} />;
};

// Legacy component for backward compatibility
export const GradientMesh = SingleColorGradientMesh;
