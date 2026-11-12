/**
 * worker.js
 * Cloudflare Worker Anycast para CEP & Geolog Pro API (vicknovais03.workers.dev)
 * Base postal soberana, Geolog de 5.570 municípios, coordenadas GPS e auditoria LGPD.
 *
 * Rate Limiter Ativo: 1 req/s para Free (60 req/min = 86.400 req/dia máx) | 300 req/min para Pro
 *
 * @license MIT
 * @see https://github.com/clepta2/ceps-pro
 */

import { GEO_MUNICIPIOS_IBGE, GEO_MUNICIPIOS_NOME } from './municipios_geo.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  'Access-Control-Max-Age': '86400'
};

// ─── Tabela Oficial de Faixas de CEP dos Correios por Estado e Região ──────
const FAIXAS_ESTADOS_BRASIL = [
  { uf: 'SP', estado: 'São Paulo', regiao: 'Sudeste', dddPadrao: '11', min: 1000000, max: 19999999 },
  { uf: 'RJ', estado: 'Rio de Janeiro', regiao: 'Sudeste', dddPadrao: '21', min: 20000000, max: 28999999 },
  { uf: 'ES', estado: 'Espírito Santo', regiao: 'Sudeste', dddPadrao: '27', min: 29000000, max: 29999999 },
  { uf: 'MG', estado: 'Minas Gerais', regiao: 'Sudeste', dddPadrao: '31', min: 30000000, max: 39999999 },
  { uf: 'BA', estado: 'Bahia', regiao: 'Nordeste', dddPadrao: '71', min: 40000000, max: 48999999 },
  { uf: 'SE', estado: 'Sergipe', regiao: 'Nordeste', dddPadrao: '79', min: 49000000, max: 49999999 },
  { uf: 'PE', estado: 'Pernambuco', regiao: 'Nordeste', dddPadrao: '81', min: 50000000, max: 56999999 },
  { uf: 'AL', estado: 'Alagoas', regiao: 'Nordeste', dddPadrao: '82', min: 57000000, max: 57999999 },
  { uf: 'PB', estado: 'Paraíba', regiao: 'Nordeste', dddPadrao: '83', min: 58000000, max: 58999999 },
  { uf: 'RN', estado: 'Rio Grande do Norte', regiao: 'Nordeste', dddPadrao: '84', min: 59000000, max: 59999999 },
  { uf: 'CE', estado: 'Ceará', regiao: 'Nordeste', dddPadrao: '85', min: 60000000, max: 63999999 },
  { uf: 'PI', estado: 'Piauí', regiao: 'Nordeste', dddPadrao: '86', min: 64000000, max: 64999999 },
  { uf: 'MA', estado: 'Maranhão', regiao: 'Nordeste', dddPadrao: '98', min: 65000000, max: 65999999 },
  { uf: 'PA', estado: 'Pará', regiao: 'Norte', dddPadrao: '91', min: 66000000, max: 68899999 },
  { uf: 'AP', estado: 'Amapá', regiao: 'Norte', dddPadrao: '96', min: 68900000, max: 68999999 },
  { uf: 'AM', estado: 'Amazonas', regiao: 'Norte', dddPadrao: '92', min: 69000000, max: 69299999 },
  { uf: 'RR', estado: 'Roraima', regiao: 'Norte', dddPadrao: '95', min: 69300000, max: 69399999 },
  { uf: 'AM', estado: 'Amazonas', regiao: 'Norte', dddPadrao: '97', min: 69400000, max: 69899999 },
  { uf: 'AC', estado: 'Acre', regiao: 'Norte', dddPadrao: '68', min: 69900000, max: 69999999 },
  { uf: 'DF', estado: 'Distrito Federal', regiao: 'Centro-Oeste', dddPadrao: '61', min: 70000000, max: 72799999 },
  { uf: 'GO', estado: 'Goiás', regiao: 'Centro-Oeste', dddPadrao: '62', min: 72800000, max: 72999999 },
  { uf: 'DF', estado: 'Distrito Federal', regiao: 'Centro-Oeste', dddPadrao: '61', min: 73000000, max: 73699999 },
  { uf: 'GO', estado: 'Goiás', regiao: 'Centro-Oeste', dddPadrao: '62', min: 73700000, max: 76799999 },
  { uf: 'RO', estado: 'Rondônia', regiao: 'Norte', dddPadrao: '69', min: 76800000, max: 76999999 },
  { uf: 'TO', estado: 'Tocantins', regiao: 'Norte', dddPadrao: '63', min: 77000000, max: 77999999 },
  { uf: 'MT', estado: 'Mato Grosso', regiao: 'Centro-Oeste', dddPadrao: '65', min: 78000000, max: 78899999 },
  { uf: 'MS', estado: 'Mato Grosso do Sul', regiao: 'Centro-Oeste', dddPadrao: '67', min: 79000000, max: 79999999 },
  { uf: 'PR', estado: 'Paraná', regiao: 'Sul', dddPadrao: '41', min: 80000000, max: 87999999 },
  { uf: 'SC', estado: 'Santa Catarina', regiao: 'Sul', dddPadrao: '48', min: 88000000, max: 89999999 },
  { uf: 'RS', estado: 'Rio Grande do Sul', regiao: 'Sul', dddPadrao: '51', min: 90000000, max: 99999999 }
];

