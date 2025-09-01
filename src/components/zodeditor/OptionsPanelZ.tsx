import { z } from "zod";
import * as zodTypes from "@remotion/zod-types";
import React, { useCallback, useEffect, useMemo } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { ZodColorEditor } from "@/components/zodeditor/color-editor";
import { ZodEnumEditor } from "@/components/zodeditor/enum-editor";
import { ZodNumberEditor } from "@/components/zodeditor/number-editor";
import { ZodTextEditor } from "@/components/zodeditor/text-editor";
import { ZodArrayEditor } from "@/components/zodeditor/array-editor";

import type {
  CompositionConfig,
  PropType,
} from "@/components/interfaces/compositions";
import { useComposition } from "@/lib/CompositionContext";
import type { BaseItem } from "@/components/timeline/Timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { modifyPropsInTree } from "@/components/zodeditor/tree-modifier";
import { TypoAggregateEditor } from "@/components/zodeditor/typo-agg/typo-agg-editor";

import { typographySchema } from "@/remotion-lib/TextFades/schemas";

export const OptionsPanelZ: React.FC<{
  selectedItem?: BaseItem | null;
}> = ({ selectedItem }) => {
  const { compositions, setCompositions } = useComposition();
  const [selectedComp, setSelectedComp] =
    React.useState<CompositionConfig | null>(null);

  // When selectedItem changes, open its accordion section
  useEffect(() => {
    if (selectedItem && compositions) {
      const selectedComp = compositions.find((comp) => comp.id === selectedItem.id);
      setSelectedComp(selectedComp || null);
    }
  }, [selectedItem, compositions]);

  return (
    <>
      {selectedComp ? (
        <ScrollArea className="h-full w-full">
          <div className="w-full space-y-4">
            <ZodEditor
              compositions={compositions || []}
              setCompositions={(newComps) => setCompositions(newComps as CompositionConfig[])}
              selectedComp={selectedComp}
            />
          </div>
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
  const makeUIFriendly = (label: string): string => {
    return label
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const shapeDef = (composition.schema as z.ZodTypeAny)._def.shape() as Record<
    string,
    z.ZodTypeAny
  >;

  return (
    <div>
      {Object.keys(shapeDef).map((key) => (
        <div className="py-2" key={`${composition.id}-${key}`}>
          <ZodSwitch
            key={`${composition.id}-${key}`}
            comp={composition}
            fieldKey={key}
            label={makeUIFriendly(key)}
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

  const filteredComps = useMemo(() => {
    const targetFields = Object.keys(typographySchema.shape);
    const excessKeys = Object.keys(
      (selectedComp.schema as z.AnyZodObject).shape,
    ).filter((key) => !targetFields.includes(key));

    // filter out scheme
    const typoShape = (selectedComp.schema as z.AnyZodObject).omit(
      Object.fromEntries(excessKeys.map((key) => [key, true])),
    );

    const typoKeysFilter = Object.fromEntries(
      Object.keys(typoShape.shape).map((key) => [key, true]),
    ) as Record<string, true>;

    const nonTypoShape = (selectedComp.schema as z.AnyZodObject).omit(
      typoKeysFilter,
    );

    return {
      typo: { ...selectedComp, schema: typoShape },
      nonTypo: { ...selectedComp, schema: nonTypoShape },
    };
  }, [selectedComp]);

  return (
    <>
      <TypoAggregateEditor
        composition={filteredComps.typo}
        handleChange={handleFieldChange({
          parentId: filteredComps.typo.id,
          level: 0,
        })}
      />

      {Object.keys(filteredComps.nonTypo.schema.shape).length > 0 && (
        <Card key={selectedComp.id} className="mb-4 gap-4">
          <CardHeader>
            <CardTitle>Animation</CardTitle>
          </CardHeader>
          <CardContent>
            <EditorElement
              composition={filteredComps.nonTypo}
              handleChange={handleFieldChange({
                parentId: selectedComp.id,
                level: 0,
              })}
            />
          </CardContent>
        </Card>
      )}
      {selectedComp.background && (
        <Card key="background" className="mb-4 gap-4">
          <CardHeader>
            <CardTitle>Background</CardTitle>
          </CardHeader>
          <CardContent>
            <EditorElement
              composition={selectedComp.background}
              handleChange={handleFieldChange({
                parentId: selectedComp.id,
                level: 1,
              })}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

// Factory that picks the correct editor based on Zod type
interface ZodSwitchProps {
  comp: CompositionConfig;
  fieldKey: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFieldChange: (compId: string, key: string, value: any) => void;
}

const ZodSwitch: React.FC<ZodSwitchProps> = ({
  comp,
  fieldKey,
  label,
  onFieldChange,
}) => {
  let fieldSchema = (
    (comp.schema as z.ZodTypeAny)._def.shape() as Record<string, z.ZodTypeAny>
  )[fieldKey];
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
          label={label}
          value={String(currentValue)}
          onChange={onFieldChange}
        />
      );
    case z.ZodFirstPartyTypeKind.ZodNumber:
      return (
        <ZodNumberEditor
          compId={comp.id}
          fieldKey={fieldKey}
          label={label}
          value={Number(currentValue)}
          onChange={onFieldChange}
        />
      );
    case z.ZodFirstPartyTypeKind.ZodEnum:
      return (
        <ZodEnumEditor
          compId={comp.id}
          fieldKey={fieldKey}
          label={label}
          value={String(currentValue)}
          onChange={onFieldChange}
          schema={fieldSchema as z.ZodEnum<[string, ...string[]]>}
        />
      );
    case z.ZodFirstPartyTypeKind.ZodArray:
      return (
        <ZodArrayEditor
          compId={comp.id}
          fieldKey={fieldKey}
          label={label}
          value={Array.isArray(currentValue) ? currentValue : []}
          onChange={onFieldChange}
          schema={fieldSchema as z.ZodArray<z.ZodTypeAny>}
        />
      );
    case z.ZodFirstPartyTypeKind.ZodEffects: {
      const desc = (fieldSchema as z.ZodTypeAny)._def.description;
      if (desc == zodTypes.ZodZypesInternals.REMOTION_COLOR_BRAND) {
        return (
          <ZodColorEditor
            compId={comp.id}
            fieldKey={fieldKey}
            label={label}
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
