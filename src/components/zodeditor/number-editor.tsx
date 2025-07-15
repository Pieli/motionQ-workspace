import { Input } from "@/components/ui/input";

interface ZodNumberEditorProps {
  readonly compId: string;
  readonly fieldKey: string;
  readonly value: number;
  readonly onChange: (compId: string, key: string, value: number) => void;
}

export const ZodNumberEditor: React.FC<ZodNumberEditorProps> = ({
  compId,
  fieldKey,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm text-foreground font-medium mb-1">
        {fieldKey}
      </label>
      <Input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(compId, fieldKey, Number(e.currentTarget.value))
        }
      />
    </div>
  );
};