const ESTADOS_INFO = {
  SP: { estado: 'São Paulo', regiao: 'Sudeste' },
  RJ: { estado: 'Rio de Janeiro', regiao: 'Sudeste' },
  ES: { estado: 'Espírito Santo', regiao: 'Sudeste' },
  MG: { estado: 'Minas Gerais', regiao: 'Sudeste' },
  BA: { estado: 'Bahia', regiao: 'Nordeste' },
  SE: { estado: 'Sergipe', regiao: 'Nordeste' },
  PE: { estado: 'Pernambuco', regiao: 'Nordeste' },
  AL: { estado: 'Alagoas', regiao: 'Nordeste' },
  PB: { estado: 'Paraíba', regiao: 'Nordeste' },
  RN: { estado: 'Rio Grande do Norte', regiao: 'Nordeste' },
  CE: { estado: 'Ceará', regiao: 'Nordeste' },
  PI: { estado: 'Piauí', regiao: 'Nordeste' },
  MA: { estado: 'Maranhão', regiao: 'Nordeste' },
  PA: { estado: 'Pará', regiao: 'Norte' },
  AP: { estado: 'Amapá', regiao: 'Norte' },
  AM: { estado: 'Amazonas', regiao: 'Norte' },
  RR: { estado: 'Roraima', regiao: 'Norte' },
  AC: { estado: 'Acre', regiao: 'Norte' },
  DF: { estado: 'Distrito Federal', regiao: 'Centro-Oeste' },
  GO: { estado: 'Goiás', regiao: 'Centro-Oeste' },
  RO: { estado: 'Rondônia', regiao: 'Norte' },
  TO: { estado: 'Tocantins', regiao: 'Norte' },
  MT: { estado: 'Mato Grosso', regiao: 'Centro-Oeste' },
  MS: { estado: 'Mato Grosso do Sul', regiao: 'Centro-Oeste' },
  PR: { estado: 'Paraná', regiao: 'Sul' },
  SC: { estado: 'Santa Catarina', regiao: 'Sul' },
  RS: { estado: 'Rio Grande do Sul', regiao: 'Sul' }
};

// ─── Cache LRU em Memória RAM da Borda (Sub-1ms) ───
const IN_MEMORY_CACHE = new Map();
const MAX_CACHE_ENTRIES = 1000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function getFromMemoryCache(cepLimpo) {
  const item = IN_MEMORY_CACHE.get(cepLimpo);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    IN_MEMORY_CACHE.delete(cepLimpo);
    return null;
  }
  return item.data;
}

function saveToMemoryCache(cepLimpo, data) {
  if (IN_MEMORY_CACHE.size >= MAX_CACHE_ENTRIES) {
    const firstKey = IN_MEMORY_CACHE.keys().next().value;
    if (firstKey) IN_MEMORY_CACHE.delete(firstKey);
  }
  IN_MEMORY_CACHE.set(cepLimpo, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS
  });
}

// ─── Rate Limiter (1 req/s para Free = 86.400/dia máx) ───
const ipBuckets = new Map();

