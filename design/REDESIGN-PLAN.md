# Freedom Green — redesign plan

25 Nov 2026. Based on a live render of all 22 pages at 390 px and 1280 px, screenshots of the six real templates, and the code in `assets/` and each page's `<style>` block. Method: `charles-design-laws` (steps 1–8), `charles-ux-animation` (questions 1–5), and `charles-hero-mockups` for the hero art direction.

**Keeps:** the brand palette (`--green-deep #3d5a1e`, `--green-main #87a946`, `--amber #f9cc3c`, `--red #d1302c`, charcoal, white, green-pale), Inter, static HTML/CSS/JS, the Shopify cart and EmailJS quote system.
**Changes:** what each colour is *for*, the layout of every template, the shared header/menu/footer, and the motion system.

---

## 1. The direction in one paragraph

The site is three shops in one (spare parts, boiler quotes, installer trade accounts) dressed as a brochure. Today the top task, ordering a part, sits three to four screens down. Half the links go to "Coming soon" pages or `#`. Every section repeats the same proof points, and amber is spread over a dozen things per view, so nothing leads. The redesign puts each page's one job in its first screen, then cuts every repeated section. It gives amber one job (the primary action) and red one job (heat, in the imagery), and rebuilds the layout on one grid with shared components. That fixes the orphan rows, the 14–16k px mobile pages and the dead ends in one pass.

---

## 2. Job, tasks, what's missing

**Job:** get UK homeowners, farms and businesses, and heating engineers to order genuine biomass parts, ask for a boiler quote, or open a trade account, trusting Freedom Green as Froling's authorised UK distributor.

**Tasks, most-used first** (there's no analytics, so every task is ranked from the product's core task):
1. Find and order a spare part by name, part number or boiler brand *(assumed: the top bar, the nav CTA and the live Shopify cart all point here)*
2. Get a quote or recommendation for a new boiler *(assumed)*
3. Phone or message the team *(assumed: the phone number appears 4+ times per page)*
4. Compare models and specs, and check grant eligibility *(assumed)*
5. Installers: open a trade account *(assumed)*
6. Business goal: newsletter sign-up (footer). It's kept, but never the thing that stands out.

**What's missing (every item is broken):**

| What | Where |
| --- | --- |
| 13 of 22 pages are "under construction", including **About, Installer Services and Contact Us** (3 of the 4 top-level nav links), plus Residential, Industrial, Log and SP Dual boilers, Smart Solar, Heat Pumps, Pyrolysis CHP, Brochures, and Binda and Other Brands parts | `about.html`, `contact.html`, … (`.under-construction`) |
| All 6 homepage product cards, all 3 category cards and "View Installer Programme" link to `#` | `index.html` (`href="#" class="product-card"`) |
| The nav search button has no handler: it does nothing | `assets/nav.js:75` |
| The newsletter form has no handler: Subscribe does nothing | footer on every page |
| Privacy, Terms and Cookies link to `#`, yet three forms collect personal data | footer |
| `installers.html`, the most finished page, is linked from nowhere | — |
| The Products dropdown opens on `:hover` only, so keyboard users can't open it and touch users at tablet widths struggle | `assets/style.css:254` |
| The mobile menu leaves out Binda, Other Brands, Brochures and Pyrolysis CHP, which the desktop menu has | `assets/nav.js:98-119` |

**Worst moment:** a homeowner taps **Contact Us** (or half the homepage products) and lands on *"This page is currently under construction."* Fix that before anything else.

---

## 3. Findings

Sorted by severity. Within a severity, the higher-ranked task comes first.

