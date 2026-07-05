# Front-End Design System: Neumorphism (Soft UI)

## Core Philosophy
All user interface elements must adhere strictly to Neumorphic (Soft UI) design principles. Elements must not look flat; they must appear to be extruded from or recessed into the background using dual-shadow techniques.

## 1. Color Palette & Backgrounds
* **The Background Rule**: The page background and the component surface background MUST use the exact same color code. Do not use pure white (#FFF) or pure black (#000).
* **Primary Light Mode Background**: `#e0e0e0` (or your chosen mid-tone hex code)
* **Text / Contrast Color**: Standard high-contrast text appropriate for the background (e.g., `#333333`).

## 2. The Box-Shadow Formula (The Shadow Core)
Every container, button, card, and input field must utilize dual box-shadows to establish depth. 
* **Extruded (Popping Out) Elements**: Require a light shadow on the top-left and a dark shadow on the bottom-right.
  * *CSS Standard Example*: `box-shadow: 9px 9px 16px #bebebe, -9px -9px 16px #ffffff;`
* **Recessed (Sunken/Pressed) Elements**: For active states, input fields, or toggled buttons, use the `inset` property.
  * *CSS Standard Example*: `box-shadow: inset 9px 9px 16px #bebebe, inset -9px -9px 16px #ffffff;`

## 3. Component Specifications
* **Border Radius**: Never use sharp corners. All neumorphic containers must use a smooth border-radius between `12px` and `24px` depending on size.
* **Borders**: Avoid solid, harsh borders. If a separator is needed, use a subtle 1px border matching the light shadow color, or a gradient stroke.
* **Buttons**: 
  * Default State: Extruded (Popping out).
  * Hover/Active State: Transition smoothly to Recessed (Pressed inset).
* **Form Inputs**: Always recessed (inset shadow) by default so the user intuitively knows they can type "into" the field.

## 4. Framework Enforcement
* If writing raw CSS/HTML: Implement the rules via standard class structures.
* If using Tailwind CSS: Utilize custom utility classes or explicit arbitrary values (e.g., `shadow-[9px_9px_16px_#bebebe,-9px_-9px_16px_#ffffff]`).
* If using a UI library: Modify the base theme/global CSS overrides to enforce these specific shadow configurations globally.
