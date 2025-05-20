import { debounce } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// import { Row } from "@/components/ui/row";
import type { CompositionConfig } from "@/components/interfaces/compositions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";

import { Plus } from "@/icons/plus";

type BaseItem = {
  id: string;
  duration: number;
};

type Track = {
  name: string;
  items: BaseItem[];
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

const TrackItems: React.FC<{
  items: BaseItem[];
  calcWidth: (duration: number) => number;
}> = ({ items, calcWidth }) => {
  return (
    <div className="flex" style={{ gap: "1px" }}>
      {items.map((item: BaseItem) => (
        <div
          style={{
            width: calcWidth(item.duration),
          }}
        >
          <div
            className="h-full w-full border border-black"
            style={{ backgroundColor: "#b04bcf" }}
          >
            {item.id}
          </div>
        </div>
      ))}
    </div>
  );
};

const TrackLines: React.FC<{
  tracks: Track[];
  width: number;
  stepWidth: number;
  stepTime: number;
}> = ({ tracks, width, stepWidth, stepTime }) => {
  const calculateTrackItemWidth = useCallback(
    (duration: number) => (duration / stepTime) * stepWidth,
    [stepWidth, stepTime],
  );

  return (
    <>
      <div style={{ width: width, height: 130 }}>
        {tracks.map((track, index) => (
          <div key={index} className="relative">
            <div
              className="absolute flex box-border cursor-pointer rounded-sm border border-black/80 select-none"
              style={{
                width: calculateTrackItemWidth(120),
                height: 40,
                left: stepWidth,
                top: 40 * index + 40 + index * 10,
                overflow: "hidden",
                zIndex: 0,
              }}
            >
              <TrackItems
                items={track.items}
                calcWidth={calculateTrackItemWidth}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const Timeline: React.FC<{ comps: CompositionConfig[] }> = ({
  comps,
}) => {
  const [tracks, setTracks] = useState<Track[]>([
    { name: "Animation", items: [] },
  ]);

  useEffect(() => {
    setTracks([
      {
        name: "Animations",
        items: comps?.map((com: CompositionConfig) => ({
          id: com.id,
          duration: com.duration,
        })),
      },
    ]);
  }, [comps]);

  const maxDuration: number = 120;

  const [zoom, setZoom] = useState<number>(1);

  const stepToSecs = useCallback((step: number): number => {
    switch (step) {
      case 1:
        return 60;
      case 2:
        return 30;
      case 3:
        return 10;
      case 4:
        return 5;
      case 5:
        return 1;
      case 6:
        return 0.5;
      default:
        return 60;
    }
  }, []);

  const steps = useMemo(
    () => maxDuration / stepToSecs(zoom),
    [zoom, maxDuration, stepToSecs],
  );

  const { width } = useWindowDimensions();

  const stepWidth = useMemo(() => (width * 0.75) / 12, [width]);
  const maxWidth = useMemo(() => (steps + 2) * stepWidth, [steps, stepWidth]);

  const secToMinSec = useCallback((secs: number): string => {
    const mins: number = Math.floor(secs / 60);
    const minFmt: string = mins > 9 ? mins.toString() : `0${mins}`;
    const secRest: number = secs % 60;
    const secsFmt: string = secRest > 9 ? secRest.toString() : `0${secRest}`;

    return `${minFmt}:${secsFmt}`;
  }, []);

  const stepsToMinSec = useCallback(
    (step: number) => {
      return secToMinSec(step * stepToSecs(zoom));
    },
    [zoom, stepToSecs, secToMinSec],
  );

  const timelineMarkers = useMemo(
    () =>
      Array.from({ length: steps + 2 }, (_, i) => ({
        key: i,
        time: stepsToMinSec(i),
      })),
    [steps, stepsToMinSec],
  );

  const debouncedZoomChange = useMemo(
    () =>
      debounce((value: number[]) => {
        setZoom(value[0]);
      }, 50),
    [setZoom],
  );

  return (
    <>
      <div className="w-full border-black-50 overflow-hidden rounded-md shadow-lg mb-4">
        <div className="relative h-full w-full" style={{ height: 250 }}>
          <div className="absolute w-full h-full flex flex-column">
            <ScrollArea className="h-full w-full">
              <div className="flex h-full w-full">
                <div
                  className="sticky left-0 bg-black z-20 flex h-full flex-col"
                  style={{ width: "200px", minWidth: "200px" }}
                >
                  <div className="border-timeline-border relative top-0 flex w-full shrink-0 items-center justify-end border-r-[1px] pr-2 font-bold text-white tabular-nums">
                    <div className="bg-timeline-panel flex items-center justify-center gap-1 rounded-sm px-2 py-1 text-sm font-semibold text-white shadow-xs hover:bg-white/20">
                      <Plus color={"white"} className="size-4" />
                    </div>
                  </div>
                  {tracks.map((track, index) => (
                    <div
                      key={index}
                      className="flex h-16 w-full items-center justify-end border-b-[1px] border-timeline-border pr-2 font-bold text-white tabular-nums"
                    >
                      {track.name}
                    </div>
                  ))}
                </div>
                <div
                  className="relative flex-1"
                  style={{ minHeight: 230, height: 132 }}
                >
                  <div
                    className="absolute top-0 left-0 flex h-full select-none"
                    style={{ width: maxWidth }}
                  >
                    {timelineMarkers.map(({ key, time }) => (
                      <div
                        key={key}
                        className="border-r-white flex min-h-full items-start justify-end truncate border-r-[1px] pt-3 pr-1"
                        style={{
                          minWidth: Math.max(stepWidth, 35),
                          width: stepWidth,
                        }}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                  <TrackLines
                    tracks={tracks}
                    width={maxWidth}
                    stepWidth={stepWidth}
                    stepTime={stepToSecs(zoom)}
                  />
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
      <Slider
        defaultValue={[1]}
        onValueChange={debouncedZoomChange}
        max={6}
        min={1}
        step={1}
      />
    </>
  );
};

export const TimelineV2: React.FC<{
  compositions: CompositionConfig[];
  setCompositions: React.Dispatch<
    React.SetStateAction<CompositionConfig[] | null>
  >;
}> = ({ compositions, setCompositions }) => {
  const totalDuration = compositions.reduce((sum, c) => sum + c.duration, 0);

  // Example: prompt for a new comp id and duration
  const handleAdd = () => {
    const id = prompt("New comp ID")?.trim();
    const dur = Number(prompt("Duration in frames"));
    if (!id || isNaN(dur)) {
      return;
    }
    // here you'd also choose component, schema and props
    const newComp: CompositionConfig = {
      id,
      component: () => <div style={{ padding: 10 }}>Demo {id}</div>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      schema: {} as any,
      props: {},
      duration: dur,
    };
    setCompositions((prev) => (prev ? [...prev, newComp] : [newComp]));
  };

  const handleRemove = (idx: number) => {
    setCompositions((prev) => (prev ? prev.filter((_, i) => i !== idx) : prev));
  };

  return (
    <div style={{ border: "1px solid #ccc" }}>
      {compositions.map((c, i) => {
        const left = compositions
          .slice(0, i)
          .reduce((sum, x) => sum + x.duration, 0);
        // const width = c.duration;
        return (
          <div
            key={c.id}
            style={{
              top: 10,
              left,
              // width,
              height: 40,
              background: "#888",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 4px",
            }}
          >
            <span>{c.id}</span>
            <button onClick={() => handleRemove(i)}>×</button>
          </div>
        );
      })}
      <button onClick={handleAdd}>Add Composition</button>
      <div>Total Duration: {totalDuration} frames</div>
    </div>
  );
};