| Severity | Law / principle | Where | Before | After |
| --- | --- | --- | --- | --- |
| broken | Exits are inert while closed (ux-animation) | Cart + quote drawers, `style.css:1160` | Closed drawers sit at `translateX(100%)`, still visible, casting a `-8px 0 40px` shadow as a grey band down the right edge of **every page**, and keyboard focus can still reach them | Closed: `visibility:hidden` + `inert`, shadow only on `.open` |
| friction | Pareto principle | `spare-parts.html` | Catalogue search at **1,777 px** on desktop and **3,474 px** on mobile, under hero + trust bar + "Shop by brand" | Search and results directly under a compact hero; brands become filter chips above the results |
| friction | Pareto principle | Homepage hero | Two equal CTAs ("Explore Products", "Call"); the top task has no way in | A parts search field is the hero's primary action; "Get a free boiler quote →" is the secondary text link |
| friction | Recognition over recall | Parts search (both places) | Empty field: people must recall a part name or number | Opens on popular parts + brand chips; "Don't know the part? Send a photo" link |
| friction | Von Restorff effect | `spare-parts.html` | 9 amber fills in one view (header button, hero button, 6× "Add to Quote", …) | Amber on the one primary action per view; per-card buttons in the secondary style |
| friction | Von Restorff effect | Homepage hero | Amber badge dot + amber headline word + amber CTA + amber header button | Amber on the CTA only; the hero's accent comes from the image (§4.6) |
| friction | Serial position effect | Main nav (`nav.js:26-72`) | About first, Contact last, **Spare parts buried inside the Products dropdown** | `Boilers ▾ · Spare parts · Installers · About · Contact` + `Order parts` |
| friction | Serial position / Fitts's law | Mobile header + menu (`style.css:1144`, `nav.js:118`) | "Order Parts" is hidden from the mobile header and is the last of 17 menu items, below the fold | Pinned at the bottom of the menu sheet, in thumb reach |
| friction | Progressive disclosure | Mobile menu | One flat 1,017 px list, section labels at 11 px | Two levels: Boilers / Spare parts / Solar & heat pumps as accordions |
| friction | Progressive disclosure | Category + model FAQs (`wood-chip-boilers.html:422`) | Every answer open, in a column squeezed beside "Why us" | `<details>` accordions, full width, first one open |
| friction | Occam's razor | Every page's top bar (`nav.js:9-15`) | Three messages; on mobile it wraps to 3 lines (97 px) with stray `|` dividers | One line: "Order by 2pm for same-day dispatch" (the phone number stays in the header) |
| friction | Occam's razor | Home, categories, PE1, parts, brand pages | A "Why Freedom Green" section on nearly every page; the hero "At a glance" card repeats the hero chips | One shared proof strip, once per page; stats live in one place |
| friction | Occam's razor | Category + PE1 heroes | 1 eyebrow + 1 badge + 5–6 chips + 2 CTAs + stats card + phone card | Headline, one line of copy, ≤3 spec chips, one primary, phone as a text link |
| friction | Pareto principle | Mobile cards (home 430 px, parts 467 px each) | Full-width posters: homepage 10,170 px, wood chip 16,760 px, PE1 14,703 px, parts 13,806 px tall | Compact rows (88 px thumb, name, key spec, action); targets: home ≤6k, category ≤8k, parts ≤6k |
| friction | Cognitive load | Homepage product images | Wind turbines on *Wood Chip Boilers*, a circuit board on *Pyrolysis CHP*, solar panels on *Heat Pumps* and *Part Supplies*, a building site on *Residential* | Real product photos on one pale backdrop |
| friction | Cognitive load | Nav quote icon | Icon-only document glyph next to the cart; meaning unclear | Labelled "Quote" with a count, shown only once the quote holds items |
| friction | Law of proximity | Contact section (`index.html:311`) | Section header spans both columns, leaving a large empty gap above the form, and a 2× gap between heading and intro on mobile | Heading inside the left column, form top-aligned with it |
| friction | Law of similarity | Buttons, all pages | 5–8 button styles per page ("Add to Cart" green, "Add to Quote" amber, white, ghost-white, outline…) | Three roles only: primary (amber), secondary (deep-green outline), text link |
| friction | Parkinson's law | Enquiry forms on home + category pages | No `autocomplete` hints (0 on 5 inputs) | `name`, `email`, `tel`, `postal-code` hints; installers.html already does this |
| friction | Timing (ux-animation) | `--transition` (`style.css:32`), used by 29 rules | 300 ms Material curve on hover, colour, lifts and drawers alike | Named tokens: hover/colour 150 ms, press 120 ms, dropdown 200 ms, sheets 280 ms, exits 20–30% shorter |
| friction | Anticipation: hover only where it hovers | 12 `translateY(-…)` hover lifts, the image zoom, the amber glow | No `(hover:hover)` guard, so cards stay "lifted" after a tap on phones | Hover in `@media (hover:hover) and (pointer:fine)`; wide cards change border/background, not position; buttons `scale(.97)` on `:active` |
| friction | Jakob's law | Mobile menu | Esc doesn't close it; no focus trap; focus isn't returned | Esc closes, focus trapped while open, returned to the toggle |
| friction | Fitts's law / hit area | `.icon-btn` 36×36 (`style.css:138`); 30 controls under 40 px tall on mobile home | Small targets | 44×44 hit area via `::after`, visuals unchanged |
| friction | Reduced motion | Whole site | Only `installers.html` honours `prefers-reduced-motion` | One global block in `style.css` |
| polish | Law of Prägnanz | Grids | Orphan rows: `.products-grid` 6 in 4 cols, `.model-grid` 5 in 3, `.parts-grid` 6 in 5, `.parts-cat-grid` 9 in 5, trust bar 5 → 4 + 1 | Column counts that divide the item count (§4.2), lists for odd counts |
| polish | Law of Prägnanz | All pages | 60 font sizes, 5–10 corner radii per page, shadow-lg + lift + glow on hover | 9 type steps, 3 radii, one edge per card |
| polish | Law of similarity | Badges | Green, amber and outline badge styles on cards and in the mega menu | One badge style |
| polish | Occam's razor | Section heads | An uppercase eyebrow above every H2 | Cut. The H2 already says it |
| polish | Mobile menu motion | `.mobile-menu` | `transition: all` on a `display` toggle, so it snaps with no motion | Sheet slides from the right, 280 ms ease-out; backdrop fades on the same clock |

