**Cerniq.app CB V2**  
Complete CognitiveBrain-first UI/UX Blueprint \+ Implementation Plan

Prepared for a fresh implementation on 19 April 2026  
Scope: research-grounded product decisions, page architecture, component system, responsive behavior, motion language, stack, and phased delivery plan

| Decision area | Final stance |
| :---- | :---- |
| Implementation approach | Build a new application, not a direct page-by-page migration of the existing prototype |
| Core product model | CognitiveBrain-first: gateways, neurons, synapses, topology, traces, memory, and telemetry become primary navigation objects |
| Visual direction | Liquid, calm, premium, Apple-inspired surface language adapted to enterprise cognitive operations |
| Technology direction | React 19.2.x \+ Next.js 16.2.4 \+ Tailwind CSS 4.2.2 \+ Motion 12.38.0 \+ App Router \+ RSC \+ Cache Components \+ SSE for live telemetry |
| Quality bar | Pixel-perfect, keyboard-first, accessibility-compliant, observability-rich, and high-performance on all major screen classes |

| Executive recommendationCB V2 should feel like a cognitive operating system, not a CRM with a Brain tab. The app shell, page model, navigation, and design language should all begin with the Brain and let business workflows emerge from the Brain rather than surround it. |
| :---- |

# **1\. Research-grounded decisions and hard constraints**

This blueprint takes the final implementation stance for Cerniq.app CB V2 and resolves the major product, navigation, visual, technical, and delivery decisions discussed in this conversation.

**• Fresh build, not migration.** CB V2 is a new application shell. The existing prototype remains an input for domain understanding, current operational patterns, and interaction seeds.

**• CognitiveBrain-first information architecture.** Users navigate first by gateway, neuron, synapse, topology, trace, memory, and telemetry—not by a legacy business-module-first shell.

**• Latest stable lines only.** The stack is pinned to current stable lines observable by April 2026, with exact patches locked in pnpm at bootstrap time.

**• Enterprise-grade UX constraints.** The UI must be keyboard-first, reduced-motion aware, real-time observable, and predictable under load.

**• Self-hosted compatibility.** The front-end stack and supporting UI tooling must stay open-source and self-hostable.

# **2\. Audit of the existing prototype UI foundation**

Direct inspection of the current prototype branch shows that the existing UI already contains a useful operational Brain seed.

**• Existing routed app shell.** The current web app already has protected routing, app-level providers, auth and query layers, and a dedicated Brain page.

**• Existing tri-pane operational pattern.** The current Brain page is organized as a left context rail, central topology/canvas, and right-side inspector. This pattern is worth preserving as an operator-grade primitive.

**• Existing runtime semantics.** The current UI already expects live topology, SSE events, neuron states, traces, mutations, and pause/resume or config controls.

**• Current limitation.** Brain still behaves as one module within a broader shell instead of becoming the shell itself.

**• Current design gap.** The prototype is serviceable, but it does not yet present a premium visual language, a responsive system, or a complete CognitiveBrain-wide navigation architecture.

| Current prototype pattern | What it proves | Why it is insufficient for CB V2 |
| :---- | :---- | :---- |
| Tri-pane Brain screen | A viable operational base pattern already exists | The entire application shell is not yet derived from it |
| Canvas \+ inspector \+ live state | The product already needs real-time cognitive observability | The current arrangement is still page-specific, not system-wide |
| Batch/context selector rail | Context switching is a real requirement | Gateway-centric context must replace batch-first thinking |
| Traces / mutations / controls | Operator workflows are core to the product | These should become first-class pages and inspectors rather than hidden tabs |

| Design directiveCB V2 should preserve the seriousness and observability of the current Brain page while replacing the old information architecture with a full CognitiveBrain product shell. |
| :---- |

# **3\. Verified front-end baseline (April 2026\)**

Selected versions below are the planning baseline. Exact patches should be resolved once again at bootstrap and written into pnpm-lock.yaml on day zero.

| Layer | Selected baseline | Why selected |
| :---- | :---- | :---- |
| React | 19.2.x line (latest docs line 19.2; lock exact patch at init) | Current React line with Activity, useEffectEvent, improved SSR behavior, and modern RSC-compatible foundations |
| Next.js | 16.2.4 | Latest stable release visible in official GitHub releases during planning; modern App Router and Cache Components-first direction |
| Tailwind CSS | 4.2.2 | Latest stable release visible in official GitHub releases; modern CSS variables, container query friendly architecture, and fast engine |
| Motion | 12.38.0 | Latest stable release visible in official changelog; high-quality layout and interaction animation system |
| TanStack React Query | 5.99.1 | Current high-end server-state library line with mature cache behavior and good React integration |
| TanStack React Router (optional alt) | 1.168.22 | Only if a non-Next route layer is needed for a separate internal shell; otherwise stay with App Router |
| Zustand | 5.0.10 | Lightweight client-state layer for local UI state and dock/layout state |
| Storybook | 10.3.5 | Current stable component workshop line for design system development and regression review |

Architectural stance:

**• Use Next.js 16 App Router.** Build the app shell, layouts, route groups, server components, and streaming boundaries with App Router.

**• Prefer React Server Components for shell and data-rich static frame areas.** Move highly interactive live zones into client islands only where they truly need client-side execution.

**• Use Cache Components for the shell and reusable page frame zones.** Keep the shell fast and stable while allowing dynamic streams and operator islands inside it.

