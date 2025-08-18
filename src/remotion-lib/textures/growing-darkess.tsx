import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    Easing,
} from "remotion";
import { type GrowingDarkProps } from "./schemas";

export const GrowingDark: React.FC<GrowingDarkProps> = ({ backgroundColor }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // const backColor = "#16191D";
    // const glow_color = "";

    const progress = spring({
        fps,
        frame,
        config: {
            damping: 100,
        },
        durationInFrames: 1 * fps,
        delay: 1 * fps,
    });

    const darkness_scale = interpolate(progress, [0, 1], [0, 1920], {
        easing: Easing.poly(4)
    });

    const opacity = interpolate(progress, [0, 1], [0, 1], {
        easing: Easing.poly(4)
    });


    return (
        <AbsoluteFill style={{ backgroundColor }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={1920}
                height={1080}
                fill="none"
            >
                <g id="simple-efffect" clipPath="url(#clip0_48754_349)">
                    <path fill="url(#paint0_radial_48754_349)" d="M0 0h1920v1080H0z" />
                    <g id="highlight-2" filter="url(#filter0_f_48754_349)">
                        <ellipse
                            cx={372}
                            cy={649.169}
                            fill="#816CFF"
                            fillOpacity={0.6}
                            rx={184.193}
                            ry={160.087}
                            transform="rotate(-.65 372 649.169)"
                        />
                    </g>
                    <g id="highlight-1" filter="url(#filter1_f_48754_349)">
                        <ellipse
                            cx={1656.21}
                            cy={293.5}
                            fill="#816CFF"
                            fillOpacity={0.6}
                            rx={266.394}
                            ry={249.49}
                            transform="rotate(-.65 1656.21 293.5)"
                        />
                    </g>
                    <g id="overlay">
                        <circle cx={width / 2} cy={height / 2} r={darkness_scale} style={{opacity}}fill="#000" />
                    </g>
                </g>
                <defs>
                    <filter
                        id="filter0_f_48754_349"
                        width={768.383}
                        height={720.182}
                        x={-12.191}
                        y={289.078}
                        colorInterpolationFilters="sRGB"
                        filterUnits="userSpaceOnUse"
                    >
                        <feFlood floodOpacity={0} result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur
                            result="effect1_foregroundBlur_48754_349"
                            stdDeviation={100}
                        />
                    </filter>
                    <filter
                        id="filter1_f_48754_349"
                        width={1218.79}
                        height={1184.99}
                        x={1046.82}
                        y={-298.993}
                        colorInterpolationFilters="sRGB"
                        filterUnits="userSpaceOnUse"
                    >
                        <feFlood floodOpacity={0} result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur
                            result="effect1_foregroundBlur_48754_349"
                            stdDeviation={171.5}
                        />
                    </filter>
                    <radialGradient
                        id="paint0_radial_48754_349"
                        cx={0}
                        cy={0}
                        r={1}
                        gradientTransform="rotate(-61.746 1182.626 -1.374) scale(500.65 890.044)"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#413399" />
                        <stop offset={0.301} stopColor="#3D308F" />
                        <stop offset={1} stopColor="#0A071C" />
                    </radialGradient>
                    <clipPath id="clip0_48754_349">
                        <path fill="#fff" d="M0 0h1920v1080H0z" />
                    </clipPath>
                </defs>
            </svg>
        </AbsoluteFill>
    );
};
