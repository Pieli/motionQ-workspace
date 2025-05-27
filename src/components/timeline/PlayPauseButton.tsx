import { Button } from "@/components/ui/button";
import type { PlayerRef } from "@remotion/player";
import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const PlayPauseButton: React.FC<{
  playerRef: React.RefObject<PlayerRef | null>;
}> = ({ playerRef }) => {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    setPlaying(player.isPlaying());
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);

    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
    };
  }, [playerRef]);

  const onToggle = useCallback(() => {
    playerRef.current?.toggle();
  }, [playerRef]);

  return (
    <Button variant="ghost" size="icon" onClick={onToggle}>
      {playing ? <Pause className="size-6" /> : <Play className="size-6" />}
    </Button>
  );
};
