import StairsImage from "./stairs-image.png";
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export interface AnimationConfig {
  damping: number;
  durationInFrames: number;
  blob1Animation: {
    xKeyframes: number[] | ((width: number) => number[]);
    yKeyframes: number[];
    progressKeyframes: number[];
  };
  blob2Animation: {
    xKeyframes: number[] | ((width: number) => number[]);
    yKeyframes: number[];
    progressKeyframes: number[];
  };
}

export interface StairsTextureBaseProps {
  backgroundColor: string;
  blob1Color: string;
  blob2Color: string;
  animationConfig: AnimationConfig;
}

export const StairsTextureBase: React.FC<StairsTextureBaseProps> = ({
  backgroundColor,
  blob1Color,
  blob2Color,
  animationConfig,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const progress = spring({
    fps,
    frame,
    config: {
      damping: animationConfig.damping,
    },
    durationInFrames: animationConfig.durationInFrames,
  });

  const blob1XKeyframes = typeof animationConfig.blob1Animation.xKeyframes === 'function'
    ? animationConfig.blob1Animation.xKeyframes(width)
    : animationConfig.blob1Animation.xKeyframes;

  const blob2XKeyframes = typeof animationConfig.blob2Animation.xKeyframes === 'function'
    ? animationConfig.blob2Animation.xKeyframes(width)
    : animationConfig.blob2Animation.xKeyframes;

  const blob_1_tranform_x = interpolate(
    progress,
    animationConfig.blob1Animation.progressKeyframes,
    blob1XKeyframes
  );
  const blob_1_tranform_y = interpolate(
    progress,
    animationConfig.blob1Animation.progressKeyframes,
    animationConfig.blob1Animation.yKeyframes
  );
  const blob_1_scale = 1;

  const blob_2_tranform_x = interpolate(
    progress,
    animationConfig.blob2Animation.progressKeyframes,
    blob2XKeyframes
  );
  const blob_2_tranform_y = interpolate(
    progress,
    animationConfig.blob2Animation.progressKeyframes,
    animationConfig.blob2Animation.yKeyframes
  );
  const blob_2_scale = 1;

  return (
    <AbsoluteFill>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={1920}
        height={1080}
        fill="none"
      >
        <g id="Plugin / file cover - 7" clipPath="url(#clip0_48746_292)">
          <path fill={backgroundColor} d="M0 0h1920v1080H0z" />
          <g
            id="blob-2-highlight"
            filter="url(#filter0_f_48746_292)"
            style={{
              transformOrigin: "center center",
              transform: `translate(${blob_2_tranform_x}px, ${blob_2_tranform_y}px) scale(${blob_2_scale})`,
            }}
          >
            <ellipse
              cx={1738.5}
              cy={1019.5}
              fill={blob2Color}
              rx={532.5}
              ry={526.5}
            />
          </g>
          <g
            id="blob-1-highlight"
            filter="url(#filter1_f_48746_292)"
            style={{
              transformOrigin: "center center",
              transform: `translate(${blob_1_tranform_x}px, ${blob_1_tranform_y}px) scale(${blob_1_scale})`,
            }}
          >
            <ellipse
              cx={126.739}
              cy={175.457}
              fill={blob1Color}
              rx={441.739}
              ry={411.457}
            />
          </g>
          <g id="Mask group">
            <mask
              id="mask0_48746_292"
              width={1920}
              height={1080}
              x={0}
              y={0}
              maskUnits="userSpaceOnUse"
              style={{
                maskType: "alpha",
              }}
            >
              <path
                id="stairs 1"
                fill="url(#pattern0_48746_292)"
                d="M0 0h1920v1080H0z"
              />
            </mask>
            <g mask="url(#mask0_48746_292)">
              <g
                id="blob-2"
                style={{
                  transformOrigin: "center center",
                  transform: `translate(${blob_2_tranform_x}px, ${blob_2_tranform_y}px) scale(${blob_2_scale})`,
                }}
              >
                <g id="Mask group_2">
                  <g
                    id="Ellipse 43394"
                    filter="url(#filter2_f_48746_292)"
                    style={{
                      mixBlendMode: "overlay",
                    }}
                  >
                    <circle
                      cx={1794.16}
                      cy={1087.16}
                      r={350}
                      fill="#E3D9FE"
                      transform="rotate(19.074 1794.16 1087.16)"
                    />
                  </g>
                  <g
                    id="Ellipse 43393"
                    filter="url(#filter3_f_48746_292)"
                    style={{
                      mixBlendMode: "overlay",
                    }}
                  >
                    <ellipse
                      cx={1701.06}
                      cy={1015.05}
                      fill="#D9D9D9"
                      rx={474.237}
                      ry={467.755}
                      transform="rotate(19.074 1701.06 1015.05)"
                    />
                  </g>
                </g>
              </g>
              <g
                id="blob-1"
                style={{
                  transformOrigin: "center center",
                  transform: `translate(${blob_1_tranform_x}px, ${blob_1_tranform_y}px) scale(${blob_1_scale})`,
                }}
              >
                <g id="Mask group_3">
                  <g
                    id="Ellipse 43392"
                    filter="url(#filter4_f_48746_292)"
                    style={{
                      mixBlendMode: "overlay",
                    }}
                  >
                    <ellipse
                      cx={476.269}
                      cy={503.672}
                      fill="#D9D9D9"
                      rx={476.269}
                      ry={503.672}
                      transform="matrix(.93649 .3507 -.30413 .95263 -94.037 -467.689)"
                    />
                  </g>
                  <g
                    id="Ellipse 43390"
                    filter="url(#filter5_f_48746_292)"
                    style={{
                      mixBlendMode: "overlay",
                    }}
                  >
                    <ellipse
                      cx={450.829}
                      cy={473.541}
                      fill="#E3D9FE"
                      rx={450.829}
                      ry={473.541}
                      transform="matrix(.93649 .3507 -.30413 .95263 -147.961 -591)"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_48746_292"
            width={1393}
            height={1381}
            x={1042}
            y={329}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_48746_292"
              stdDeviation={82}
            />
          </filter>
          <filter
            id="filter1_f_48746_292"
            width={1211.48}
            height={1150.91}
            x={-479}
            y={-400}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_48746_292"
              stdDeviation={82}
            />
          </filter>
          <filter
            id="filter2_f_48746_292"
            width={1092.19}
            height={1092.19}
            x={1248.07}
            y={541.065}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_48746_292"
              stdDeviation={98}
            />
          </filter>
          <filter
            id="filter3_f_48746_292"
            width={1339.36}
            height={1329.16}
            x={1031.38}
            y={350.471}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_48746_292"
              stdDeviation={98}
            />
          </filter>
          <filter
            id="filter4_f_48746_292"
            width={1335.44}
            height={1408.39}
            x={-468.92}
            y={-525.038}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_48746_292"
              stdDeviation={98}
            />
          </filter>
          <filter
            id="filter5_f_48746_292"
            width={1284.41}
            height={1348.29}
            x={-511.99}
            y={-655.926}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_48746_292"
              stdDeviation={98}
            />
          </filter>
          <clipPath id="clip0_48746_292">
            <path fill="#fff" d="M0 0h1920v1080H0z" />
          </clipPath>
          <pattern
            id="pattern0_48746_292"
            width={1}
            height={1}
            patternContentUnits="objectBoundingBox"
          >
            <use
              xlinkHref="#image0_48746_292"
              transform="scale(.00052 .00093)"
            />
          </pattern>
          <image
            id="image0_48746_292"
            width={1920}
            height={1080}
            data-name="stairs.png"
            href={StairsImage}
            preserveAspectRatio="none"
          />
        </defs>
      </svg>
    </AbsoluteFill>
  );
};