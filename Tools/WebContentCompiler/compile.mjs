import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const generatedDir = join(root, 'Web', 'public', 'generated');

async function readJson(name) {
  return JSON.parse(await readFile(join(generatedDir, name), 'utf8'));
}

const definitions = await readJson('definitions.json');
const storyBuckets = await readJson('story-buckets.json');
const occupationGroups = await readJson('occupation-groups.json');
const portraitCatalog = await readJson('portrait-catalog.json');
const residentProfileCatalog = await readJson('resident-profile-catalog.json');
const stableIdRegistry = await readJson('stable-id-registry.json');

if (definitions.schema !== 'wanhu.resident-definitions.v3') {
  throw new Error(`WebContentCompiler expected wanhu.resident-definitions.v3, got ${definitions.schema}`);
}
if (storyBuckets.schema !== 'wanhu.story-buckets.v1') {
  throw new Error(`Unsupported Story Bucket schema: ${storyBuckets.schema}`);
}
if (occupationGroups.schema !== 'wanhu.occupation-groups.v1') {
  throw new Error(`Unsupported occupation-group schema: ${occupationGroups.schema}`);
}
if (portraitCatalog.schema !== 'wanhu.portrait-catalog.v2') {
  throw new Error(`Unsupported portrait catalog schema: ${portraitCatalog.schema}`);
}
if (residentProfileCatalog.schema !== 'wanhu.resident-profile-catalog.v1') {
  throw new Error(`Unsupported resident profile catalog schema: ${residentProfileCatalog.schema}`);
}
if (stableIdRegistry.schema !== 'wanhu.stable-id-registry.v1') {
  throw new Error(`Unsupported Stable ID registry schema: ${stableIdRegistry.schema}`);
}

const eventIds = new Set(definitions.lifeEvents.map((item) => item.id));
for (const bucket of storyBuckets.buckets) {
  for (const eventId of bucket.eventIds) {
    if (!eventIds.has(eventId)) throw new Error(`Story Bucket ${bucket.key} references unknown LifeEvent ${eventId}.`);
  }
}

const output = {
  ...definitions,
  schema: 'wanhu.resident-definitions.v7',
  occupationGroups: occupationGroups.items,
  portraitCatalog,
  residentProfileCatalog,
  storyBuckets,
  contentMeta: {
    stableIdCount: stableIdRegistry.items.length,
    storyBucketCount: storyBuckets.buckets.length,
    portraitFaceFamilyCount: portraitCatalog.faceFamilies.length,
    portraitHairStyleCount: portraitCatalog.hairStyles.length,
    portraitOutfitStyleCount: portraitCatalog.outfitStyles.length,
    residentTemperamentCount: residentProfileCatalog.temperaments.length,
    residentLifeFocusCount: residentProfileCatalog.lifeFocuses.length,
    residentPresentationStyleCount: residentProfileCatalog.presentationStyles.length,
    routineDefinitionCount: definitions.routines.length,
    routineVariantCount: definitions.routines.reduce((sum, item) => sum + item.variants.length, 0),
  },
};

await writeFile(join(generatedDir, 'definitions.json'), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Assembled Web resident definitions v7 with ${storyBuckets.buckets.length} Story Buckets, ${residentProfileCatalog.temperaments.length + residentProfileCatalog.lifeFocuses.length + residentProfileCatalog.presentationStyles.length} resident profile traits, ${portraitCatalog.faceFamilies.length} FaceFamilies and ${portraitCatalog.hairStyles.length} HairStyles.`);