**• Use SSE as the default telemetry delivery channel.** The UI primarily consumes Brain events; most live panels are naturally one-way.

# **4\. Product definition of CB V2**

CB V2 is not only a cognitive operations console. It is a complete CRM \+ Sales Pipeline \+ Sales Engine \+ Sales Automation \+ Business Operations Automation suite powered by CognitiveBrain. The Brain remains the living execution core, but the product surface must also expose the full business-operating system around it.

**• Gateway \= pathway page object.** A gateway is an executable neuronal route composed of neurons and synapses. It deserves first-class navigation, page models, run views, and controls.

**• Neuron \= atomic operator object.** Each neuron gets an identity page, configuration, live metrics, run history, dependencies, and contracts.

**• Synapse \= atomic transport object.** Each synapse gets its own health, lag, retry, delivery, and DLQ surfaces.

**• Trace \= forensic object.** Every run must be inspectable down to trace, event timeline, payloads, error decisions, and recovery outcomes.

**• Topology \= atlas object.** The graph is not decoration; it is a primary navigation and diagnostic surface.

| North-star user questionAt every moment the user should be able to answer: what is active, what is healthy, what is blocked, what changed, why it changed, and what I can do next. |
| :---- |

# **5\. Visual and interaction language: 'Cerniq Liquid Cognitive'**

The target look-and-feel is premium, layered, translucent, and calm—but never decorative at the expense of clarity.

**• Layered translucent surfaces.** Panels, inspector docks, command bars, chips, and sheets use subtle glass-like treatment with strict contrast control and restrained blur.

**• Content-first chrome.** Surfaces recede when the canvas, traces, charts, or inspectors need attention.

**• Morphing continuity.** Inspectors, sheets, and auxiliary panels should visually emerge from the active context rather than pop in abruptly.

**• Micro-interactions everywhere, but calm.** Hover, focus, pressed, selected, warning, and live pulse states always have visible feedback, yet avoid flashy behavior.

**• Enterprise restraint.** Use premium depth, typography, spacing, and motion to achieve polish rather than noisy color or over-ornamented widgets.

# **6\. Information architecture and navigation**

The application must have chapter-based navigation organized by governance domains. CognitiveBrain remains the central operating model, but the shell must also expose the end-to-end business suite: data ingest, customer management, revenue execution, communications, workflows, operations, analytics, and administration.

| Navigation layer | Purpose | Primary contents |
| :---- | :---- | :---- |
| Primary rail | Global product navigation | Overview, Live, Gateways, Neurons, Synapses, Topology, Traces, Memory, Admin, Settings |
| Context rail / context bar | Current slice and working context | Workspace, environment, stage E1–E5, time range, live/frozen mode, selected gateway or topology focus |
| Command layer | Fast keyboard-driven travel and action | Open entity, search any object, inspect, pin, resume, isolate path, open trace, open run, switch mode |

**• Primary rail.** Desktop-first vertical rail with icon-first collapsed mode and labeled expanded mode.

**• Top command surface.** Persistent command/search bar in the top shell with live status chips and context selectors.

**• Command palette.** Universal Ctrl/Cmd+K palette that searches gateways, neurons, synapses, runs, traces, alerts, and actions.

**• Contextual breadcrumbs.** Page-local breadcrumbs should reflect the Brain hierarchy, not legacy module ancestry.

**• Keyboard system.** Navigation, focus switching, panel toggling, canvas focus, and trace exploration all require explicit shortcuts.

# **7\. New page system for Cerniq.app CB V2**

The page map below is the initial Brain-centric page system, but it must be expanded into a full suite. The extended blueprint appended in this revision defines the complete chapter model and operational page inventory required by the real product scope.

| Route | Page purpose | Core surfaces |
| :---- | :---- | :---- |
| /overview | Brain status and executive situational awareness | Brain health hero, pulse strip, stage lanes, anomalies, active runs, top failing synapses |
| /live | Live operational control center | Live topology, event river, active gateway strip, incident panels, run timeline |
| /gateways | Gateway catalog and exploration | Cards/table/matrix, filters, preview dock |
| /gateways/\[gatewayId\] | Gateway detail and orchestration surface | Path canvas, command strip, selected step inspector, telemetry tray |
| /gateways/\[gatewayId\]/runs/\[runId\] | One concrete gateway execution | Execution timeline, playback, events, payloads, retries, errors |
| /neurons | Neuron catalog | Searchable list, grid, filters, status clusters |
| /neurons/\[neuronId\] | Neuron detail | Identity, contracts, config, linked gateways, metrics, errors, audit |
| /synapses | Synapse catalog | List, health, lag, QoS, directionality, throughput filters |
| /synapses/\[synapseId\] | Synapse detail | Flow map, QoS, lag, delivery history, DLQ, upstream/downstream |
| /topology | Full Brain atlas | Full-screen graph, minimap, layers, legend, inspector, time scrubber |
| /traces | Trace explorer | Trace list, flame/timeline, payload diff, raw events, retry history |
| /memory | Memory and context surfaces | Memory spaces, embeddings health, recall views, context lineage |
| /admin | Governance and control | Models, routing, policies, roles, limits, audit |
| /settings | Product and operator settings | Theme, keyboard shortcuts, notification and panel preferences |

# **8\. App shell blueprint**

The shell must make the user feel that they are entering a living system, not a collection of unrelated admin pages.

