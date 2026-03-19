export async function POST(req) {
  const { story, genres, options } = await req.json();
 
  const genreText = genres.length > 0 ? `선택한 분위기: ${genres.join(', ')}` : '';
  const optText = options.join(', ');
 
  const prompt = `당신은 애니메이션 스토리 전문 작가이자 연출가입니다. 다음 줄거리를 분석하고 아래 형식으로 JSON을 반환해주세요.
 
줄거리:
"""
${story}
"""
 
${genreText}
분석 항목: ${optText}
 
반드시 아래 JSON 형식만 반환하세요. 다른 텍스트나 마크다운 없이 순수 JSON만:
{
  "title": "이 이야기에 어울리는 제목 (15자 이내)",
  "genres": ["추천 장르1", "추천 장르2", "추천 장르3"],
  "summary": "이 줄거리의 핵심 매력과 감상 포인트를 2-3문장으로",
  "improved_plot": "더 극적이고 흥미롭게 개선된 줄거리 버전 (3-5문장)",
  "scenes": [
    {"num": 1, "desc": "씬 설명 (1-2문장)"},
    {"num": 2, "desc": "씬 설명"},
    {"num": 3, "desc": "씬 설명"},
    {"num": 4, "desc": "씬 설명"}
  ],
  "character_tip": "주인공 캐릭터를 더 매력적으로 만들기 위한 조언 (2문장)",
  "direction_style": "이 이야기에 어울리는 애니메이션 연출 스타일과 분위기 설명 (2문장)"
}`;
 
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000 }
      })
    }
  );
 
  const data = await response.json();
 
  if (!data.candidates || data.candidates.length === 0) {
    return Response.json({ error: 'No response from Gemini' }, { status: 500 });
  }
 
  const text = data.candidates[0]?.content?.parts?.[0]?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return Response.json({ error: 'Invalid JSON response' }, { status: 500 });
  }
  const result = JSON.parse(jsonMatch[0]);
 
  return Response.json(result);
}
