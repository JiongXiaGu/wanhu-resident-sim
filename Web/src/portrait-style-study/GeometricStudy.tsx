function Woman(){return <svg viewBox="0 0 220 260" aria-label="几何构成成年女性">
  <rect width="220" height="260" rx="18" fill="#d9cfb9"/>
  <path d="m33 260 20-70 57-27 58 27 19 70Z" fill="#526a69"/>
  <path d="m82 163 28 26 30-26-8-16H91Z" fill="#d2a17e"/>
  <path d="m67 61 42-43 49 40-7 91-41 25-43-29Z" fill="#2c2928"/>
  <path d="m78 68 31-33 36 28-4 63-31 36-31-33Z" fill="#cc9874"/>
  <path d="m78 68 31-33 36 28-29 7-22-13-18 19Z" fill="#2c2928"/>
  <path d="m90 95 14-5 10 7-12 7Zm37 2 13-5 10 7-12 7Z" fill="#312d2a"/>
  <circle cx="103" cy="98" r="2.7" fill="#d9cfb9"/><circle cx="139" cy="100" r="2.7" fill="#d9cfb9"/>
  <path d="m119 101-5 24 13 2" fill="none" stroke="#805a45" strokeWidth="3" strokeLinejoin="round"/>
  <path d="m101 139 14 7 17-7" fill="none" stroke="#81534e" strokeWidth="3" strokeLinejoin="round"/>
  <path d="m82 163 28 26-17 19-32-15Zm58 0-30 26 18 19 31-15Z" fill="#c4b99f"/>
</svg>}
function Man(){return <svg viewBox="0 0 220 260" aria-label="几何构成年男性">
  <rect width="220" height="260" rx="18" fill="#cec5b0"/>
  <path d="m28 260 25-68 60-29 64 29 16 68Z" fill="#596354"/>
  <path d="m75 57 37-40 52 37-7 95-43 25-47-31Z" fill="#262524"/>
  <path d="m79 67 34-34 39 25-5 69-34 37-36-35Z" fill="#bd8262"/>
  <path d="m79 67 34-34 39 25-32 10-19-16-24 22Z" fill="#262524"/>
  <polygon points="108,17 132,17 137,29 112,34" fill="#262524"/>
  <path d="m89 96 15-5 11 7-14 7Zm39 2 15-5 11 7-14 7Z" fill="#2e2b28"/>
  <circle cx="103" cy="99" r="2.5" fill="#cec5b0"/><circle cx="142" cy="101" r="2.5" fill="#cec5b0"/>
  <path d="m119 101-5 25 14 2" fill="none" stroke="#744c3b" strokeWidth="3.2" strokeLinejoin="round"/>
  <path d="m100 142 16 5 19-4" fill="none" stroke="#6f4941" strokeWidth="3.2"/>
  <path d="m86 169 27 22-18 20-33-18Zm56 0-29 22 19 20 31-18Z" fill="#c0b397"/>
</svg>}
function Elder(){return <svg viewBox="0 0 220 260" aria-label="几何构成老年居民">
  <rect width="220" height="260" rx="18" fill="#d7cebb"/>
  <path d="m31 260 23-64 56-30 61 30 18 64Z" fill="#746d63"/>
  <path d="m72 62 39-39 49 36-7 88-42 28-44-31Z" fill="#69645f"/>
  <path d="m80 70 31-31 36 25-4 65-32 37-34-34Z" fill="#c18c6b"/>
  <path d="m80 70 31-31 36 25-31 8-20-13-20 18Z" fill="#69645f"/>
  <path d="m89 98 15-5 10 7-13 7Zm38 1 15-5 10 7-13 7Z" fill="#34302c"/>
  <circle cx="102" cy="101" r="2.2" fill="#d7cebb"/><circle cx="140" cy="102" r="2.2" fill="#d7cebb"/>
  <path d="m118 104-5 24 14 2" fill="none" stroke="#765140" strokeWidth="3"/>
  <path d="m99 143 16 3 18-2" fill="none" stroke="#72504a" strokeWidth="3"/>
  <path d="m86 115-10 5m65-5 10 5m-62 9-9 4m61-4 9 4" stroke="#8a6250" strokeWidth="2" opacity=".65"/>
  <path d="m85 171 26 21-18 19-31-17Zm55 0-29 21 19 19 31-17Z" fill="#b9ae98"/>
</svg>}
export function GeometricStudy(){return <article className="style-study-group style-study-group--geometric" data-style-study-id="geometric">
  <header><div><span>C · GEOMETRIC CONSTRUCTION</span><h2>几何构成人物</h2></div><p>脸、头发和服饰由明显切面构成，主动放弃自然曲线。眼睛、鼻梁和衣领都是图形语言，而不是细线肖像。</p></header>
  <div className="style-study-portraits"><Woman/><Man/><Elder/></div>
  <div className="style-study-notes"><b>关键词</b><span>切面</span><span>角度</span><span>图形五官</span><span>强剪影</span></div>
</article>}