| Shell zone | Role | Behavior |
| :---- | :---- | :---- |
| Top bar | Identity \+ search \+ global context \+ live status | Sticky; 72px high; remains visually calm and thin |
| Primary rail | Global navigation | Collapsed and expanded modes; persistent on desktop; compact variant on smaller screens |
| Main workspace | Page-specific content | Changes by route; supports one, two, or three-panel layouts |
| Utility dock | Inspector / telemetry / selected object | Persistent on wide screens; collapses into sheet or drawer on smaller screens |
| Bottom overlay host | Playback bar, toasts, debug strip | Contextual; appears only when active |

| App shell ruleDo not let every page invent its own layout logic. All pages should be composed from the same shell grammar: page header, action strip, workspace, utility dock, and optional telemetry tray. |
| :---- |

# **9\. Detailed page blueprint**

## **9.1 Overview**

Overview is the landing page for decision-makers and operators. It answers whether the Brain is healthy, busy, saturated, or unstable.

**• Page header.** Title, environment selector, workspace selector, live status, time range, breadcrumb.

**• Brain health hero.** High-trust KPI cluster: active gateways, active runs, neuron error rate, synapse lag, model latency, top incidents.

**• Live pulse strip.** A horizontal event river showing spikes, alerts, and flow intensity over the current time window.

**• Stage lanes E1–E5.** Five lane cards showing current health, traffic, and anomalies per stage.

**• Recent active runs.** Virtualized high-density list with open-in-split-view interaction.

**• Utility dock.** Selected anomaly, quick actions, and AI/operator assistant panel.

## **9.2 Live**

Live is the operational command center for immediate monitoring and interventions.

**• Central live canvas.** Topology viewport centered on currently active paths and hotspots.

**• Event river.** Continuous streamed event feed with filters.

**• Incident panel.** Pinned list of current warnings, failures, and saturation states.

**• Run timeline.** Chronological timeline of active and recently completed runs.

**• Inspector dock.** Selection-aware panel showing the currently selected gateway, neuron, synapse, or alert.

## **9.3 Gateways index**

Gateways becomes the primary catalog entry point into executable pathway design and operation.

**• Filter bar.** Search, stage, domain, health, owner, live-only, favorites, density mode.

**• View switcher.** Cards, table, and matrix views.

**• Preview dock.** Selection preview with route summary, current health, latest run, and quick actions.

**• Empty states.** Guided states for no results, no permission, or no gateways in the selected workspace.

## **9.4 Gateway detail**

Gateway detail is the flagship operating page of CB V2.

**• Gateway hero header.** Identity, stage, health, owner, last run, current mode, pinned actions.

**• Gateway command strip.** Pause, resume, inspect latest run, open topology focus, isolate path, compare versions.

**• Central path canvas.** Pathway rendered as executable flow: neurons, synapses, grouped stages, and critical breakpoints.

**• Current run timeline.** If active, shows progress and state transitions by step.

**• Bottom telemetry tray.** Traces, logs, metrics, mutations, and payload previews.

**• Right inspector dock.** Selection summary, contracts, config, upstream/downstream, related entities.

## **9.5 Neuron detail**

Neuron detail is a technical and operational page for one atomic unit.

**• Identity card.** Purpose, stage, owning gateway(s), criticality, runtime class, current health.

**• Contracts.** Input schema, output schema, validation policy, error taxonomy.

**• Config.** Runtime config, concurrency, limits, experimental flags, rollout state.

**• Metrics.** Latency, throughput, failures, retries, recent anomalies, saturation curve.

**• Linked gateways.** All gateways where the neuron participates.

**• Run history.** Virtualized history with links into trace detail.

## **9.6 Synapse detail**

Synapse detail makes transport and delivery visible as first-class UX.

**• Identity card.** Source, destination, direction, QoS, retry policy, current health.

**• Lag and throughput.** Histograms, current lag, moving averages, queue depth.

**• Delivery history.** Latest deliveries, retries, reclaims, DLQ entries.

**• Upstream/downstream panels.** Linked source and target entities with quick jump actions.

**• Troubleshooting workbench.** Pin failed deliveries, inspect payload, replay or quarantine.

## **9.7 Topology atlas**

Topology is the immersive 'wow' surface and must remain useful, not decorative.

**• Full-screen canvas.** Dominant visual surface with pan, zoom, isolate, stage overlays, and focus modes.

**• Floating layer controls.** Toggle stage coloring, health overlay, live flow, topology groups, labels.

**• Minimap and legend.** Always visible on large screens; collapsible on smaller ones.

**• Selection inspector.** Docked or sheet-based depending on screen size.

**• Time scrubber.** Review the graph in frozen historical mode.

## **9.8 Trace explorer**

Traces is the forensic surface for operators, developers, and support engineers.

**• Trace list.** Searchable, filterable, high-density, virtualized table.

**• Trace detail split view.** Timeline/flame, raw events, payload diff, retries, linked entities.

**• Keyboard-centric exploration.** Fast opening, stepping, collapsing, expanding, and jumping to entity pages.

# **10\. Responsive layout system**

CB V2 must be responsive both to viewport size and to container size. Breakpoints alone are not enough.

| Screen class | Range | Layout rule |
| :---- | :---- | :---- |
| Mobile compact | 360–479 px | Bottom navigation; full-screen search; sheets for inspector and telemetry; stacked content |
| Mobile large | 480–767 px | Bottom navigation; segmented mode switchers; cards remain single-column |
| Tablet | 768–1023 px | Compact top navigation \+ optional rail; inspector becomes bottom sheet or right drawer |
| Laptop | 1024–1439 px | Primary rail \+ content \+ collapsible utility dock; telemetry moves to tabs/drawer |
| Desktop | 1440–1919 px | Three-zone shell is available; inspector remains persistent where useful |
| Ultrawide | 1920+ px | Three-zone shell plus bottom telemetry tray can stay open simultaneously |

