import { z } from "zod";
import * as zodTypes from "@remotion/zod-types";
import React, { useEffect, useCallback, useMemo } from "react";

import { Spacing } from "@/components/ui/spacing";
import { Row } from "@/components/ui/row";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { CompostitionConfig } from "@/components/interfaces/compositions";

import { colorWithNewOpacity } from "@/helpers/color-math";

export const OptionsPanelZ: React.FC<{
  compositions: CompostitionConfig[];
  setCompositions: React.Dispatch<
    React.SetStateAction<CompostitionConfig[] | null>
  >;
}> = ({ compositions, setCompositions }) => {
  // initialize local state from incoming compositions
  const [comps, setComps] = React.useState(compositions);

  useEffect(() => {
    setCompositions(comps);
  }, [comps, setCompositions]);

  return <ZodEditor compositions={comps} setCompositions={setComps} />;
};

interface ZodEditorProps {
  compositions: CompostitionConfig[];
  setCompositions: React.Dispatch<React.SetStateAction<CompostitionConfig[]>>;
}

const ZodEditor: React.FC<ZodEditorProps> = ({
  compositions,
  setCompositions,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldChange = (compId: string, key: string, value: any) => {
    setCompositions((prev) =>
      prev.map((comp) => {
        if (comp.id !== compId) return comp;
        // update the composition's props for `key`
        const newProps = { ...comp.props, [key]: value };
        return { ...comp, props: newProps };
      }),
    );
  };

  return (
    <>
      {compositions.map((comp) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shapeDef = (comp.schema as any)._def.shape() as Record<
          string,
          z.ZodTypeAny
        >;
        return (
          <div key={comp.id} className="mb-8">
            <h2 className="text-ml font-bold mb-4">{comp.id}</h2>
            <div className="space-y-4 pr-4">
              {Object.keys(shapeDef).map((key) => (
                <ZodSwitch
                  key={key}
                  comp={comp}
                  fieldKey={key}
                  onFieldChange={handleFieldChange}
                />
              ))}
            </div>
            <Spacing />
          </div>
        );
      })}
    </>
  );
};

// Factory that picks the correct editor based on Zod type
interface ZodSwitchProps {
  comp: CompostitionConfig;
  fieldKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFieldChange: (compId: string, key: string, value: any) => void;
}

const ZodSwitch: React.FC<ZodSwitchProps> = ({
  comp,
  fieldKey,
  onFieldChange,
}) => {
  const fieldSchema =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((comp.schema as any)._def.shape() as Record<string, z.ZodTypeAny>)[
      fieldKey
    ];
  const typeName = fieldSchema._def.typeName as z.ZodFirstPartyTypeKind;
  const currentValue = comp.props?.[fieldKey] ?? "";

  switch (typeName) {
    case z.ZodFirstPartyTypeKind.ZodString:
      return (
        <ZodTextEditor
          compId={comp.id}
          fieldKey={fieldKey}
          value={String(currentValue)}
          onChange={onFieldChange}
        />
      );
    case z.ZodFirstPartyTypeKind.ZodEffects: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const desc = (fieldSchema as any)._def.description;
      if (desc == zodTypes.ZodZypesInternals.REMOTION_COLOR_BRAND) {
        return (
          <ZodColorEditor
            compId={comp.id}
            fieldKey={fieldKey}
            value={String(currentValue)}
            onChange={onFieldChange}
          />
        );
      }
      return (
        <div className="text-sm text-gray-500">
          Unsupported type: why I am here {comp.schema._def.description}
        </div>
      );
    }

    default:
      return (
        <div className="text-sm text-gray-500">
          Unsupported type: {typeName}
        </div>
      );
  }
};

// Editor for string fields
interface ZodTextEditorProps {
  readonly compId: string;
  readonly fieldKey: string;
  readonly value: string;
  readonly onChange: (compId: string, key: string, value: string) => void;
}

const ZodTextEditor: React.FC<ZodTextEditorProps> = ({
  compId,
  fieldKey,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{fieldKey}</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(compId, fieldKey, e.currentTarget.value)}
      />
    </div>
  );
};

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
      const newValue = e.target.value;
      onChange(compId, fieldKey, newValue);
    },
    [compId, fieldKey, onChange],
  );

  const rgb = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return (
    <>
      <label className="block text-sm font-medium mb-1">{fieldKey}</label>
      <div style={{ width: "100%" }}>
        <Row align="center">
          <Input
            type="color"
            style={{
              height: 29,
              width: 29,
              borderRadius: "50%",
              margin: 0,
              padding: 4,
              display: "inline-block",
            }}
            value={rgb}
            onChange={onValueChange}
            name={fieldKey}
          />
          <Spacing x={1} block />
          <Input value={value} placeholder={value} onChange={onTextChange} />
        </Row>
      </div>
    </>
  );
};
