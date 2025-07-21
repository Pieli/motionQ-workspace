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

import type {
  CompositionConfig,
  PropType,
} from "@/components/interfaces/compositions";

const AlignmentSelectHorizontal: React.FC<{
  readonly compId: string;
  readonly fieldKey: string;
  readonly value: "left" | "center" | "right";
  readonly onChange: (compId: string, key: string, value: string) => void;
}> = ({ compId, fieldKey, value, onChange }) => {
  const [val, setVal] = useState<"left" | "center" | "right">(value);

  return (
    <div className="inline-flex h-11 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
      <Toggle
        pressed={val === "left"}
        onPressedChange={() => {
          setVal("left");
          onChange(compId, fieldKey, "left");
        }}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-1 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
      >
        <AlignLeft className="h-3 w-3" />
      </Toggle>
      <Toggle
        pressed={val === "center"}
        onPressedChange={() => {
          setVal("center");
          onChange(compId, fieldKey, "center");
        }}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-1 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
      >
        <AlignCenter className="h-3 w-3" />
      </Toggle>
      <Toggle
        pressed={val === "right"}
        onPressedChange={() => {
          setVal("right");
          onChange(compId, fieldKey, "right");
        }}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-1 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
      >
        <AlignRight className="h-3 w-3" />
      </Toggle>
    </div>
  );
};

const AlignmentSelectVertical: React.FC<{
  readonly compId: string;
  readonly fieldKey: string;
  readonly value: "bottom" | "center" | "top";
  readonly onChange: (compId: string, key: string, value: string) => void;
}> = ({ compId, fieldKey, value, onChange }) => {
  const [val, setVal] = useState<"bottom" | "center" | "top">(value);

  return (
    <div className="w-1/2 flex justify-between">
      <div className="inline-flex h-11 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        <Toggle
          pressed={val === "top"}
          onPressedChange={() => {
            setVal("top");
            onChange(compId, fieldKey, "top");
          }}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-1 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
        >
          <ArrowUp className="h-3 w-3" />
        </Toggle>
        <Toggle
          pressed={val === "center"}
          onPressedChange={() => {
            setVal("center");
            onChange(compId, fieldKey, "baseline");
          }}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-1 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
        >
          <MoveVertical className="h-3 w-3" />
        </Toggle>
        <Toggle
          pressed={val === "bottom"}
          onPressedChange={() => {
            setVal("bottom");
            onChange(compId, fieldKey, "bottom");
          }}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-1 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
        >
          <ArrowDown className="h-3 w-3" />
        </Toggle>
      </div>
    </div>
  );
};

export const TypoAggregateEditor: React.FC<{
  composition: CompositionConfig;
  handleChange: (compId: string, key: string, value: PropType) => void;
}> = ({ composition, handleChange }) => {
  return (
    <>
      <div className="p-4 space-y-4 border rounded-md bg-white mb-8">
        <div>
          <h4 className="text-sm font-medium mb-4">Typography</h4>

          {/* Font Family */}
          <Select onValueChange={() => {}}>
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
          <Select
            onValueChange={(value: string) => {
              console.log("value", value);
              handleChange(composition.id, "typo_fontSize", Number(value));
            }}
          >
            <SelectTrigger className="w-1/2 h-8">
              <SelectValue placeholder="100" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="40">40</SelectItem>
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
            <AlignmentSelectHorizontal
              compId={composition.id}
              value="center"
              fieldKey="typo_textAlign"
              onChange={handleChange}
            />
          </div>
          <div className="w-1/2 flex justify-between">
            <AlignmentSelectVertical
              compId={composition.id}
              value="center"
              fieldKey="typo_verticalAlign"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};