**• Viewport responsiveness.** The shell and panel count change with screen class.

**• Container responsiveness.** Cards, inspectors, metric blocks, and data rows adapt to the width of the container that holds them, not just the viewport.

**• Animated rearrangement.** When panels collapse, dock, undock, or convert into sheets, the transition should be animated and spatially understandable.

**• Touch adaptation.** Hit targets, sheets, segmented controls, and swipe interactions expand gracefully on touch-centric devices.

# **11\. Motion system and 'liquid' behavior**

The motion language must feel premium, fast, and physically coherent.

**• Shared layout transitions.** Cards expand into inspectors, list rows become detail headers, and selected graph entities connect spatially with their docks.

**• Panel morphing.** Drawers and sheets visually emerge from the area that triggered them.

**• State feedback.** Hover, focus, pressed, warning, active, and selected states are always visible and animated lightly.

**• Live pulse language.** Gateway, neuron, and synapse live states use subtle pulse or flow accents rather than aggressive blinking.

**• Reduced motion support.** Every non-essential animation must degrade to a low-motion alternative.

| Motion token | Recommended value | Usage |
| :---- | :---- | :---- |
| duration-fast | 120 ms | Hover, focus, chips, small button states |
| duration-base | 180 ms | Tabs, drawers, selection transitions |
| duration-soft | 240 ms | Panel enter/exit, inspector changes |
| duration-fluid | 320 ms | Shared layout transitions and shell rearrangements |
| ease-snappy | cubic-bezier tuned for quick interaction | Buttons, toggles, menus |
| ease-fluid | spring-like or smooth cubic curve | Panels, sheets, list-to-detail, card expansion |

# **12\. Component system architecture**

The component system should be layered so that premium UI behavior stays reusable and predictable.

| Layer | Examples | Rules |
| :---- | :---- | :---- |
| Foundations | Surface, GlassSurface, Stack, Grid, Cluster, Hairline, Text, Icon, FocusRing | No business logic; define layout, depth, and text rhythm |
| Controls | LiquidButton, IconButton, SearchField, CommandInput, Tabs, Popover, Tooltip, Breadcrumbs | Pure interaction primitives with accessibility built in |
| Data primitives | StatusDot, MetricPill, ErrorTag, Sparkline, HistogramMini, TimelineMarker | Compact reusable data-expression elements |
| Cognitive entity components | GatewayCard, NeuronCard, SynapseRow, TraceRow, StageLaneCard | Entity-aware but reusable across pages |
| High-level surfaces | BrainHealthHero, GatewayPathCanvas, TelemetryTray, TraceExplorer, TopologyAtlas | Large page surfaces composed from lower layers |

# **13\. Design tokens and theming**

Theming must be token-first from day zero.

**• Color model.** Use modern CSS variable tokens with OKLCH / wide-gamut friendly values where practical, while preserving fallbacks and enterprise readability.

**• Spacing.** 4-pt base with strong rhythm at 8, 12, 16, 24, 32, 40, and 56\.

**• Radius system.** Use restrained but premium radii: 12, 18, 24, 32\.

**• Depth system.** Depth is expressed through subtle shadows, translucency, and separation—not dramatic elevation.

**• Light and dark themes.** Both themes must be premium and equal citizens, not one strong theme plus a weaker fallback.

# **14\. Real-time telemetry and observability UI**

Live telemetry is not an afterthought. It is one of the product’s defining UI strengths.

**• SSE-first data plane.** Gateways, neurons, synapses, and trace views subscribe to Brain events using EventSource-based streams for live updates.

**• Telemetry tray.** A bottom tray pattern should expose logs, metrics, traces, and mutations without leaving the current page.

**• Inspector awareness.** Selecting an entity updates not only the inspector but also the metrics and event context tied to that selection.

**• Time controls.** Every telemetry-heavy page should support live mode and frozen historical mode.

**• Debugging surfaces.** Errors should reveal trace IDs, recovery hints, related entities, and recent timeline context.

# **15\. Keyboard-first and accessibility-first enterprise UX**

Accessibility and keyboard fluency are mandatory, not post-launch improvements.

**• Universal command palette.** Ctrl/Cmd+K opens omnibox search and actions.

**• Global navigation shortcuts.** Shortcuts jump directly to Gateways, Neurons, Synapses, Topology, and Traces.

**• Focus model.** The user can switch focus between page header, canvas, inspector, telemetry tray, and lists without leaving the keyboard.

**• Reduced motion.** Prefer-reduced-motion must disable non-essential motion without breaking information hierarchy.

**• Screen-reader structure.** Use proper landmarks, headings, labels, and dynamic announcements for critical live changes.

# **16\. New front-end codebase structure**

This is the recommended top-level codebase tree for the new CB V2 front-end.

