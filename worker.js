// ============================================================
// Cloudflare Worker — Proxy NVIDIA NIM API
// Passagem de Plantão — Sala Vermelha / Retaguarda do Trauma
// ============================================================
// Variável de ambiente necessária (configurar no dashboard):
//   NVIDIA_API_KEY = nvapi-SUA_CHAVE_AQUI
// ============================================================

const NVIDIA_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {

    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Apenas POST
    if (request.method !== 'POST') {
      return new Response('Método não permitido.', { status: 405, headers: CORS_HEADERS });
    }

    // Verificar chave configurada
    if (!env.NVIDIA_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'NVIDIA_API_KEY não configurada no Worker.' }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'JSON inválido no corpo da requisição.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // Encaminhar para NVIDIA
    const nvidiaResponse = await fetch(NVIDIA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.NVIDIA_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await nvidiaResponse.json();

    return new Response(JSON.stringify(data), {
      status: nvidiaResponse.status,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  },
};
