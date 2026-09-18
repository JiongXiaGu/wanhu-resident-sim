import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root=process.cwd();
const readJson=async(path)=>JSON.parse(await readFile(join(root,path),'utf8'));
const source=await readJson('Content/Portrait/portrait-catalog.json');
const art=await readJson('Web/src/resident/portrait/assets/art-manifest.json');

if(source.schema!=='wanhu.portrait-catalog.v2') throw new Error('Unexpected portrait catalog schema.');
if(art.schema!=='wanhu.portrait-art-manifest.v1') throw new Error('Unexpected portrait art manifest schema.');

function ids(items){return items.map((item)=>item.id).sort();}
function assertExact(label,left,right){
  const a=JSON.stringify(ids(left));
  const b=JSON.stringify(ids(right));
  if(a!==b) throw new Error(label+' ids differ. source='+a+' art='+b);
}
assertExact('FaceFamily',source.faceFamilies,art.faceFamilies);
assertExact('HairStyle',source.hairStyles,art.hairStyles);
assertExact('OutfitStyle',source.outfitStyles,art.outfitStyles);

const frameIds=['female.child','female.adult','female.elder','male.child','male.adult','male.elder'];
for(const frameId of frameIds) {
  if(!art.frames?.[frameId]) throw new Error('Missing frame art '+frameId);
  if(!source.hairStyles.some((item)=>item.frameIds.includes(frameId))) throw new Error('No HairStyle for '+frameId);
  if(!source.outfitStyles.some((item)=>item.frameIds.includes(frameId))) throw new Error('No OutfitStyle for '+frameId);
}

for(const face of art.faceFamilies) {
  for(const band of ['child','adult','elder']) {
    if(!face.faceLayerByAge?.[band]) throw new Error(face.id+' missing '+band+' face art.');
  }
}

const assetFiles=[
  'Web/src/resident/portrait/assets/faces.ts',
  'Web/src/resident/portrait/assets/necks.ts',
  'Web/src/resident/portrait/assets/outfits.ts',
  'Web/src/resident/portrait/assets/hair.ts',
];
const layerIds=new Set();
for(const path of assetFiles) {
  const text=await readFile(join(root,path),'utf8');
  for(const match of text.matchAll(/\{\s*id:'([^']+)'\s*,\s*slot:/g)) {
    if(layerIds.has(match[1])) throw new Error('Duplicate vector layer '+match[1]);
    layerIds.add(match[1]);
  }
}
const referenced=new Set();
for(const frame of Object.values(art.frames)) referenced.add(frame.neckLayerId);
for(const face of art.faceFamilies) for(const id of Object.values(face.faceLayerByAge)) referenced.add(id);
for(const hair of art.hairStyles) {referenced.add(hair.backLayerId);referenced.add(hair.frontLayerId);}
for(const outfit of art.outfitStyles) for(const ids of Object.values(outfit.layerAssetIdsByFrame)) for(const id of ids) referenced.add(id);

for(const id of referenced) if(!layerIds.has(id)) throw new Error('Art manifest references missing vector layer '+id);
for(const id of layerIds) if(!referenced.has(id)) throw new Error('Unreferenced vector layer '+id);

console.log(`PortraitCatalogAudit: ${source.faceFamilies.length} faces, ${source.hairStyles.length} hair styles, ${source.outfitStyles.length} outfits, ${layerIds.size} vector layers.`);
