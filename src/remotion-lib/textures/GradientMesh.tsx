import { zColor } from "@remotion/zod-types";
import * as blobs2 from "blobs/v2";
import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

export const GradientMeshPropsSchema = z.object({
    speed: z.number().min(1).max(15).default(12),
    backgroundColor: zColor().default("#fff"),
    // colors: z.array(zColor())
});

/*
export const GradientMeshPropsSchema = z.object({
    extraPoints: z.number().min(0).default(8), 
    size: z.number().min(1).max(150).default(60),
    speed: z.number().min(0).default(1.0),
    blur: z.number().min(0).max(500).default(50), 
    edginess: z.number().min(0).max(300).default(4), 
    positionSeed: z.number().min(0).max(1000).default(1), 
    directionSeed: z.number().min(0).max(1000).default(42), 
    backgroundColor: zColor().default("#1e1e1e"), // Default to black
});


*/

export type GradientMeshProps = z.infer<typeof GradientMeshPropsSchema>;

export const GradientMesh: React.FC<GradientMeshProps> = ({
    speed: movement_speed,
    backgroundColor,
}) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    const extraPoints = 14;
    const size = 30;
    const blur = 200;
    const edginess = 25;
    const positionSeed = 3;
    const directionSeed = 47;

    const num_blobs = 5
    const colors = ["6d213c", "946846", "baab68", "e3c16f","faff70"]
    const blobSize = useMemo(() => Math.max(width, height) * size / 100, [width, height, size]);

    const generateBlob = useMemo(
        () => (seed: number) =>
            blobs2.svgPath({
                seed: seed,
                extraPoints: extraPoints,
                randomness: edginess,
                size: blobSize,
            }),
        [extraPoints, edginess, blobSize]
    );

    const blobs = useMemo(() => Array.from({ length: num_blobs }, (_, index) => generateBlob(index)), [generateBlob]);

    const initialPositions = useMemo(
        () =>
            blobs.map((_, index) => {
                const x = random(`${positionSeed}-blob-x-${index}`) * (width - blobSize);
                const y = random(`${positionSeed}-blob-y-${index}`) * (height - blobSize);
                return { x, y };
            }),
        [blobs, positionSeed, width, height, blobSize]
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
                    const directionX = random(`${directionSeed}-blob-direction-x-${index}`) * 2 - 1;
                    const directionY = random(`${directionSeed}-blob-direction-y-${index}`) * 2 - 1;

                    const x = initialPositions[index].x + frame * movement_speed * directionX;
                    const y = initialPositions[index].y + frame * movement_speed * directionY;

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
                            <path
                                d={blob}
                                // fill={`#${colors[index]}`}
                                fill={"red"}
                            />
                        </svg>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};