import type { CompositionConfig } from "@/components/interfaces/compositions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Minus } from "@/icons/minus";
import { Plus } from "@/icons/plus";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";

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
      {items.map((item: BaseItem, index) => (
        <div
          key={index}
          style={{
            width: calcWidth(item.duration),
          }}
        >
          <div className="h-full w-full" style={{ backgroundColor: "#b04bcf" }}>
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

  const containerHeight = tracks.length * 50;

  return (
    <>
      <div style={{ width: width, height: containerHeight }}>
        {tracks.map((track, index) => (
          <div key={index} className="relative">
            <div
              className="absolute flex box-border cursor-pointer rounded-sm border border-black/80 select-none"
              style={{
                height: 40,
                left: stepWidth + stepWidth * index * (60 / stepTime), // Remove +1 to include first element
                top: 60 + 40 * index + index * 10,
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
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    setTracks(
      comps?.map((com: CompositionConfig, index: number) => ({
        name: `A-${index + 1}`,
        items: [{ id: com.id, duration: com.duration }],
      })),
    );
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

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      const scrollContainer = e.currentTarget.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollLeft += e.deltaY;
      }
    }
  }, []);

  return (
    <>
      <div className="w-full overflow-hidden rounded-md shadow-lg mb-4 bg-background">
        <div
          className="relative h-full w-full"
          style={{ height: Math.max(250, tracks.length * 50 + 50) }}
        >
          <ScrollArea className="h-full w-full" onWheel={handleWheel}>
            <div
              className="relative flex-1"
              style={{
                minHeight: Math.max(230, tracks.length * 50),
                height: tracks.length * 50 + 50,
              }}
            >
              <div
                className="absolute top-0 left-0 flex select-none"
                style={{ width: maxWidth, height: tracks.length * 50 + 50 }}
              >
                {timelineMarkers.map(({ key, time }) => (
                  <div
                    key={key}
                    className="border-r-black flex items-start justify-end truncate border-r-[1px] pt-3 pr-1"
                    style={{
                      minWidth: Math.max(stepWidth, 35),
                      width: stepWidth,
                      height: "100%",
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
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 w-full">
        <Minus className="size-4" />
        <div className="w-28">
          <Slider
            defaultValue={[1]}
            onValueChange={debouncedZoomChange}
            max={6}
            min={1}
            step={1}
          />
        </div>
        <Plus className="size-4" />
      </div>
    </>
  );
};
