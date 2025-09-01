import { useCallback, useState } from "react";

export function useValidatedInput<T>(
  initialValue: T,
  isValid: (value: T) => boolean,
  success: (value: T) => void,
): [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  React.KeyboardEventHandler<HTMLInputElement>,
  (val: T) => void,
] {
  const [lastValidValue, setLastValidValue] = useState<T>(initialValue);
  const [currentValue, setCurrentValue] = useState<T>(initialValue);

  const onValueChange = useCallback(
    (val: T) => {
      if (isValid(val) && val !== lastValidValue) {
        setCurrentValue(val);
        success(val);
        setLastValidValue(val);
        return;
      }

      // invalid value reset
      setCurrentValue(lastValidValue);
    },
    [lastValidValue, isValid, success, setCurrentValue, setLastValidValue],
  );

  const onEnterPressed: React.KeyboardEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        if (e.key !== "Enter") {
          return;
        }

        onValueChange(currentValue);
      },
      [onValueChange, currentValue],
    );

  return [currentValue, setCurrentValue, onEnterPressed, onValueChange];
}
