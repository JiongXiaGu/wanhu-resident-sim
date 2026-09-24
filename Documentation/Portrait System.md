# Resident Portrait Frame System — frozen fallback contract

## Scope

This document specifies the existing fallback portrait path in `Web/src/resident/portrait/` and `Content/Portrait/`. Its geometry and runtime remain frozen. It is not the authoring guide for the new four-option Avatar Workshop; that Web-only override is documented in `Avatar Workshop.md`.

This path is now the final fallback rather than the first default for every unedited resident. `ResidentAvatar` resolves sources in this order: saved Workshop override → Resident Profile-derived `chibi-cute-v1` recipe → this frozen PortraitRenderer fallback. Neither the saved override nor the generated recipe mutates the original ResidentPortraitDNA or portrait catalog. Removing a saved override returns to the Profile-derived default; this renderer is used only when the generated path is unavailable.

## Stable DNA and frames

```text
ResidentPortraitDNA
  faceFamilyId
  hairStyleId
  outfitStyleId
  skinPaletteId
  baseHairColorId
```

Exactly six fixed frames: female.child, female.adult, female.elder, male.child, male.adult, male.elder. Gameplay child/teen maps to child; young-adult/adult/middle-age maps to adult; elder maps to elder. Gender and age are derived from resident state, not additional saved DNA fields.

The resident keeps its faceFamilyId identity over age bands. Hair/outfit incompatible with a new age band resolve deterministically to supported presentation assets, without a general compatibility graph.

## Fixed geometry

Master canvas `120 × 150`; square UI crop `x=0, y=15, width=120, height=120`; centerline x=60. All frames share the same viewBox.

Frames specify head area, neck root, shoulders, hair bounds and draw order. They are authoring specifications, not runtime anchor solvers. Assets fit directly or are redrawn; no per-face offsets, head scaling, age-dependent viewBox, masks or automatic fit patches.

Fallback render order is exactly:

```text
Back Hair → Neck → Outfit → Face → Front Hair
```

FaceFamily owns complete faces for child/adult/elder, including outline and features; this fallback does not use one shared feature layer for every face. Hair owns front/back layers. Outfit owns complete shoulder/collar/chest geometry. Wealth affects initial outfit selection only; saved style IDs are not bound to occupation.

Hats, accessories, beard systems and a generic overlay engine are not part of this frozen fallback. The new workshop expression field is not retrofitted into formal DNA.

## Catalog authority

`Content/Portrait/portrait-catalog.json` is the authority for logical IDs, frame/gender compatibility, weights and initial wealth fit. `Web/src/resident/portrait/assets/art-manifest.json` maps Web art layer IDs. `Tools/PortraitCatalogAudit` verifies their agreement during build-content.

Geometry remains split into assets/faces.ts, hair.ts, outfits.ts and necks.ts. catalog.ts joins metadata and art. Generated files are compiled, not edited manually.

The final runtime has no youth/middle StageProfile, stage-specific body geometry, shared FeatureLayer, fullFrame migration flag or female-adult/male-elder alignment special cases. Render contract is 9.0 with a three-band frame contract.

## Regression review

`/?view=portraits` is the fixed fallback contract inspection page. It remains separate from the player's single Avatar Workshop.

The review retains the original checks for all six frame IDs, absence of stage profiles/shared face-detail layers, consistent contract 9.0, 72 female-adult combinations (6 faces × 3 hair × 4 outfits), four outfit cards, three age samples sharing identity, ten face-family cards, eight hair styles, 24 seeded residents, six close-up faces and four male-elder samples.

`capture-portrait-review.mjs` only removes tests for retired style galleries; the fallback checks remain. No old experiment folder is needed to preserve this contract. Refer to Git history for discarded art trials.

Do not interpret this frozen fallback as user approval of its visual style, or as permission to expand Unity save/ECS contracts in the Web prototype.
