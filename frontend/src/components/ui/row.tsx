import type { HTMLAttributes } from "react";
import React, { useMemo } from "react";

export const Row: React.FC<
  {
    readonly justify?: "center" | "flex-start" | "flex-end";
    readonly align?: "center";
    readonly style?: React.CSSProperties;
    readonly flex?: number;
    readonly className?: string;
    readonly children: React.ReactNode;
  } & HTMLAttributes<HTMLDivElement>
> = ({ children, justify, className, align, flex, style = {}, ...other }) => {
  const finalStyle: React.CSSProperties = useMemo(() => {
    return {
      ...style,
      display: "flex",
      flexDirection: "row",
      justifyContent: justify ?? "flex-start",
      alignItems: align ?? "flex-start",
      flex: flex ?? undefined,
    };
  }, [align, flex, justify, style]);

  return (
    <div className={className} style={finalStyle} {...other}>
      {children}
    </div>
  );
};
