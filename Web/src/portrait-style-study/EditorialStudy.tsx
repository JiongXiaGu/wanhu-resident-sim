function Woman() {
  return <svg viewBox="0 0 220 260" aria-label="无描边 Editorial 成年女性">
    <rect width="220" height="260" rx="32" fill="#eadfc8"/>
    <path d="M40 260c4-45 25-71 61-82h20c38 9 59 38 62 82Z" fill="#7b9396"/>
    <ellipse cx="111" cy="103" rx="56" ry="69" fill="#322b29"/>
    <path d="M66 99c0-39 18-61 46-61 30 0 49 24 49 62 0 43-18 72-49 72-29 0-46-28-46-73Z" fill="#dfad88"/>
    <path d="M64 94c11-8 23-24 31-46 15 19 35 31 62 35-7-34-24-49-48-49-24 0-39 18-45 60Z" fill="#322b29"/>
    <circle cx="93" cy="105" r="4.2" fill="#312a27"/><circle cx="132" cy="105" r="4.2" fill="#312a27"/>
    <path d="M111 107c-4 12-4 20 0 25 4 2 8 1 12-2" fill="none" stroke="#a87761" strokeWidth="3" strokeLinecap="round"/>
    <path d="M96 144c10 6 21 6 31 0" fill="none" stroke="#995f5b" strokeWidth="3.3" strokeLinecap="round"/>
    <path d="M92 177 111 197l19-20 30 18-20 65H80l-19-65Z" fill="#7b9396"/>
    <path d="m92 177 19 20-14 17-29-24Zm38 0-19 20 14 17 28-24Z" fill="#d9ccb2"/>
  </svg>;
}
function Man() {
  return <svg viewBox="0 0 220 260" aria-label="无描边 Editorial 成年男性">
    <rect width="220" height="260" rx="32" fill="#ddd3bc"/>
    <path d="M30 260c8-43 33-70 74-82h18c41 10 66 39 68 82Z" fill="#60705f"/>
    <path d="M62 89c0-43 21-67 53-67 33 0 54 26 54 69 0 48-20 81-55 81-34 0-52-31-52-83Z" fill="#2b2927"/>
    <path d="M72 89c2-34 18-52 45-52 27 0 44 20 44 53 0 47-18 74-46 74-28 0-43-27-43-75Z" fill="#c98e6a"/>
    <path d="M68 82c15-8 28-25 37-47 15 17 34 27 58 29-10-28-25-40-48-40-23 0-39 18-47 58Z" fill="#2b2927"/>
    <rect x="103" y="14" width="25" height="15" rx="7" fill="#2b2927"/>
    <circle cx="96" cy="105" r="4" fill="#2c2926"/><circle cx="136" cy="105" r="4" fill="#2c2926"/>
    <path d="M113 108c-3 12-3 20 2 24 4 1 7 0 11-3" fill="none" stroke="#91644f" strokeWidth="3" strokeLinecap="round"/>
    <path d="M98 145c11 3 23 3 34 0" fill="none" stroke="#774f48" strokeWidth="3.2" strokeLinecap="round"/>
    <path d="M88 178 113 198l23-20 34 18-16 64H70l-18-64Z" fill="#60705f"/>
    <path d="m88 178 25 20-16 18-31-24Zm48 0-23 20 16 18 30-24Z" fill="#cbbfa7"/>
  </svg>;
}
function Elder() {
  return <svg viewBox="0 0 220 260" aria-label="无描边 Editorial 老年居民">
    <rect width="220" height="260" rx="32" fill="#e0d6bf"/>
    <path d="M34 260c7-42 31-67 68-80h21c37 11 61 37 64 80Z" fill="#7d756b"/>
    <ellipse cx="112" cy="101" rx="54" ry="70" fill="#746f69"/>
    <path d="M69 101c0-39 17-60 44-60 29 0 47 23 47 61 0 43-18 71-48 71-29 0-43-27-43-72Z" fill="#cd9b79"/>
    <path d="M69 92c12-10 21-24 27-42 24 0 44 10 61 29-9-31-25-44-48-43-21 1-34 20-40 56Z" fill="#746f69"/>
    <circle cx="95" cy="106" r="3.6" fill="#37302c"/><circle cx="133" cy="106" r="3.6" fill="#37302c"/>
    <path d="M84 94c8-5 15-6 23-2m14 0c8-3 16-2 23 2M86 119c7 4 14 4 21 2m19 0c7 3 14 3 20-2" fill="none" stroke="#a2745e" strokeWidth="2" opacity=".7" strokeLinecap="round"/>
    <path d="M112 109c-3 13-2 21 2 25 4 1 8 0 11-3" fill="none" stroke="#8c6754" strokeWidth="2.7" strokeLinecap="round"/>
    <path d="M99 148c10-1 20 0 30 3" fill="none" stroke="#77544e" strokeWidth="3" strokeLinecap="round"/>
    <path d="M90 180 112 197l22-17 33 18-17 62H72l-17-62Z" fill="#7d756b"/>
    <path d="m90 180 22 17-15 17-30-22Zm44 0-22 17 15 17 29-22Z" fill="#c8bda5"/>
  </svg>;
}
export function EditorialStudy() {
  return <article className="style-study-group style-study-group--editorial" data-style-study-id="editorial">
    <header><div><span>A · NO-OUTLINE EDITORIAL</span><h2>无描边 Editorial Flat</h2></div><p>刻意使用更大的圆润头部、短身体和色块构形。人物不靠线稿成立，眼睛只保留图形符号，服装以宽色面而不是结构线表达。</p></header>
    <div className="style-study-portraits"><Woman/><Man/><Elder/></div>
    <div className="style-study-notes"><b>关键词</b><span>大头短身</span><span>无外描边</span><span>圆润色块</span><span>极简眼睛</span></div>
  </article>;
}