apps/  
└── cerniq-cb-v2-web/  
    ├── app/  
    │   ├── (shell)/  
    │   │   ├── overview/page.tsx  
    │   │   ├── live/page.tsx  
    │   │   ├── gateways/page.tsx  
    │   │   ├── gateways/\[gatewayId\]/page.tsx  
    │   │   ├── gateways/\[gatewayId\]/runs/\[runId\]/page.tsx  
    │   │   ├── neurons/page.tsx  
    │   │   ├── neurons/\[neuronId\]/page.tsx  
    │   │   ├── synapses/page.tsx  
    │   │   ├── synapses/\[synapseId\]/page.tsx  
    │   │   ├── topology/page.tsx  
    │   │   ├── traces/page.tsx  
    │   │   ├── memory/page.tsx  
    │   │   ├── admin/page.tsx  
    │   │   └── settings/page.tsx  
    │   ├── api/  
    │   │   ├── live/route.ts  
    │   │   ├── telemetry/route.ts  
    │   │   └── command/route.ts  
    │   ├── layout.tsx  
    │   └── globals.css  
    ├── src/  
    │   ├── shell/  
    │   │   ├── top-bar/  
    │   │   ├── primary-rail/  
    │   │   ├── context-bar/  
    │   │   ├── utility-dock/  
    │   │   └── overlay-host/  
    │   ├── foundations/  
    │   │   ├── layout/  
    │   │   ├── surfaces/  
    │   │   ├── typography/  
    │   │   ├── feedback/  
    │   │   └── tokens/  
    │   ├── controls/  
    │   │   ├── buttons/  
    │   │   ├── inputs/  
    │   │   ├── navigation/  
    │   │   ├── overlays/  
    │   │   └── command/  
    │   ├── data-primitives/  
    │   │   ├── badges/  
    │   │   ├── pills/  
    │   │   ├── sparklines/  
    │   │   └── timelines/  
    │   ├── entities/  
    │   │   ├── gateways/  
    │   │   ├── neurons/  
    │   │   ├── synapses/  
    │   │   ├── traces/  
    │   │   └── memory/  
    │   ├── surfaces/  
    │   │   ├── overview/  
    │   │   ├── live/  
    │   │   ├── gateway-detail/  
    │   │   ├── neuron-detail/  
    │   │   ├── synapse-detail/  
    │   │   ├── topology/  
    │   │   └── traces/  
    │   ├── motion/  
    │   ├── hooks/  
    │   ├── state/  
    │   ├── streaming/  
    │   ├── telemetry/  
    │   ├── lib/  
    │   ├── styles/  
    │   └── tests/  
    ├── .storybook/  
    ├── public/  
    └── package.json

# **17\. Technology and package decision summary**

| Package / capability | Recommended usage in CB V2 |
| :---- | :---- |
| react / react-dom | Core UI runtime on the current 19.2.x line |
| next | Primary framework with App Router, server components, route groups, and streaming-ready layouts |
| tailwindcss | Token-driven styling and layout foundation |
| motion | Shared layout transitions, spring motion, panel morphing, interactive state animation |
| @tanstack/react-query | Server state, caching, background refresh, and controlled client cache behavior |
| zustand | Local app UI state: panel positions, pinned inspectors, command palette state, canvas UI state |
| storybook | Design system development, visual review, documentation, and QA |
| playwright | End-to-end interaction and responsive regression coverage |
| axe-core or equivalent | Automated accessibility assertions in CI |

# **18\. Phased implementation plan**

## **Phase 0 — bootstrap**

Set up the new application shell, package baselines, app layout, linting, Storybook, design tokens, theme primitives, and the first top-bar/rail shell surfaces.

**•** Create the new repo/app package

**•** Pin the baseline versions

**•** Implement top bar, primary rail, and shell layout

**•** Implement light/dark theme tokens

**•** Establish Storybook and visual QA process

## **Phase 1 — design system**

Build the foundational surfaces, controls, data primitives, focus patterns, and motion tokens before page proliferation begins.

**•** Surface primitives

**•** Buttons / inputs / overlays

**•** Data pills and badges

**•** Typography system

**•** Motion wrapper components

## **Phase 2 — product shell pages**

Implement Overview, Live, and the catalog index pages for Gateways, Neurons, and Synapses.

**•** Overview page

**•** Live page

**•** Gateway index

**•** Neuron index

**•** Synapse index

## **Phase 3 — flagship operational pages**

Implement Gateway detail, Gateway run detail, utility dock, and telemetry tray; these define the operator core of the app.

**•** Gateway detail

**•** Gateway run player

**•** Telemetry tray

**•** Utility dock interactions

## **Phase 4 — expert inspection surfaces**

Implement Neuron detail, Synapse detail, Trace explorer, and Memory surfaces.

**•** Neuron detail

**•** Synapse detail

**•** Trace explorer

**•** Memory views

## **Phase 5 — immersive atlas and polish**

Build full Topology atlas, responsive refinements, advanced motion, keyboard completion, and final visual tuning.

**•** Topology atlas

**•** Advanced responsive behavior

**•** Keyboard system

**•** Performance tuning

**•** Pixel-perfect pass

# **19\. Acceptance criteria**

**• Navigation clarity.** A first-time user can understand the distinction between gateways, neurons, synapses, topology, and traces within one session.

**• Operational fluency.** An operator can go from anomaly to gateway to neuron to synapse to trace without losing context.

**• Performance.** The shell feels immediate, page transitions are calm and fast, and live telemetry does not destabilize the rest of the UI.

**• Responsiveness.** Every major page remains usable and legible on desktop, laptop, tablet, and mobile.

**• Premium fit and finish.** Visual alignment, spacing, depth, glass treatment, and motion all feel intentional and consistent.

