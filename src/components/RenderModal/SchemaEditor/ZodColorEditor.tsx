import React, { useCallback, useMemo } from "react";
import { colorWithNewOpacity } from "../../../helpers/color-math";
import { InputDragger } from "../../NewComposition/InputDragger";
import { RemotionInput } from "../../NewComposition/RemInput";
import { RemInputTypeColor } from "../../NewComposition/RemInputTypeColor";

import { z } from "zod";
import * as zodTypes from "@remotion/zod-types";

import { Row } from "@/components/ui/row";
import { Spacing } from "@/components/ui/spacing";
import { Fieldset } from "./Fieldset";
import { SchemaLabel } from "./SchemaLabel";
import { ZodFieldValidation } from "./ZodFieldValidation";
import type { UpdaterFunction } from "./ZodSwitch";
import { useLocalState } from "./local-state";
import type { JSONPath } from "./zod-types";

const fullWidth: React.CSSProperties = {
  width: "100%",
};

export const ZodColorEditor: React.FC<{
  readonly schema: z.ZodTypeAny;
  readonly jsonPath: JSONPath;
  readonly value: string;
  readonly defaultValue: string;
  readonly setValue: UpdaterFunction<string>;
  readonly onSave: UpdaterFunction<string>;
  readonly onRemove: null | (() => void);
  readonly showSaveButton: boolean;
  readonly saving: boolean;
  readonly saveDisabledByParent: boolean;
  readonly mayPad: boolean;
}> = ({
  jsonPath,
  value,
  setValue,
  showSaveButton,
  defaultValue,
  schema,
  onSave,
  onRemove,
  saving,
  saveDisabledByParent,
  mayPad,
}) => {
  const {
    localValue,
    onChange: onValueChange,
    reset,
  } = useLocalState({
    schema,
    setValue,
    unsavedValue: value,
    savedValue: defaultValue,
  });

  const { a, b, g, r } = localValue.zodValidation.success
    ? zodTypes.ZodZypesInternals.parseColor(localValue.value)
    : { a: 1, b: 0, g: 0, r: 0 };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const newColor = colorWithNewOpacity(
        e.target.value,
        Math.round(a),
        zodTypes,
      );
      onValueChange(() => newColor, false, false);
    },
    [a, onValueChange],
  );

  const onTextChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const newValue = e.target.value;
      onValueChange(() => newValue, false, false);
    },
    [onValueChange],
  );

  const save = useCallback(() => {
    onSave(() => value, false, false);
  }, [onSave, value]);

  const rgb = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  const status = localValue.zodValidation.success ? "ok" : "error";

  const colorPicker: React.CSSProperties = useMemo(() => {
    return {
      height: 39,
      width: 45,
      display: "inline-block",
    };
  }, []);

  const onOpacityChange = useCallback(
    (newValue: string) => {
      const newColor = colorWithNewOpacity(
        localValue.value,
        Math.round((Number(newValue) / 100) * 255),
        zodTypes,
      );
      onValueChange(() => newColor, false, false);
    },
    [localValue.value, onValueChange],
  );

  const onOpacityValueChange = useCallback(
    (newValue: number) => {
      const newColor = colorWithNewOpacity(
        localValue.value,
        Math.round((Number(newValue) / 100) * 255),
        zodTypes,
      );
      onValueChange(() => newColor, false, false);
    },
    [localValue.value, onValueChange],
  );

  return (
    <Fieldset shouldPad={mayPad} success={localValue.zodValidation.success}>
      <SchemaLabel
        handleClick={null}
        isDefaultValue={localValue.value === defaultValue}
        jsonPath={jsonPath}
        onReset={reset}
        onSave={save}
        showSaveButton={showSaveButton}
        onRemove={onRemove}
        saving={saving}
        valid={localValue.zodValidation.success}
        saveDisabledByParent={saveDisabledByParent}
        suffix={null}
      />
      <div style={fullWidth}>
        <Row align="center">
          <div style={colorPicker}>
            <RemInputTypeColor
              type="color"
              style={{
                height: 39,
              }}
              value={rgb}
              onChange={onChange}
              className="__remotion_color_picker"
              status={status}
              name={jsonPath.join(".")}
            />
          </div>
          <Spacing x={1} block />
          <RemotionInput
            value={localValue.value}
            status={status}
            placeholder={jsonPath.join(".")}
            onChange={onTextChange}
            rightAlign={false}
          />
          <Spacing x={1} />
          <InputDragger
            onTextChange={onOpacityChange}
            onValueChange={onOpacityValueChange}
            status={status}
            value={(a / 255) * 100}
            min={0}
            max={100}
            step={1}
            formatter={(v) => `${Math.round(Number(v))}%`}
            rightAlign={false}
          />
        </Row>
        <ZodFieldValidation path={jsonPath} localValue={localValue} />
      </div>
    </Fieldset>
  );
};
