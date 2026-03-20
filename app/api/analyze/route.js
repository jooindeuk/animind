export async function POST(req) {
  try {
    const { story, genres, options } = await req.json();
    const genreText = genres.length > 0 ? `선택한 분위기: ${genres.join(', ')}` : '';
    const prompt = `당신은 애니메이션 스토리 전문 작가입니다. 아래 줄거리를 분석하고 JSON만 반환하세요. 마크다운 없이 순수 JSON만:
 
줄거리: "${story}"
${genreText}
 
형식: {"title":"제목(15자이내)","genres":["장르1","장르2","장르3"],"summary":"핵심 매력 2-3문장","improved_plot":"개선된 줄거리 3-5문장","scenes":[{"num":1,"desc":"씬1"},{"num":2,"desc":"씬2"},{"num":3,"desc":"씬3"},{"num":4,"desc":"씬4"}],"character_tip":"캐릭터 조언 2문장","direction_style":"연출 스타일 2문장"}`;
 
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2000 }
        })
      }
    );
 
    const data = await res.json();
    if (!data.candidates?.[0]) {
      console.error('Gemini:', JSON.stringify(data));
      return Response.json({ error: 'No candidates' }, { status: 500 });
    }
 
    const text = data.candidates[0].content.parts[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return Response.json({ error: 'No JSON: ' + text }, { status: 500 });
 
    return Response.json(JSON.parse(match[0]));
  } catch(e) {
    console.error('Error:', e.message);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
