# 📍 CEP & Geolog Pro — Edge Postal & Geolocation API

> **Microsserviço de Alta Frequência em Cloudflare Edge (<2ms)**  
> Base postal completa cobrindo **100% do Brasil**: 1.209.314 CEPs oficiais dos Correios (DNE) + 111.450.000 domicílios e números de casas do Censo IBGE (CNEFE 2022).  
> Geolog Integrado com Coordenadas GPS (Latitude e Longitude) e DDD de todos os 5.570 municípios do Brasil.  
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

### 2. Validação Estrutural Rápida (<1ms, sem chamada externa)
```bash
curl -X GET "https://ceps-pro-api.vicknovais03.workers.dev/api/validar-cep?cep=01310-100"
```

---

## 🛡️ Rate Limiting & Proteção de Cotas

- **Plano Gratuito / Básico:** 1 requisição por segundo (60 req/min = **máximo de 86.400 requisições/dia**).
- **Plano Pro / Enterprise (`x-api-key`):** Até 300 requisições/minuto.
- Se a cota por segundo for ultrapassada, a API retorna `429 Too Many Requests` com cabeçalho `Retry-After: 1`.

---

## 🧪 Bateria de Testes

```bash
npm test
```
