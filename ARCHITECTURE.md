# Architecture - AI Project Mentor Platform

## 1. Recommended Technology Stack
- **Framework:** Next.js (App Router, React 18+)
- **Language:** TypeScript (for type safety and maintainability)
- **Styling:** Tailwind CSS + Radix UI / shadcn/ui (for accessible, headless components)
- **Database:** Firebase Firestore (NoSQL, excellent for document-oriented AI responses and flexible schema)
- **Authentication:** Firebase Authentication
- **AI Integration:** Google Gemini API (via `@google/genai` or Vertex AI)
- **State Management:** React Context + Zustand (for global state), TanStack React Query (for async data/caching)
- **Validation:** Zod (for environment variables, API payloads, and form validation)
- **Testing:** Jest + React Testing Library (Unit/Integration), Playwright (E2E)
- **Deployment:** Dockerized Next.js app on Google Cloud Run
- **Observability:** Google Cloud Logging / Application Performance Management (APM)

## 2. Folder Structure
```text
/
├── src/
│   ├── app/                # Next.js App Router (Pages & API Routes)
│   │   ├── (auth)/         # Authentication routes (login, signup)
│   │   ├── api/            # Backend API routes
│   │   ├── dashboard/      # Protected dashboard routes
│   │   ├── onboarding/     # Student onboarding flow
│   │   └── page.tsx        # Landing page
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Generic UI components (buttons, dialogs)
│   │   └── features/       # Feature-specific components (e.g., SkillGapVisualizer)
│   ├── lib/                # Core utilities
│   │   ├── firebase/       # Firebase config and admin SDK
│   │   ├── ai/             # Gemini API integration and prompt engineering
│   │   └── utils/          # General helper functions
│   ├── types/              # TypeScript interface and type definitions
│   ├── schemas/            # Zod validation schemas
│   ├── services/           # Business logic layer (separating logic from UI/API)
│   └── styles/             # Global CSS
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/                 # Static assets
├── .env.example            # Example environment variables
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json            # Dependencies and scripts
```

## 3. Database Architecture (Firestore)
**Collections:**
- `users`: ID, email, roles, timestamps.
- `studentProfiles`: User ID, skills, interests, time availability, learning goals.
- `projects`: ID, User ID, title, problem, target users, mvp features, tech stack, difficulty, estimated time.
- `roadmaps`: Project ID, phases (tasks, dependencies, completion status).
- `mentorConversations`: User ID, Project ID, messages (role, content, timestamp).

**Access Patterns & Security Strategy:**
- **Repository Pattern:** Database access is abstracted via `src/services/database/`. UI components NEVER interact with Firestore directly.
- **Data Validation:** Strict Zod validation happens prior to DB writes.
- **IDOR Protection:** All repositories check the `userId` associated with the resource against the authenticated caller's `userId`. Any mismatch throws a `ForbiddenError`.
- **Mass Assignment:** Data inputs are strictly parsed using Zod, and ownership fields (like `userId`) are overwritten or strictly validated against the authenticated user context.

## 4. API Architecture
- **RESTful endpoints** via Next.js `/app/api`.
- **Validation:** All incoming payloads validated via Zod (`src/schemas/db.schema.ts`).
- **Error Handling:** Standardized API error responses via `src/lib/api-errors.ts` (throwing `NotFoundError`, `ForbiddenError`, `ValidationError`). 
- **Pagination:** Collections returning multiple items (e.g., fetching a user's saved projects) will accept cursor/limit bounds.

## 5. Authentication Architecture
- **Provider:** Firebase Authentication (Email/Password, Google OAuth).
- **Client:** Firebase Client SDK for UI state and token generation.
- **Server:** Firebase Admin SDK for verifying ID tokens on secure API routes (Session Cookies or Bearer Token).
- **Authorization:** Middleware and server-side checks to ensure users can only access/modify their own resources (Preventing IDOR).

## 6. AI Architecture
- **Provider:** Google Gemini API.
- **Security:** Prompts are constructed server-side. User input is sanitized and injected into strict templates.
- **Structured Outputs:** Gemini prompted to return JSON adhering to Zod schemas to guarantee predictable data structures.
- **Resilience:** Fallbacks, timeouts, and standard error handling for API quotas or failures.

## 7. Google Service Architecture
- **Firebase Auth:** User identity and session management.
- **Firestore:** Primary database.
- **Google Gemini:** Core AI reasoning engine.
- **Google Cloud Run:** Serverless container hosting for the Next.js application.
- **Google Cloud Logging:** Centralized logging for backend observability.

## 8. Security Architecture
- **Input Validation:** Strict Zod schemas for every API endpoint.
- **Authentication:** Protected API routes verifying Firebase tokens.
- **Authorization:** Ownership verification before read/write operations (No IDOR).
- **AI Protections:** System prompts strictly define AI boundaries. Responses parsed and validated; AI never executes code or queries directly.
- **Secrets Management:** Environment variables managed via GCP Secret Manager / Cloud Run env vars. No secrets in frontend bundle.

## 9. Testing Architecture
- **Unit Tests (Jest):** Business logic, validation schemas, data transformations, prompt generation logic.
- **Integration Tests (Jest/RTL):** API endpoint responses, database reads/writes (using Firebase emulator), component integration.
- **E2E Tests (Playwright):** Critical user flows (Signup -> Onboard -> Generate Project -> View Roadmap).
- **Security Tests:** API endpoints tested for unauthorized access and input fuzzing.

## 10. Deployment Architecture
- **CI/CD:** GitHub Actions (or similar) running linting, type-checking, and tests.
- **Hosting:** Docker container deployed to Google Cloud Run.
- **Scalability:** Cloud Run automatically scales instances based on HTTP traffic.

## 11. Accessibility Strategy
- **Semantic HTML:** Strict adherence to structural HTML elements.
- **Component Library:** Radix UI / shadcn for primitives (Dialogs, Dropdowns) ensuring keyboard navigation and ARIA attributes out of the box.
- **Focus Management:** Visible focus indicators (`focus-visible`).
- **Color Contrast:** WCAG AA compliant color palette.
- **Testing:** Automated accessibility checks using `axe-core` and manual keyboard navigation testing.

## 12. Performance Strategy
- **Frontend Optimization:** React Server Components (RSC) where applicable to reduce bundle size. Code splitting and lazy loading for heavy components (e.g., Markdown renderers).
- **API Optimization:** Pagination for lists. Aggregated documents in Firestore to avoid N+1 queries.
- **AI Latency Mitigation:** Streaming AI responses where appropriate, or clear loading states with progress indicators for long-running generation tasks. Optimistic UI updates.
