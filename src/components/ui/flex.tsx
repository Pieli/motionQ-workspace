import React from "react";

const flexCss: React.CSSProperties = { flex: 1 };

export const Flex: React.FC<{
  readonly children?: React.ReactNode;
}> = ({ children }) => <div style={flexCss}>{children}</div>;
