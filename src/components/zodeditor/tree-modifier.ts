import type { CompositionConfig, PropType } from "@/components/interfaces/compositions";

function changeProp(
    comp: CompositionConfig,
    key: string,
    value: PropType,
): CompositionConfig {
    const newProps = { ...comp.props, [key]: value };
    return { ...comp, props: newProps };
};


// changes props of the tree on level 0 (foreground) or 1 (background)
// larger levels are not supported yet
export function modifyPropsInTree(
    comps: CompositionConfig[],
    nodeInfo: { parentId: string; level: number },
    compId: string,
    key: string,
    value: PropType
    ): CompositionConfig[] {

    return comps.map((comp) => {
      if (comp.id !== nodeInfo.parentId) return comp;

      if (nodeInfo.level === 0) {
        if (comp.id !== compId) {
          return comp;
        }
        return changeProp(comp, key, value)
      }

      if (nodeInfo.level === 1) {
           if (!comp.background || comp.background.id !== compId) {
              return comp
          }

          const newBackground = changeProp(comp.background, key, value)
          return {...comp, background: newBackground}
      }

      // else
      return comp
    });
};

  /*
  export const modCompositionTree =
    () =>
    (compId: string, key: string, value: PropType) => {
      // level decides on which level of the tree to search
      // TODO state change
      // possibly troublesome (state modifications with refereneces)

      setCompositions(),
      );
    };

    */
