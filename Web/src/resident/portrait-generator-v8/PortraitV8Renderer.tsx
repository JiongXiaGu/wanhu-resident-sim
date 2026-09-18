import { useId } from 'react';
import { HEAD_PROFILES } from './catalog';
import { buildRenderPlan } from './render-plan';
import type {
  LayerMaskMode,
  PaletteToken,
  PortraitLod,
  RenderLayer,
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

function transformMatrix(layer: RenderLayer) {
  const t = layer.transform;
  const e = t.translateX + t.originX * (1 - t.scaleX);
  const f = t.translateY + t.originY * (1 - t.scaleY);
  return 'matrix('+t.scaleX+' 0 0 '+t.scaleY+' '+e+' '+f+')';
}

function maskProps(uid: string, mode: LayerMaskMode) {
  if (mode === 'inside-skull') return { clipPath: 'url(#'+uid+'-skull)' };
  if (mode === 'behind-head') return { clipPath: 'url(#'+uid+'-behind)' };
  if (mode === 'outside-face') return { mask: 'url(#'+uid+'-outside-face)' };
  if (mode === 'ear-front-left') return { clipPath: 'url(#'+uid+'-ear-left)' };
  if (mode === 'ear-front-right') return { clipPath: 'url(#'+uid+'-ear-right)' };
  return {};
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
  if (!head) throw new Error('V8.1 renderer missing HeadProfile '+plan.headProfileId);

  const neckTop = Math.max(head.anchors.chin.y - 4, head.anchors.neckLeft.y);
  const neckBottom = context.lifeStage === 'child' ? 99 : 102;
  const maskedLayerCount = plan.layers.filter((layer)=>layer.maskMode !== 'none').length;
  const localLayerCount = plan.layers.filter((layer)=>
    Math.abs(layer.transform.translateX) > 0 || Math.abs(layer.transform.translateY) > 0
  ).length;

  return (
    <div
      className="portrait-v8-renderer"
      data-renderer="render-plan"
      data-generator-version={plan.generatorVersion}
      data-render-contract={plan.renderContractVersion}
      data-resident-id={plan.residentStableId}
      data-head-profile={plan.headProfileId}
      data-hair-bundle={dna.presentation.hairBundleId}
      data-outfit-bundle={dna.presentation.outfitBundleId}
      data-accessory={dna.presentation.accessoryAssetId}
      data-mask-contract="active"
      data-masked-layer-count={maskedLayerCount}
      data-local-placement-count={localLayerCount}
      data-lod={lod}
      data-halo="none"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 15 120 120" focusable="false">
        <defs>
          <clipPath id={uid+'-skull'} clipPathUnits="userSpaceOnUse">
            <path d={plan.masks.skull}/>
          </clipPath>
          <clipPath id={uid+'-behind'} clipPathUnits="userSpaceOnUse">
            <path d={plan.masks.behindHead}/>
          </clipPath>
          <clipPath id={uid+'-ear-left'} clipPathUnits="userSpaceOnUse">
            <path d={plan.masks.earFrontLeft}/>
          </clipPath>
          <clipPath id={uid+'-ear-right'} clipPathUnits="userSpaceOnUse">
            <path d={plan.masks.earFrontRight}/>
          </clipPath>
          <mask id={uid+'-outside-face'} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="150">
            <rect width="120" height="150" fill="white"/>
            <path d={plan.masks.faceKeepout} fill="black"/>
          </mask>
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
            data-mask-mode={layer.maskMode}
            {...maskProps(uid, layer.maskMode)}
          >
            <g transform={transformMatrix(layer)}>
              {layer.shapes.map((shape,index)=>(
                <Shape key={layer.assetId+'-'+index} shape={shape} palette={plan.palette}/>
              ))}
            </g>
          </g>
        ))}

        {debugMasks && <g fill="none" strokeWidth=".6" opacity=".62" pointerEvents="none">
          <path d={plan.masks.skull} stroke="#b84f42"/>
          <path d={plan.masks.faceKeepout} stroke="#4c7f91"/>
          <path d={plan.masks.behindHead} stroke="#718d62" strokeDasharray="2 2"/>
          <circle cx={head.anchors.bunLow.x} cy={head.anchors.bunLow.y} r="2" fill="#cfaa58" stroke="none"/>
          <circle cx={head.anchors.skullTop.x} cy={head.anchors.skullTop.y} r="1.5" fill="#d66f62" stroke="none"/>
        </g>}
      </svg>
    </div>
  );
}
