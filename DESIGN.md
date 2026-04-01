# The Design System: Editorial Excellence for Specialty Coffee Management

## 1. Overview & Creative North Star: "The Digital Sommelier"
The Creative North Star for this design system is **"The Digital Sommelier."** This system moves away from the clinical, cold utility of standard SaaS and adopts the warm, authoritative, and tactile nature of high-end specialty coffee culture. It blends the structural precision of Linear.app with the organic, sensory elegance of a boutique café.

To break the "template" look, this system utilizes **Intentional Asymmetry**. Instead of rigid, centered grids, we use large editorial gutters and overlapping elements. Headers might be offset, and secondary information is often tucked into wide margins, creating a layout that feels curated like a premium lifestyle magazine rather than a data table.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in the "Deep Espresso" (`#1A1208`) and "Warm Amber" (`#C8864A`), creating a high-contrast, prestigious atmosphere.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Traditional lines create a "boxed-in" feel that contradicts the fluid, premium nature of the brand.
- **Boundaries:** Define sections solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background.
- **Surface Hierarchy & Nesting:** Use the surface-container tiers (`lowest` to `highest`) to create depth. Treat the UI as stacked sheets of fine, heavy-stock paper. An inner management module should be `surface-container-high` nested within a `surface-container` dashboard.

### The "Glass & Gradient" Rule
To elevate the experience, floating elements (modals, dropdowns) must use **Glassmorphism**.
- **Token Usage:** Use semi-transparent `surface` colors with a `backdrop-blur` of 12px–20px. 
- **Signature Textures:** Apply subtle linear gradients to main CTAs (transitioning from `primary` to `primary_container`). This prevents the UI from feeling "flat" and adds a liquid, amber-like glow that mimics the surface of a perfect pour-over.

---

## 3. Typography: Editorial Authority
The typography system balances the heritage of `Fraunces` (Serif) with the modern efficiency of `DM Sans` and `Inter`.

- **Display & Headlines (Fraunces):** Used for big, bold moments—page titles, high-level metrics, and welcoming messages. The soft curves of Fraunces convey "Warmth" and "Handcrafted Quality."
- **Titles & Body (DM Sans / Plus Jakarta Sans):** These provide the "Linear-like" functional clarity required for management tasks.
- **Labels (Inter / Berkeley Mono):** Use `Berkeley Mono` (25% weight) for technical data like SKU numbers, brew times, or temperatures to provide a "lab-certified" precision feel.

**Hierarchy Strategy:** 
- `display-lg`: 3.5rem (Fraunces) – For heroic impact.
- `title-md`: 1.125rem (DM Sans) – For interactive component labels.
- `label-sm`: 0.6875rem (Berkeley Mono) – For metadata and system status.

---

## 4. Elevation & Depth: Tonal Layering
We reject the use of heavy shadows and structural lines in favor of **Ambient Light**.

- **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` section creates a natural "lift" through color value alone.
- **Ambient Shadows:** If an element must float (e.g., a "New Order" popover), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0,0,0,0.08)`. The shadow color should never be pure black; it must be a dark tint of the `on-surface` color.
- **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use a **Ghost Border**: `outline-variant` token at 10% opacity. It should be felt, not seen.
- **Interaction Depth:** On hover, instead of a border change, increase the surface tier (e.g., moving from `surface-container` to `surface-container-high`) to "lift" the element toward the user.

---

## 5. Components

### Buttons & Interaction
- **Primary Button:** 24px radius (`xl`). Background: Amber Gradient (`primary` to `primary_container`). Text: `on_primary`. This is the "Hero" action.
- **Secondary Button:** 24px radius (`xl`). Background: `secondary_container`. No border.
- **Tertiary/Ghost:** No container. Use `primary` text color with a 2px underline that appears only on hover.

### Inputs & Fields
- **Text Inputs:** 8px radius (`md`). Background: `surface_container_highest`. 
- **Focus State:** No thick glowing ring. Use a subtle `outline` shift and a 1px "Ghost Border" at 40% opacity.
- **Checkboxes & Radios:** High-contrast `primary` fill when active. The unselected state should be a subtle `surface_variant` circle/square to keep the UI clean.

### Cards & Lists
- **Cards:** 10px radius (`DEFAULT`). **Strictly no dividers.** Use 32px (`8`) or 40px (`10`) vertical white space to separate content groups. 
- **List Items:** Use a 4px horizontal padding and a `surface_bright` background on hover to indicate interactivity.

### Specialty Components
- **The Brew Tracker:** A custom component using `Berkeley Mono` for time-tracking, styled with a semi-transparent `tertiary_container` background to highlight "active" brewing status.
- **Inventory Heatmap:** Using subtle tonal shifts from `surface_container_low` to `primary_container` to show stock levels without using "Red/Yellow/Green" traffic light patterns which break the premium aesthetic.

---

## 6. Do’s and Don’ts

### Do
- **Use "White Space" as a Separator:** Allow content to breathe. If a layout feels cluttered, increase the spacing scale rather than adding a line.
- **Embrace Asymmetry:** Offset your headlines. Align a piece of metadata to a different vertical axis than the body text to create a bespoke, editorial feel.
- **Prioritize Legibility:** While using `deep espresso` backgrounds, ensure `on_surface` text maintains high contrast for accessibility.

### Don’t
- **No 100% Opaque Borders:** Never use a solid, high-contrast border to separate modules.
- **No Standard Shadows:** Avoid "drop shadows" that look like 2000s web design. If it doesn't look like ambient light, don't use it.
- **No Default System Fonts:** Avoid San Francisco/Arial. Stick strictly to the defined `Fraunces` and `DM Sans` / `Inter` pairing to maintain the premium "Coffee House" identity.
- **No "Flat" Buttons:** Ensure primary actions have the subtle amber gradient to give them "soul."