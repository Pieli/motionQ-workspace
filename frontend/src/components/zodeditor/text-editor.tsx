import { Textarea } from "@/components/ui/textarea";
// Editor for string fields
interface ZodTextEditorProps {
  readonly compId: string;
  readonly fieldKey: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (compId: string, key: string, value: string) => void;
}

export const ZodTextEditor: React.FC<ZodTextEditorProps> = ({
  compId,
  fieldKey,
  label,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm text-foreground font-medium mb-1">
        {label}
      </label>
      <Textarea
        defaultValue={value}
        onChange={(e) => onChange(compId, fieldKey, e.currentTarget.value)}
      />
    </div>
  );
};