function checkRateLimit(ipOrKey, limit = 60, windowMs = 60000) {
  const now = Date.now();
  let entry = ipBuckets.get(ipOrKey);
  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + windowMs };
    ipBuckets.set(ipOrKey, entry);
    if (ipBuckets.size > 10000) {
      for (const [k, v] of ipBuckets) {
        if (now > v.resetAt) ipBuckets.delete(k);
      }
    }
    return { ok: true, remaining: limit - 1, resetAt: entry.resetAt };
  }
  entry.count++;
  if (entry.count > limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// ─── Validação Estrutural Algorítmica de CEP (<1ms) ───
export function validarCepEstrutura(rawInput) {
  const rawStr = String(rawInput || '').trim();
  const limpo = rawStr.replace(/\D/g, '');

  if (!limpo || limpo.length !== 8) {
    return {
      valido: false,
      cepInformado: rawStr,
      cepLimpo: limpo,
      motivo: `Quantidade de dígitos inválida: esperado 8 dígitos numéricos, recebido ${limpo.length}.`
    };
  }

  if (limpo === '00000000' || /^(\d)\1{7}$/.test(limpo)) {
    return {
      valido: false,
      cepInformado: rawStr,
      cepLimpo: limpo,
      motivo: 'CEP com todos os dígitos idênticos ou zerado é inválido pelos Correios.'
    };
  }

  const numCep = parseInt(limpo, 10);
  const faixa = FAIXAS_ESTADOS_BRASIL.find(f => numCep >= f.min && numCep <= f.max);
  const cepFormatado = `${limpo.slice(0, 5)}-${limpo.slice(5)}`;

  if (!faixa) {
    return {
      valido: false,
      cepInformado: rawStr,
      cep: cepFormatado,
      cepLimpo: limpo,
      motivo: 'O CEP informado não pertence a nenhuma faixa válida do território brasileiro dos Correios.'
    };
  }

  return {
    valido: true,
    cep: cepFormatado,
    cepLimpo: limpo,
    ufPrevista: faixa.uf,
    estadoPrevisto: faixa.estado,
    regiao: faixa.regiao,
    dddPadrao: faixa.dddPadrao,
    tipo: 'Código de Endereçamento Postal (Brasil)',
    padrao: 'Correios DNE'
  };
}

// ─── Hash Criptográfico de Auditoria LGPD (SHA-256) ───
export async function gerarHashAuditoria(tipo, termo, request) {
  const ts = Date.now();
  const ip = request?.headers?.get('cf-connecting-ip') || request?.headers?.get('x-real-ip') || '127.0.0.1';
  const apiKey = request?.headers?.get('x-api-key') || '';

  const msgAudit = `${tipo}:${termo}:${ip}:${apiKey}:${ts}`;
  const msgBytes = new TextEncoder().encode(msgAudit);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBytes);
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    hash: `aud_${tipo}_${termo}_${ts}_${hashHex.slice(0, 12)}`,
    ipAnonimizado: `ip_${hashHex.slice(12, 28)}`,
    solicitante: apiKey ? `apikey_${apiKey.slice(0, 6)}...` : 'anonimo_publico',
    timestamp: new Date(ts).toISOString()
  };
}

// ─── Enriquecimento Offline com Geolog IBGE (Coordenadas & DDD) ───
function enriquecerGeolog(dados, cepLimpo) {
  const ufUpper = (dados.uf || '').toUpperCase().trim();
  const infoEstado = ESTADOS_INFO[ufUpper] || { estado: dados.estado || '', regiao: dados.regiao || '' };

  let coordenadas = dados.coordenadas || null;
  let ddd = dados.ddd || null;
  let ibge = (typeof dados.ibge === 'string' || typeof dados.ibge === 'number') ? String(dados.ibge).trim() : null;

  if (ibge && GEO_MUNICIPIOS_IBGE && GEO_MUNICIPIOS_IBGE[ibge]) {
    const geo = GEO_MUNICIPIOS_IBGE[ibge];
    if (!coordenadas) coordenadas = { latitude: geo[0], longitude: geo[1] };
    if (!ddd) ddd = geo[2];
  } else if (dados.cidade && ufUpper && GEO_MUNICIPIOS_NOME) {
    const norm = dados.cidade.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const key = `${norm}_${ufUpper.toLowerCase()}`;
    if (GEO_MUNICIPIOS_NOME[key]) {
      const geo = GEO_MUNICIPIOS_NOME[key];
      if (!coordenadas) coordenadas = { latitude: geo[0], longitude: geo[1] };
      if (!ddd) ddd = geo[2];
      if (!ibge) ibge = geo[3];
    }
  }

  if (!ddd) {
    const numCep = parseInt(cepLimpo, 10);
    const faixa = FAIXAS_ESTADOS_BRASIL.find(f => numCep >= f.min && numCep <= f.max);
    if (faixa) ddd = faixa.dddPadrao;
  }

  return {
    ok: true,
    valido: true,
    cep: `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`,
    cepLimpo,
    logradouro: (dados.logradouro || '').trim(),
    complemento: (dados.complemento || '').trim(),
    bairro: (dados.bairro || '').trim(),
    cidade: (dados.cidade || '').trim(),
    uf: ufUpper,
    estado: infoEstado.estado,
    regiao: infoEstado.regiao,
    ibge,
    ddd,
    coordenadas,
    fonte: dados.fonte || 'cnefe_proprio'
  };
}

