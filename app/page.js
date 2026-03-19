'use client';
import { useState } from 'react';

const GENRES = ['⚡ 액션','💫 로맨스','🌙 판타지','🌑 공포','😄 코미디','🚀 SF','☕ 일상'];
const OPTIONS = [
  { key: 'plot', label: '줄거리 개선' },
  { key: 'scenes', label: '씬 분할' },
  { key: 'character', label: '캐릭터 분석' },
  { key: 'style', label: '연출 스타일' },
];

export default function Home() {
  const [story, setStory] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [activeOptions, setActiveOptions] = useState(['plot', 'scenes']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  const toggleGenre = (g) => {
    setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };
  const toggleOption = (key) => {
    setActiveOptions(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
  };

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    setError(false);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story, genres: selectedGenres, options: activeOptions }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!result) return;
    const text = `${result.title}\n\n장르: ${result.genres?.join(', ')}\n\n${result.summary}\n\n개선 줄거리:\n${result.improved_plot}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --black: #0a0a0a; --white: #f5f4f0; --accent: #ff5c3a;
          --accent-soft: #fff0ed; --gray: #8a8a82; --gray-light: #e8e7e2;
          --gray-mid: #d0cfc9; --surface: #ffffff;
        }
        body { background: var(--white); color: var(--black); font-family: 'DM Sans', sans-serif; font-weight: 300; min-height: 100vh; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        nav { display:flex; align-items:center; justify-content:space-between; padding:20px 40px; border-bottom:1px solid var(--gray-light); background:var(--white); position:sticky; top:0; z-index:10; }
        .logo { font-family:'DM Serif Display',serif; font-size:20px; color:var(--black); text-decoration:none; }
        .logo span { color:var(--accent); }
        .nav-badge { font-size:11px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:var(--gray); background:var(--gray-light); padding:4px 12px; border-radius:100px; }
        .layout { display:grid; grid-template-columns:1fr 1fr; min-height:calc(100vh - 65px); }
        .left { padding:48px 40px; border-right:1px solid var(--gray-light); display:flex; flex-direction:column; gap:28px; }
        .right { padding:48px 40px; display:flex; flex-direction:column; gap:20px; overflow-y:auto; }
        h1 { font-family:'DM Serif Display',serif; font-size:26px; letter-spacing:-0.5px; line-height:1.2; }
        h1 em { font-style:italic; color:var(--accent); }
        .label { font-size:11px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:var(--gray); margin-bottom:10px; }
        .chips { display:flex; flex-wrap:wrap; gap:8px; }
        .chip { padding:7px 16px; border-radius:100px; font-size:13px; border:1px solid var(--gray-light); cursor:pointer; background:transparent; color:var(--black); font-family:inherit; transition:all 0.15s; }
        .chip:hover { border-color:var(--black); }
        .chip.on { background:var(--black); color:var(--white); border-color:var(--black); }
        .textarea-wrap { position:relative; flex:1; }
        textarea { width:100%; height:100%; min-height:220px; padding:20px; font-family:inherit; font-size:15px; font-weight:300; line-height:1.8; color:var(--black); background:var(--surface); border:1px solid var(--gray-light); border-radius:16px; resize:none; outline:none; transition:border-color 0.2s; }
        textarea:focus { border-color:var(--black); }
        textarea::placeholder { color:var(--gray-mid); }
        .char-count { position:absolute; bottom:14px; right:16px; font-size:11px; color:var(--gray); }
        .opts { display:flex; gap:10px; flex-wrap:wrap; }
        .opt { display:flex; align-items:center; gap:8px; padding:8px 16px; border-radius:10px; border:1px solid var(--gray-light); cursor:pointer; font-family:inherit; font-size:13px; color:var(--gray); background:transparent; transition:all 0.15s; user-select:none; }
        .opt.on { border-color:var(--accent); color:var(--accent); background:var(--accent-soft); }
        .opt-dot { width:7px; height:7px; border-radius:50%; background:var(--gray-mid); }
        .opt.on .opt-dot { background:var(--accent); }
        .btn { width:100%; padding:18px; background:var(--black); color:var(--white); border:none; border-radius:14px; font-family:inherit; font-size:15px; font-weight:500; cursor:pointer; transition:background 0.2s; }
        .btn:hover:not(:disabled) { background:var(--accent); }
        .btn:disabled { opacity:0.4; cursor:not-allowed; }
        .empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:16px; color:var(--gray); }
        .empty-icon { width:64px; height:64px; border-radius:16px; background:var(--gray-light); display:flex; align-items:center; justify-content:center; }
        .card { background:var(--surface); border:1px solid var(--gray-light); border-radius:16px; padding:28px; animation:fadeUp 0.4s ease forwards; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .card-tag { display:inline-flex; align-items:center; gap:6px; font-size:10px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:var(--gray); margin-bottom:16px; }
        .card-tag-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); }
        .card-title { font-family:'DM Serif Display',serif; font-size:20px; margin-bottom:12px; }
        .card-body { font-size:14px; line-height:1.8; color:#444; }
        .genre-tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:4px; }
        .genre-tag { padding:6px 14px; border-radius:100px; font-size:12px; font-weight:500; background:var(--accent-soft); color:var(--accent); border:1px solid #ffd0c5; }
        .scenes { display:flex; flex-direction:column; gap:0; margin-top:4px; }
        .scene { display:flex; gap:14px; align-items:flex-start; padding:12px 0; border-bottom:1px solid var(--gray-light); }
        .scene:last-child { border-bottom:none; }
        .scene-num { font-family:'DM Serif Display',serif; font-size:13px; color:var(--accent); min-width:28px; }
        .scene-text { font-size:13px; line-height:1.65; color:#444; }
        .skeleton { background:var(--surface); border:1px solid var(--gray-light); border-radius:16px; padding:28px; }
        .skel { background:linear-gradient(90deg,var(--gray-light) 25%,var(--gray-mid) 50%,var(--gray-light) 75%); background-size:200% 100%; border-radius:6px; height:14px; margin-bottom:10px; animation:shimmer 1.4s ease infinite; }
        .skel.s { width:40%; } .skel.m { width:70%; } .skel.f { width:100%; } .skel.t { height:22px; width:55%; margin-bottom:14px; }
        @keyframes shimmer { to{background-position:-200% 0} }
        .save-row { display:flex; gap:10px; }
        .save-btn { flex:1; padding:14px; border-radius:12px; font-family:inherit; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.15s; }
        .save-btn.outline { background:transparent; border:1px solid var(--gray-light); color:var(--black); }
        .save-btn.outline:hover { border-color:var(--black); }
        .save-btn.filled { background:var(--black); border:1px solid var(--black); color:var(--white); }
        .save-btn.filled:hover { background:var(--accent); border-color:var(--accent); }
        @media(max-width:768px) { .layout{grid-template-columns:1fr} .left{border-right:none;border-bottom:1px solid var(--gray-light);padding:32px 24px} .right{padding:32px 24px} nav{padding:16px 24px} }
      `}</style>

      <nav>
        <span className="logo">Ani<span>mind</span></span>
        <span className="nav-badge">무료 체험</span>
      </nav>

      <div className="layout">
        {/* LEFT */}
        <div className="left">
          <h1>줄거리를 입력하면<br /><em>AI가 함께 만들어요</em></h1>

          <div>
            <div className="label">분위기 선택</div>
            <div className="chips">
              {GENRES.map(g => (
                <button key={g} className={`chip${selectedGenres.includes(g) ? ' on' : ''}`} onClick={() => toggleGenre(g)}>{g}</button>
              ))}
            </div>
          </div>

          <div className="textarea-wrap">
            <textarea
              placeholder={"줄거리를 여기에 자유롭게 적어보세요.\n\n예) 평범한 고등학생 지호는 어느 날 자신이 시간을 멈출 수 있다는 걸 알게 된다..."}
              value={story}
              onChange={e => setStory(e.target.value)}
              maxLength={1000}
            />
            <span className="char-count">{story.length} / 1000</span>
          </div>

          <div>
            <div className="label">AI 분석 옵션</div>
            <div className="opts">
              {OPTIONS.map(o => (
                <button key={o.key} className={`opt${activeOptions.includes(o.key) ? ' on' : ''}`} onClick={() => toggleOption(o.key)}>
                  <span className="opt-dot" />{o.label}
                </button>
              ))}
            </div>
          </div>

          <button className="btn" onClick={analyze} disabled={story.trim().length < 10 || loading}>
            {loading ? '분석 중...' : '✦ AI 분석 시작'}
          </button>
        </div>

        {/* RIGHT */}
        <div className="right">
          {!loading && !result && !error && (
            <div className="empty">
              <div className="empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8a8a82" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                </svg>
              </div>
              <div>
                <p style={{fontSize:'16px',fontWeight:'500',color:'var(--black)',marginBottom:'8px'}}>AI 결과가 여기에 나와요</p>
                <p>왼쪽에 줄거리를 입력하고<br />분석 버튼을 눌러보세요</p>
              </div>
            </div>
          )}

          {loading && (
            <>
              {[1,2,3].map(i => (
                <div key={i} className="skeleton">
                  <div className="skel s" /><div className="skel t" />
                  <div className="skel f" /><div className="skel m" /><div className="skel f" />
                </div>
              ))}
            </>
          )}

          {error && (
            <div className="empty">
              <p style={{color:'var(--accent)',fontWeight:'500'}}>분석에 실패했어요</p>
              <p>잠시 후 다시 시도해보세요</p>
            </div>
          )}

          {result && (
            <>
              <div className="card">
                <div className="card-tag"><span className="card-tag-dot" />분석 결과</div>
                <div className="card-title">{result.title}</div>
                <div className="genre-tags">{result.genres?.map(g => <span key={g} className="genre-tag">{g}</span>)}</div>
                <div className="card-body" style={{marginTop:'16px'}}>{result.summary}</div>
              </div>

              {activeOptions.includes('plot') && result.improved_plot && (
                <div className="card">
                  <div className="card-tag"><span className="card-tag-dot" />줄거리 개선안</div>
                  <div className="card-body">{result.improved_plot}</div>
                </div>
              )}

              {activeOptions.includes('scenes') && result.scenes && (
                <div className="card">
                  <div className="card-tag"><span className="card-tag-dot" />씬 구성</div>
                  <div className="scenes">
                    {result.scenes.map(s => (
                      <div key={s.num} className="scene">
                        <span className="scene-num">S{s.num}</span>
                        <span className="scene-text">{s.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeOptions.includes('character') || activeOptions.includes('style')) && (
                <div className="card">
                  <div className="card-tag"><span className="card-tag-dot" />추가 제안</div>
                  {activeOptions.includes('character') && result.character_tip && (
                    <div style={{marginBottom:'16px'}}>
                      <div style={{fontSize:'12px',fontWeight:'500',color:'var(--gray)',letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:'8px'}}>캐릭터 팁</div>
                      <div className="card-body">{result.character_tip}</div>
                    </div>
                  )}
                  {activeOptions.includes('style') && result.direction_style && (
                    <div>
                      <div style={{fontSize:'12px',fontWeight:'500',color:'var(--gray)',letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:'8px'}}>연출 스타일</div>
                      <div className="card-body">{result.direction_style}</div>
                    </div>
                  )}
                </div>
              )}

              <div className="save-row">
                <button className="save-btn outline" onClick={() => { setResult(null); setStory(''); }}>↩ 다시 쓰기</button>
                <button className="save-btn filled" onClick={copyResult}>결과 복사하기</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