**Problems no law covers**
- **Contrast.** `#87a946` with white text (Add to Cart, Send Enquiry, `.btn-green`) is **2.7:1**, and `#87a946` text on white (section labels, "Find out more", breadcrumbs) is also 2.7:1. Both fail WCAG AA. Passing pairs: deep green on white 7.8:1, charcoal on amber 11.6:1, white on red 5.0:1. This drives the colour roles in §4.1.
- The PE1 spec table (7 models) scrolls sideways inside a 348 px box with no visible cue; only "PE1 7" shows.
- Inter loads 7 weights through a render-blocking `@import` (`style.css:5`).
- 39 hard-coded `max-width` containers, and page `<style>` blocks that re-declare shared rules and hard-code hexes (`#87a946` ×69, `#111827` ×52). Changing the palette today means editing 22 files.
- `product.html` has no `<h1>`.

---

## 4. The redesign

### 4.1 Colour roles (same hexes, one job each)

| Token | Hex | Job | Never |
| --- | --- | --- | --- |
| `--amber` | #f9cc3c | **The one action colour**: primary button fill, charcoal text (11.6:1). One per view | Headline words, badges, dots, per-card buttons |
| `--green-deep` | #3d5a1e | Brand surfaces (hero field, footer, bands), green text and links on light (7.8:1), secondary buttons | — |
| `--green-main` | #87a946 | Decoration only: icons, rules, logo, badge fills with deep-green text | Text on white, white text on it (2.7:1) |
| `--green-pale` | #eef5dd | Tinted sections, icon tiles, selected rows | — |
| `--red` | #d1302c | Heat in the imagery (flame, boiler paint); errors and out-of-stock in the UI | Buttons |
| `--charcoal` / `--slate` / `--muted` | #111827 / #374151 / #6b7280 | Text | — |

