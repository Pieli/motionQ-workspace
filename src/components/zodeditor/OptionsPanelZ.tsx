import { z } from 'zod';
import React, { useEffect } from 'react';

import { Spacing } from "@/components/ui/spacing";
import { Textarea } from "@/components/ui/textarea";
import type { CompostitionConfig } from "@/components/interfaces/compositions";

export const OptionsPanelZ: React.FC<{ 
    compositions: CompostitionConfig[] 
    setCompositions: React.Dispatch<React.SetStateAction<CompostitionConfig[]>>
}> = ({ compositions, setCompositions }) => {
  // initialize local state from incoming compositions
  const [comps, setComps] = React.useState(compositions);

  useEffect(() => {
      setCompositions(comps);
  }, [comps, setCompositions]);

  return (
    <ZodEditor
      compositions={comps}
      setCompositions={setComps}
    />
  );
};

interface ZodEditorProps {
  compositions: CompostitionConfig[];
  setCompositions: React.Dispatch<React.SetStateAction<CompostitionConfig[]>>;
}

const ZodEditor: React.FC<ZodEditorProps> = ({ compositions, setCompositions }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldChange = (compId: string, key: string, value: any) => {
    setCompositions(prev =>
      prev.map(comp => {
        if (comp.id !== compId) return comp;
        // update the composition's props for `key`
        const newProps = { ...comp.props, [key]: value };
        return { ...comp, props: newProps };
      })
    );
  };

  return (
    <>
      {compositions.map(comp => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shapeDef = (comp.schema as any)._def.shape() as Record<string, z.ZodTypeAny>;
        return (
          <div key={comp.id} className="mb-8">
            <h2 className="text-xl font-bold mb-4">{comp.id}</h2>
            <div className="space-y-4">
              {Object.keys(shapeDef).map(key => (
                <ZodSwitch
                  key={key}
                  comp={comp}
                  fieldKey={key}
                  onFieldChange={handleFieldChange}
                />
              ))}
            </div>
            <Spacing />
          </div>
        );
      })}
    </>
  );
};

// Factory that picks the correct editor based on Zod type
interface ZodSwitchProps {
  comp: CompostitionConfig;
  fieldKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFieldChange: (compId: string, key: string, value: any) => void;
}

const ZodSwitch: React.FC<ZodSwitchProps> = ({ comp, fieldKey, onFieldChange }) => {
  // grab the schema for this field
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldSchema = ((comp.schema as any)._def.shape() as Record<string, z.ZodTypeAny>)[fieldKey];
  const typeName = fieldSchema._def.typeName as z.ZodFirstPartyTypeKind;
  // the current prop value for this key
  const currentValue = comp.props?.[fieldKey] ?? '';

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
    default:
      return <div className="text-sm text-gray-500">Unsupported type: {typeName}</div>;
  }
};

// Editor for string fields
interface ZodTextEditorProps {
  compId: string;
  fieldKey: string;
  value: string;
  onChange: (compId: string, key: string, value: string) => void;
}

const ZodTextEditor: React.FC<ZodTextEditorProps> = ({ compId, fieldKey, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{fieldKey}</label>
      <Textarea
        value={value}
        onChange={e => onChange(compId, fieldKey, e.currentTarget.value)}
      />
    </div>
  );
};

