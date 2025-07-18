// import { z } from "zod";

import { useState } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
  MoveVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/*
interface ZodSwitchProps {
comp: CompositionConfig;
fieldKey: string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
onFieldChange: (compId: string, key: string, value: any) => void;
}
*/

import type {
  CompositionConfig,
  PropType,
} from "@/components/interfaces/compositions";

/*
const ZodSwitch: React.FC<ZodSwitchProps> = ({
comp,
fieldKey,
onFieldChange,
}) => {
let fieldSchema =
((comp.schema as z.ZodTypeAny)._def.shape() as Record<string, z.ZodTypeAny>)[
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
    case z.ZodFirstPartyTypeKind.ZodNumber:
      return (
        <ZodNumberEditor
          compId={comp.id}
          fieldKey={fieldKey}
          value={Number(currentValue)}
          onChange={onFieldChange}
        />
      );
    case z.ZodFirstPartyTypeKind.ZodEnum:
      return (
        <ZodEnumEditor
          compId={comp.id}
          fieldKey={fieldKey}
          value={String(currentValue)}
          onChange={onFieldChange}
          schema={fieldSchema as z.ZodEnum<[string, ...string[]]>}
        />
      );
    case z.ZodFirstPartyTypeKind.ZodEffects: {
      const desc = (fieldSchema as z.ZodTypeAny)._def.description;
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
*/

const AlignmentSelectHorizonzal: React.FC<{
  value: "left" | "center" | "right";
  setSelectedTabAlign: React.Dispatch<
    React.SetStateAction<"left" | "center" | "right">
  >;
}> = ({ value, setSelectedTabAlign }) => {
  return (
    <div className="inline-flex h-11 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
      <Toggle
        pressed={value === "left"}
        onPressedChange={() => setSelectedTabAlign("left")}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-1 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
      >
        <ArrowUp className="h-3 w-3" />
      </Toggle>
      <Toggle
        pressed={value === "center"}
        onPressedChange={() => setSelectedTabAlign("center")}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-1 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
      >
        <MoveVertical className="h-3 w-3" />
      </Toggle>
      <Toggle
        pressed={value === "right"}
        onPressedChange={() => setSelectedTabAlign("right")}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-1 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
      >
        <ArrowDown className="h-3 w-3" />
      </Toggle>
    </div>
  );
};

const AlignmentSelectVertical: React.FC<{
  value: "bottom" | "center" | "top";
  setSelectedTabAlign: React.Dispatch<
    React.SetStateAction<"bottom" | "center" | "top">
  >;
}> = ({ value, setSelectedTabAlign }) => {
  return (
    <div className="w-1/2 flex justify-between">
      <div className="inline-flex h-11 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        <Toggle
          pressed={value === "top"}
          onPressedChange={() => setSelectedTabAlign("top")}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-1 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
        >
          <AlignLeft className="h-3 w-3" />
        </Toggle>
        <Toggle
          pressed={value === "center"}
          onPressedChange={() => setSelectedTabAlign("center")}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-1 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
        >
          <AlignCenter className="h-3 w-3" />
        </Toggle>
        <Toggle
          pressed={value === "bottom"}
          onPressedChange={() => setSelectedTabAlign("bottom")}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-1 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
        >
          <AlignRight className="h-3 w-3" />
        </Toggle>
      </div>
    </div>
  );
};

export const TypoAggregateEditor: React.FC<{
  composition: CompositionConfig;
  handleChange: (compId: string, key: string, value: PropType) => void;
}> = () => {
  // }> = ({ composition, handleChange }) => {

  const [selectedTabAlignHorizontal, setSelectedTabAlignHorizontal] = useState<
    "left" | "center" | "right"
  >("center");

  const [selectedTabAlignVertical, setSelectedTabAlignVertical] = useState<
    "bottom" | "center" | "top"
  >("center");

  /*
  const shapeDef = (composition.schema as z.ZodTypeAny)._def.shape() as Record<
    string,
    z.ZodTypeAny
  >;

  return (
    <div>
      {Object.keys(shapeDef).map((key, index) => (
        <div className="py-2" key={index}>

        </div>
      ))}
    </div>
  );
  */

  return (
    <>
      <div className="p-4 space-y-4 border rounded-md bg-white">
        <div>
          <h4 className="text-sm font-medium mb-4">Typography</h4>

          {/* Font Family */}
          <Select>
            <SelectTrigger className="w-full h-8">
              <SelectValue placeholder="Roboto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="sans">Sans</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font Weight and Size */}
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-1/2 h-8">
              <SelectValue placeholder="SemiBold" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="semibold">SemiBold</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-1/2 h-8">
              <SelectValue placeholder="100" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">100</SelectItem>
              <SelectItem value="semibold">10</SelectItem>
              <SelectItem value="bold">1111</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Line Height & Letter Spacing */}
        <div className="flex gap-2">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
              <p className="border-y border-y-1 border-muted-foreground py-0.5 leading-none">
                A
              </p>
            </span>
            <Input className="pl-10" defaultValue="100%" />
          </div>

          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
              <p className="border-x border-x-1 border-muted-foreground px-1 leading-none">
                A
              </p>
            </span>
            <Input className="pl-10" defaultValue="100%" />
          </div>
        </div>

        {/* Alignment Buttons */}
        <div className="flex gap-2">
          <div className="w-1/2 flex justify-between">
            <AlignmentSelectVertical
              value={selectedTabAlignVertical}
              setSelectedTabAlign={setSelectedTabAlignVertical}
            />
          </div>
          <div className="w-1/2 flex justify-between">
            <AlignmentSelectHorizonzal
              value={selectedTabAlignHorizontal}
              setSelectedTabAlign={setSelectedTabAlignHorizontal}
            />
          </div>
        </div>
      </div>
    </>
  );
};
