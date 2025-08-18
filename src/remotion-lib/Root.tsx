import { Composition, Folder } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { FadeInTransition } from "./TextFades/FadeInText";
import { ScaleUpDownTransition } from "./TextFades/ScaleUpDownText";
import { SimpleTextFade } from "./TextFades/SimpleTextFade";
import { SimpleTextTyping } from "./TextFades/SimpleTextTyping";
import { SlideInTransition } from "./TextFades/SlideInText";
import {
  TextShatterTransition,
  textShatterSchema,
} from "./TextFades/TextShatterTransition";
import {
  ThreeDTextTransition,
  threeDTextSchema,
} from "./TextFades/ThreeDTextTransition";
import {
  WaveEffectTransition,
  waveEffectSchema,
} from "./TextFades/WaveEffectTransition";
import { CountingStars, countingStarsSchema } from "./counting/counting-stars";
import {
  fadeInSchema,
  scaleUpDownSchema,
  simpleFadeSchema,
  simpleTypingSchema,
  slideInSchema,
} from "./TextFades/schemas";
import { SearchBarAnimation } from "./experimental-jitter/searchbar";

import { GradientMesh } from "./textures/GradientMesh";
import { GrowingDark } from "./textures/growing-darkess";
import { StairsMesh } from "./textures/staris-texture";
import { StairsMeshV2 } from "./textures/staris-texture-v2";
import { StairsMeshV3 } from "./textures/staris-texture-v3";
import { TwinMesh } from "./textures/twins-texture";
import {
  gradientMeshSchema,
  growingDarkSchema,
  stairsMeshSchema,
  twinMeshSchema,
  stairsMeshSchemaV2,
  stairsMeshSchemaV3,
} from "./textures/schemas";



// import { ReactComponent as SaasOverview } from "./public/saas_overview.svg";
// import { SvgTransition, svgTransitionSchema } from "./ProductPreview/SvgTransition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render src/index.ts <id> out/video.mp4
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />

      <Composition
        id="SimpleFade"
        component={SimpleTextFade}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        schema={simpleFadeSchema}
        defaultProps={simpleFadeSchema.parse({
          text: "Hello World" as const,
        })}
      />

      <Composition
        id="SimpleTyping"
        component={SimpleTextTyping}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        schema={simpleTypingSchema}
        defaultProps={simpleTypingSchema.parse({
          text: "Hello World" as const,
        })}
      />

      <Composition
        id="SlideInTransition"
        component={SlideInTransition}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        schema={slideInSchema}
        defaultProps={slideInSchema.parse({
          text: "Hello World" as const,
          textColor: "#000" as const,
        })}
      />

      <Composition
        id="ScaleUpDownTransition"
        component={ScaleUpDownTransition}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        schema={scaleUpDownSchema}
        defaultProps={scaleUpDownSchema.parse({
          text: "Hello World" as const,
        })}
      />

      <Composition
        id="FadeInTransition"
        component={FadeInTransition}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        schema={fadeInSchema}
        defaultProps={fadeInSchema.parse({
          text: "Hello World" as const,
          textColor: "#000" as const,
        })}
      />

      <Composition
        id="ThreeDTextTransition"
        component={ThreeDTextTransition}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        schema={threeDTextSchema}
        defaultProps={{
          text: "Hello World" as const,
          bgColor: "#fff" as const,
        }}
      />

      <Composition
        id="TextShatterTransition"
        component={TextShatterTransition}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        schema={textShatterSchema}
        defaultProps={{
          text: "Hello World" as const,
          bgColor: "#fff" as const,
        }}
      />

      <Composition
        id="WaveEffectTransition"
        component={WaveEffectTransition}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        schema={waveEffectSchema}
        defaultProps={{
          text: "Hello World" as const,
          bgColor: "#fff" as const,
        }}
      />

      <Composition
        id="CountingStars"
        component={CountingStars}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        schema={countingStarsSchema}
        defaultProps={{
          text: "100 Counting Stars",
          bgColor: "#000",
          textColor: "#fff",
          startingNumber: 0,
          goalNumber: 100,
          suffixText: "",
          prefixText: "",
        }}
      />

      <Composition
        id="SearchBar"
        component={SearchBarAnimation}
        durationInFrames={4 * 30}
        fps={30}
        width={1920}
        height={1080}
      />

      <Folder name="textures">
        <Composition
          id="GradientMesh"
          component={GradientMesh}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={gradientMeshSchema}
          defaultProps={gradientMeshSchema.parse({
            extraPoints: 8,
            size: 60,
            speed: 1,
          })}
        />
        <Composition
          id="TwinTexture"
          component={TwinMesh}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={twinMeshSchema}
          defaultProps={twinMeshSchema.parse({
            backgroundColor: "#1e1e1e"
          })}
        />
        <Composition
          id="StairsTexture"
          component={StairsMesh}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={stairsMeshSchema}
          defaultProps={stairsMeshSchema.parse({
            backgroundColor: "#1e1e1e"
          })}
        />
        <Composition
          id="StairsTextureV2"
          component={StairsMeshV2}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={stairsMeshSchemaV2}
          defaultProps={stairsMeshSchemaV2.parse({
            backgroundColor: "#1e1e1e"
          })}
        />
        <Composition
          id="StairsTextureV3"
          component={StairsMeshV3}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={stairsMeshSchemaV3}
          defaultProps={stairsMeshSchemaV3.parse({
            backgroundColor: "#1e1e1e"
          })}
        />
        <Composition
          id="GrowingDarkness"
          component={GrowingDark}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={growingDarkSchema}
          defaultProps={growingDarkSchema.parse({
            backgroundColor: "#1e1e1e"
          })}
        />
      </Folder>


      {/*
      <Composition
        id="SvgTransition"
        component={SvgTransition}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
        schema={svgTransitionSchema}
        defaultProps ={{
          asset: staticFile("./public/saas_overview.svg"),
          scale: 1,
          duration: 80,
        }}
      />
     */}
    </>
  );
};
