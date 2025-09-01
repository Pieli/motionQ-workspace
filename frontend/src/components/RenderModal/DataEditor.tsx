import React, {
  // useCallback,
  // useContext,
  // useEffect,
  useMemo,
  useState,
} from "react";
import type { _InternalTypes } from "remotion";
// import { Internals } from "remotion";

/*
import {
  callUpdateDefaultPropsApi,
  canUpdateDefaultProps,
} from "../RenderQueue/actions";
*/

import { SchemaEditor } from "@/components/RenderModal/SchemaEditor/SchemaEditor";

import type { TypeCanSaveState } from "./get-render-modal-warnings";
import { defaultTypeCanSaveState } from "./get-render-modal-warnings";

const BACKGROUND = "rgb(31,36,40)";

export type State =
  | {
      str: string;
      value: Record<string, unknown>;
      validJSON: true;
      zodValidation: Zod.SafeParseReturnType<unknown, unknown>;
    }
  | {
      str: string;
      validJSON: false;
      error: string;
    };

export type PropsEditType = "input-props" | "default-props";

type AllCompStates = {
  [key: string]: TypeCanSaveState;
};

const outer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflow: "hidden",
  backgroundColor: BACKGROUND,
};

export const DataEditor: React.FC<{
  readonly unresolvedComposition: _InternalTypes["AnyComposition"];
  readonly defaultProps: Record<string, unknown>;
  readonly setDefaultProps: React.Dispatch<
    React.SetStateAction<Record<string, unknown>>
  >;
  readonly mayShowSaveButton: boolean;
  readonly propsEditType: PropsEditType;
  readonly saving: boolean;
  readonly setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  readonly readOnlyStudio: boolean;
}> = ({
  unresolvedComposition,
  defaultProps,
  setDefaultProps,
  mayShowSaveButton,
  saving,
  // setSaving,
  // readOnlyStudio,
}) => {
  // const { updateCompositionDefaultProps } = useContext( Internals.CompositionSetters,);

  const schema = useMemo(() => {
    if (!unresolvedComposition.schema) {
      return "no-schema" as const;
    }

    if (!(typeof unresolvedComposition.schema.safeParse === "function")) {
      throw new Error(
        "A value which is not a Zod schema was passed to `schema`",
      );
    }

    return unresolvedComposition.schema;
  }, [unresolvedComposition.schema]);

  const zodValidationResult = useMemo(() => {
    if (schema === "no-schema") {
      return "no-schema" as const;
    }

    return schema.safeParse(defaultProps);
  }, [defaultProps, schema]);

  const [canSaveDefaultPropsObjectState, setCanSaveDefaultProps] =
    useState<AllCompStates>({
      [unresolvedComposition.id]: defaultTypeCanSaveState,
    });
    
  // TODO remove this added to remove the error above
  setCanSaveDefaultProps({[unresolvedComposition.id]: defaultTypeCanSaveState});

  const canSaveDefaultProps = useMemo(() => {
    return canSaveDefaultPropsObjectState[unresolvedComposition.id]
      ? canSaveDefaultPropsObjectState[unresolvedComposition.id]
      : defaultTypeCanSaveState;
  }, [canSaveDefaultPropsObjectState, unresolvedComposition.id]);

  const showSaveButton = mayShowSaveButton && canSaveDefaultProps.canUpdate;

  // const { fastRefreshes } = useContext(Internals.NonceContext);

  /*
  const checkIfCanSaveDefaultProps = useCallback(async () => {
    try {
      const can = await canUpdateDefaultProps(
        unresolvedComposition.id,
        readOnlyStudio,
      );

      if (can.canUpdate) {
        setCanSaveDefaultProps((prevState) => ({
          ...prevState,
          [unresolvedComposition.id]: {
            canUpdate: true,
          },
        }));
      } else {
        setCanSaveDefaultProps((prevState) => ({
          ...prevState,
          [unresolvedComposition.id]: {
            canUpdate: false,
            reason: can.reason,
            determined: true,
          },
        }));
      }
    } catch (err) {
      setCanSaveDefaultProps((prevState) => ({
        ...prevState,
        [unresolvedComposition.id]: {
          canUpdate: false,
          reason: (err as Error).message,
          determined: true,
        },
      }));
    }
  }, [readOnlyStudio, unresolvedComposition.id]);

  useEffect(() => {
    checkIfCanSaveDefaultProps();
  }, [checkIfCanSaveDefaultProps]);
  */

  /*
  const onSave = useCallback(
    (
      updater: (oldState: Record<string, unknown>) => Record<string, unknown>,
    ) => {
      if (schema === "no-schema" || z === null) {
        console.log("Cannot update default props: No Zod schema", 2000);
        return;
      }

      window.remotion_ignoreFastRefreshUpdate = fastRefreshes + 1;
      setSaving(true);
      const newDefaultProps = updater(unresolvedComposition.defaultProps ?? {});
      callUpdateDefaultPropsApi(
        unresolvedComposition.id,
        newDefaultProps,
        extractEnumJsonPaths({
          schema,
          zodRuntime: z,
          currentPath: [],
          zodTypes,
        }),
      )
        .then((response) => {
          if (!response.success) {
            console.log(response.stack);
            console.log(
              `Cannot update default props: ${response.reason}. See console for more information.`,
              2000,
            );
          }

          updateCompositionDefaultProps(
            unresolvedComposition.id,
            newDefaultProps,
          );
        })
        .catch((err) => {
          console.log(`Cannot update default props: ${err.message}`, 2000);
        })
        .finally(() => {
          setSaving(false);
        });
    },
    [
      schema,
      fastRefreshes,
      setSaving,
      unresolvedComposition.defaultProps,
      unresolvedComposition.id,
      updateCompositionDefaultProps,
    ],
  );

  if (schema === "no-schema") {
    return <NoSchemaDefined />;
  }

  if (!z) {
    throw new Error("expected zod");
  }

  if (zodValidationResult === "no-schema") {
    throw new Error("expected schema");
  }

  const def: z.ZodTypeDef = schema._def;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typeName = (def as any).typeName as z.ZodFirstPartyTypeKind;

  if (typeName === z.ZodFirstPartyTypeKind.ZodAny) {
    return <NoSchemaDefined />;
  }

  if (!unresolvedComposition.defaultProps) {
    return <NoDefaultProps />;
  }
  */

  return (
    <div style={outer}>
      {"Hello"}
      {schema === "no-schema" || zodValidationResult === "no-schema" || unresolvedComposition === undefined ? (
          "No schema defined "
        ) : (

      <SchemaEditor
        unsavedDefaultProps={defaultProps}
        setValue={setDefaultProps}
        schema={schema}
        zodValidationResult={zodValidationResult}
        savedDefaultProps={unresolvedComposition.defaultProps as Record<string, unknown>}
        onSave={() => {console.log("onSave not implemented")}}
        showSaveButton={showSaveButton}
        saving={saving}
        saveDisabledByParent={!zodValidationResult.success}
      />)
      }
    </div>
  );
};
