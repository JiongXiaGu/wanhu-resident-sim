import { buildRenderPlan } from './render-plan';
import type {
  PaletteToken,
  PortraitLod,
  ResolvedAppearanceDNA,
  SemanticAppearanceContext,
  VectorShape,
} from './types';

function paint(token: PaletteToken | undefined, palette: Record<string,string>) {
  if (!token) return 'none';
  return palette[token] ?? 'none';
}

function Shape({shape,palette}:{shape:VectorShape;palette:Record<string,string>}) {
  if (shape.kind === 'path') {
    return <path d={shape.d} fill={paint(shape.fill,palette)} stroke={paint(shape.stroke,palette)}
      strokeWidth={shape.strokeWidth} opacity={shape.opacity} strokeLinecap="round" strokeLinejoin="round"/>;
  }
  if (shape.kind === 'ellipse') {
    return <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry}
      fill={paint(shape.fill,palette)} stroke={paint(shape.stroke,palette)}
      strokeWidth={shape.strokeWidth} opacity={shape.opacity}/>;
  }
  if (shape.kind === 'circle') {
    return <circle cx={shape.cx} cy={shape.cy} r={shape.r}
      fill={paint(shape.fill,palette)} stroke={paint(shape.stroke,palette)}
      strokeWidth={shape.strokeWidth} opacity={shape.opacity}/>;
  }
  return <line x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2}
    stroke={paint(shape.stroke,palette)} strokeWidth={shape.strokeWidth}
    opacity={shape.opacity} strokeLinecap="round"/>;
}

export function PortraitRenderer({
  dna,
  context,
  lod=96,
  label,
}:{
  dna:ResolvedAppearanceDNA;
  context:SemanticAppearanceContext;
  lod?:PortraitLod;
  label?:string;
}) {
  const plan=buildRenderPlan(dna,context,lod);
  return (
    <div
      className="portrait-renderer"
      data-renderer="simple-render-plan"
      data-generator-version={plan.generatorVersion}
      data-render-contract={plan.renderContractVersion}
      data-resident-id={plan.residentStableId}
      data-frame-id={plan.frameId}
      data-face-family={plan.faceFamilyId}
      data-hair-style={dna.presentation.hairStyleId}
      data-outfit-style={dna.presentation.outfitStyleId}
      data-lod={lod}
      role={label?'img':undefined}
      aria-label={label}
      aria-hidden={label?undefined:true}
    >
      <svg viewBox={plan.viewBox.x+' '+plan.viewBox.y+' '+plan.viewBox.width+' '+plan.viewBox.height} focusable="false">
        <rect width="120" height="150" fill={plan.palette.background}/>
        {plan.layers.map((layer)=>(
          <g key={layer.assetId} data-layer-asset={layer.assetId} data-slot={layer.slot}>
            {layer.shapes.map((shape,index)=><Shape key={layer.assetId+'-'+index} shape={shape} palette={plan.palette}/>)}
          </g>
        ))}
      </svg>
    </div>
  );
}
