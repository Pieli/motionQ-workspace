import React from "react";
import { z } from "zod";
import * as zodTypes from "@remotion/zod-types";
import { Button } from "@/components/ui/button";
import { ZodColorEditor } from "@/components/zodeditor/color-editor";
import { Trash2, Plus } from "lucide-react";

interface ZodArrayEditorProps {
  compId: string;
  fieldKey: string;
  label: string;
  value: string[];
  onChange: (compId: string, key: string, value: string[]) => void;
  schema: z.ZodArray<z.ZodTypeAny>;
}

export const ZodArrayEditor: React.FC<ZodArrayEditorProps> = ({
  compId,
  fieldKey,
  label,
  value = [],
  onChange,
  schema,
}) => {
  const minLength = schema._def.minLength?.value ?? 0;
  const maxLength = schema._def.maxLength?.value ?? null;
  const elementType = schema._def.type;

  const isColorArray = () => {
    let checkType = elementType;

    if (checkType._def.typeName === z.ZodFirstPartyTypeKind.ZodDefault) {
      checkType = checkType._def.innerType;
    }

    if (checkType._def.typeName === z.ZodFirstPartyTypeKind.ZodEffects) {
      const desc = checkType._def.description;
      return desc === zodTypes.ZodZypesInternals.REMOTION_COLOR_BRAND;
    }

    return false;
  };

  const canAdd = maxLength === null || value.length < maxLength;
  const canRemove = value.length > minLength;

  const handleItemChange = (index: number, newValue: string) => {
    const newArray = [...value];
    newArray[index] = newValue;
    onChange(compId, fieldKey, newArray);
  };

  const handleAddItem = () => {
    if (!canAdd) return;

    let defaultValue = "#ffffff";
    if (elementType._def.typeName === z.ZodFirstPartyTypeKind.ZodDefault) {
      defaultValue = elementType._def.defaultValue();
    }

    const newArray = [...value, defaultValue];
    onChange(compId, fieldKey, newArray);
  };

  const handleRemoveItem = (index: number) => {
    if (!canRemove) return;

    const newArray = value.filter((_, i) => i !== index);
    onChange(compId, fieldKey, newArray);
  };

  if (!isColorArray()) {
    return (
      <div className="text-sm text-gray-500">
        Unsupported array type: Only color arrays are supported
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
      </div>
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1">
              <ZodColorEditor
                compId={compId}
                fieldKey={`${fieldKey}[${index}]`}
                value={item}
                onChange={(_, __, newValue) =>
                  handleItemChange(index, newValue)
                }
              />
            </div>
            {canRemove && (
              <Button
                onClick={() => handleRemoveItem(index)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 " />
              </Button>
            )}
          </div>
        ))}
      </div>
      {canAdd && (
        <div className="flex justify-around">
          <Button
            onClick={handleAddItem}
            size="sm"
            variant="outline"
            className="h-8 w-6/10 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
      {value.length === 0 && (
        <div className="text-sm text-gray-500 text-center py-4">
          No items. Click + to add one.
        </div>
      )}
    </div>
  );
};