Drop `--green-mid` and `--green-light`; nothing needs them. Move the footer from `#111827` to `--green-deep` so the brand owns the bottom of every page. The hero-mockup palette check shows why this matters. The current hero pairs amber with deep green: only **41°** apart on the colour wheel, with a field almost as loud as the accent, so it reads as a shade, not a highlight. Red on deep green is **104°** apart and passes. So in heroes, red (in the image) carries the drama and amber carries the click.

### 4.2 Type, space, grid

- **Type:** Inter only, 4 weights (400/500/600/800) via `<link rel="preload">` instead of `@import`. Nine steps: 12 (legal) · 14 · 16 (body) · 18 · 22 · 28 · 36 · 48 · `clamp(40px, 6vw, 72px)` (display).
- **Space:** a 4 px base (4, 8, 12, 16, 24, 32, 48, 64, 96). Sections run 96 px desktop / 56 px mobile. The gap between groups is always at least 2× the gap inside one.
- **Radii:** three: 8 (controls), 16 (cards), 999 (chips only).
- **Container:** one `.container { max-width: 1200px; margin-inline: auto; padding-inline: clamp(16px, 4vw, 40px) }` replaces the 39 hard-coded ones.
- **Grids that never orphan:** pick the column count from the item count, not from `auto-fill`: 6 → 3×2 (2×3 on tablet), 9 → 3×3, 4 → 4 or 2×2. Odd counts (5 models) become a list or a comparison table. Mobile: cards become compact rows, or a horizontal `scroll-snap` row when browsing beats comparing.

### 4.3 Shared chrome (built once in `nav.js` / `style.css`)

- **Top bar:** one line, "Order by 2pm for same-day dispatch". Hidden on the parts checkout path once the cart is open.
- **Header:** logo · `Boilers ▾` · `Spare parts` · `Installers` · `About` · `Contact` · search · cart (+ "Quote" once used) · **Order parts** (amber). The dropdown opens on click, tap and focus; Esc and an outside click close it.
- **Search:** opens an inline field and routes to `spare-parts.html?q=…`. The catalogue already filters, so search reads `q` on load.
- **Mobile menu:** a full-height sheet built **from the same link array as the desktop menu**, so they can't drift apart. Two-level accordions, Order parts pinned to the bottom, Esc / focus trap / focus return.
- **Drawers:** cart and quote use the same sheet component and motion tokens as the menu; inert and shadowless while closed.
- **Footer:** deep green; real Privacy, Terms and Cookies pages; the newsletter either works (EmailJS, which is already loaded) or is removed. A button that does nothing costs more trust than no button.

### 4.4 Page templates

**Home (`index.html`)**: one job: send each visitor down their route.
1. Hero: headline, one line, **parts search field + amber "Find part"**, then "Get a free boiler quote →" as a text link. Below it, three proof points on one line (12+ years · 500+ installs · 5★). These stay visible on mobile; today `.hero-card` is `display:none` under 900 px (`style.css:1094`).
2. Three route tiles: *I need a part* · *I want a new boiler* · *I'm an installer* (→ `installers.html`).
3. One product grid, 9 items in 3×3. The "Explore further" categories fold in here. Real photos, one badge style, real links.
4. Proof strip (merges the trust bar and "Why choose us").
5. Contact: heading in the left column, form on the right, success state in place.
6. Footer.

**Category (`wood-chip-boilers.html`, `pellet-boilers.html`)**: job: pick a model and ask for a quote.
Hero (≤3 spec chips, amber "Get a free quote", phone as a text link) → **model list**: one row per model with image, name, kW range, 3 specs and "View model", or a comparison table on desktop. This replaces the 3-col grid with its 2-card orphan row and the five "Enquire About the …" buttons. Then technology (2-col text/image) → FAQ accordions → one enquiry form, with the model prefilled from the row people came from.

**Model (`pe1-pellet-boiler.html`)**: job: confirm the spec, ask for a quote.
On mobile the product photo and primary CTA sit in the first screen; today the CTA is below 5 chips, past 813 px of hero. Spec table: a sticky first column with a visible edge shadow, plus a model switcher (`PE1 7 · 10 · 15 · 20 · 25 · 30 · 35`) on mobile so one column shows at a time. Then optional modules → FAQ accordions → form.

