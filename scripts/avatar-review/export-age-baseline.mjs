import {execFileSync} from 'node:child_process';
import {mkdtempSync,rmSync,writeFileSync,mkdirSync} from 'node:fs';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createRequire} from 'node:module';
import ts from 'typescript';

// 只用于 Actions 的旧新对照。旧画稿从 Git 历史取出到临时目录，绝不进入 Web 运行时。
const baseline=process.argv[2]??'28ad42619edb7a6abb21ca7ef8d2dee30d2afda2';
const out=process.argv[3]??'review-screenshots/avatar/phase8b';
if(!/^[a-f0-9]{40}$/.test(baseline))throw new Error('Baseline must be a complete commit SHA');
const sha=execFileSync('git',['rev-parse',`${baseline}^{commit}`],{encoding:'utf8'}).trim();
if(sha!==baseline)throw new Error('Unexpected Phase 8B baseline');
const temp=mkdtempSync(join(tmpdir(),'wanhu-avatar-baseline-'));
const require=createRequire(import.meta.url),old=require.extensions['.ts'];
try{
 const archive=execFileSync('git',['archive',baseline,'Web/src/avatar'],{maxBuffer:16*1024*1024});
 execFileSync('tar',['-xf','-','-C',temp],{input:archive});
 require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,file);
 const m=require(join(temp,'Web/src/avatar/model.ts')),r=require(join(temp,'Web/src/avatar/render.ts'));
 const rows=[];
 for(const frame of m.frames){
  const stage=frame.split('.')[1];
  const recipe={...m.recipeForPack('chibi-cute-v1',frame),face:'oval',expression:'smile',
   hair:stage==='child'?'child-topknot':stage==='elder'?'elder-swept':'bound',
   outfit:stage==='child'?'child-short-robe':stage==='elder'?'elder-long-robe':'commoner'};
  for(const part of ['hair','outfit'])for(const option of m.optionsFor(recipe.pack,part,frame)){
   const value={...recipe,[part]:option.id};rows.push({frame,part,id:option.id,label:option.label,recipe:value,svg:r.renderAvatar(frame,value)});
  }
 }
 mkdirSync(out,{recursive:true});writeFileSync(join(out,'baseline.json'),JSON.stringify({sha,rows},null,2)+'\n');
 console.log(`Phase 8B baseline ${sha}: ${rows.length} fixed-recipe renders`);
}finally{
 if(old)require.extensions['.ts']=old;else delete require.extensions['.ts'];
 rmSync(temp,{recursive:true,force:true});
}
