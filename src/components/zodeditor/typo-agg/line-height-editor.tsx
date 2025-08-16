import React, { useCallback } from "react";

import { Input } from "@/components/ui/input";
import { useValidatedInput } from "@/hooks/input-validator";

export const LineHeightEditor: React.FC<{
  readonly compId: string;
  readonly fieldKey: string;
  readonly value: number | string;
  readonly onChange: (compId: string, key: string, value: number) => void;
}> = ({ compId, fieldKey, value, onChange }) => {
  const success = useCallback(
    (value: string) => {
      onChange(compId, fieldKey, Number(value));
    },
    [onChange, compId, fieldKey],
  );

  const isValid = useCallback((value: string) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0 && num <= 500;
  }, []);

  const [currentValue, setCurrentValue, onEnterPressed] =
    useValidatedInput<string>(value?.toString() || "", isValid, success);

  return (
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
        <p className="border-y border-y-1 border-muted-foreground py-0.5 leading-none">
          A
        </p>
      </span>
      <div className="relative">
        <Input
          className="pl-10 pr-6"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onKeyDown={onEnterPressed}
          placeholder="100"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
          %
        </span>
      </div>
    </div>
  );
};
