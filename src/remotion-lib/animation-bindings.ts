import { fadeInOutSchema, } from "@/remotion-lib/TextFades/FadeInText";
import { slideInSchema, } from "@/remotion-lib/TextFades/SlideInText";

import { getSchemaDescription } from "@/api/animation-factories";
import type { AnimationBinding } from "@/components/interfaces/llm";

export const bindings: AnimationBinding[] = [
    {
        name: "slideInTransition",
        usecase: "Moving text into frame from any direction. Best for dramatic entrances or sequential reveals.",
        settings: getSchemaDescription(slideInSchema)
    },
    {
        name: "fadeInTransition",
        usecase: "Smooth fade in effects. Ideal for subtle transitions or gentle text appearances.",
        settings: getSchemaDescription(fadeInOutSchema)
    }
];
