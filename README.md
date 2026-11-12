# 📍 CEP & Geolog Pro — Edge Postal & Geolocation API

> **Microsserviço de Alta Frequência em Cloudflare Edge (<2ms)**  
> Consulta CEP pelo KV quando populado, com fallback para BrasilAPI e ViaCEP. A disponibilidade de uma base DNE/CNEFE própria completa não está confirmada.
> Geolog complementado por dados municipais integrados e pelos provedores de consulta.
> **Hash Criptográfico de Auditoria (SHA-256)** em cada requisição para conformidade estrita com a LGPD.

[![Status](https://img.shields.io/badge/Status-Cloudflare%20Edge%20API-success.svg)](#)
[![Latency](https://img.shields.io/badge/Latency-sub--2ms-10b981.svg)](#)
[![Audit](https://img.shields.io/badge/Audit-SHA--256%20LGPD-38bdf8.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ⚡ Endpoints Oficiais em Produção

Base URL Oficial de Borda (Cloudflare Anycast):  
👉 **`https://ceps-pro-api.vicknovais03.workers.dev`**

### 1. Consulta Completa de CEP & Geolog (GET & POST)
```bash
# Consulta por CEP
curl -X GET "https://ceps-pro-api.vicknovais03.workers.dev/api/cep/01310100"

# Consulta com validação física do número da casa na rua
curl -X GET "https://ceps-pro-api.vicknovais03.workers.dev/api/cep/01310100?num=1000"

# Consulta via POST (JSON)
curl -X POST "https://ceps-pro-api.vicknovais03.workers.dev/api/cep" \
  -H "Content-Type: application/json" \
  -d '{"cep": "01310-100", "num": "1000"}'
```

### Consulta de CEPs em lote
Envie somente os CEPs desejados. O limite é de 50 CEPs por requisição no plano Pro e 5 no gratuito:
```bash
curl -X POST "https://ceps-pro-api.vicknovais03.workers.dev/api/cep/lote" \
  -H "Content-Type: application/json" \
  -H "x-api-key: SUA_CHAVE_PRO" \
  -d '{"ceps":["01310-100","20031-170"]}'
```
Cada CEP enviado recebe seu próprio resultado ou erro; o endpoint não envia outros registros.

### 2. Validação Estrutural Rápida (<1ms, sem chamada externa)
```bash
curl -X GET "https://ceps-pro-api.vicknovais03.workers.dev/api/validar-cep?cep=01310-100"
```

---

## 🛡️ Rate Limiting & Proteção de Cotas

- **Plano Gratuito / Básico:** até 60 requisições por janela de 60 segundos no isolate.
- **Plano Pro / Enterprise (`x-api-key`):** Até 300 requisições/minuto.
- O contador em memória não é uma cota diária global e não é compartilhado entre todos os isolates/locais de borda da Cloudflare. A API retorna `429 Too Many Requests` com cabeçalho `Retry-After` quando o contador daquele isolate excede o limite.

---

## 🧪 Bateria de Testes

```bash
npm test
```
