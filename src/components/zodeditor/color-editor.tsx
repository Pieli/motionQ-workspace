import React, { useCallback, useMemo} from "react";
import * as zodTypes from "@remotion/zod-types";
import { zColor } from "@remotion/zod-types";

import { colorWithNewOpacity } from "@/helpers/color-math";
import { Spacing } from "@/components/ui/spacing";
import { Input } from "@/components/ui/input";
import { Row } from "@/components/ui/row";
import { useValidatedInput } from "@/hooks/input-validator";

export const ZodColorEditor: React.FC<{
  readonly compId: string;
  readonly fieldKey: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (compId: string, key: string, value: string) => void;
}> = ({ compId, fieldKey, label, value, onChange }) => {


  const success = useCallback((value: string) => {
    onChange(compId, fieldKey, value)
  }, [onChange, compId, fieldKey])


  const [currentValue, setCurrentValue, onEnterPressed, onValueChange] = useValidatedInput<string>(
      value, 
      (value: string) => zColor().safeParse(value).success,
      success
  )

  const { a, b, g, r } = useMemo(() => {
    try {
      return zodTypes.ZodZypesInternals.parseColor(currentValue);
    } catch {
      // Fallback to a default color if even the last valid value fails
      return zodTypes.ZodZypesInternals.parseColor("#000000");
    }
  }, [currentValue]);

  const rgb = useMemo(() => {
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }, [r, g, b]);

  const onValueChangeExteneded: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const newColor = colorWithNewOpacity(
        e.target.value,
        Math.round(a),
        zodTypes,
      );
      // invalid color
      onValueChange(newColor);

    }, [a, onValueChange],
  );


  return (
    <>
      <label className="block text-sm text-foreground font-medium mb-1">
        {label}
      </label>
      <div style={{ width: "100%" }}>
        <Row align="center">
          <Input
            type="color"
            value={rgb}
            onChange={onValueChangeExteneded}
            name={fieldKey}
            className="w-6 h-6 p-1 m-0 rounded-[50%] inline-block cursor-pointer"
          />
          <Spacing x={1} block />
          <Input
            value={currentValue}
            placeholder={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={onEnterPressed}
          />
        </Row>
      </div>
    </>
  );
};
