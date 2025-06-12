import React, {useCallback, useMemo} from 'react';
import {z} from 'zod';
import {Checkmark} from '../../../icons/Checkmark';
import type {ComboboxValue} from '../../NewComposition/ComboBox';
import {Combobox} from '../../NewComposition/ComboBox';
import {Fieldset} from './Fieldset';
import {SchemaLabel} from './SchemaLabel';
import {ZodFieldValidation} from './ZodFieldValidation';
import type {UpdaterFunction} from './ZodSwitch';
import {useLocalState} from './local-state';
import type {JSONPath} from './zod-types';


const getStaticFiles = () => {
    console.warn('getStaticFiles is not implemented');
    return [];
}

const container: React.CSSProperties = {
	width: '100%',
};

export const ZodStaticFileEditor: React.FC<{
	readonly schema: z.ZodTypeAny;
	readonly jsonPath: JSONPath;
	readonly value: string;
	readonly defaultValue: string;
	readonly setValue: UpdaterFunction<string>;
	readonly onSave: (updater: (oldState: string) => string) => void;
	readonly showSaveButton: boolean;
	readonly onRemove: null | (() => void);
	readonly saving: boolean;
	readonly saveDisabledByParent: boolean;
	readonly mayPad: boolean;
}> = ({
	schema,
	jsonPath,
	setValue,
	defaultValue,
	value,
	onSave,
	showSaveButton,
	onRemove,
	saving,
	saveDisabledByParent,
	mayPad,
}) => {

	const {
		localValue,
		onChange: setLocalValue,
		reset,
	} = useLocalState({
		schema,
		setValue,
		unsavedValue: value,
		savedValue: defaultValue,
	});

	const def = schema._def;

	const typeName = def.typeName as z.ZodFirstPartyTypeKind;
	if (typeName !== z.ZodFirstPartyTypeKind.ZodString) {
		throw new Error('expected enum');
	}

	const isRoot = jsonPath.length === 0;

	const comboBoxValues = useMemo(() => {
		return getStaticFiles().map((option): ComboboxValue => {
			return {
                // @ts-expect-error not implemented 
				value: option.src,
                // @ts-expect-error not implemented 
				label: option.name,
                // @ts-expect-error not implemented 
				id: option.src,
				keyHint: null,
                // @ts-expect-error not implemented 
				leftItem: option.src === value ? <Checkmark /> : null,
				onClick: (id: string) => {
					setLocalValue(() => id, false, false);
				},
				quickSwitcherLabel: null,
				subMenu: null,
				type: 'item',
			};
		});
	}, [setLocalValue, value]);

	const save = useCallback(() => {
		onSave(() => value);
	}, [onSave, value]);

	return (
		<Fieldset shouldPad={mayPad} success={localValue.zodValidation.success}>
			<SchemaLabel
				handleClick={null}
				onSave={save}
				showSaveButton={showSaveButton}
				isDefaultValue={localValue.value === defaultValue}
				onReset={reset}
				jsonPath={jsonPath}
				onRemove={onRemove}
				saving={saving}
				valid={localValue.zodValidation.success}
				saveDisabledByParent={saveDisabledByParent}
				suffix={null}
			/>

			<div style={isRoot ? undefined : container}>
				<Combobox
                    // @ts-expect-error not implemented
					values={comboBoxValues}
					selectedId={localValue.value}
					title={value}
				/>
			</div>
			<ZodFieldValidation path={jsonPath} localValue={localValue} />
		</Fieldset>
	);
};
