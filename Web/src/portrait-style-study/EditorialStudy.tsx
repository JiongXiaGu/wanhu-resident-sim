function Woman() {
  return <svg viewBox="0 0 220 260" aria-label="无描边 Editorial 成年女性">
    <rect width="220" height="260" rx="30" fill="#e7d9bd"/>
    <path d="M35 260C40 205 62 176 93 168h34c32 10 52 39 58 92Z" fill="#75888b"/>
    <path d="M79 170c8 13 20 20 31 20s24-7 32-21l-16-8H95Z" fill="#d8b59a"/>
    <path d="M71 75c0-37 18-57 43-57 29 0 47 22 45 61l-5 70c-12 14-28 23-46 23-17 0-31-7-42-20Z" fill="#332c29"/>
    <path d="M79 69c4-25 18-38 37-38 23 0 36 17 34 44v44c-5 31-20 48-40 48-22 0-36-19-36-51Z" fill="#d9aa87"/>
    <path d="M79 75c15-4 28-15 36-34 8 16 20 26 35 31-4-29-16-41-36-41-19 0-31 13-35 44Z" fill="#332c29"/>
    <ellipse cx="96" cy="99" rx="3.4" ry="4.2" fill="#292523"/>
    <ellipse cx="129" cy="99" rx="3.4" ry="4.2" fill="#292523"/>
    <path d="M112 101c-2 9-3 15-1 20 3 2 6 2 9 0" fill="none" stroke="#9b735d" strokeWidth="2.3" strokeLinecap="round"/>
    <path d="M101 137c8 4 16 4 24-1" fill="none" stroke="#8e5e56" strokeWidth="2.6" strokeLinecap="round"/>
    <path d="M93 168 110 186l17-17 26 20-17 71H79l-13-71Z" fill="#6c7d7d"/>
    <path d="m93 168 17 18-12 16-24-20Zm34 1-17 17 13 16 24-20Z" fill="#c8baa1"/>
  </svg>;
}
function Man() {
  return <svg viewBox="0 0 220 260" aria-label="无描边 Editorial 成年男性">
    <rect width="220" height="260" rx="30" fill="#d8ccb0"/>
    <path d="M30 260c8-58 31-83 68-94h28c37 10 58 38 64 94Z" fill="#66715f"/>
    <path d="M79 72c2-35 21-54 47-53 26 2 42 24 39 62l-4 66c-13 14-29 22-49 22-20 0-35-8-46-23Z" fill="#2d2b28"/>
    <path d="M80 72c4-27 18-40 42-39 21 1 35 17 34 45v36c-4 34-20 50-43 50-25 0-39-20-39-53Z" fill="#c9916f"/>
    <path d="M78 78c17-7 30-20 38-39 10 15 24 25 42 29-6-25-20-36-39-36-20 0-34 14-41 46Z" fill="#2d2b28"/>
    <rect x="106" y="15" width="21" height="14" rx="7" fill="#2d2b28"/>
    <ellipse cx="97" cy="101" rx="3.4" ry="4.1" fill="#282420"/>
    <ellipse cx="132" cy="101" rx="3.4" ry="4.1" fill="#282420"/>
    <path d="M112 105c-2 8-2 14 1 19 3 1 6 1 8-1" fill="none" stroke="#936750" strokeWidth="2.3" strokeLinecap="round"/>
    <path d="M102 139c9 2 18 2 26-1" fill="none" stroke="#77534b" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="m92 168 20 20 20-20 28 21-8 71H70l-10-70Z" fill="#586555"/>
    <path d="m92 168 20 20-13 16-25-20Zm40 0-20 20 13 16 25-20Z" fill="#b5aa91"/>
  </svg>;
}
function Elder() {
  return <svg viewBox="0 0 220 260" aria-label="无描边 Editorial 老年居民">
    <rect width="220" height="260" rx="30" fill="#ddd1b5"/>
    <path d="M28 260c8-54 32-80 67-91h34c34 10 56 39 63 91Z" fill="#7c7468"/>
    <path d="M72 75c3-34 21-52 45-52 29 0 47 22 44 63l-4 58c-11 17-27 27-47 27-20 0-36-10-47-28Z" fill="#77706a"/>
    <path d="M79 75c5-24 17-37 37-37 22 0 35 17 34 46v29c-2 34-18 52-39 52-22 0-36-20-36-52Z" fill="#c99a79"/>
    <path d="M78 78c11-6 19-17 25-31 17 0 31 7 45 20-5-20-16-29-33-29-18 0-31 13-37 40Z" fill="#77706a"/>
    <ellipse cx="96" cy="103" rx="3" ry="3.7" fill="#312b27"/>
    <ellipse cx="128" cy="103" rx="3" ry="3.7" fill="#312b27"/>
    <path d="M87 92c7-4 13-4 19-1m13 0c6-3 12-2 18 1M89 111c5 3 10 3 15 1m17 0c5 2 10 2 15-1" fill="none" stroke="#9b705c" strokeWidth="1.6" strokeLinecap="round" opacity=".65"/>
    <path d="M112 106c-2 10-2 16 1 20 3 2 6 1 9-1" fill="none" stroke="#936b57" strokeWidth="2.1" strokeLinecap="round"/>
    <path d="M101 142c8-1 16 0 24 2" fill="none" stroke="#76544e" strokeWidth="2.3" strokeLinecap="round"/>
    <path d="m91 169 20 17 20-17 29 22-7 69H68l-8-69Z" fill="#6f685f"/>
    <path d="m91 169 20 17-12 15-26-17Zm40 0-20 17 12 15 26-17Z" fill="#b6ab96"/>
  </svg>;
}
export function EditorialStudy() {
  return <article className="style-study-group style-study-group--editorial" data-style-study-id="editorial">
    <header><div><span>A · NO-OUTLINE EDITORIAL</span><h2>无描边 Editorial Flat</h2></div><p>靠轮廓色块与比例建立人物，不依赖黑色外描边。眼睛是小而清晰的图形，衣服用大块交叠形状表达。</p></header>
    <div className="style-study-portraits"><Woman/><Man/><Elder/></div>
    <div className="style-study-notes"><b>关键词</b><span>柔和大形</span><span>无外描边</span><span>色块构脸</span><span>低细节</span></div>
  </article>;
}
