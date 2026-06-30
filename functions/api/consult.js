const SYSTEM_PROMPT = `당신은 파트너십 인사이트의 제휴 마케팅 전문 컨설턴트입니다.
제휴 마케팅, 공동 마케팅, 브랜드 협업, 파트너십 전략에 대해 실용적이고 구체적인 조언을 제공합니다.
답변은 항상 한국어로 작성하며, 실행 가능하고 구체적인 내용으로 구성합니다.
관련 없는 질문에는 정중히 주제를 안내합니다.`

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS })
}

export async function onRequestPost(context) {
  const { request, env } = context

  if (!env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API 키가 설정되지 않았습니다.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS } }
    )
  }

  let message, history
  try {
    ;({ message, history = [] } = await request.json())
  } catch {
    return new Response(
      JSON.stringify({ error: '잘못된 요청입니다.' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...CORS } }
    )
  }

  if (!message?.trim()) {
    return new Response(
      JSON.stringify({ error: '메시지를 입력해주세요.' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...CORS } }
    )
  }

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: message },
      ],
      stream: true,
      max_tokens: 1500,
      temperature: 0.7,
    }),
  })

  if (!openaiRes.ok) {
    const err = await openaiRes.text()
    return new Response(
      JSON.stringify({ error: err }),
      { status: openaiRes.status, headers: { 'Content-Type': 'application/json', ...CORS } }
    )
  }

  return new Response(openaiRes.body, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', ...CORS },
  })
}
