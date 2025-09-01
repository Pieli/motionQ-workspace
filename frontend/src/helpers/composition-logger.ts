import type { CompositionConfig } from "@/components/interfaces/compositions";

export function logCompositionConfig(comps: CompositionConfig[]) {
    // Try to get the schema and component names, fallback to string

    function getObject(compConf: CompositionConfig): object {
        const schemaName = compConf.schema?.constructor?.name || "z.object({ ... })";
        const componentName = compConf.component?.name || "MyComponent";


        let back: object | undefined = undefined 

        if (compConf.background) {
            back = getObject(compConf.background);
        }

        return {
            id: compConf.id,
            component: componentName,
            schema: schemaName,
            props: compConf.props,
            duration: compConf.duration,
            background: back,
        }
    }


    const compObjects = comps.map((c) => getObject(c))
    console.log(compObjects);
}