**• Accessibility.** Keyboard operation, focus treatment, reduced motion, and structural semantics are complete from the initial release candidate.

# **20\. Research references used for the planning baseline**

The references below informed the stack decisions and capability assumptions. The code audit findings on the current prototype come from direct inspection of the repository branch discussed in this conversation.

**• React versions / React 19.2 —** https://react.dev/versions

**• React 19.2 announcement —** https://react.dev/blog/2025/10/01/react-19-2

**• Next.js official releases (v16.2.4 latest during planning) —** https://github.com/vercel/next.js/releases

**• Next.js Cache Components docs —** https://nextjs.org/docs/app/getting-started/cache-components

**• React Server Components reference —** https://react.dev/reference/rsc/server-components

**• Tailwind CSS official releases (v4.2.2 latest during planning) —** https://github.com/tailwindlabs/tailwindcss/releases

**• Tailwind CSS v4 announcement —** https://tailwindcss.com/blog/tailwindcss-v4

**• Motion docs —** https://motion.dev/docs/react

**• Motion changelog —** https://motion.dev/changelog

**• TanStack Query official releases —** https://github.com/TanStack/query/releases

**• TanStack Router official releases —** https://github.com/TanStack/router/releases

**• Zustand official releases —** https://github.com/pmndrs/zustand/releases

**• Jotai official releases —** https://github.com/pmndrs/jotai/releases

**• Radix primitives repository and release overview —** https://github.com/radix-ui/primitives

**• Storybook official releases —** https://github.com/storybookjs/storybook/releases

**• MDN container queries guide —** https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container\_queries

**• WAI-ARIA Authoring Practices Guide —** https://www.w3.org/WAI/ARIA/apg/

**• web.dev content-visibility overview —** https://web.dev/content-visibility

# **21\. Product scope correction: the full CB V2 suite**

The revised product definition for Cerniq.app CB V2 is a complete business-operating suite, not only a Brain observer or atlas. The application must combine CRM, sales pipeline management, sales execution, communications, workflow automation, and business operations surfaces into one CognitiveBrain-centered shell.

• CognitiveBrain is the living runtime and the primary organizing metaphor, but not the only user-facing concern.

• Every business page must map back to gateways, neurons, synapses, traces, policies, and telemetry where relevant.

• Operational users still need conventional business surfaces: customer records, inboxes, tasks, opportunities, pipeline boards, workflow editors, ingest consoles, and operations workbenches.

• The suite must support both executive visibility and operator-grade execution without fragmenting the mental model of the product.

# **22\. Governance chapters and navigation domains**

The global navigation must be organized into chapters that reflect governance domains. Each chapter has its own landing page, sub-navigation, page templates, and role visibility rules.

## **22.1 Home and workspace**

• Workspace switcher, role-aware home, personalized command surface, recent work, pinned entities, saved views, and system announcements.

• This chapter provides the entry point into the suite and should adapt to executive, sales, operations, and admin personas.

## **22.2 CognitiveBrain core**

• Overview, Live, Gateways, Neurons, Synapses, Topology, Traces, Memory, and Runtime controls.

• This chapter contains the canonical Brain surfaces and remains the deepest technical-operational layer of the product.

## **22.3 Data ingest and enrichment**

• Imports, source connectors, upload sessions, mapping, validation, bronze/silver/gold processing status, quarantines, retries, enrichment jobs, and ingest audits.

• This chapter is where external data becomes structured business intelligence inside the suite.

## **22.4 CRM and customer intelligence**

• Accounts, organizations, contacts, customer 360 views, segmentation, ownership, relationship graph, notes, tasks, timelines, and health signals.

• This chapter exposes the commercial truth of the customer base and must be deeply linked to Brain-derived insights and actions.

## **22.5 Unified Inbox and communications**

• Omnichannel inbox, conversations, activity streams, assignment, drafts, snippets, AI suggestions, SLA indicators, and communication analytics.

• This chapter is the human interaction surface for live communication and follow-up execution.

## **22.6 Sales pipeline and revenue execution**

• Pipeline boards, opportunities, deal rooms, account plans, forecasting, stage progression, objections, offer generation, negotiation support, and win/loss intelligence.

• This chapter turns Brain outputs into concrete revenue execution.

## **22.7 Workflow automation and orchestration**

• Automation builders, workflow runs, triggers, conditions, approvals, queues, retries, dead-letter worklists, and policy-aware automation controls.

• This chapter is where business automations become manageable products rather than hidden backend behavior.

## **22.8 Operations and business execution**

• Orders, contracts, invoicing, logistics, fulfillment, post-sale actions, onboarding, collections, churn prevention, referrals, and exception handling.

• This chapter anchors the product in real business operations, not only sales discovery or lead generation.

## **22.9 Analytics, telemetry, and decision intelligence**

• Business dashboards, conversion analytics, operational KPIs, attribution, model latency, funnel leakage, anomaly panels, executive scorecards, and drill-down workspaces.

• This chapter connects the business layer and the Brain layer through shared metrics and traceability.

## **22.10 Administration, governance, and security**

• Users, roles, permissions, environments, policies, model routing, audit logs, data governance, retention controls, tenant settings, and integration settings.

• This chapter is mandatory for enterprise operation and must be navigation-complete from day one.

# **23\. Complete page suite and chapter-level page inventory**

The suite below defines the minimum complete application surface for CB V2. Page names are organized by chapter and written as implementation targets, not abstract feature buckets.

## **23.1 Home and workspace pages**

