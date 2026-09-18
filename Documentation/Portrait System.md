# Resident Portrait Frame System

## Status

This is the canonical portrait design after the 2026-09-19 simplification decision.

The Web runtime now uses the final fixed-frame portrait path. Legacy V8 stage profiles, shared feature layers, stage bodies and migration-only render branches have been removed. The remaining system is a small **dress-up style portrait framework** intended to be frozen and handed to Unity.

The portrait remains a secondary game system. The priority is:

1. one resident is visually recognizable;
2. child / adult / elder read immediately;
3. one face can use several hairstyles and outfits;
4. assets never drift because every part obeys a fixed frame;
5. the Unity handoff remains small.

The system is not a general character creator.

---

## Core decision

The portrait is modular, but not free-form.

~~~text
ResidentPortraitDNA
├─ faceFamilyId
├─ hairStyleId
├─ outfitStyleId
├─ skinPaletteId
└─ baseHairColorId
        ↓
Gender + AgeBand
        ↓
PortraitFrame
        ↓
FaceFamily art
HairStyle art
OutfitStyle art
        ↓
PortraitRenderer
~~~

A face can pair with many hairstyles and many outfits **inside the same frame contract**.

There is no runtime auto-fitting system.

---

## Three age bands

Portrait art only recognizes three visual age bands:

~~~text
child
adult
elder
~~~

Gameplay life stages map to them:

~~~text
child / teen                     → child
young-adult / adult / middle-age → adult
elder                            → elder
~~~

Gameplay may continue to distinguish teen, young-adult and middle-age for stories and simulation. Portrait art does not need separate geometry for them.

---

## Six fixed frames

Gender and age band produce exactly six authoring frames:

~~~text
female.child
female.adult
female.elder
male.child
male.adult
male.elder
~~~

Every swappable portrait asset declares which frame or frames it was authored for.

A frame is an **authoring specification**, not a runtime anchor solver.

It fixes:

- canvas and crop;
- head center and usable face bounds;
- neck root;
- shoulder / collar region;
- allowed hair silhouette area;
- draw order.

Assets that do not fit the frame are rejected or redrawn. The runtime never moves them into place.

---

## Fixed canvas and crop

New assets use one shared coordinate system:

~~~text
master canvas: 120 × 150
square UI crop: x=0, y=15, width=120, height=120
center line: x=60
~~~

The viewBox must not change per resident, FaceFamily, hairstyle or outfit.

All six PortraitFrames now use this same fixed viewBox. There is no stage-specific viewBox path in the active runtime.

Recommended authoring guide ranges:

| Age band | Head top | Chin | Neck root | Main shoulder region |
| --- | ---: | ---: | ---: | ---: |
| child | 28–32 | 82–86 | 80–92 | 92–104 |
| adult | 22–26 | 90–96 | 86–100 | 96–112 |
| elder | 26–30 | 92–98 | 90–102 | 100–114 |

These are art guides. They are not runtime parameters and are not stored per resident.

---

## FaceFamily

FaceFamily is the stable identity.

A FaceFamily owns three direct art variants:

~~~text
child
adult
elder
~~~

The resident keeps the same `faceFamilyId` for life.

Each variant must already fit its frame. The renderer must not apply face offsets, per-face scale, feature-span morphs, or per-hair/per-outfit corrections.

Variation comes from authored silhouettes and features, not runtime deformation.

---

## HairStyle

Hair is swappable presentation art.

A hairstyle contains:

~~~text
id
allowedFrameIds
backLayer
frontLayer
weight
~~~

Hair is drawn directly in final portrait coordinates.

A hairstyle can support several frames only when art has been explicitly authored for those frames. It is never stretched or translated automatically.

No HeadProfile, hair anchors, placement offsets, skull masks, accessory slots, or compatibility weighting graph.

If a hairstyle does not fit a frame, make a separate asset or do not allow the combination.

---

## OutfitStyle

Outfit is also swappable presentation art.

The target outfit asset owns the visible clothing geometry:

- collar;
- shoulder silhouette;
- upper chest;
- decorative seam / trim where useful.

The fixed frame owns only the neutral body / neck guide needed for assembly.

This removes the current problem where a stage body and an unrelated outfit overlay can look shifted relative to each other.

An outfit contains:

~~~text
id
allowedFrameIds
initialWealthTiers
layerAssetIds
weight
~~~

Wealth only influences the **initial default choice**. After generation, clothing is just a saved style ID.

Occupation does not choose clothing.

---

## Compatibility rule

There is one hard compatibility rule:

> **Face, Hair and Outfit must resolve to the same PortraitFrame.**

That is enough for the first Unity-ready version.

Do not add a general compatibility engine. In particular, do not reintroduce preferred face families, arbitrary offset tables, automatic head fitting, or population-neighbor diversity state.

Art problems are fixed in art.

---

## Draw order

The intended simple layer stack is:

~~~text
Background
Back Hair
Neck
Outfit
Face
Front Hair
~~~

Accessories, hats, beard systems and generic overlay slots are out of scope for the first frozen version.

---

## Catalog ownership

There are now two deliberately different data sources:

~~~text
Content/Portrait/portrait-catalog.json
= gameplay/content metadata authority
  Stable ID / gender / Frame compatibility / initial wealth fit / weight

Web/src/resident/portrait/assets/art-manifest.json
= Web art mapping only
  label / Face age layer IDs / Hair front+back layer IDs / Outfit layer IDs / Frame neck art
