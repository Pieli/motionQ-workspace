import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Internals} from 'remotion';
import type {AnyZodObject} from 'zod';
import { z } from "zod";

import {
	InvalidDefaultProps,
	InvalidSchema,
	TopLevelZodValue,
} from './SchemaErrorMessages';
import {ZodObjectEditor} from './ZodObjectEditor';
import {deepEqual} from './deep-equal';
import type {RevisionContextType} from './local-state';
import {RevisionContext} from './local-state';
import {defaultPropsEditorScrollableAreaRef} from './scroll-to-default-props-path';

const scrollable: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	overflowY: 'auto',
}; 


let unsavedProps = false;
const setUnsavedProps = (unsaved: boolean) => {
	window.remotion_unsavedProps = unsaved;

	unsavedProps = unsaved;
};

export const SchemaEditor: React.FC<{
	readonly schema: AnyZodObject;
	readonly unsavedDefaultProps: Record<string, unknown>;
	readonly setValue: React.Dispatch<
		React.SetStateAction<Record<string, unknown>>
	>;
	readonly zodValidationResult: z.SafeParseReturnType<unknown, unknown>;
	readonly savedDefaultProps: Record<string, unknown>;
	readonly onSave: (
		updater: (oldState: Record<string, unknown>) => Record<string, unknown>,
	) => void;
	readonly showSaveButton: boolean;
	readonly saving: boolean;
	readonly saveDisabledByParent: boolean;
}> = ({
	schema,
	unsavedDefaultProps,
	setValue,
	zodValidationResult,
	savedDefaultProps,
	onSave,
	showSaveButton,
	saving,
	saveDisabledByParent,
}) => {
	const [revision, setRevision] = useState(0);

	const revisionState: RevisionContextType = useMemo(() => {
		return {
			childResetRevision: revision,
		};
	}, [revision]);

	useEffect(() => {
		const bumpRevision = () => {
			setRevision((old) => old + 1);
		};

		window.addEventListener(Internals.PROPS_UPDATED_EXTERNALLY, bumpRevision);

		return () => {
			window.removeEventListener(
				Internals.PROPS_UPDATED_EXTERNALLY,
				bumpRevision,
			);
		};
	}, []);

	const hasChanged = useMemo(() => {
		return !deepEqual(savedDefaultProps, unsavedDefaultProps);
	}, [savedDefaultProps, unsavedDefaultProps]);

	useEffect(() => {
		setUnsavedProps(hasChanged);
	}, [hasChanged]);


	const def: z.ZodTypeDef = schema._def;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const typeName = (def as any).typeName as z.ZodFirstPartyTypeKind;

	const reset = useCallback(() => {
		setValue(savedDefaultProps);
	}, [savedDefaultProps, setValue]);

	if (!zodValidationResult.success) {
		const defaultPropsValid = schema.safeParse(savedDefaultProps);

		if (!defaultPropsValid.success) {
			return <InvalidDefaultProps zodValidationResult={zodValidationResult} />;
		}

		return (
			<InvalidSchema reset={reset} zodValidationResult={zodValidationResult} />
		);
	}

	if (typeName !== z.ZodFirstPartyTypeKind.ZodObject) {
		return <TopLevelZodValue typeReceived={typeName} />;
	}

	return (
		<div
			ref={defaultPropsEditorScrollableAreaRef}
			style={scrollable}
		>
			<RevisionContext.Provider value={revisionState}>
				<ZodObjectEditor
					discriminatedUnionReplacement={null}
					unsavedValue={unsavedDefaultProps as Record<string, unknown>}
					setValue={setValue}
					jsonPath={[]}
					schema={schema}
					savedValue={savedDefaultProps as Record<string, unknown>}
					onSave={
						onSave as (
							newValue: (
								oldVal: Record<string, unknown>,
							) => Record<string, unknown>,
						) => void
					}
					showSaveButton={showSaveButton}
					onRemove={null}
					saving={saving}
					saveDisabledByParent={saveDisabledByParent}
					mayPad
				/>
			</RevisionContext.Provider>
		</div>
	);
};
