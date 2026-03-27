# Sculpted Playroom - Theme & Color Scheme Guide

The "Sculpted Playroom" aesthetic relies on a high-contrast, monochrome palette using Tailwind's **Zinc** color scale. It creates depth through subtle off-whites and rich dark grays, and uses a striking "inverse" logic when toggling between light and dark modes.

Here is the exact color scheme and the Tailwind classes you should use to build new pages that match perfectly:

## 1. Main Backgrounds (Surface Dim)
Used for the main application background (like the right-side form panel).
*   **Light Mode:** `bg-zinc-50`
*   **Dark Mode:** `dark:bg-zinc-900`
*   *Combined Class:* `bg-zinc-50 dark:bg-zinc-900`

## 2. Inverse Backgrounds (Inverse Surface)
Used for high-emphasis areas (like the left branding panel) or elements that need to stand out dramatically.
*   **Light Mode:** `bg-zinc-900`
*   **Dark Mode:** `dark:bg-zinc-50`
*   *Combined Class:* `bg-zinc-900 dark:bg-zinc-50`

## 3. Text Colors (Foreground)
*   **Primary Text** (Headings, main body text):
    *   *Class:* `text-zinc-900 dark:text-zinc-100` (or `dark:text-white`)
*   **Secondary Text** (Subtitles, placeholders, helper text):
    *   *Class:* `text-zinc-500 dark:text-zinc-400`
*   **Inverse Text** (Text sitting on top of an Inverse Background):
    *   *Class:* `text-white dark:text-zinc-900`

## 4. Interactive Elements (Inputs, Cards, Panels)
Used for elements sitting on top of the main background to give them a slight "lift".
*   **Background:** `bg-white dark:bg-zinc-900`
*   **Borders:** `border-zinc-200 dark:border-zinc-800`
*   **Hover States (Borders):** `hover:border-zinc-300 dark:hover:border-zinc-700`
*   **Focus Rings:** `focus:ring-zinc-900 dark:focus:ring-zinc-100`

## 5. Primary Action Buttons
We use a subtle gradient to give primary buttons a premium, tactile feel.
*   **Background:** `bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300`
*   **Text:** `text-white dark:text-zinc-900`
*   **Hover State:** `hover:opacity-90 hover:shadow-lg`

## 6. Text Selection (Highlighting)
To keep the theme cohesive when a user highlights text with their mouse:
*   *Class:* `selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900`

## 💡 The Golden Rule for this Theme: Transitions
To ensure the dark mode toggle feels smooth and expensive, **every single element** that changes color must have this transition class applied to it:
*   *Class:* `transition-colors duration-500` (or `transition-all duration-500` if borders/shadows are also changing).

## Example: A Standard Card Component
If you want to build a new card component on a new page, it would look like this:

```tsx
<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 transition-all duration-500">
  <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold transition-colors duration-500">
    Card Title
  </h3>
  <p className="text-zinc-500 dark:text-zinc-400 mt-2 transition-colors duration-500">
    This is some secondary text inside the card.
  </p>
</div>
```
