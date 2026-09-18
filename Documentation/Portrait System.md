# Unified Resident Portrait System

## Status

This document is the canonical portrait-system design after Portrait Generator V8.4.

The current `main` branch already contains the V8.4 simplified prototype. The next task is to make that design the **only runtime portrait system** used by the resident simulator, then remove the older experimental portrait stacks.

## Cleanup progress — 2026-09-18

Completed on the cleanup branch:

- V8.4 is already merged into `main`.
- The new canonical Web module is now `Web/src/resident/portrait/`.
- Experimental `portrait-generator-v8` naming has been removed from the cleanup branch.
- The multiple portrait lab routes now point to one `PortraitLab` workbench.
- Historical V2 / V7 / V8 portrait screenshot jobs have been replaced by one unified portrait review script.
- Resident UI screenshots and portrait screenshots are now separate responsibilities.
- Build and the simplified visual-review workflow both pass.

Runtime migration progress:

- The live `ResidentAvatar` now renders through `Web/src/resident/portrait/PortraitRenderer.tsx`.
- Minimal male FaceFamily / HairStyle coverage has been added so generated male residents no longer require the legacy renderer.
- Live ResidentAvatar review now explicitly asserts render contract 8.4.
- `ResidentAvatarArtV1.tsx`, `ResidentAvatarArtV2.tsx`, `portrait-rig.ts`, `portrait-art-v2.ts`, and `portrait-woodblock-v7.tsx` have been removed from the migration branch.
- Build passes after removing the legacy Web renderer stack.

Snapshot/compiler migration progress:

- Final resident snapshots now use `wanhu.resident-snapshot.v4`.
- Residents store compact `ResidentPortraitDNA`: FaceFamily / HairStyle / OutfitStyle / skin palette / base hair color.
- The old `appearance` payload and `portraitSeed` are removed from final resident records.
- `Tools/ResidentPortraitCompiler/` now performs deterministic seeded portrait selection.
- The live ResidentAvatar consumes these saved stable IDs.
- The old `ResidentAppearanceCompiler` has been removed.

Still intentionally retained for the next cleanup phase:

- `Content/Appearance/`
- `Schemas/appearance.schema.json`
- appearance-catalog generation inside ContentContractCompiler / WebContentCompiler

These are now build-time legacy only; neither the live portrait renderer nor the final resident snapshot depends on them.

The portrait is a secondary game system. The priority order is:

1. The player can recognize the resident.
2. Age reads clearly.
3. Hair can be changed.
4. Clothing can be changed.
5. Art quality is easy to iterate.
6. Architecture stays small.

The portrait system is **not** a character creator and should not become one.

---

## Target architecture

~~~text
ResidentRecord
  ↓
ResidentPortraitDNA
  ↓
FaceFamily + LifeStage
HairStyle
OutfitStyle
Skin / Hair Palette
  ↓
Simple RenderPlan
  ↓
PortraitRenderer
~~~

No runtime facial morph stack.

No hair anchor system.

No hair mask system.

No accessory system.

No population-diversity controller.

No general compatibility engine.

---

## Runtime identity

The stable portrait identity should eventually contain only:

~~~text
faceFamilyId
skinPaletteId
baseHairColorId
~~~

Presentation contains only:

~~~text
hairStyleId
outfitStyleId
~~~

Hair gray / salt-pepper state is derived from life stage unless the game later introduces explicit hair dye.

The player may change `hairStyleId` and `outfitStyleId` without changing identity.

---

## FaceFamily

Face variety is preserved as discrete art.

Initial target:

- soft oval
- round soft
- long narrow
- broad cheek
- soft square
- narrow chin

Each FaceFamily owns direct age variants:

~~~text
child
youth
adult
elder
~~~

Middle age may reuse the adult base with a small amount of direct age-detail art.

A resident keeps the same `faceFamilyId` for life.

Do not reintroduce continuous faceWidth / noseLength / featureSpan runtime morphs unless there is a demonstrated gameplay requirement.

---

## HairStyle

Hair is final-canvas art.

Each HairStyle contains only:

