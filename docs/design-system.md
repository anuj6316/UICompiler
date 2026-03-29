# Design System

UICompiler uses a custom design system called **"Sculpted Playroom"** — a high-contrast, monochrome aesthetic built on Tailwind CSS v4.

---

## Color Palette

The system uses Tailwind's **Zinc** scale throughout, with an "inverse" logic for dark mode where foreground and background flip roles.

### Light Mode

| Token | Color | Usage |
|---|---|---|
| Surface | `bg-zinc-50` | Main page backgrounds |
| Inverse surface | `bg-zinc-900` | Branded/hero panels |
| Card / Input | `bg-white` | Elevated interactive elements |
| Primary text | `text-zinc-900` | Headings, main body |
| Secondary text | `text-zinc-500` | Subtitles, placeholders |
| Border | `border-zinc-200` | Input and card borders |
| Hover border | `hover:border-zinc-300` | Interactive hover states |

### Dark Mode

| Token | Color | Usage |
|---|---|---|
| Surface | `dark:bg-[#111113]` | Main page backgrounds |
| Inverse surface / Card | `dark:bg-[#1a1a1f]` | Branded hero panels, elevated interactive elements |
| Primary text | `dark:text-zinc-200` | Headings, main body |
| Secondary text | `dark:text-zinc-400` | Subtitles, placeholders |
| Border | `dark:border-white/[0.08]` | Input and card borders |
| Hover border | `dark:hover:border-white/[0.15]` | Interactive hover states |

### Primary Action (Buttons)

| State | Light | Dark |
|---|---|---|
| Background | `bg-zinc-900` | `dark:bg-white` |
| Text | `text-white` | `dark:text-black` |
| Border | `border-zinc-900` | `dark:border-white/[0.1]` |
| Hover | `hover:bg-transparent hover:text-zinc-900` | `dark:hover:text-zinc-100` |

---

## Typography

Fonts are currently loaded from `@fontsource-variable/geist`.

| Role | Font | Class |
|---|---|---|
| Body / UI | Geist Variable (fallback: Inter) | `font-sans` |
| Monospace / Code | JetBrains Mono | `font-mono` |

### Proposed Brand Personalities (Under Review)
To shift UICompiler's aesthetic away from standard SaaS to a more specialized identity, three typography directions are currently being evaluated:

1. **The Technical/Brutalist Look (Space Grotesk)**
   *Personality: Engineered, slightly retro-futuristic developer aesthetic.*
   ![Space Grotesk Font Preview](file:///home/anuj/.gemini/antigravity/brain/1884455b-0202-4ff4-a593-cbd814ef6395/font_spacegrotesk_1774745645890.png)

2. **The Premium/Apple Look (Plus Jakarta Sans)**
   *Personality: Extremely clean, geometric, and trustworthy enterprise SaaS.*
   ![Plus Jakarta Sans Font Preview](file:///home/anuj/.gemini/antigravity/brain/1884455b-0202-4ff4-a593-cbd814ef6395/font_plusjakartasans_1774745662718.png)

3. **The Modern Startup Look (Outfit)**
   *Personality: Bold, creative, dynamic AI tool.*
   ![Outfit Font Preview](file:///home/anuj/.gemini/antigravity/brain/1884455b-0202-4ff4-a593-cbd814ef6395/font_outfit_1774745683611.png)

### Text Scale

- **H1:** `text-4xl xl:text-5xl font-medium tracking-tight`
- **H2 / Page title:** `text-3xl font-semibold tracking-tight`
- **H3 / Card title:** `text-xl font-semibold tracking-tight`
- **Body:** `text-sm leading-relaxed`
- **Labels / Micro-copy:** `text-sm font-medium`
- **Tiny labels:** `text-[10px] font-bold uppercase tracking-widest`

---

## Shapes & Border Radii

The design enforces a strict, premium "brutalist" structure by avoiding soft corners on all main UI containers and elements. 

| Element | Radius |
|---|---|
| Main containers / cards | `rounded-none` |
| Inputs / buttons | `rounded-none` |
| Floating toolbars / tools | `rounded-none` or `rounded-full` (for specific circular tools) |

> All pages have been refactored to use `rounded-none` consistently across the entire dashboard to maintain a sharp, professional UX.

---

## Ambient Backgrounds

The application utilizes **Soft Gradient Orbs** rather than solid vectors or SVG path blocks for hero atmospheres.

- **Implementation:** Large, absolutely positioned `div` elements with varied, colorful backgrounds (e.g., `bg-indigo-500/5`, `bg-purple-500/5`), extreme `blur-[100px]`, and `rounded-full` classes.
- **Masking:** A `mask-image: linear-gradient(to bottom, black 40%, transparent 100%)` is applied to containers holding these orbs. This ensures that the colorful glow fades perfectly into the solid background without any harsh edges or visible block cutoffs.
- **Usage:** Found on the Home page Hero and Profile cover photo area.

---

## Spacing & Layout

- **Page wrapper:** `flex min-h-screen w-full`
- **Sidebar Integration:** All main dashboard pages (Home, Projects, SketchToUI, Profile) follow a consistent split layout: a fixed left Sidebar and a flexible main workspace area.
- **Form/content gaps:** `gap-6` between major sections, `gap-4` between related inputs
- **Large panels:** `p-8` or `p-12`
- **Standard cards:** `p-6`

---

## Motion & Transitions

Every element that changes color on theme toggle **must** include:

```
transition-colors duration-500
```

or for elements that also change borders/shadows:

```
transition-all duration-500
```

For interactive hover effects (button lifts), use `duration-200` or `duration-300` so they feel snappy.

---

## Component Patterns

### Input

```tsx
<input className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#09090B] border border-black/5 dark:border-white/[0.05] shadow-sm dark:shadow-none rounded-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 focus:border-transparent transition-all duration-500" />
```

### Primary Button

```tsx
<button className="py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-none font-semibold border border-zinc-900 dark:border-white/[0.1] hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 active:scale-[0.98]">
  Submit
</button>
```

### Secondary Button

```tsx
<button className="py-3.5 bg-transparent border border-zinc-200 dark:border-white/[0.05] text-zinc-900 dark:text-zinc-200 rounded-none font-semibold hover:border-zinc-900 dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.98]">
  Cancel
</button>
```

### Card

```tsx
<div className="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] rounded-none p-6 transition-all duration-500">
  ...
</div>
```

---

## CSS Custom Properties (`src/index.css`)

The app uses shadcn-compatible CSS variables for the component library:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --border: oklch(0.922 0 0);
  --radius: 0.625rem;
  /* ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

Custom brand tokens:
```css
@theme {
  --color-brand: #000000;
  --color-brand-foreground: #ffffff;
}
@theme dark {
  --color-brand: #ffffff;
  --color-brand-foreground: #000000;
}
```

---

## Text Selection

```
selection:bg-zinc-900 selection:text-white
dark:selection:bg-white/20 dark:selection:text-white
```
