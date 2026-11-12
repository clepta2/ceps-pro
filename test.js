/**
 * test.js
 * Bateria de Testes Unitários do CEP & Geolog Pro
 */
import worker, { validarCepEstrutura } from './worker.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('🧪 Iniciando Testes Unitários do CEP & Geolog Pro...');

// 1. CEPs Válidos por Faixa Estadual dos Correios
console.log('\n--- 1. Validação Estrutural de CEPs ---');
const sp = validarCepEstrutura('01310-100'); // Av Paulista, SP
assert(sp.valido === true, 'Valida CEP de São Paulo');
assert(sp.ufPrevista === 'SP' && sp.dddPadrao === '11', 'Deduz UF SP e DDD 11');

const rj = validarCepEstrutura('20031-170'); // Centro, Rio de Janeiro
assert(rj.valido === true, 'Valida CEP do Rio de Janeiro');
assert(rj.ufPrevista === 'RJ' && rj.dddPadrao === '21', 'Deduz UF RJ e DDD 21');

const df = validarCepEstrutura('70040-010'); // Brasília, DF
assert(df.valido === true, 'Valida CEP do Distrito Federal');
assert(df.ufPrevista === 'DF' && df.dddPadrao === '61', 'Deduz UF DF e DDD 61');

// 2. Rejeição de CEPs Inválidos
console.log('\n--- 2. Bloqueio de CEPs Inválidos ---');
const zeros = validarCepEstrutura('00000-000');
assert(zeros.valido === false, 'Rejeita CEP zerado');

const reps = validarCepEstrutura('11111-111');
assert(reps.valido === false, 'Rejeita dígitos repetidos');

const curto = validarCepEstrutura('1234');
assert(curto.valido === false, 'Rejeita tamanho menor que 8 dígitos');

// 3. Consulta em lote
console.log('\n--- 3. Rota de Consulta em Lote ---');
const loteResponse = await worker.fetch(new Request('https://api.test/api/cep/lote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ceps: ['invalido', '11111111'] })
}), {});
const loteBody = await loteResponse.json();
assert(loteResponse.status === 200, 'A rota de lote é reconhecida');
assert(loteBody.totalSolicitado === 2 && loteBody.resultados.length === 2, 'O lote retorna somente os CEPs solicitados');
assert(loteBody.resultados.every((item) => item.ok === false), 'CEPs inválidos são reportados individualmente');

const sucessoLoteResponse = await worker.fetch(new Request('https://api.test/api/cep/lote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ceps: ['01310-100'] })
}), {
  CEPS_KV: {
    get: async (key) => key === '01310100' ? {
      logradouro: 'Avenida Paulista',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      fonte: 'kv_test'
    } : null
  }
});
const sucessoLoteBody = await sucessoLoteResponse.json();
assert(sucessoLoteBody.totalEncontrado === 1 && sucessoLoteBody.resultados[0].cepLimpo === '01310100', 'O lote resolve e retorna somente o CEP solicitado');

const limiteResponse = await worker.fetch(new Request('https://api.test/api/ceps/lote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ceps: Array(6).fill('invalido') })
}), {});
assert(limiteResponse.status === 413, 'O lote gratuito acima de cinco itens é rejeitado claramente');

const metodoResponse = await worker.fetch(new Request('https://api.test/api/cep/lote'), {});
assert(metodoResponse.status === 405, 'A rota de lote exige POST');

console.log(`\n📊 Resultado: ${passed} passaram, ${failed} falharam.\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 Todos os testes unitários do CEP & Geolog Pro passaram com 100% de sucesso!');
}