**Parts catalogue (`spare-parts*.html`)**: job: find the part and buy it.
A compact hero (≤50vh) leads straight into search + brand chips + results. Part card: image, name, price, stock; **one** action (`Add to basket` in the secondary style; out of stock turns it into `Add to quote`). Mobile rows are about 140 px instead of 467. After the results: "Can't find it? Send a photo", the three-step process, then FAQ. The Froling and Herz brand pages reuse this template with the brand chip preselected. The 9-item category grid becomes 3×3.

**Installers (`installers.html`)**: already the strongest page (qualifier-first 2-step form, autofill hints, reduced motion). It becomes the reference for tone and form design. Link it from the nav and from the homepage route tile, and retire the `installer-services.html` placeholder.

**Placeholders (13 pages)**: no dead ends. Build Contact (the homepage contact block moves here) and About (the "Why" content moves here). Each product placeholder becomes a short real page: hero, 3 key facts, brochure link, enquiry form. Until then, take it out of the nav.

### 4.5 Motion spec

Tokens in `:root`. Every rule uses them; nothing uses a bare duration.

```css
--dur-press: 120ms;  --dur-hover: 150ms;  --dur-pop: 200ms;  --dur-sheet: 280ms;
--ease-out: cubic-bezier(0.32, 0.72, 0, 1);   /* entrances */
--ease-in: cubic-bezier(0.55, 0, 1, 0.45);    /* exits, at ~70% of the entrance */
--ease-move: cubic-bezier(0.77, 0, 0.175, 1); /* moves/resizes on screen */
```

| Interaction | Motion |
| --- | --- |
| Button press | `scale(.97)` on `:active`, `--dur-hover --ease-out`; no lift, no glow |
| Card hover (pointer only) | Border goes to `--green-main` and background to `--green-pale` in 150 ms; no translate or zoom |
| Products dropdown | opacity + `translateY(-4px) scale(.98)` → rest, 200 ms ease-out, origin at the trigger; exit 140 ms ease-in |
| Mobile menu / cart / quote sheet | Slides from the right, 280 ms ease-out, backdrop fades on the same clock; exit 200 ms ease-in; inert while closed |
| Add to basket | Optimistic: the badge count bumps (1 → 1.15 → 1, 200 ms) on the same frame; the button label cross-fades to "Added ✓" for 1.5 s; spinner only after 300 ms |
| FAQ accordion | `grid-template-rows: 0fr → 1fr`, 250 ms `--ease-move`; chevron rotates on the same clock |
| Form submit | Button disabled at once, "Sending…" after 300 ms, held ≥500 ms; on success the form is replaced in place by a confirmation naming the person and the next step ("Thanks, Sam — we'll call 07700 900000 within one working day"); on error every field keeps its value |
| Page load | No entrance animations (there are none today; keep it that way) |
| Reduced motion | One global block turns transitions and animations off, spinners excepted |

### 4.6 Hero direction (`charles-hero-mockups`)

Four art directions, one per key template. All pass the skill's palette and spread checks (`set ok`). Each runs five variations, 20 renders in all.

| Page | Layout | Subject and light | Palette (field / type / accent) | Headline |
| --- | --- | --- | --- | --- |
| Home | macro | A boiler's round inspection window, pellet flame behind the glass; the flame is the only light, raking across green steel | deep green / cream / **red** | Sustainable *heating* |
| Spare parts | word-behind | One glowing ceramic igniter standing in front of the I of a giant GENUINE, braided cable sweeping off-frame | charcoal / white / **amber** | GENUINE |
| Wood chip | left-headline | A red commercial boiler front with wood chips pouring from the chute through god rays | ivory / deep green / **red** | Heat the whole *farm* |
| Installers | split | A heating engineer in an amber hi-vis jacket between two gels, between the words | charcoal / white / **amber** | Trade *prices* |

