import { Textarea } from "@/components/ui/textarea";
// Editor for string fields
interface ZodTextEditorProps {
  readonly compId: string;
  readonly fieldKey: string;
  readonly value: string;
  readonly onChange: (compId: string, key: string, value: string) => void;
}

export const ZodTextEditor: React.FC<ZodTextEditorProps> = ({
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
