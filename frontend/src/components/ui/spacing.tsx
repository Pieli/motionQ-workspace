import React, { useMemo } from "react";

export const SPACING_UNIT = 4;

export const Spacing: React.FC<{
  readonly x?: number;
  readonly y?: number;
  readonly block?: boolean;
}> = ({ x = 0, y = 0, block = false }) => {
  const style = useMemo((): React.CSSProperties => {
    return {
      display: block ? "block" : "inline-block",
      width: x * SPACING_UNIT,
      height: y * SPACING_UNIT,
      flexShrink: 0,
    };
  }, [block, x, y]);

  return <div style={style} />;
};
