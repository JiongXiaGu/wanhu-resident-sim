import { useId } from 'react';
import { HEAD_PROFILES } from './catalog';
import { buildRenderPlan } from './render-plan';
import type {
  PaletteToken,
  PortraitLod,
  ResolvedAppearanceDNA,
  SemanticAppearanceContext,
  VectorShape,
} from './types';

function paint(token: PaletteToken | undefined, palette: Record<string,string>) {
  if (!token || token === 'none') return 'none';
  return palette[token] ?? 'none';
}

function Shape({
  shape,
  palette,
}: {
  shape: VectorShape;
  palette: Record<string,string>;
}) {
  if (shape.kind === 'path') {
    return <path
      d={shape.d}
      fill={paint(shape.fill, palette)}
      stroke={paint(shape.stroke, palette)}
      strokeWidth={shape.strokeWidth}
      opacity={shape.opacity}
      strokeLinecap="round"
      strokeLinejoin="round"
    />;
  }
  if (shape.kind === 'ellipse') {
    return <ellipse
      cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry}
      fill={paint(shape.fill, palette)}
      stroke={paint(shape.stroke, palette)}
      strokeWidth={shape.strokeWidth}
      opacity={shape.opacity}
    />;
  }
  if (shape.kind === 'circle') {
    return <circle
      cx={shape.cx} cy={shape.cy} r={shape.r}
      fill={paint(shape.fill, palette)}
      stroke={paint(shape.stroke, palette)}
      strokeWidth={shape.strokeWidth}
      opacity={shape.opacity}
    />;
  }
  return <line
    x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2}
    stroke={paint(shape.stroke, palette)}
    strokeWidth={shape.strokeWidth}
    opacity={shape.opacity}
    strokeLinecap="round"
  />;
}

export function PortraitV8Renderer({
  dna,
  context,
  lod = 96,
  label,
  debugMasks = false,
}: {
  dna: ResolvedAppearanceDNA;
  context: SemanticAppearanceContext;
  lod?: PortraitLod;
  label?: string;
  debugMasks?: boolean;
}) {
  const uid = useId().replace(/:/g,'');
  const plan = buildRenderPlan(dna, context, lod);
  const head = HEAD_PROFILES.find((item)=>item.id===plan.headProfileId);
  if (!head) throw new Error('V8 renderer missing HeadProfile '+plan.headProfileId);

  const neckTop = Math.max(head.anchors.chin.y - 4, head.anchors.neckLeft.y);
  const neckBottom = context.lifeStage === 'child' ? 99 : 102;

  return (
    <div
      className="portrait-v8-renderer"
      data-renderer="render-plan"
      data-generator-version={plan.generatorVersion}
      data-resident-id={plan.residentStableId}
      data-head-profile={plan.headProfileId}
      data-hair-bundle={dna.presentation.hairBundleId}
      data-outfit-bundle={dna.presentation.outfitBundleId}
      data-accessory={dna.presentation.accessoryAssetId}
      data-lod={lod}
      data-halo="none"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 15 120 120" focusable="false">
        <defs>
          <clipPath id={uid+'-skull'}><path d={plan.masks.skull}/></clipPath>
          <clipPath id={uid+'-face'}><path d={plan.masks.faceKeepout}/></clipPath>
        </defs>
        <rect width="120" height="150" fill={plan.palette.background}/>
        <path
          d={'M'+head.anchors.neckLeft.x+' '+neckTop+
            ' H'+head.anchors.neckRight.x+
            ' L'+(head.anchors.neckRight.x+1)+' '+neckBottom+
            ' Q60 '+(neckBottom+3)+' '+(head.anchors.neckLeft.x-1)+' '+neckBottom+'Z'}
          fill={plan.palette.skin}
        />
        {plan.layers.map((layer)=>(
          <g
            key={layer.assetId}
            data-layer-asset={layer.assetId}
            data-slot={layer.slot}
            transform={
              'translate('+layer.transform.translateX+' '+layer.transform.translateY+') '+
              'scale('+layer.transform.scaleX+' '+layer.transform.scaleY+')'
            }
          >
            {layer.shapes.map((shape,index)=>(
              <Shape key={layer.assetId+'-'+index} shape={shape} palette={plan.palette}/>
            ))}
          </g>
        ))}
        {debugMasks && <g fill="none" stroke="#b84f42" strokeWidth=".6" opacity=".65">
          <path d={plan.masks.skull}/>
          <path d={plan.masks.faceKeepout} stroke="#4c7f91"/>
        </g>}
      </svg>
    </div>
  );
}
