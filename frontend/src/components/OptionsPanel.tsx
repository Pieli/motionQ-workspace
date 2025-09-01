import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { _InternalTypes } from "remotion";
import { Internals } from "remotion";
import { DataEditor } from "@/components/RenderModal/DataEditor";

export const OptionsPanel: React.FC<{
  readonly readOnlyStudio: boolean;
}> = ({ readOnlyStudio }) => {
  const { props, updateProps, resetUnsaved } = useContext(
    Internals.EditorPropsContext,
  );
  const [saving, setSaving] = useState(false);

  const container: React.CSSProperties = useMemo(
    () => ({
      height: "100%",
      width: "100%",
      display: "flex",
      position: "absolute",
      flexDirection: "column",
      flex: 1,
    }),
    [],
  );

  const { compositions, canvasContent } = useContext(
    Internals.CompositionManager,
  );

  const composition = useMemo((): _InternalTypes["AnyComposition"] | null => {
    if (canvasContent === null || canvasContent.type !== "composition") {
      return null;
    }

    for (const comp of compositions) {
      if (comp.id === canvasContent.compositionId) {
        return comp;
      }
    }

    return null;
  }, [canvasContent, compositions]);

  const setDefaultProps = useCallback(
    (
      newProps:
        | Record<string, unknown>
        | ((oldProps: Record<string, unknown>) => Record<string, unknown>),
    ) => {
      if (composition === null) {
        return;
      }

      window.remotion_ignoreFastRefreshUpdate = null;

      updateProps({
        id: composition.id,
        defaultProps: composition.defaultProps as Record<string, unknown>,
        newProps,
      });
    },
    [composition, updateProps],
  );

  const currentDefaultProps = useMemo(() => {
    if (composition === null) {
      return {};
    }

    return props[composition.id] ?? composition.defaultProps ?? {};
  }, [composition, props]);

  const reset = useCallback(
    (e: Event) => {
      if ((e as CustomEvent).detail.resetUnsaved) {
        resetUnsaved((e as CustomEvent).detail.resetUnsaved);
      }
    },
    [resetUnsaved],
  );

  useEffect(() => {
    window.addEventListener(Internals.PROPS_UPDATED_EXTERNALLY, reset);

    return () => {
      window.removeEventListener(Internals.PROPS_UPDATED_EXTERNALLY, reset);
    };
  }, [reset]);

  return (
    <div style={container} className="css-reset">
      {composition && (
        <DataEditor
          key={composition.id}
          unresolvedComposition={composition}
          defaultProps={currentDefaultProps}
          setDefaultProps={setDefaultProps}
          mayShowSaveButton
          propsEditType="default-props"
          saving={saving}
          setSaving={setSaving}
          readOnlyStudio={readOnlyStudio}
        />
      )}
    </div>
  );
};
