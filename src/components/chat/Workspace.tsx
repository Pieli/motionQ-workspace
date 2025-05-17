import { useState, useMemo } from "react";

import {
  FadeInOutTransition,
  fadeInOutSchema,
} from "@/remotion-lib/TextFades/FadeInText";

import {
  SlideInTransition,
  slideInSchema,
} from "@/remotion-lib/TextFades/SlideInText";

import { Player } from "@remotion/player";
import { createElement } from "react";
import { Series } from "remotion";
import { z } from "zod";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { OptionsPanel } from "@/components/OptionsPanel";

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

  const [history, setHistory] = useState<string[]>([]);

  const totalDuration = useMemo(
    () =>
      GeneratedComp?.reduce((acc, comp) => {
        const { duration } = comp;
        return acc + duration;
      }, 0),
    [GeneratedComp],
  );

  const generate = async () => {
    setHistory((prev) => [...prev, prompt]);
    setPrompt("");
    setLoading(true);
    setGeneratedComp(components);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[calc(100vh-60px)]"
      >
        <ResizablePanel defaultSize={25}>
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div className="flex-1">
              {history.length > 0 ? (
                <ul className="overflow-auto p-4 space-y-4">
                  {history.map((item, index) => (
                    <li key={index} className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl bg-secondary text-secondary-foreground px-4 py-2 break-words text-left">
                        {item}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted-foreground p-4 text-center">
                  No history available
                </div>
              )}
            </div>
            <div className="pt-4 px-4">
              <div className="relative">
                <Textarea
                  className="min-h-[60px] w-full pr-12 resize-none rounded-xl"
                  placeholder="Describe your animation..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={1}
                  style={{
                    minHeight: "60px",
                    maxHeight: "200px",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
                <Button
                  className="absolute right-2 bottom-2"
                  size="sm"
                  onClick={generate}
                  disabled={loading || !prompt}
                >
                  <span style={{ fontWeight: 900, fontSize: 12 }}>{">"}</span>
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex-1 px-4 h-full">
            {/*<Tabs defaultValue="account" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="editor"></TabsContent>
              <TabsContent value="preview"></TabsContent>
            </Tabs>
        */}
            <div className="isolate flex-1 p-20 h-full rounded-xl bg-secondary">
              {GeneratedComp ? (
                <Player
                  component={SequenceBuilder}
                  durationInFrames={totalDuration || 1}
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
            </div>
          </div>
        </ResizablePanel>
        <ResizablePanel defaultSize={25}>
          <h2 className="text-xl font-bold m-4">Animation Properties</h2>
          <OptionsPanel readOnlyStudio={true} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default Workspace;