• Workspace Home: role-aware landing page with pulse strip, pinned entities, recent activity, approvals queue, and command launcher.

• My Work: tasks, assigned conversations, owned opportunities, pending approvals, and personal follow-up queues.

• Saved Views and Watchlists: curated entity views, filters, alerts, and dashboard presets.

• Notifications Center: actionable alerts, workflow exceptions, Brain warnings, mention feed, and inbox events.

## **23.2 CognitiveBrain core pages**

• Brain Overview, Live Operations, Gateway Catalog, Gateway Detail, Gateway Run Detail, Neuron Catalog, Neuron Detail, Synapse Catalog, Synapse Detail, Topology Atlas, Trace Explorer, Memory Explorer, Runtime Policies, and Incident Console.

• Every page in this chapter must expose both business-readable summaries and expert-depth inspection states.

## **23.3 Data ingest and enrichment pages**

• Imports Home, Upload Session Wizard, Connector Catalog, Connector Detail, Source Mapping Studio, Validation Console, Quarantine Workbench, Enrichment Jobs, Batch Detail, Entity Promotion Review, and Import Audit Trail.

• These pages are mission-critical because they control data quality and the entry of truth into the entire suite.

## **23.4 CRM and customer intelligence pages**

• Accounts Index, Account Detail, Contact Index, Contact Detail, Customer 360, Relationship Graph, Segment Builder, Ownership Console, Activity Timeline, Notes and Attachments, and Risk/Health view.

• Customer pages must combine canonical business fields with live Brain suggestions, scores, and recommended actions.

## **23.5 Unified Inbox and communications pages**

• Inbox Overview, Conversation List, Conversation Detail, Draft Composer, Shared Queues, SLA Console, Snippets and Templates, Communication Analytics, and Assignment Workbench.

• Unified Inbox must support email, chat, internal notes, and automation-assisted follow-up in a single operator flow.

## **23.6 Sales pipeline and revenue execution pages**

• Pipeline Overview, Pipeline Board, Opportunity Index, Opportunity Detail, Deal Room, Forecasting Console, Stage Health Analytics, Objection Library, Offer/Proposal Builder, Negotiation Workspace, and Win/Loss Review.

• Sales pages must feel commercial first, but remain traceable back to gateways and neuron-derived actions.

## **23.7 Workflow automation and orchestration pages**

• Automation Catalog, Workflow Builder, Trigger Catalog, Run Queue, Workflow Run Detail, Approval Inbox, Retry Workbench, DLQ Review, Policy Simulation, and Automation Audit.

• Workflow pages must make invisible automation behavior visible, controllable, and governable.

## **23.8 Operations and business execution pages**

• Orders, Contracts, Billing and Invoicing, Logistics and Delivery, Onboarding Workbench, Post-Sale Care, Collections, Churn Prevention, Referral Engine, and Exception Desk.

• These pages are the operational backbone of the suite and must be co-designed with business data density and Brain-driven intervention surfaces.

## **23.9 Analytics and executive intelligence pages**

• Executive Dashboard, Revenue Analytics, Funnel Analytics, Customer Analytics, Operations Analytics, Model and Runtime Analytics, Attribution, Anomaly Explorer, and KPI Builder.

• Analytics pages must allow both presentation-grade executive views and direct drill-down to runs, traces, and entities.

## **23.10 Administration and governance pages**

• Users and Teams, Roles and Access, Tenant Settings, Environment Settings, Policy Center, Model Routing, Audit Log, Data Governance, Integration Settings, and Retention Controls.

# **24\. Detailed UI templates for business-operational chapters**

To avoid building unrelated screens, page templates should be standardized by chapter. The templates below define the canonical container model for the missing business pages.

## **24.1 Data ingest template**

• Top shell with workspace, environment, ingest health, and command input.

• Left context rail for source, session, batch, and phase filters.

• Central workbench for mapping grid, validation grid, or batch timeline depending on sub-page.

• Right inspector for selected source column, validation issue, promoted entity, or ingest control.

• Bottom telemetry tray for stream events, retries, warnings, and background Brain interventions.

## **24.2 Customer 360 template**

• Header hero with account identity, relationship status, health, owner, and quick actions.

• Primary content split into customer summary, timeline, active opportunities, communications, and operations panels.

• Persistent insight dock with Brain recommendations, next-best-actions, and risk alerts.

• Context tabs for Overview, Contacts, Opportunities, Activity, Inbox, Operations, Documents, and Audit.

## **24.3 Unified Inbox template**

• Conversation list rail, active conversation pane, and contextual assistant/inspector pane.

• Sticky composer dock with snippets, templates, sentiment cues, and suggested actions.

• Right utility tabs for customer context, deal context, workflow context, and Brain context.

• Mobile behavior must prioritize list-detail transitions with full-screen sheets for assistant and context.

## **24.4 Pipeline and opportunity template**

• Board or table switcher at the top, with stage analytics ribbon and forecast chips.

• Opportunity workbench with center deal narrative, left pipeline context, right action dock, and bottom activity timeline.

• Command strip for stage movement, proposal generation, negotiation assist, task generation, and workflow launch.

## **24.5 Workflow and operations template**

• Run queue or worklist rail on the left, execution graph or case content in the center, and policy/exception panel on the right.

• Bottom tray for live logs, retry history, linked traces, linked entities, and human approvals.

## **24.6 Executive analytics template**

• Hero KPI band, narrative summary band, filter dock, analytical grid, and guided drill-down side sheet.

