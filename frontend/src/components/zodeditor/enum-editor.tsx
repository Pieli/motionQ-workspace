import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { z } from "zod";

interface ZodEnumEditorProps {
  readonly compId: string;
  readonly fieldKey: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (compId: string, key: string, value: string) => void;
  readonly schema: z.ZodEnum<[string, ...string[]]>;
}

export const ZodEnumEditor: React.FC<ZodEnumEditorProps> = ({
  compId,
  fieldKey,
  label,
  value,
  onChange,
  schema,
}) => {
  const enumValues = schema._def.values;

  return (
    <div>
      <label className="block text-sm text-foreground font-medium mb-1">
        {label}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {value || "Select an option"}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={(newValue) => onChange(compId, fieldKey, newValue)}
          >
            {enumValues.map((enumValue) => (
              <DropdownMenuRadioItem key={enumValue} value={enumValue}>
                {enumValue}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