~~~text
id
allowedLifeStages
backLayer
frontLayer
weight
~~~

The art is drawn directly in portrait canvas coordinates.

Do not add:

- HeadProfile anchors
- bunLow / skullTop placement
- placementByHeadProfile
- inside-skull clipping
- outside-face masks
- accessory slots
- hair-specific LOD topology

If the same conceptual hairstyle needs a different silhouette for another age group, create another art asset.

Asset duplication is acceptable when it improves visual control.

---

## OutfitStyle

Outfit is a stable presentation ID.

Wealth affects the **initial default selection only**.

After generation, the player can change clothing directly.

No general compatibility graph is required.

A small set of high-quality silhouettes is preferred over dozens of parameterized variations.

Initial target:

- rough work clothes
- plain cross-collar
- layered cross-collar
- comfortable / merchant clothing
- refined clothing
- elder high-collar variant where visually useful

---

## Accessory policy

Portrait accessories are disabled for the first unified version.

This includes:

- hairpins
- jade pins
- cords
- ribbons
- hats
- headwear
- generic accessory slots

They can return later only if gameplay or art direction clearly justifies the maintenance cost.

---

## LOD policy

96 / 64 / 48 use the same primary SVG/vector silhouette.

Small sizes are ordinary renderer scaling.

Optional fine detail may be hidden later, but primary geometry must not have separate placement logic.

---

## Seed policy

Deterministic seed remains useful and cheap.

A resident seed determines the initial:

- FaceFamily
- skin palette
- base hair color
- default HairStyle
- default OutfitStyle

The resolved stable IDs should be saved.

Do not use recent-neighbor state or population order to change results.

---

# Repository consolidation plan

## Current problem

The repository currently contains several historical portrait systems at the same time.

Examples:

~~~text
Web/src/PortraitArtLab.tsx
Web/src/PortraitIdentityLab.tsx
Web/src/PortraitLab.tsx
Web/src/PortraitStyleLab.tsx
Web/src/PortraitV8Lab.tsx

Web/src/resident/portrait-art-v2.ts
Web/src/resident/portrait-rig.ts
Web/src/resident/portrait-woodblock-v7.tsx
Web/src/resident/portrait-generator-v8/
~~~

There are also multiple historical documents and screenshot scripts.

The old code cannot all be deleted immediately because the current game runtime still uses it.

## Current runtime dependency discovered during cleanup

The actual game path is currently:

~~~text
App.tsx
  ↓
ResidentAvatar.tsx
  ↓
ResidentAvatarArtV2.tsx
  ↓
portrait-rig.ts
portrait-art-v2.ts
~~~

The content build also still runs:

~~~text
Tools/ResidentAppearanceCompiler/compile.mjs
~~~

and the snapshot still stores the old `ResidentAppearanceDNA` fields:

~~~text
faceId
hairId
browId
facialHairId
headwearId
outfitId
skinPaletteId
hairPaletteId
clothingPaletteId
~~~

Therefore legacy deletion must happen **after runtime migration**, not before.

---

# Migration phases

## Phase 0 — completed

- Merge V8.4 simplified portrait prototype into `main`.
- Preserve the local launcher commit already on `main`.
- Confirm Build and Visual Review pass.

## Phase 1 — create one canonical code module

Create:

~~~text
Web/src/resident/portrait/
  types.ts
  catalog.ts
  resolver.ts
  render-plan.ts
  PortraitRenderer.tsx
  seed.ts
  index.ts
~~~

Move the V8.4 implementation into this directory.

Names should no longer contain `v7`, `v8`, `art-v2`, or `generator-v8`.

The system becomes the normal resident portrait implementation rather than an experiment.

## Phase 2 — migrate the real ResidentAvatar — completed on runtime-migration branch

Replace:

~~~text
ResidentAvatar
  → ResidentAvatarArtV2
~~~

with:

~~~text
ResidentAvatar
  → portrait/PortraitRenderer
~~~

Before this switch, the unified system must support every gender used by generated residents.

The first V8.4 art pass currently focuses on female assets, so a **minimal male art set** must be added before the old renderer is removed.

