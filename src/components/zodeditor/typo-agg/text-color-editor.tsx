import React, { useCallback, useMemo } from "react";
import * as zodTypes from "@remotion/zod-types";
import { zColor } from "@remotion/zod-types";

import { colorWithNewOpacity } from "@/helpers/color-math";
import { Input } from "@/components/ui/input";
import { useValidatedInput } from "@/hooks/input-validator";

export const TextColorEditor: React.FC<{
  readonly compId: string;
  readonly fieldKey: string;
  readonly value: string;
  readonly onChange: (compId: string, key: string, value: string) => void;
}> = ({ compId, fieldKey, value, onChange }) => {
  const success = useCallback((value: string) => {
    onChange(compId, fieldKey, value);
  }, [onChange, compId, fieldKey]);

  const [currentValue, setCurrentValue, onEnterPressed, onValueChange] = useValidatedInput<string>(
    value, 
    (value: string) => zColor().safeParse(value).success,
    success
  );

  const { a, b, g, r } = useMemo(() => {
    try {
      return zodTypes.ZodZypesInternals.parseColor(currentValue);
    } catch {
      return zodTypes.ZodZypesInternals.parseColor("#ffffff");
    }
  }, [currentValue]);

  const rgb = useMemo(() => {
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }, [r, g, b]);

  const onValueChangeExtended: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const newColor = colorWithNewOpacity(
        e.target.value,
        Math.round(a),
        zodTypes,
      );
      onValueChange(newColor);
    }, [a, onValueChange],
  );

  return (
    <div className="flex gap-2 items-center">
      <Input
        type="color"
        value={rgb}
        onChange={onValueChangeExtended}
        className="w-6 h-6 p-1 m-0 rounded-[50%] inline-block cursor-pointer"
      />
      <Input
        value={currentValue}
        placeholder="#ffffff"
        onChange={(e) => setCurrentValue(e.target.value)}
        onKeyDown={onEnterPressed}
      />
    </div>
  );
};