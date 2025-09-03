import type { CompositionConfig } from "@/components/interfaces/compositions";
import { FadeInTransition } from "@/remotion-lib/TextFades/FadeInText";
import { ScaleUpDownTransition } from "@/remotion-lib/TextFades/ScaleUpDownText";
import { SimpleTextTyping } from "@/remotion-lib/TextFades/SimpleTextTyping";
import { SlideInTransition } from "@/remotion-lib/TextFades/SlideInText";
import { GradientMesh } from "@/remotion-lib/textures/gradientMesh";
import { GrowingDark } from "@/remotion-lib/textures/growing-darkess";
import { PlainBackground } from "@/remotion-lib/textures/PlainBackground";
import { StairsMeshV2 } from "@/remotion-lib/textures/staris-texture-v2";
import {
  gradientMeshSchema,
  growingDarkSchema,
  plainBackgroundSchema,
  stairsMeshSchemaV2,
} from "@/remotion-lib/textures/schemas";

import {
  fadeInSchema,
  scaleUpDownSchema,
  simpleTypingSchema,
  slideInSchema,
} from "@/remotion-lib/TextFades/schemas";

import type { ChatMessage } from "@/types/chat";

export const exampleHistory: ChatMessage[] = [
  {
    id: "example_msg_1",
    role: "user",
    content:
      "I have build an email client called Zero and I want to make a promo for that tool.  What is Zero ?  Zero is an open - source AI email solution that gives users the power to self - host their own email app while also integrating external services like Gmail and other email providers.Our goal is to modernize and improve emails through AI agents to truly modernize emails.  Why Zero ?  Most email services today are either closed - source, data - hungry, or too complex to self - host. 0.email is different: Open - Source – No hidden agendas, fully transparent.  AI Driven - Enhance your emails with Agents & LLMs.  Data Privacy First – Your emails, your data.Zero does not track, collect, or sell your data in any way.Please note: while we integrate with external services, the data passed through them is not under our control and falls under their respective privacy policies and terms of service.  Self - Hosting Freedom – Run your own email app with ease.  Unified Inbox – Connect multiple email providers like Gmail, Outlook, and more.  Customizable UI & Features – Tailor your email experience the way you want it.  Developer - Friendly – Built with extensibility and integrations in mind.",
    timestamp: "2024-01-01T00:00:00Z",
  },
  {
    id: "example_msg_2",
    role: "assistant",
    content: "done so sire",
    timestamp: "2024-01-01T00:01:00Z",
  },
];

