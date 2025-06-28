
import { fadeInSchema, FadeInTransition } from "@/remotion-lib/TextFades/FadeInText";
import { PlainBackground, PlainBackgroundSchema } from "@/remotion-lib/textures/PlainBackground";
import { scaleUpDownSchema, ScaleUpDownTransition } from "@/remotion-lib/TextFades/ScaldeUpDowText";
import { GradientMesh, GradientMeshPropsSchema } from "@/remotion-lib/textures/GradientMesh";
import { slideInSchema, SlideInTransition } from "@/remotion-lib/TextFades/SlideInText";
import { SimpleTextTyping, simpleTypingSchema } from "@/remotion-lib/TextFades/SimpleTextTyping";
import { GrowingDark, GrowingDarkPropsSchema } from "@/remotion-lib/textures/growing-darkess";
import { StairsMeshPropsSchemaV2, StairsMeshV2 } from "@/remotion-lib/textures/staris-texture-v2";
import type { CompositionConfig } from "@/components/interfaces/compositions";


export const exampleComp: CompositionConfig[] = [
    {
        id: "intro_slide",
        component: FadeInTransition,
        schema: fadeInSchema,
        props: {
            text: "Meet Zero: Your Open-Source Email Solution",
            textColor: "#ffffff"
        },
        duration: 45,
        background: {
            id: "intro_slide-background",
            component: GradientMesh,
            schema: GradientMeshPropsSchema,
            props: {
                speed: 12,
                backgroundColor: "#1e3c72"
            },
            duration: 1,
            background: undefined
        }
    },
    {
        id: "problem_slide_1",
        component: SlideInTransition,
        schema: slideInSchema,
        props: {
            text: "Closed-Source Email Services",
            textColor: "#ffffff"
        },
        duration: 45,
        background: {
            id: "problem_slide_1-background",
            component: StairsMeshV2,
            schema: StairsMeshPropsSchemaV2,
            props: {
                speed: 12,
                backgroundColor: "#4b6cb7"
            },
            duration: 1,
            background: undefined
        }
    },
    {
        id: "problem_slide_2",
        component: SlideInTransition,
        schema: slideInSchema,
        props: {
            text: "Data-Hungry and Complex",
            textColor: "#ffffff"
        },
        duration: 45,
        background: {
            id: "problem_slide_2-background",
            component: StairsMeshV2,
            schema: StairsMeshPropsSchemaV2,
            props: {
                speed: 12,
                backgroundColor: "#4b6cb7"
            },
            duration: 1,
            background: undefined
        }
    },
    {
        id: "problem_slide_3",
        component: SlideInTransition,
        schema: slideInSchema,
        props: {
            text: "Limited Control and Privacy",
            textColor: "#ffffff"
        },
        duration: 45,
        background: {
            id: "problem_slide_3-background",
            component: StairsMeshV2,
            schema: StairsMeshPropsSchemaV2,
            props: {
                speed: 12,
                backgroundColor: "#4b6cb7"
            },
            duration: 1,
            background: undefined
        }
    },
    {
        id: "solution_slide",
        component: FadeInTransition,
        schema: fadeInSchema,
        props: {
            text: "Zero: Open, AI-Powered, Self-Hosting",
            textColor: "#ffffff"
        },
        duration: 45,
        background: {
            id: "solution_slide-background",
            component: GrowingDark,
            schema: GrowingDarkPropsSchema,
            props: {
                speed: 12,
                backgroundColor: "#0f2027"
            },
            duration: 1,
            background: undefined
        }
    },
    {
        id: "features_intro",
        component: SimpleTextTyping,
        schema: simpleTypingSchema,
        props: {
            text: "What Zero Offers",
            textColor: "#ffffff"
        },
        duration: 45,
        background: {
            id: "features_intro-background",
            component: PlainBackground,
            schema: PlainBackgroundSchema,
            props: {
                speed: 12,
                backgroundColor: "#1f4037"
            },
            duration: 1,
            background: undefined
        }
    },
    {
        id: "feature_1",
        component: SlideInTransition,
        schema: slideInSchema,
        props: {
            text: "Open-Source & Transparent",
            textColor: "#ffffff"
        },
        duration: 45,
        background: {
            id: "feature_1-background",
            component: GradientMesh,
            schema: GradientMeshPropsSchema,
            props: {
                speed: 12,
                backgroundColor: "#43cea2"
            },
            duration: 1,
            background: undefined
        }
    },
    {
        id: "feature_2",
        component: SlideInTransition,
        schema: slideInSchema,
        props: {
            text: "AI Agents to Enhance Emails",
            textColor: "#ffffff"
        },
        duration: 45,
        background: {
            id: "feature_2-background",
            component: GradientMesh,
            schema: GradientMeshPropsSchema,
            props: {
                speed: 12,
                backgroundColor: "#43cea2"
            },
            duration: 1,
            background: undefined
        }
    },
    {
        id: "feature_3",
        component: SlideInTransition,
        schema: slideInSchema,
        props: {
            text: "Your Data, Your Privacy",
            textColor: "#ffffff"
        },
        duration: 45,
        background: {
            id: "feature_3-background",
            component: GradientMesh,
            schema: GradientMeshPropsSchema,
            props: {
                speed: 12,
                backgroundColor: "#43cea2"
            },
            duration: 1,
            background: undefined
        }
    },
    {
        id: "feature_4",
        component: SlideInTransition,
        schema: slideInSchema,
        props: {
            text: "Self-Hosting Made Easy",
            textColor: "#ffffff"
        },
        duration: 45,
        background: {
            id: "feature_4-background",
            component: GradientMesh,
            schema: GradientMeshPropsSchema,
            props: {
                speed: 12,
                backgroundColor: "#43cea2"
            },
            duration: 1,
            background: undefined
        }
    },
    {
        id: "call_to_action",
        component: ScaleUpDownTransition,
        schema: scaleUpDownSchema,
        props: {
            text: "Join Zero Today!",
            textColor: "#ffffff"
        },
        duration: 45,
        background: {
            id: "call_to_action-background",
            component: PlainBackground,
            schema: PlainBackgroundSchema,
            props: {
                speed: 12,
                backgroundColor: "#0f2027"
            },
            duration: 1,
            background: undefined
        }
    }
]
