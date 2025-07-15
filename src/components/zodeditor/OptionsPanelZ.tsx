import * as zodTypes from "@remotion/zod-types";
import React, { useCallback, useEffect, useMemo } from "react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Row } from "@/components/ui/row";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spacing } from "@/components/ui/spacing";
import { Textarea } from "@/components/ui/textarea";

import type { BaseItem } from "@/components/timeline/Timeline";
import type {
  CompositionConfig,
  PropType,
} from "@/components/interfaces/compositions";
import { colorWithNewOpacity } from "@/helpers/color-math";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { modifyPropsInTree } from "./tree-modifier";

export const OptionsPanelZ: React.FC<{
  compositions: CompositionConfig[];
  setCompositions: React.Dispatch<
    React.SetStateAction<CompositionConfig[] | null>
  >;
  selectedItem?: BaseItem | null;
}> = ({ compositions, setCompositions, selectedItem }) => {
  const [comps, setComps] = React.useState(compositions);
  const [selectedComp, setSelectedComp] =
    React.useState<CompositionConfig | null>(null);

  useEffect(() => {
    setCompositions(comps);
  }, [comps, setCompositions]);

  useEffect(() => {
    setComps(compositions);
  }, [compositions]);

  // When selectedItem changes, open its accordion section
  useEffect(() => {
    if (selectedItem) {
      const selectedComp = comps.find((comp) => comp.id === selectedItem.id);
      setSelectedComp(selectedComp || null);
    }
  }, [selectedItem, compositions, comps]);

  return (
    <>
      {selectedComp ? (
        <ScrollArea className="h-full w-full">
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={[selectedComp.id, ...(selectedComp.background ? [selectedComp.background.id] : [])]}
            value={[selectedComp.id, ...(selectedComp.background ? [selectedComp.background.id] : [])]}
          >
            <ZodEditor
              compositions={comps}
              setCompositions={setComps}
              selectedComp={selectedComp}
            />
          </Accordion>
        </ScrollArea>
      ) : (
        <span>Select a composition to edit its properties</span>
      )}
    </>
  );
};

interface ZodEditorProps {
  compositions: CompositionConfig[];
  setCompositions: React.Dispatch<React.SetStateAction<CompositionConfig[]>>;
  selectedComp: CompositionConfig;
}

const EditorElement: React.FC<{
  composition: CompositionConfig;
  handleChange: (compId: string, key: string, value: PropType) => void;
}> = ({ composition, handleChange }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shapeDef = (composition.schema as any)._def.shape() as Record<
    string,
    z.ZodTypeAny
  >;

  return (
    <div>
      {Object.keys(shapeDef).map((key, index) => (
        <div className="py-2" key={index}>
          <ZodSwitch
            key={index}
            comp={composition}
            fieldKey={key}
            onFieldChange={handleChange}
          />
        </div>
      ))}
    </div>
  );
};

const ZodEditor: React.FC<ZodEditorProps> = ({
  compositions,
  setCompositions,
  selectedComp,
}) => {
  const handleFieldChange = useCallback(
    (nodeInfo: { parentId: string; level: number }) =>
      (compId: string, key: string, value: PropType) => {
        setCompositions(
          modifyPropsInTree(compositions, nodeInfo, compId, key, value),
        );
      },
    [compositions, setCompositions],
  );

  return (
    <>
      <AccordionItem
        value={selectedComp.id}
        key={selectedComp.id}
        className="mb-8 border rounded-xl"
      >
        <AccordionTrigger>
          <h2 className="text-ml font-bold p-2">Foreground</h2>
        </AccordionTrigger>
        <AccordionContent className="p-2">
          <EditorElement
            composition={selectedComp}
            handleChange={handleFieldChange({
              parentId: selectedComp.id,
              level: 0,
            })}
          />
        </AccordionContent>
      </AccordionItem>
      {selectedComp.background && (
        <AccordionItem
          value={selectedComp.background.id}
          key={"background"}
          className="mb-8 border rounded-xl"
        >
          <AccordionTrigger>
            <h2 className="text-ml font-bold p-2">Background</h2>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <EditorElement
              composition={selectedComp.background}
              handleChange={handleFieldChange({
                parentId: selectedComp.id,
                level: 1,
              })}
            />
          </AccordionContent>
        </AccordionItem>
      )}
    </>
  );
};

// Factory that picks the correct editor based on Zod type
interface ZodSwitchProps {
  comp: CompositionConfig;
  fieldKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFieldChange: (compId: string, key: string, value: any) => void;
}

const ZodSwitch: React.FC<ZodSwitchProps> = ({
  comp,
  fieldKey,
  onFieldChange,
}) => {
  let fieldSchema =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((comp.schema as any)._def.shape() as Record<string, z.ZodTypeAny>)[
      fieldKey
    ];
  let typeName = fieldSchema._def.typeName as z.ZodFirstPartyTypeKind;
  let currentValue = comp.props?.[fieldKey];

  // If ZodDefault, unwrap and use the default value if not set
  if (typeName === z.ZodFirstPartyTypeKind.ZodDefault) {
    const innerType = fieldSchema._def.innerType;
    const defaultValue = fieldSchema._def.defaultValue();
    fieldSchema = innerType;
    typeName = innerType._def.typeName;
    currentValue = currentValue ?? defaultValue;
  }

  currentValue = currentValue ?? "";

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
      onChange(compId, fieldKey, e.target.value);
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
