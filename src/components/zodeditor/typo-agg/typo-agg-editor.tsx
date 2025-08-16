import { useState } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
  MoveVertical,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type {
  CompositionConfig,
  PropType,
} from "@/components/interfaces/compositions";

import { FontCombobox } from "@/components/zodeditor/language-combobox";
import { TextColorEditor } from "@/components/zodeditor/typo-agg/text-color-editor";
import { LineHeightEditor } from "@/components/zodeditor/typo-agg/line-height-editor";
import { LetterSpacingEditor } from "@/components/zodeditor/typo-agg/letter-spacing-editor";

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
  );
};

export const TypoAggregateEditor: React.FC<{
  composition: CompositionConfig;
  handleChange: (compId: string, key: string, value: PropType) => void;
}> = ({ composition, handleChange }) => {
  // console.log(composition.props);
  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            key={composition.id}
            defaultValue={composition.props?.["typo_text"] || ""}
            onChange={(e) =>
              handleChange(composition.id, "typo_text", e.target.value)
            }
            placeholder="Enter your text here..."
            className="min-h-[60px] resize-none"
          />

          <FontCombobox
            compId={composition.id}
            value={composition.props?.["typo_fontFamily"]}
            fieldKey="typo_fontFamily"
            onChange={handleChange}
          />

          {/* Text Color */}
          <TextColorEditor
            compId={composition.id}
            fieldKey="typo_textColor"
            value={
              composition.props?.["typo_textColor"].toString() || "#ffffff"
            }
            onChange={handleChange}
          />

          {/* Font Weight and Size */}
          <div className="flex gap-2">
            <Select
              defaultValue={composition.props?.["typo_fontWeight"]?.toString()}
              onValueChange={(value: string) => {
                handleChange(composition.id, "typo_fontWeight", Number(value));
              }}
            >
              <SelectTrigger className="w-1/2 h-8">
                <SelectValue placeholder={"SemiBold"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="400">Regular</SelectItem>
                <SelectItem value="550">SemiBold</SelectItem>
                <SelectItem value="700">Bold</SelectItem>
              </SelectContent>
            </Select>

            <Select
              defaultValue={composition.props?.["typo_fontSize"]?.toString()}
              onValueChange={(value: string) => {
                handleChange(composition.id, "typo_fontSize", Number(value));
              }}
            >
              <SelectTrigger className="w-1/2 h-8">
                <SelectValue placeholder="100" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: (320 - 12) / 8 + 1 },
                  (_, i) => 12 + i * 8,
                ).map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Line Height & Letter Spacing */}
          <div className="flex gap-2">
            <LineHeightEditor
              compId={composition.id}
              fieldKey="typo_lineHeight"
              value={composition.props?.["typo_lineHeight"] || ""}
              onChange={handleChange}
            />

            <LetterSpacingEditor
              compId={composition.id}
              fieldKey="typo_letter_spacing"
              value={composition.props?.["typo_letter_spacing"] || ""}
              onChange={handleChange}
            />
          </div>

          {/* Alignment Buttons */}
          <div className="flex gap-2">
            <div className="w-1/2 flex justify-between">
              <AlignmentSelectHorizontal
                compId={composition.id}
                value={
                  (composition.props?.["typo_textAlign"] as
                    | "left"
                    | "center"
                    | "right") || "center"
                }
                fieldKey="typo_textAlign"
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2 flex justify-between">
              <AlignmentSelectVertical
                compId={composition.id}
                value={
                  (composition.props?.["typo_verticalAlign"] as
                    | "bottom"
                    | "center"
                    | "top") || "center"
                }
                fieldKey="typo_verticalAlign"
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
