import React, {useCallback} from 'react';
import type {z} from 'zod';
import { Checkbox } from "@/components/ui/checkbox"
import {Fieldset} from './Fieldset';
import {SchemaLabel} from './SchemaLabel';
import type {UpdaterFunction} from './ZodSwitch';
import {useLocalState} from './local-state';
import type {JSONPath} from './zod-types';

const fullWidth: React.CSSProperties = {
	width: '100%',
};

export const ZodBooleanEditor: React.FC<{
	readonly schema: z.ZodTypeAny;
	readonly jsonPath: JSONPath;
	readonly value: boolean;
	readonly setValue: UpdaterFunction<boolean>;
	readonly defaultValue: boolean;
	readonly onSave: UpdaterFunction<boolean>;
	readonly onRemove: null | (() => void);
	readonly showSaveButton: boolean;
	readonly saving: boolean;
	readonly saveDisabledByParent: boolean;
	readonly mayPad: boolean;
}> = ({
	schema,
	jsonPath,
	value,
	setValue,
	onSave,
	defaultValue,
	onRemove,
	showSaveButton,
	saving,
	saveDisabledByParent,
	mayPad,
}) => {
	const {localValue, onChange, reset} = useLocalState({
		schema,
		setValue,
		unsavedValue: value,
		savedValue: defaultValue,
	});

	const onToggle = useCallback(
		(checked: boolean | 'indeterminate') => {
            if (checked === 'indeterminate') {
                return;
            }
			onChange(() => checked, false, false);
		},
		[onChange],
	);

	const save = useCallback(() => {
		onSave(() => value, false, false);
	}, [onSave, value]);

	return (
		<Fieldset shouldPad={mayPad} success={localValue.zodValidation.success}>
			<SchemaLabel
				handleClick={null}
				isDefaultValue={localValue.value === defaultValue}
				jsonPath={jsonPath}
				onReset={reset}
				onSave={save}
				showSaveButton={showSaveButton}
				onRemove={onRemove}
				saving={saving}
				valid
				saveDisabledByParent={saveDisabledByParent}
				suffix={null}
			/>
			<div style={fullWidth}>
				<Checkbox
					name={jsonPath.join('.')}
					checked={localValue.value}
					onCheckedChange={onToggle}
					disabled={false}
				/>
			</div>
		</Fieldset>
	);
};