Recommended minimal male coverage:

- 4–6 FaceFamily art families
- child / youth / adult / elder age variants
- 2–3 simple male hair styles per broad age range
- the same shared OutfitStyle system

Do not rebuild the old beard / headwear / rig complexity during this step.

## Phase 3 — simplify snapshot appearance data — completed on runtime-migration branch

Replace the old `ResidentAppearanceDNA` with a compact `ResidentPortraitDNA`:

~~~text
faceFamilyId
hairStyleId
outfitStyleId
skinPaletteId
baseHairColorId
~~~

Optional future fields should only be added when a real gameplay feature requires them.

Update the snapshot schema in one migration.

## Phase 4 — replace the appearance compiler — compiler replaced; old content contract cleanup remains

Current compiler complexity includes:

- face-family compatibility weighting
- recent silhouette tracking
- headwear visibility
- brow selection
- facial-hair selection
- presentation-style filtering
- rig validation

Replace it with a small portrait compiler that performs deterministic seeded selection and outputs stable IDs.

Recommended canonical authoring data:

~~~text
Content/Portrait/portrait-catalog.json
~~~

It should contain only metadata needed by the compiler:

- FaceFamily IDs
- HairStyle IDs + allowed stages + weights
- OutfitStyle IDs + initial wealth weights
- palette IDs

The Web renderer keeps vector geometry in the portrait art catalog.

## Phase 5 — delete legacy runtime portrait stacks

After the actual game uses the unified renderer, remove:

~~~text
Web/src/resident/ResidentAvatarArtV2.tsx
Web/src/resident/portrait-art-v2.ts
Web/src/resident/portrait-rig.ts
Web/src/resident/portrait-woodblock-v7.tsx

Tools/ResidentAppearanceCompiler/
Content/Appearance/
Schemas/appearance.schema.json
~~~

Only delete these after the new snapshot compiler and runtime path are working.

## Phase 6 — delete historical labs

Replace multiple portrait routes with a single editor/review view:

~~~text
/?view=portraits
~~~

Recommended unified tool:

~~~text
PortraitLab
  - FaceFamily selector
  - life-stage selector
  - HairStyle selector
  - OutfitStyle selector
  - skin palette selector
  - 96 / 64 / 48 preview
  - life-stage strip
  - crowd preview
~~~

Then remove historical labs and their CSS:

~~~text
PortraitArtLab
PortraitIdentityLab
PortraitStyleLab
old PortraitLab
PortraitV8Lab
~~~

The new lab should be an art-production tool, not an algorithm diagnostics dashboard.

## Phase 7 — remove historical screenshot pipelines

Keep only:

- resident UI review
- unified portrait review

Delete the old V2 / V7 / V8 screenshot and quality scripts after the unified review covers their necessary cases.

The visual-review workflow should become much shorter and faster.

## Phase 8 — archive or delete historical documents

The canonical design is this document.

Historical V1 / V2 / V7 / V8 documents may be moved to:

~~~text
Documentation/Archive/Portrait/
~~~

or deleted if Git history is considered sufficient.

They must not look like active design requirements.

---

# Art production priorities after cleanup

1. Make the six FaceFamily silhouettes clearly different.
2. Produce good age variants for each family.
3. Build 2–3 good HairStyles per major age band.
4. Build 5–6 good OutfitStyles.
5. Add minimal male coverage.
6. Review 48px readability.
7. Review a 24–64 resident crowd.

Do not add new architecture to solve an art-quality problem.

---

# Definition of done

The portrait cleanup is complete when:

- the game runtime uses only `Web/src/resident/portrait/`;
- `ResidentAvatarArtV2` is gone;
- old rig / woodblock / V8 experimental runtime files are gone;
- the old appearance compiler and schema are gone;
- the snapshot stores only compact stable portrait IDs;
- only one portrait lab exists;
- only one portrait screenshot pipeline exists;
- changing hair or clothing is a simple ID update;
- face identity survives age changes;
- 48px portraits remain readable;
- art iteration does not require debugging anchors or masks.

Final principle:

> **The portrait system should be boring code around good art.**
