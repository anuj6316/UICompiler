# Sculpted Playroom - Design & UI Guidelines

To maintain the "Sculpted Playroom" aesthetic across all current and future pages, follow these core design principles. This document works alongside the `color-scheme.md` to ensure a cohesive, premium feel.

## 1. Typography
The typography is clean, modern, and highly legible, relying on system sans-serif fonts (like Inter or SF Pro).

*   **Headings (H1, H2, H3):**
    *   Use medium to semibold weights: `font-medium` or `font-semibold`.
    *   Keep letter spacing tight for a premium feel: `tracking-tight`.
    *   Example: `<h1 className="text-4xl font-medium tracking-tight text-zinc-900 dark:text-white">`
*   **Body Text:**
    *   Use relaxed line heights for readability: `leading-relaxed`.
    *   Keep secondary text muted: `text-zinc-500 dark:text-zinc-400`.
*   **Labels & Micro-copy:**
    *   Use slightly smaller text with medium weight: `text-sm font-medium`.

## 2. Shapes & Border Radii
We use soft, friendly, but structured corners to create the "sculpted" feel. Avoid sharp corners.

*   **Main Containers / Cards:** `rounded-2xl` or `rounded-3xl`
*   **Inputs & Buttons:** `rounded-xl`
*   **Small Badges / Tags:** `rounded-lg` or `rounded-full`

## 3. Layout & Spacing
Generous whitespace is key to this design system. It prevents the UI from feeling cluttered.

*   **Page Wrappers:** Always ensure the root container fills the screen and handles the background transition.
    *   `className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-900 transition-colors duration-500"`
*   **Form/Content Gaps:** Use `gap-6` between major form sections and `gap-4` between closely related inputs.
*   **Padding:** Use `p-8` or `p-12` for large panels, and `p-6` for standard cards.

## 4. Components & Interactive States

### Inputs & Textareas
Inputs should feel tactile and slightly recessed or elevated depending on the background.
*   **Base:** `bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3.5`
*   **Focus State (Crucial):** Always include a high-contrast focus ring.
    *   `focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent`
*   **Transitions:** `transition-all duration-500`

### Buttons
Buttons should feel solid and satisfying to click.
*   **Primary Button:** `bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl py-3.5 font-medium`
*   **Hover State:** `hover:opacity-90 hover:shadow-md hover:-translate-y-0.5` (Subtle lift effect)
*   **Disabled State:** `disabled:opacity-50 disabled:cursor-not-allowed`

### Icons
*   **Library:** Always use `lucide-react`.
*   **Sizing:** Standardize on `w-5 h-5` for inline icons (inside inputs or buttons).
*   **Coloring:** Muted by default (`text-zinc-400`), but change to primary text color on focus/active states.

## 5. Animation & Motion
Motion should feel deliberate and smooth, never rushed.

*   **Theme Toggling:** As noted in the color scheme, **every** element that changes color must have `transition-colors duration-500` or `transition-all duration-500`.
*   **Hover Effects:** Keep hover transitions slightly faster if they involve movement (e.g., `duration-200` for a button lift), but keep color transitions at `duration-500` to sync with the dark mode toggle.
*   **State Changes:** When revealing new UI (like switching from Login to OTP), use subtle fade-ins or slide-ups (e.g., using Framer Motion or Tailwind's `animate-in fade-in slide-in-from-bottom-4`).

## 6. Split-Screen Layout Pattern (Desktops)
For landing, authentication, or onboarding pages, utilize the 50/50 split layout:
*   **Left Panel (Visual/Brand):** Fixed or sticky, uses the `inverse_surface` colors (`bg-zinc-900 dark:bg-zinc-50`), contains abstract imagery with blend modes (`mix-blend-luminosity`), and hero typography.
*   **Right Panel (Interactive):** Scrollable, uses the `surface_dim` colors (`bg-zinc-50 dark:bg-zinc-900`), centers the interactive forms or content with a `max-w-md` container.