• Every KPI card should support jump-to-source behavior: account, gateway, workflow run, opportunity, or incident.

# **25\. Navigation architecture revised for the full suite**

The shell must no longer expose a flat Brain-only primary rail. It needs a two-level model: chapter navigation first, then chapter-local navigation.

• Primary navigation \= governance chapters. Home, Brain, Ingest, Customers, Inbox, Sales, Workflows, Operations, Analytics, Admin.

• Secondary navigation \= local chapter sections. Example: Sales \-\> Pipelines, Opportunities, Forecasts, Negotiation, Proposals.

• Entity breadcrumbs must remain semantic. Example: Sales / Opportunities / OP-24491 / Negotiation instead of Brain / Gateway / Node ancestry when the user is in a commercial page.

• Cross-links into Brain are contextual, not dominant. Business pages expose “Open in Brain”, “Open related gateway”, “Open trace”, and “View neuron explanation” actions.

• Command palette must search across both business entities and Brain entities: customers, contacts, opportunities, conversations, workflows, gateways, neurons, synapses, traces, incidents.

# **26\. Responsive behavior for the complete suite**

Responsive behavior must now account for both graph-heavy Brain pages and dense business-operational pages.

• Ultrawide desktop uses persistent three-zone layouts for workbenches: chapter nav, central workspace, utility dock.

• Standard desktop keeps the same mental model but collapses low-priority side surfaces into segmented inspector tabs.

• Tablet uses list-detail-shell patterns for Inbox, CRM, Opportunities, and Imports, while Brain-heavy pages switch to full-width canvas plus sheets.

• Mobile prioritizes action-oriented views: task queues, conversation detail, account summary, opportunity summary, and run detail in vertical sheets rather than miniature desktop layouts.

• Container-query behavior must be applied to cards, inspectors, metric groups, and worklists so the same components can be reused across Overview, CRM, Sales, and Ops pages without brittle breakpoint-only logic.

# **27\. Reusable component expansion for the full business suite**

The component system must be expanded beyond Brain-specific cards into business-operational primitives and composite organisms.

• Business identity components: AccountCard, ContactCard, OpportunityCard, ConversationCard, WorkflowCard, OrderCard, ContractCard.

• Commercial status components: StagePill, RevenuePill, ForecastPill, SLAChip, OwnershipBadge, RiskBadge, SentimentBadge.

• Worklist components: QueueTable, ActionList, ApprovalCard, ExceptionCard, RetryCard, AuditRow.

• Communication components: ThreadListItem, ConversationPane, ComposerBar, SnippetPicker, AttachmentStrip.

• Customer 360 components: RelationshipGraphCard, HealthScoreCard, TimelineRail, ActivityCluster, NextBestActionCard.

• Operational components: BatchProgressBoard, ValidationIssueRow, QuarantineCard, OrderStepper, ContractTimeline, LogisticsCheckpointRow.

• Executive components: KPIHeroCard, NarrativeSummaryCard, DrilldownTable, VarianceCard, ForecastChartCard.

# **28\. Revised phased implementation plan for the full suite**

## **Phase 0 — corrected product foundation**

• Lock chapter taxonomy, governance model, personas, and full page inventory before visual implementation.

• Freeze the canonical cross-entity vocabulary: gateway, neuron, synapse, account, contact, opportunity, conversation, workflow, order, contract, incident, run, and trace.

• Expand the route map, command model, and design tokens to cover both Brain pages and business-operational pages.

## **Phase 1 — shell and design system**

• Build the chapter-based app shell, navigation systems, command palette, responsive surface system, and reusable design primitives.

• Deliver Home, Brain Overview, Ingest Home, Customers Home, Inbox Home, Sales Home, Workflows Home, Operations Home, Analytics Home, and Admin Home.

## **Phase 2 — first-class business workbenches**

• Implement Imports, Customer 360, Unified Inbox, Opportunity Detail, and Workflow Run pages as flagship workbenches.

• Ensure every workbench already links to Brain evidence: related gateway, trace, neuron explanation, and live telemetry.

## **Phase 3 — operational suite**

• Implement Orders, Contracts, Billing, Logistics, Post-Sale, Churn, and Referral pages.

• Unify exception handling across workflows, operations, and Brain incidents.

## **Phase 4 — executive intelligence and atlas depth**

• Implement executive dashboards, analytical drill-down, cross-domain scorecards, and atlas-level topology workflows.

• Polish motion, reduce cognitive load, and harden keyboard-first flows.

## **Phase 5 — enterprise hardening**

• Visual QA on all breakpoints, accessibility audits, reduced-motion refinements, latency budgets, and role-based acceptance testing.

• Finalize playbooks, documentation, Storybook coverage, and design-system governance.

# **29\. Final implementation stance**

The final decision is that Cerniq.app CB V2 must be designed as a complete enterprise business suite whose living core is CognitiveBrain. The interface must therefore satisfy two obligations simultaneously: it must be the best possible operational surface for gateways, neurons, synapses, traces, and topology, and it must also be the best possible commercial-operational surface for ingest, customers, inbox, sales, workflows, and business execution.

• The Brain is the engine and the organizing principle.

• The suite is the product users actually live in every day.

• Navigation must be chapter-based and governance-based.

• Business pages and Brain pages must cross-link seamlessly without competing mental models.

• The implementation plan must prioritize reusable page templates and workbench patterns so the suite feels coherent and premium from day one.