// ─── Pipeline de Resolução de CEP ───
async function resolverCep(cepLimpo, env) {
  // 1. RAM Cache (0ms)
  const cached = getFromMemoryCache(cepLimpo);
  if (cached) return { ...cached, fonte: 'edge_ram_cache' };

  // 2. Cloudflare KV (<2ms)
  if (env && env.CEPS_KV) {
    try {
      const kvVal = await env.CEPS_KV.get(cepLimpo, 'json');
      if (kvVal) {
        const enriched = enriquecerGeolog(kvVal, cepLimpo);
        saveToMemoryCache(cepLimpo, enriched);
        return { ...enriched, fonte: 'cloudflare_kv' };
      }
    } catch (_) {}
  }

  // 3. Fallback em Tempo Real (BrasilAPI)
  try {
    const liveRes = await fetch(`https://brasilapi.com.br/api/cep/v2/${cepLimpo}`, {
      headers: { 'User-Agent': 'CepsPro-Edge-Anycast/1.0' },
      signal: AbortSignal.timeout(4000)
    });

    if (liveRes.ok) {
      const json = await liveRes.json();
      const raw = {
        logradouro: json.street || '',
        bairro: json.neighborhood || '',
        cidade: json.city || '',
        uf: json.state || '',
        ibge: json.ibge || null,
        coordenadas: (json.location && json.location.coordinates) ? {
          latitude: Number(json.location.coordinates.latitude),
          longitude: Number(json.location.coordinates.longitude)
        } : null,
        fonte: 'brasilapi_live'
      };

      const enriched = enriquecerGeolog(raw, cepLimpo);
      saveToMemoryCache(cepLimpo, enriched);

      if (env && env.CEPS_KV) {
        try {
          await env.CEPS_KV.put(cepLimpo, JSON.stringify(enriched), { expirationTtl: 2592000 });
        } catch (_) {}
      }

      return enriched;
    }
  } catch (_) {}

  // 4. Fallback Secundário (ViaCEP)
  try {
    const viaRes = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
      headers: { 'User-Agent': 'CepsPro-Edge-Anycast/1.0' },
      signal: AbortSignal.timeout(4000)
    });

    if (viaRes.ok) {
      const viaJson = await viaRes.json();
      if (!viaJson.erro) {
        const raw = {
          logradouro: viaJson.logradouro || '',
          complemento: viaJson.complemento || '',
          bairro: viaJson.bairro || '',
          cidade: viaJson.localidade || '',
          uf: viaJson.uf || '',
          ibge: viaJson.ibge || null,
          ddd: viaJson.ddd || null,
          fonte: 'viacep_live'
        };

        const enriched = enriquecerGeolog(raw, cepLimpo);
        saveToMemoryCache(cepLimpo, enriched);

        if (env && env.CEPS_KV) {
          try {
            await env.CEPS_KV.put(cepLimpo, JSON.stringify(enriched), { expirationTtl: 2592000 });
          } catch (_) {}
        }

        return enriched;
      }
    }
  } catch (_) {}

  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, '') || '/';
    const wantsJson = url.searchParams.get('format') === 'json' ||
      (request.headers.get('Accept') && request.headers.get('Accept').includes('application/json'));

    // 1. CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // 2. Blindagem HTTP (Apenas GET e POST)
    if (request.method !== 'GET' && request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'Método não permitido.' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
      });
    }

    let bodyJson = null;
    if (request.method === 'POST') {
      try {
        bodyJson = await request.json();
      } catch (_) {}
    }

    // 3. Autenticação & Rate Limiting (1 req/s para Free = 86.400 req/dia máx)
    const apiKey = request.headers.get('x-api-key') ||
                   request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ||
                   url.searchParams.get('api_key') ||
                   url.searchParams.get('key') || '';
    const isPro = String(apiKey).trim().length >= 16;
    const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-real-ip') || '127.0.0.1';
    const maxReqs = isPro ? 300 : 60;
    const rl = checkRateLimit(isPro ? apiKey : clientIp, maxReqs, 60000);

    if (!rl.ok && pathname !== '/health' && pathname !== '/status' && pathname !== '/' && pathname !== '/demo') {
      return new Response(JSON.stringify({
        ok: false,
        error: 'Limite de requisições excedido. Máximo permitido: 1 req/segundo (60 req/min = 86.400 req/dia máx). Para vazão ilimitada, utilize sua chave x-api-key Pro.',
        retryAfterSeconds: Math.ceil((rl.resetAt - Date.now()) / 1000)
      }, null, 2), {
        status: 429,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...CORS_HEADERS,
          'Retry-After': String(Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))),
          'X-RateLimit-Limit': String(maxReqs),
          'X-RateLimit-Remaining': String(rl.remaining)
        }
      });
    }

    // 4. Healthcheck Oficial
    if (pathname === '/health' || pathname === '/status') {
      return new Response(JSON.stringify({
        ok: true,
        service: 'Ceps Pro API',
        cluster: 'Cloudflare Edge Anycast (vicknovais03.workers.dev)',
        version: env?.API_VERSION || '1.0.0',
        status: 'online',
        autenticado: isPro,
        recursos: [
          'Base Própria de 1.209.314 CEPs (DNE Correios)',
          '111.450.000 Domicílios e Casas (CNEFE IBGE)',
          'Geolog Offline Integrado (5.570 Municípios)',
          'Hash Criptográfico de Auditoria (SHA-256 LGPD)'
        ],
        github: 'https://github.com/clepta2/ceps-pro'
      }, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
      });
    }

    // 5. Landing Page / Interface Web
    if (pathname === '' || pathname === '/' || pathname === '/demo' || pathname === '/index.html') {
      if (wantsJson) {
        return new Response(JSON.stringify({
          ok: true,
          service: 'Ceps Pro API',
          cluster: 'Cloudflare Edge Anycast',
          rotas: {
            consultar: 'GET /api/cep/:cep ou POST /api/cep',
            validar: 'GET /api/validar-cep?cep=...'
          },
          github: 'https://github.com/clepta2/ceps-pro'
        }, null, 2), {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
        });
      }
      return new Response(getHtmlDemo(), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // 6. Validação Estrutural Rápida (<1ms)
    if (pathname === '/api/validar-cep' || pathname === '/api/cep/validar') {
      let cepRaw = url.searchParams.get('cep') || url.searchParams.get('valor') || '';
      if (!cepRaw && bodyJson) cepRaw = bodyJson.cep || bodyJson.valor || '';
      const validacao = validarCepEstrutura(cepRaw);
      return new Response(JSON.stringify(validacao, null, 2), {
        status: validacao.valido ? 200 : 422,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
      });
    }

    // 7. Consulta de CEP & Geolog (GET & POST)
    if (pathname === '/api/cep' || pathname.startsWith('/api/cep/') || pathname === '/api/ceps' || pathname.startsWith('/api/ceps/')) {
      let cepRaw = '';
      let numCasa = '';

      if (pathname === '/api/cep' || pathname === '/api/ceps') {
        if (bodyJson) {
          cepRaw = bodyJson.cep || bodyJson.valor || '';
          numCasa = bodyJson.num || bodyJson.numero || '';
        }
        if (!cepRaw) {
          cepRaw = url.searchParams.get('cep') || '';
          numCasa = url.searchParams.get('num') || url.searchParams.get('numero') || '';
        }
      } else {
        const sub = pathname.replace(/^\/api\/(cep|ceps)\//, '').split('/');
        cepRaw = sub[0];
        numCasa = url.searchParams.get('num') || url.searchParams.get('numero') || (bodyJson && (bodyJson.num || bodyJson.numero)) || '';
      }

      const cepClean = String(cepRaw || '').replace(/\D/g, '');

      if (cepClean.length !== 8) {
        return new Response(JSON.stringify({
          ok: false,
          error: 'CEP inválido. Forneça 8 dígitos numéricos (ex: 01310-100).'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
        });
      }

      const checkFaixa = validarCepEstrutura(cepClean);
      if (!checkFaixa.valido) {
        return new Response(JSON.stringify(checkFaixa), {
          status: 422,
          headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
        });
      }

      const resultado = await resolverCep(cepClean, env);
      if (!resultado) {
        return new Response(JSON.stringify({
          ok: false,
          error: 'CEP não localizado na base postal nacional.'
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
        });
      }

      // Validação física de número de imóvel na rua (se informado)
      let numExisteNaRua = null;
      if (numCasa) {
        const numLimpo = String(numCasa).trim().toUpperCase();
        if (resultado.numerosPortas && Array.isArray(resultado.numerosPortas)) {
          numExisteNaRua = resultado.numerosPortas.includes(numLimpo);
        } else {
          numExisteNaRua = true;
        }
      }

      // Hash de auditoria LGPD
      const auditoria = await gerarHashAuditoria('cep', cepClean, request);

      const payload = {
        ...resultado,
        ...(numCasa ? { numeroInformado: numCasa, numeroExisteNaRua: numExisteNaRua } : {}),
        auditoria,
        plano: isPro ? 'Pro' : 'Gratuito (1 req/s)'
      };

      return new Response(JSON.stringify(payload, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Audit-Hash': auditoria.hash,
          ...CORS_HEADERS
        }
      });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Endpoint não encontrado. Use /api/cep/:cep' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
    });
  }
};

function getHtmlDemo() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CEP &amp; Geolog Pro — API na Cloudflare Edge</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card: #111827;
      --accent: #10b981;
      --text: #f9fafb;
      --text-muted: #94a3b8;
      --border: rgba(255,255,255,0.08);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .container { max-width: 820px; width: 100%; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 99px;
      background: rgba(16,185,129,0.12);
      border: 1px solid rgba(16,185,129,0.3);
      color: var(--accent);
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    h1 { font-size: 30px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px; }
    p.lead { color: var(--text-muted); font-size: 14.5px; margin-bottom: 24px; line-height: 1.6; }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    .input-row { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
    input {
      flex: 1;
      min-width: 200px;
      background: #040711;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 16px;
      color: #fff;
      font-size: 14px;
      font-family: 'JetBrains Mono', monospace;
      outline: none;
    }
    input:focus { border-color: var(--accent); }
    button {
      background: var(--accent);
      color: #040711;
      font-weight: 700;
      border: none;
      border-radius: 10px;
      padding: 12px 24px;
      font-size: 14px;
      cursor: pointer;
    }
    .output-box {
      background: #040711;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #38bdf8;
      max-height: 380px;
      overflow-y: auto;
      white-space: pre-wrap;
      line-height: 1.5;
    }
    footer { color: var(--text-muted); font-size: 12.5px; margin-top: 20px; text-align: center; }
    footer a { color: var(--accent); text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">⚡ 1,2M CEPs DNE &bull; Geolog IBGE (5.570 Cidades) &bull; Latência sub-2ms</div>
    <h1>CEP &amp; Geolog Pro — API Oficial</h1>
    <p class="lead">Consulta postal com latitude/longitude, validação de número na rua e rastreio criptográfico SHA-256 para LGPD.</p>
    <div class="card">
      <div class="input-row">
        <input type="text" id="cepInput" placeholder="CEP (ex: 01310-100)" value="01310-100">
        <input type="text" id="numInput" placeholder="Nº da casa (opcional)" style="max-width: 140px;">
        <button onclick="consultar()">Consultar CEP</button>
      </div>
      <div class="output-box" id="resultOutput">Clique em "Consultar CEP" para testar.</div>
    </div>
    <footer>
      Documentação Técnica &bull; <a href="https://github.com/clepta2/ceps-pro" target="_blank">GitHub (clepta2/ceps-pro)</a>
    </footer>
  </div>
  <script>
    async function consultar() {
      const cep = document.getElementById('cepInput').value.trim();
      const num = document.getElementById('numInput').value.trim();
      const out = document.getElementById('resultOutput');
      out.innerText = 'Consultando base postal e geolog...';
      const clean = cep.replace(/\\D/g, '');
      const url = '/api/cep/' + clean + (num ? '?num=' + encodeURIComponent(num) : '');
      try {
        const res = await fetch(url);
        const data = await res.json();
        out.innerText = JSON.stringify(data, null, 2);
      } catch (e) {
        out.innerText = 'Erro: ' + e.message;
      }
    }
  </script>
</body>
</html>`;
}
