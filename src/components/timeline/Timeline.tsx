import type { PlayerRef } from "@remotion/player";
import { debounce } from "lodash";
import { Repeat2 } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Minus } from "@/icons/minus";
import { Plus } from "@/icons/plus";

import type { CompositionConfig } from "@/components/interfaces/compositions";
import { PlayPauseButton } from "@/components/timeline/PlayPauseButton";
import { useCurrentPlayerFrame } from "@/components/timeline/user-current-player-frame";
import { FPS } from "@/globals";

type BaseItem = {
  id: string;
  start: number;
  end: number;
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
            marginLeft: calcWidth(item.start), // Add margin based on start time
          }}
        >
          <div
            className="h-full w-full bg-primary p-2 box-border cursor-pointer rounded-sm border border-black/80 select-none"
            style={{
              color: "#ffffff",
              // backgroundColor: "#347ebf",
            }}
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
  stepWidth: number;
  stepTime: number;
}> = ({ tracks, stepWidth, stepTime }) => {
  const calculateTrackItemWidth = useCallback(
    (duration: number) => (duration / (FPS * stepTime)) * stepWidth,
    [stepWidth, stepTime],
  );

  const containerHeight = tracks.length * 50;

  return (
    <>
      <div style={{ height: containerHeight }}>
        {tracks.map((track, index) => (
          <div key={index} className="relative">
            <div
              className="absolute flex"
              style={{
                height: 45,
                left: stepWidth, // Remove the index-based offset since items have their own start times
                top: 60 + 45 * index + index * 8,
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

const ControlMenu: React.FC<{
  debounceZoomChange: (value: number[]) => void;
  totalDuration: number;
  currentFrame: number | null;
  parentPlayerRef: React.RefObject<PlayerRef | null>;
  setLoop: React.Dispatch<React.SetStateAction<boolean>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}> = ({
  debounceZoomChange,
  totalDuration,
  currentFrame,
  parentPlayerRef,
  setLoop,
  zoom,
  setZoom,
}) => {
  const [isLoopActive, setIsLoopActive] = useState(true);

  function frameToTime(frame: number): string {
    const secs = Math.floor(frame / FPS);
    const milis = Math.floor((frame % FPS) * (100 / FPS));
    if (secs < 60) {
      return `00:${secs.toString().padStart(2, "0")}:${milis.toString().padStart(2, "0")}`;
    }
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}:${milis.toString().padStart(2, "0")}`;
  }

  const handleLoopToggle = () => {
    setIsLoopActive((prev) => !prev);
    setLoop((prev) => !prev);
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 1, 6));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 1, 1));
  };

  return (
    <div className="flex items-center justify-between border-b h-12 px-4">
      {/* Left section - Loop button */}
      <div className="flex-none">
        <Button
          variant="ghost"
          size="icon"
          className={`transition-colors duration-200 ${isLoopActive ? "bg-primary text-white" : "hover:bg-gray-100"}`}
          onClick={handleLoopToggle}
        >
          <Repeat2 className="size-5" />
        </Button>
      </div>

      {/* Center section - Play controls and time */}
      <div className="flex items-center gap-4">
        <PlayPauseButton playerRef={parentPlayerRef} />
        <div className="border p-1 px-3 rounded-xl text-base font-mono">
          {currentFrame !== null ? frameToTime(currentFrame) : "00:00:00"} |{" "}
          {frameToTime(totalDuration)}
        </div>
      </div>

      {/* Right section - Zoom controls */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleZoomOut}>
          <Minus className="size-3" />
        </Button>
        <div className="w-28">
          <Slider
            defaultValue={[zoom]}
            onValueChange={debounceZoomChange}
            value={[zoom]}
            max={6}
            min={1}
            step={1}
          />
        </div>
        <Button variant="ghost" size="icon" onClick={handleZoomIn}>
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  );
};

const Cursor: React.FC<{
  frame: number | null;
  stepWidth: number;
  stepTime: number;
  height: number;
}> = ({ frame, stepWidth, stepTime, height }) => {
  if (frame === null) return null;

  const position = (frame / FPS / stepTime) * stepWidth + stepWidth;

  return (
    <div
      className="absolute top-0 w-[2px] bg-red-500 pointer-events-none"
      style={{
        left: position,
        height: height,
        zIndex: 1000,
      }}
    />
  );
};

export const Timeline: React.FC<{
  comps: CompositionConfig[];
  playerRef: React.RefObject<PlayerRef | null>;
  setLoop: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ comps, playerRef, setLoop }) => {
  const [tracks, setTracks] = useState<Track[]>([]);

  const frame = useCurrentPlayerFrame(playerRef);

  useEffect(() => {
    let currentStartTime = 0;
    setTracks(
      comps?.map((com: CompositionConfig, index: number) => {
        const item: BaseItem = {
          id: com.id,
          start: currentStartTime,
          end: currentStartTime + com.duration,
          duration: com.duration,
        };

        currentStartTime += com.duration; // Update start time for next track

        return {
          name: `A-${index + 1}`,
          items: [item],
        };
      }),
    );
  }, [comps]);

  const maxDuration: number = 120;

  const [zoom, setZoom] = useState<number>(5);

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
        return 5;
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
      const scrollContainer = e.currentTarget.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollLeft += e.deltaY;
      }
    }
  }, []);

  const totalDuration = useMemo(() => {
    if (tracks && tracks.length) {
      const lastTrackItems = tracks[tracks.length - 1].items;
      return lastTrackItems[lastTrackItems.length - 1].end;
    }
    return 0;
  }, [tracks]);

  return (
    <div className="rounded-md shadow-lg mb-4 bg-background">
      <ControlMenu
        debounceZoomChange={debouncedZoomChange}
        totalDuration={totalDuration}
        currentFrame={frame}
        parentPlayerRef={playerRef}
        setLoop={setLoop}
        zoom={zoom}
        setZoom={setZoom}
      />
      <div className="w-full h-full overflow-hidden ">
        <div
          className="relative h-full w-full"
          style={{ height: Math.max(300, tracks.length * 50 + 100) }}
        >
          <ScrollArea className="h-full w-full" onWheel={handleWheel}>
            <div
              className="relative flex-1"
              style={{
                minHeight: Math.max(230, tracks.length * 50),
                height: tracks.length * 50 + 100,
              }}
            >
              <div
                className="absolute top-0 left-0 flex select-none overflow_hidden"
                style={{ width: maxWidth, height: tracks.length * 50 + 100 }}
              >
                {timelineMarkers.map(({ key, time }) => (
                  <div
                    key={key}
                    className="border-r-secondary text-muted-foreground flex items-start justify-end truncate border-r-[1px] pt-3 pr-1 font-mono"
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
              <Cursor
                frame={frame}
                stepWidth={stepWidth}
                stepTime={stepToSecs(zoom)}
                height={tracks.length * 50 + 50}
              />
              <TrackLines
                tracks={tracks}
                stepWidth={stepWidth}
                stepTime={stepToSecs(zoom)}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