The brief lives in `design/hero-mockups/concepts.json`, and the renders go to `design/hero-mockups/out/` (git-ignored). The mockups set art direction: subject, crop, light. In the build, the headline and buttons stay live HTML over the chosen image (or a real photo shot to the same brief), and the hero button turns amber per §4.1.

To render (needs an OpenAI key; about $0.05 a render, about $1 for all 20):

```bash
python3 -I ~/.claude/skills/charles-hero-mockups/scripts/heroes.py render --project design/hero-mockups
python3 -I ~/.claude/skills/charles-hero-mockups/scripts/heroes.py check --project design/hero-mockups
python3 -I ~/.claude/skills/charles-hero-mockups/scripts/heroes.py board --project design/hero-mockups
```

For closer results, drop 4 cropped hero screenshots you like into `design/hero-mockups/out/refs/` and add a `ref` to each concept.

---

## 5. Build order

Each phase ships on its own and leaves the site better than it found it.

| Phase | Scope | Done when |
| --- | --- | --- |
| **0. Foundations** | `style.css` tokens (colour roles, type, space, radii, motion), `.container`, global reduced-motion, focus ring in `--green-deep`, hover media guard; drawer fix; dropdown on click/focus; menu sheet built from one link array; one-line top bar | No grey band on the right edge of any page; Products opens from the keyboard; Esc closes every layer; no white-on-`#87a946` text. **Done 25 Nov 2026.** The type and space tokens are defined, but moving pages onto them (≤9 sizes) is in Phase 2, because most sizes live in the per-page `<style>` blocks. The top bar kept the phone number, since the header has no phone. |
| **1. No dead ends** | Real Contact and About; nav "Installers" → `installers.html`; homepage cards and tiles linked; placeholders out of the nav or made into short pages; search works; newsletter works or goes; Privacy, Terms and Cookies pages | A link crawl finds zero `href="#"` and zero nav links to `.under-construction` |
| **2. Shared components** | Button set, card + row, badge, section head, proof strip, FAQ accordion, enquiry form with autofill hints and success state, part card; per-page `<style>` blocks and inline `style=""` replaced by shared classes | Every page's `<style>` block is gone or page-specific only; no hard-coded brand hexes outside `:root` |
| **3. Templates** | Home → Parts catalogue (+ brand pages) → Category (wood chip, pellet) → Model (PE1) → Installers header alignment | First screen holds each page's primary action at 390 px; no orphan rows; mobile heights at or under the targets in §3 |
| **4. Hero art** | Render, review and fix the four concepts; pick one per page; build each hero as HTML over the image | Each hero passes the five-second look: job and one action nameable |
| **5. Verify** | The checks in §6, on the built site | All pass, or each failure is logged |

---

## 6. Checks

**Ran:**
- Rendered all 22 pages at 390 and 1280 px and measured overflow, orphan grid rows, controls under 40 px, text under 12 px, amber fills and button styles.
- Screenshots of Home, Spare parts, Wood chip, PE1 and Installers at both widths.
- Opened the mobile menu and pressed Esc (it stayed open).
- Read the code for the search, newsletter, dropdown and drawer behaviour.
- Computed contrast for the brand pairs.
- Ran the hero palette checks (`set ok`, and the current pairing measured at 41°).

**Couldn't run:**
- **Usage data:** there's none, so the task ranking is assumed. A month of Shopify and form analytics would confirm parts-first.
- **Shopify checkout and EmailJS submit:** not exercised. A real submit would send a real email, so success and error states are specified rather than reviewed.
- **Tablet (768–1024 px) by touch:** the hover-only dropdown problem there is read from code, not tested.
- **Slow network and reduced motion:** only checked by reading the CSS.
- **Hero renders:** not run, because there's no `OPENAI_API_KEY` in this environment. The 20 prompts are written and dry-run clean.
- **Leave and return:** not applicable until the forms save progress (the installer form is the candidate).