export const exampleComp: CompositionConfig[] = [
  {
    id: "intro_slide",
    name: "fadeInTransition",
    component: FadeInTransition,
    schema: fadeInSchema,
    props: {
      typo_text: "Meet Zero: Your Open-Source Email Solution",
      typo_textColor: "#ffffff",
    },
    duration: 45,
    background: {
      id: "intro_slide-background",
      name: "gradientMesh",
      component: GradientMesh,
      schema: gradientMeshSchema,
      props: {
        speed: 12,
        backgroundColor: "#1e3c72",
      },
      duration: 1,
      background: undefined,
    },
  },
  {
    id: "problem_slide_1",
    name: "slideInTransition",
    component: SlideInTransition,
    schema: slideInSchema,
    props: {
      typo_text: "Closed-Source Email Services",
      typo_textColor: "#ffffff",
    },
    duration: 45,
    background: {
      id: "problem_slide_1-background",
      name: "stairsTextureV2",
      component: StairsMeshV2,
      schema: stairsMeshSchemaV2,
      props: {
        speed: 12,
        backgroundColor: "#4b6cb7",
      },
      duration: 1,
      background: undefined,
    },
  },
  {
    id: "problem_slide_2",
    name: "slideInTransition",
    component: SlideInTransition,
    schema: slideInSchema,
    props: {
      typo_text: "Data-Hungry and Complex",
      typo_textColor: "#ffffff",
    },
    duration: 45,
    background: {
      id: "problem_slide_2-background",
      name: "stairsTextureV2",
      component: StairsMeshV2,
      schema: stairsMeshSchemaV2,
      props: {
        speed: 12,
        backgroundColor: "#4b6cb7",
      },
      duration: 1,
      background: undefined,
    },
  },
  {
    id: "problem_slide_3",
    name: "slideInTransition",
    component: SlideInTransition,
    schema: slideInSchema,
    props: {
      typo_text: "Limited Control and Privacy",
      typo_textColor: "#ffffff",
    },
    duration: 45,
    background: {
      id: "problem_slide_3-background",
      name: "stairsTextureV2",
      component: StairsMeshV2,
      schema: stairsMeshSchemaV2,
      props: {
        speed: 12,
        backgroundColor: "#4b6cb7",
      },
      duration: 1,
      background: undefined,
    },
  },
  {
    id: "solution_slide",
    name: "fadeInTransition",
    component: FadeInTransition,
    schema: fadeInSchema,
    props: {
      typo_text: "Zero: Open, AI-Powered, Self-Hosting",
      typo_textColor: "#ffffff",
    },
    duration: 45,
    background: {
      id: "solution_slide-background",
      name: "growingDark",
      component: GrowingDark,
      schema: growingDarkSchema,
      props: {
        speed: 12,
        backgroundColor: "#0f2027",
      },
      duration: 1,
      background: undefined,
    },
  },
  {
    id: "features_intro",
    name: "simpleTextTyping",
    component: SimpleTextTyping,
    schema: simpleTypingSchema,
    props: {
      typo_text: "What Zero Offers",
      typo_textColor: "#ffffff",
    },
    duration: 45,
    background: {
      id: "features_intro-background",
      name: "plainBackground",
      component: PlainBackground,
      schema: plainBackgroundSchema,
      props: {
        speed: 12,
        backgroundColor: "#1f4037",
      },
      duration: 1,
      background: undefined,
    },
  },
  {
    id: "feature_1",
    name: "slideInTransition",
    component: SlideInTransition,
    schema: slideInSchema,
    props: {
      typo_text: "Open-Source & Transparent",
      typo_textColor: "#ffffff",
    },
    duration: 45,
    background: {
      id: "feature_1-background",
      name: "gradientMesh",
      component: GradientMesh,
      schema: gradientMeshSchema,
      props: {
        speed: 12,
        backgroundColor: "#43cea2",
      },
      duration: 1,
      background: undefined,
    },
  },
  {
    id: "feature_2",
    name: "slideInTransition",
    component: SlideInTransition,
    schema: slideInSchema,
    props: {
      typo_text: "AI Agents to Enhance Emails",
      typo_textColor: "#ffffff",
    },
    duration: 45,
    background: {
      id: "feature_2-background",
      name: "gradientMesh",
      component: GradientMesh,
      schema: gradientMeshSchema,
      props: {
        speed: 12,
        backgroundColor: "#43cea2",
      },
      duration: 1,
      background: undefined,
    },
  },
  {
    id: "feature_3",
    name: "slideInTransition",
    component: SlideInTransition,
    schema: slideInSchema,
    props: {
      typo_text: "Your Data, Your Privacy",
      typo_textColor: "#ffffff",
    },
    duration: 45,
    background: {
      id: "feature_3-background",
      name: "gradientMesh",
      component: GradientMesh,
      schema: gradientMeshSchema,
      props: {
        speed: 12,
        backgroundColor: "#43cea2",
      },
      duration: 1,
      background: undefined,
    },
  },
  {
    id: "feature_4",
    name: "slideInTransition",
    component: SlideInTransition,
    schema: slideInSchema,
    props: {
      typo_text: "Self-Hosting Made Easy",
      typo_textColor: "#ffffff",
    },
    duration: 45,
    background: {
      id: "feature_4-background",
      name: "gradientMesh",
      component: GradientMesh,
      schema: gradientMeshSchema,
      props: {
        speed: 12,
        backgroundColor: "#43cea2",
      },
      duration: 1,
      background: undefined,
    },
  },
  {
    id: "call_to_action",
    name: "scaleUpDownTransition",
    component: ScaleUpDownTransition,
    schema: scaleUpDownSchema,
    props: {
      typo_text: "Join Zero Today!",
      typo_textColor: "#ffffff",
    },
    duration: 45,
    background: {
      id: "call_to_action-background",
      name: "plainBackground",
      component: PlainBackground,
      schema: plainBackgroundSchema,
      props: {
        speed: 12,
        backgroundColor: "#0f2027",
      },
      duration: 1,
      background: undefined,
    },
  },
];
