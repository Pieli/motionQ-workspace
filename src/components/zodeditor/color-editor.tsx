import React, { useCallback, useMemo } from "react";
import * as zodTypes from "@remotion/zod-types";

import { colorWithNewOpacity } from "@/helpers/color-math";
import { Spacing } from "@/components/ui/spacing";
import { Input } from "@/components/ui/input";
import { Row } from "@/components/ui/row";

export const ZodColorEditor: React.FC<{
  readonly compId: string;
  readonly fieldKey: string;
  readonly value: string;
  readonly onChange: (compId: string, key: string, value: string) => void;
}> = ({ compId, fieldKey, value, onChange }) => {
  const { a, b, g, r } = useMemo(
    () => zodTypes.ZodZypesInternals.parseColor(value),
    [value],
  );

  const onValueChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const newColor = colorWithNewOpacity(
        e.target.value,
        Math.round(a),
        zodTypes,
      );
      onChange(compId, fieldKey, newColor);
    },
    [a, compId, fieldKey, onChange],
  );

  const onTextChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onChange(compId, fieldKey, e.target.value);
    },
    [compId, fieldKey, onChange],
  );

  const rgb = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return (
    <>
      <label className="block text-sm text-foreground font-medium mb-1">
        {fieldKey}
      </label>
      <div style={{ width: "100%" }}>
        <Row align="center">
          <Input
            type="color"
            value={rgb}
            onChange={onValueChange}
            name={fieldKey}
            className="w-6 h-6 p-1 m-0 rounded-[50%] inline-block cursor-pointer"
          />
          <Spacing x={1} block />
          <Input value={value} placeholder={value} onChange={onTextChange} />
        </Row>
      </div>
    </>
  );
};
