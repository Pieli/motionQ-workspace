# CLAUDE.md

I'm building AI animation builder tool for creating company promotional videos. The application allows users to either build animations using LLM assistance or manually edit them. 

## Core Architecture

### Technology Stack
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Video Generation**: Remotion 4.0.302 for creating animated videos
- **Routing**: React Router v7
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: React Context (AuthContext)
- **LLM Integration**: OpenAI API for animation generation

### Key Directories
- `src/components/` - React components organized by feature
- `src/remotion-lib/` - Remotion video compositions and animations
- `src/api/` - LLM service integration and animation factories
- `src/lib/` - Utility functions and Firebase authentication
- `src/hooks/` - Custom React hooks

### Main Application Flow
1. **Authentication**: Firebase-based login system
2. **Start Page**: Initial landing with project selection
3. **Workspace**: Main editing interface with chat panel, video player, and timeline
4. **Chat Interface**: LLM-powered animation generation via OpenAI
5. **Video Player**: Remotion player for preview and editing
6. **Timeline**: Frame-based editing interface

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Key Components

### Workspace (`src/components/chat/Workspace.tsx`)
The main editing interface with:
- Resizable panels for chat, video player, and timeline
- Remotion player integration
- State management for compositions and properties

### Animation System (`src/remotion-lib/`)
- `Root.tsx` - Main composition registry
- `TextFades/` - Text animation components
- `textures/` - Background/texture animations
- Individual animation components with Zod schemas

### LLM Integration (`src/api/llm.ts`)
- OpenAI service for generating animations
- Animation factories for component mapping
- Response parsing and validation

### UI Components (`src/components/ui/`)
shadcn/ui components with consistent styling

## Animation Development

### Creating New Animations
1. Create component in `src/remotion-lib/`
2. Define Zod schema for props validation 
3. Add to animation factory in `src/api/animation-factories.ts` +`src/api/animation-.ts`
4. Register in `src/remotion-lib/Root.tsx`

### Remotion Compositions
- All animations are 1920x1080 at 30fps
- Use Zod schemas for type-safe props
- Compositions are organized in folders within Root.tsx

## Authentication & Firebase
- Firebase configuration in `src/lib/firebase.ts`
- AuthContext provides authentication state
- Route guards protect authenticated routes

## Styling Guidelines
- Use Tailwind CSS classes
- Follow shadcn/ui patterns
- CSS variables for theming
- Responsive design with mobile hooks

## Testing & Quality
- ESLint configured for TypeScript and React
- Use TypeScript strict mode
- Follow React hooks best practices

## Code Principles
- Fokus on readabililty 
- Always write pre and post condititions using assert statements to verify the correctness of the implementations
- Exceptions should not be hidden away but should be raised 

