import { useState } from "react";

import { ModeToggle } from "@/components/mode-toggle";
import {
  FadeInOutTransition,
  fadeInOutSchema,
} from "@/remotion-lib/TextFades/FadeInText";

import {
  SlideInTransition,
  slideInSchema,
} from "@/remotion-lib/TextFades/SlideInText";

import { Series } from "remotion";
import { Player } from "@remotion/player";
import { createElement } from "react";
import { z } from "zod";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface CompostitionConfig {
  id: string;
  component: React.FC<any>;
  schema: z.ZodObject<any, any>;
  props: Record<string, any>;
  duration: number;
}

const components: CompostitionConfig[] = [
  {
    id: "FadeInOutTransition",
    component: FadeInOutTransition,
    schema: fadeInOutSchema,
    props: {
      text: "I am testing this out",
      bgColor: "#000000",
    },
    duration: 120,
  },
  {
    id: "SlideInTransition",
    component: SlideInTransition,
    schema: slideInSchema,
    props: {
      text: "Wowi this is amazing",
      bgColor: "#000000",
    },
    duration: 120,
  },
];

const SequenceBuilder: React.FC<{ comps: CompostitionConfig[] }> = ({
  comps,
}) => {
  const innerComp = comps.map(
    ({ id, component, schema, props, duration }, index: number) => {
      const parsedProps = schema.safeParse(props);
      if (!parsedProps.success) {
        console.error(`Error parsing props for ${id}:`, parsedProps.error);
        return null;
      }

      const inner = createElement(component, { ...parsedProps.data, key: id });

      return (
        <Series.Sequence durationInFrames={duration} key={index}>
          {inner}
        </Series.Sequence>
      );
    },
  );
  return <Series>{innerComp}</Series>;
};

const Workspace = () => {
  const compositionWidth = 1920;
  const compositionHeight = 1080;

  const [prompt, setPrompt] = useState("");
  const [GeneratedComp, setGeneratedComp] = useState<
    CompostitionConfig[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalDuration = (comps: CompostitionConfig[]) =>
    comps.reduce((acc, comp) => {
      const { duration } = comp;
      return acc + duration;
    }, 0);

  const generate = async () => {
    setLoading(true);
    setGeneratedComp(components);
    setLoading(false);
  };

  return (
    <>
      <h1 style={{ fontSize: 40, paddingLeft: 20 }}>Imagine</h1>
      <ModeToggle />

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25}>
          <div style={{ display: "flex", height: "100vh" }}>
            <div
              style={{
                width: "100%",
                padding: 24,
                background: "#f4f4f4",
                color: "black",
              }}
            >
              <h2>Animation Prompt</h2>
              <textarea
                style={{ width: "100%", height: 200, color: "black" }}
                placeholder="Describe your animation..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                onClick={generate}
                style={{
                  marginTop: 16,
                  padding: "8px 16px",
                  color: "black",
                  borderColor: "black",
                  border: "2px solid black",
                  borderRadius: 4,
                  backgroundColor: "white",
                }}
                disabled={loading || !prompt}
              >
                {loading ? "Generating..." : "Generate Animation"}
              </button>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div style={{ flex: 1, background: "#222", padding: 20 }}>
            {GeneratedComp ? (
              <Player
                component={SequenceBuilder}
                durationInFrames={totalDuration(GeneratedComp)}
                fps={30}
                compositionWidth={compositionWidth}
                compositionHeight={compositionHeight}
                inputProps={{ comps: GeneratedComp }}
                style={{ width: "100%" }}
                autoPlay
                controls
                loop
              />
            ) : (
              <div style={{ color: "#888" }}>
                Animation Preview will be shown here
              </div>
            )}
            {loading && <div style={{ color: "#fff" }}>Loading…</div>}
            {error && <div style={{ color: "salmon" }}>{error}</div>}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default Workspace;