~~~

`Tools/PortraitCatalogAudit` runs during `build-content` and rejects mismatched IDs, missing Frame coverage, missing referenced layers, duplicate layers and unreferenced vector layers.

The actual vector geometry is split into:

~~~text
assets/faces.ts
assets/hair.ts
assets/outfits.ts
assets/necks.ts
~~~

`catalog.ts` only joins the generated mirror of the Content metadata with Web art and provides lookup maps. Web runtime code does not import `Content/` directly.

## Stable data

The Web snapshot already stores the correct compact payload:

~~~text
ResidentPortraitDNA
├─ faceFamilyId
├─ hairStyleId
├─ outfitStyleId
├─ skinPaletteId
└─ baseHairColorId
~~~

Keep it.

`ageBand` and `frameId` are derived from gender and current life stage. They are not additional saved DNA.

The initial selections remain deterministic from the resident seed, then the resolved stable IDs are saved.

If a saved HairStyle or OutfitStyle no longer supports the resident's current Frame after an AgeBand transition, the resolver deterministically selects a compatible presentation asset for the new Frame while keeping FaceFamily / skin / base hair identity stable. The Web prototype does not need a compatibility graph or offset migration table.

---

## Final runtime shape

The runtime path is now:

~~~text
ResidentPortraitDNA
↓
PortraitFrame (6 fixed frames)
↓
FaceFamily child/adult/elder asset
HairStyle
fixed Neck
full Outfit
↓
5-layer RenderPlan
~~~

The RenderPlan contains only:

~~~text
Back Hair
Neck
Outfit
Face
Front Hair
~~~

Removed from active code:

- PortraitStageProfile;
- youth / middle portrait geometry;
- stage-specific viewBox;
- shared FeatureLayer / face-detail slot;
- stage Body layers;
- Outfit `fullFrame` migration flag;
- `usesFemaleAdultFrame / usesMaleElderFrame` and equivalent special cases.

All six frames use the same square crop: `x=0, y=15, width=120, height=120`.

---

## Art direction: 泛中国古代居民

The target is not a dynasty costume catalogue and not a modern fantasy costume set.

For the first production assets:

- hair favors tied, coiled, low-bun and half-bound silhouettes;
- avoid modern loose curls, salon volume and decorative accessories used only to make the portrait look expensive;
- clothing favors restrained cross-collar, layered collar and front-opening everyday silhouettes;
- wealth is read through fabric completeness, layering and finish rather than saturation;
- face drawing stays natural and restrained; cultural recognition should come primarily from hair, dress and the overall illustration language rather than exaggerated facial stereotypes;
- FaceFamily is a complete face asset for production frames: outline + brows + eyes + nose + mouth. Do not pair different face outlines with one universal feature layer.
- eyes should read as natural forward-looking eyes at 48/64/96 px; avoid a repeated narrow-arc/squint motif as a cultural shorthand.
- colors stay muted enough to work in the resident panel at 48 / 64 / 96 px.

The first implemented proof is `female.adult`: six complete FaceFamily identities, three hair styles and four full-frame outfits all share one fixed canvas. A dedicated Face Close Review is required before copying the frame to other age/gender groups.

## Asset replacement order

~~~text
1. female.adult proof — implemented
   6 FaceFamily variants
   3 HairStyles
   4 OutfitStyles
   72 automated combination samples

2. art-quality correction — implemented before expansion
   complete female.adult face assets
   natural eye construction
   corrected female hairlines
   corrected male.elder tied hair + neck/collar interface

3. male.adult proof

4. female.child / male.child

5. female.elder / male.elder

6. crowd and 48px review

7. final framework cleanup — completed

8. complete remaining frame art, freeze IDs, hand portrait assets to Unity
~~~

The adult female proof is now the first live fixed-frame asset set. It remains the reference gate for later male / child / elder migrations.

---

## Portrait Lab

The only portrait review route is:

~~~text
/?view=portraits
~~~

The workbench reviews FaceFamily identity, three target age bands, frame ID, HairStyle at 96 / 64 / 48, crowd repetition, and saved stable IDs.

Historical `portrait-v8` and `portrait-styles` route aliases are removed.

---

## Unity handoff boundary

The Web project should freeze and hand over:

~~~text
ResidentPortraitDNA field semantics
Stable IDs
three age bands
six frame IDs
fixed canvas / fixed crop
FaceFamily child/adult/elder assets
HairStyle frame compatibility
OutfitStyle frame compatibility
layer order
palette semantics
approved 48px results
~~~

Unity is free to use Sprite, VectorImage, atlas textures or another renderer.

Do not carry Web-only React code, old stage profiles, SVG implementation details or experimental resolver machinery into the Unity runtime contract.

---

## Definition of done before Unity migration

The portrait package is ready to leave the Web prototype when:

- all live residents use the unified portrait module;
- only `/?view=portraits` remains as the art workbench;
- every new asset is authored to one of the six fixed frames;
- FaceFamily uses only child / adult / elder art variants;
- Hair and Outfit can be swapped within a frame without visible drift;
- the renderer uses one fixed crop and one code path for all six frames;
- there are no StageProfiles, shared FeatureLayers, stage Bodies, runtime anchors, masks or offset correction tables;
- 48px portraits remain readable;
- a 24–64 resident crowd does not look like obvious clones;
- the five saved `ResidentPortraitDNA` IDs are sufficient for Unity handoff.

Final principle:

> **Strict frame, simple code, swappable art.**
