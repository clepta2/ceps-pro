import fs from 'fs';

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CEPs Pro • Consulta Postal & Geolog Anycast • Ponte API Market</title>
  <meta name="description" content="Consulta ultrarrápida (<8ms) de 1,2 milhão de CEPs brasileiros com coordenadas GPS, código IBGE e DDD oficial na Cloudflare Edge Anycast." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css?v=4.0.0" />
  <script>
    (function() {
      const savedTheme = localStorage.getItem('ponte.theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', savedTheme);
    })();
  </script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    svg.lucide, .lucide {
      width: 18px !important;
      height: 18px !important;
      stroke-width: 2 !important;
      display: inline-block;
      vertical-align: middle;
    }
    .nav-link svg, .nav-link .lucide {
      width: 18px !important;
      height: 18px !important;
    }
    .brand-mark svg {
      width: 22px !important;
      height: 22px !important;
    }
    .playground-split {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
      gap: 24px;
      margin-top: 24px;
      width: 100%;
      min-width: 0;
    }
    @media (max-width: 1100px) {
      .playground-split { grid-template-columns: 1fr !important; gap: 18px !important; }
    }
    .playground-left,
    .playground-right,
    .tab-pane,
    .card-dashboard,
    .terminal-window {
      min-width: 0 !important;
      max-width: 100% !important;
      overflow: hidden;
    }
    .specs-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .specs-table tr {
      border-bottom: 1px solid var(--line-light);
    }
    .specs-table td {
      padding: 12px 16px;
      vertical-align: middle;
    }
    .specs-table td.label-col {
      color: var(--muted);
      font-weight: 600;
      width: 40%;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    .specs-table td.val-col {
      color: var(--ink);
      font-weight: 700;
      text-align: right;
    }
    .tab-nav-bar {
      display: flex;
      gap: 8px;
      background: var(--paper-elevated, #f1f5f2);
      padding: 6px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--line);
      margin-bottom: 24px;
      overflow-x: auto;
    }
    :root[data-theme="dark"] .tab-nav-bar {
      background: #0d1527;
      border-color: #1e293b;
    }
    .tab-nav-btn {
      flex: 1;
      min-height: 40px;
      padding: 0 18px;
      border: none;
      background: transparent;
      border-radius: var(--radius-md);
      font-size: 12.5px;
      font-weight: 600;
      color: var(--muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      white-space: nowrap;
      transition: all 0.16s ease;
    }
    .tab-nav-btn:hover {
      color: var(--ink);
      background: rgba(255, 255, 255, 0.05);
    }
    .tab-nav-btn.is-active {
      background: var(--paper);
      color: var(--ink);
      font-weight: 800;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    :root[data-theme="dark"] .tab-nav-btn.is-active {
      background: #1e293b;
      color: #fff;
    }
    .status-badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 11px;
      border-radius: var(--radius-full);
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .status-badge-pill.green {
      background: rgba(16, 185, 129, 0.12);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .status-badge-pill.red {
      background: rgba(239, 68, 68, 0.12);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .status-badge-pill.blue {
      background: rgba(59, 130, 246, 0.12);
      color: #3b82f6;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    .terminal-window {
      background: #091311;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
      display: flex;
      flex-direction: column;
    }
    .terminal-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      background: rgba(255, 255, 255, 0.04);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .terminal-dots {
      display: flex;
      gap: 7px;
    }
    .terminal-dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
    }
    .terminal-dot.red { background: #ef4444; }
    .terminal-dot.yellow { background: #f59e0b; }
    .terminal-dot.green { background: #10b981; }
    .card-dashboard {
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }
  </style>
</head>
<body>
  <div class="sidebar-drawer-backdrop" id="sidebar-drawer-backdrop" hidden></div>
  <div class="app-shell">
    <!-- Sidebar Oficial do Ecossistema Ponte / OZPro -->
    <aside class="sidebar" aria-label="Navegação principal">
      <button class="sidebar-drawer-close" id="sidebar-drawer-close" aria-label="Fechar menu lateral"><i data-lucide="x"></i></button>
      <a class="brand" href="#consulta" aria-label="Ponte API, CEPs Pro">
        <img src="brand/ozpro-mark.svg" alt="Ponte API Logo" style="width:38px;height:38px;border-radius:10px;object-fit:contain;background:var(--mint);padding:4px;box-shadow:0 4px 12px rgba(163,230,53,0.35);" />
        <span><strong>ponte</strong><small>CEPS PRO · OZPRO</small></span>
      </a>

      <nav class="primary-nav" id="primary-nav">
        <div class="nav-section-label">FUNCIONALIDADES</div>
        <button class="nav-link is-active" data-view="consulta">
          <i data-lucide="map-pin"></i> <span>Consulta Postal CEP</span>
        </button>
        <button class="nav-link" data-view="geolog">
          <i data-lucide="compass"></i> <span>Geolog & GPS (5.570 Cidades)</span>
        </button>
        <button class="nav-link" data-view="lote">
          <i data-lucide="layers"></i> <span>Consulta em Lote</span>
        </button>
        <button class="nav-link" data-view="docs">
          <i data-lucide="book-open"></i> <span>Documentação REST</span>
        </button>

        <div class="nav-section-label">ECOSSISTEMA PONTE</div>
        <a class="nav-link" href="https://ponte-marketplace.maputo2.workers.dev" target="_blank" rel="noopener">
          <i data-lucide="layout-grid"></i> <span>API Marketplace</span>
          <span class="nav-ext"><i data-lucide="arrow-up-right"></i></span>
        </a>
        <a class="nav-link" href="https://github.com/clepta2/ceps-pro" target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
          <span>GitHub do Projeto</span>
          <span class="nav-ext"><i data-lucide="arrow-up-right"></i></span>
        </a>
      </nav>

      <div class="sidebar-bottom">
        <div class="status-row">
          <span class="status-dot connected"></span>
          <span>Cloudflare Edge · &lt;8ms</span>
        </div>
        <div class="profile-row">
          <div class="avatar lg">CP</div>
          <div class="profile-copy">
            <strong>CEPs & Geolog Pro</strong>
            <span>Base Postal Soberana DNE</span>
          </div>
        </div>
        <div class="sidebar-version">v2.0.0 · 1.2M+ CEPs · GPS</div>
      </div>
    </aside>

    <!-- Área Principal -->
    <main class="main-area">
      <!-- Topbar Oficial -->
      <header class="topbar">
        <button class="mobile-hamburger-btn" id="mobile-hamburger-btn" aria-label="Abrir menu lateral"><i data-lucide="menu"></i></button>
        <div class="breadcrumb">
          <span>Workspace</span>
          <i data-lucide="chevron-right"></i>
          <span>Dados & Cadastros</span>
          <i data-lucide="chevron-right"></i>
          <strong id="breadcrumb-title">Consulta Postal CEP</strong>
        </div>
        <div class="topbar-actions">
          <span class="environment">
            <span class="status-dot connected"></span>
            Cloudflare Anycast Global (330+ Cidades)
          </span>
          <button class="icon-button theme-toggle-btn" id="theme-toggle-btn" aria-label="Alternar tema" title="Alternar tema claro/escuro">
            <i data-lucide="moon"></i>
          </button>
          <a href="https://ponte-marketplace.maputo2.workers.dev" target="_blank" rel="noopener" class="primary-button accent" style="text-decoration:none;display:inline-flex;align-items:center;gap:7px;font-size:12.5px;padding:0 16px;height:36px;">
            <i data-lucide="sparkles"></i> <span>Catálogo Completo</span>
          </a>
        </div>
      </header>

      <!-- Conteúdo da Página -->
      <div class="content-wrap">
        <div class="page-heading">
          <div>
            <p class="eyebrow">BASE POSTAL SOBERANA DNE & GEOLOG</p>
            <h1>CEPs Pro • Console Oficial Anycast</h1>
            <p class="page-subtitle">
              Consulta ultrarrápida (&lt;8ms) de 1,2 milhão de CEPs brasileiros com autopreenchimento de endereços, coordenadas geográficas GPS (latitude/longitude), código IBGE e DDD oficial na borda Cloudflare.
            </p>
          </div>
        </div>

        <!-- Cards de Métricas -->
        <div class="billing-models-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); margin-bottom: 26px;">
          <div class="model-card credit-card" style="padding:18px 22px;">
            <div class="model-card-header" style="margin-bottom:10px;">
              <span class="model-badge credit"><i data-lucide="map-pin"></i> 1.2M+ CEPS DNE</span>
            </div>
            <div style="font-size:20px;font-weight:800;color:var(--ink);margin-bottom:4px;">Diretório Postal</div>
            <p style="font-size:12.5px;color:var(--muted);margin:0;line-height:1.45;">Logradouros, bairros, municípios e seccionamentos postais oficiais.</p>
          </div>

          <div class="model-card subscription-card" style="padding:18px 22px;">
            <div class="model-card-header" style="margin-bottom:10px;">
              <span class="model-badge sub"><i data-lucide="compass"></i> COORDENADAS GPS</span>
            </div>
            <div style="font-size:20px;font-weight:800;color:var(--ink);margin-bottom:4px;">Geolocalização</div>
            <p style="font-size:12.5px;color:var(--muted);margin:0;line-height:1.45;">Latitude e longitude integradas para cálculo de frete e rotas de entrega.</p>
          </div>

          <div class="model-card tier-card" style="padding:18px 22px;">
            <div class="model-card-header" style="margin-bottom:10px;">
              <span class="model-badge tier"><i data-lucide="zap"></i> SUB-8MS ANYCAST</span>
            </div>
            <div style="font-size:20px;font-weight:800;color:var(--ink);margin-bottom:4px;">Cache Inteligente</div>
            <p style="font-size:12.5px;color:var(--muted);margin:0;line-height:1.45;">Cache Anycast de 7 dias na RAM da Cloudflare para formulários sem fricção.</p>
          </div>
        </div>

        <!-- Abas -->
        <div class="tab-nav-bar">
          <button class="tab-nav-btn is-active" data-tab="consulta">
            <i data-lucide="map-pin"></i> <span>Busca Postal & Endereço</span>
          </button>
          <button class="tab-nav-btn" data-tab="geolog">
            <i data-lucide="compass"></i> <span>Geolog & GPS</span>
          </button>
        </div>

        <!-- Playground Split-Screen de 2 Colunas -->
        <div class="playground-split">
          <!-- Coluna 1: Formulário e Painel Visual -->
          <div class="playground-left">
            <div id="section-consulta" class="tab-pane">
              <div class="card-dashboard">
                <div style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
                  <span style="display:flex;align-items:center;gap:8px;">
                    <i data-lucide="search" style="color:var(--blue);"></i>
                    <span>Buscar CEP na Base Postal Anycast</span>
                  </span>
                  <span class="status-badge-pill green">DNE Correios</span>
                </div>
                <p style="font-size:12.5px;color:var(--muted);margin-bottom:16px;line-height:1.5;">
                  Digite o CEP (com ou sem hífen) para autopreencher endereço, coordenadas e código IBGE:
                </p>

                <!-- Input e Botão de Busca -->
                <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
                  <input type="text" id="cep-input" value="01310-100" placeholder="01310-100..." maxlength="9" style="flex:2;min-width:140px;height:44px;padding:0 14px;border:1px solid var(--line);border-radius:var(--radius-md);font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:var(--ink);background:var(--paper);outline:none;" />
                  <button id="btn-exec-cep" class="primary-button accent" style="height:44px;padding:0 18px;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:7px;">
                    <i data-lucide="play"></i> <span>Buscar</span>
                  </button>
                </div>

                <!-- Presets Rápidos Padronizados -->
                <div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center;font-size:11.5px;margin-bottom:20px;">
                  <span style="color:var(--muted);font-weight:600;">Exemplos rápidos:</span>
                  <button class="secondary-button sample-cep" data-cep="01310100" style="padding:4px 10px;font-size:11.5px;display:inline-flex;align-items:center;gap:5px;">
                    <i data-lucide="building"></i> <span>Av. Paulista (SP)</span>
                  </button>
                  <button class="secondary-button sample-cep" data-cep="22070001" style="padding:4px 10px;font-size:11.5px;display:inline-flex;align-items:center;gap:5px;">
                    <i data-lucide="map-pin"></i> <span>Copacabana (RJ)</span>
                  </button>
                  <button class="secondary-button sample-cep" data-cep="70040906" style="padding:4px 10px;font-size:11.5px;display:inline-flex;align-items:center;gap:5px;">
                    <i data-lucide="landmark"></i> <span>Esplanada (DF)</span>
                  </button>
                  <button class="secondary-button sample-cep" data-cep="40026010" style="padding:4px 10px;font-size:11.5px;display:inline-flex;align-items:center;gap:5px;">
                    <i data-lucide="compass"></i> <span>Pelourinho (BA)</span>
                  </button>
                </div>

                <!-- Tabela de Raio-X Postal -->
                <div style="border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;background:var(--paper);">
                  <div style="padding:12px 16px;background:var(--paper-elevated,#f8fafc);border-bottom:1px solid var(--line);font-size:13px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:7px;">
                    <i data-lucide="clipboard-list"></i>
                    <span>Dados de Endereço & Localização</span>
                  </div>
                  <table class="specs-table">
                    <tbody>
                      <tr>
                        <td class="label-col">Logradouro</td>
                        <td class="val-col" id="val-logradouro">Avenida Paulista</td>
                      </tr>
                      <tr>
                        <td class="label-col">Bairro</td>
                        <td class="val-col" id="val-bairro">Bela Vista</td>
                      </tr>
                      <tr>
                        <td class="label-col">Município / UF</td>
                        <td class="val-col" id="val-cidade-uf">São Paulo (SP)</td>
                      </tr>
                      <tr>
                        <td class="label-col">Código IBGE</td>
                        <td class="val-col" id="val-ibge" style="font-family:'JetBrains Mono',monospace;">3550308</td>
                      </tr>
                      <tr>
                        <td class="label-col">Coordenadas GPS</td>
                        <td class="val-col" id="val-coordenadas" style="font-family:'JetBrains Mono',monospace;">-23.5614, -46.6558</td>
                      </tr>
                      <tr>
                        <td class="label-col">DDD Oficial</td>
                        <td class="val-col" id="val-ddd">11</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- TAB 2: GEOLOG -->
            <div id="section-geolog" class="tab-pane" style="display:none;">
              <div class="card-dashboard">
                <div style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
                  <span style="display:flex;align-items:center;gap:8px;">
                    <i data-lucide="compass" style="color:var(--blue);"></i>
                    <span>Geolocalização & Latitude/Longitude</span>
                  </span>
                  <span class="status-badge-pill blue">WGS 84 GPS</span>
                </div>
                <div id="geolog-display-box" style="padding:16px;border-radius:var(--radius-md);background:var(--paper-elevated,#f8fafc);border:1px solid var(--line);margin-top:10px;font-size:13px;">
                  Coordenadas prontas para uso em APIs do Google Maps, OpenStreetMap e cálculos de distância Haversine.
                </div>
              </div>
            </div>
          </div>

          <!-- Coluna 2: Terminal Console Dark Oficial da Ponte API -->
          <div class="playground-right">
            <div class="terminal-window">
              <div class="terminal-topbar">
                <div class="terminal-dots">
                  <div class="terminal-dot red"></div>
                  <div class="terminal-dot yellow"></div>
                  <div class="terminal-dot green"></div>
                </div>
                <div class="snippet-lang-tabs" role="tablist">
                  <button class="snippet-tab is-active" data-lang="curl">cURL</button>
                  <button class="snippet-tab" data-lang="nodejs">Node.js</button>
                  <button class="snippet-tab" data-lang="python">Python</button>
                  <button class="snippet-tab" data-lang="php">PHP</button>
                </div>
                <button class="icon-button copy-mini" id="btn-copy-code" title="Copiar Snippet">
                  <i data-lucide="copy" style="width:14px;height:14px;"></i>
                </button>
              </div>

              <!-- Caixa de Código do Snippet -->
              <div class="snippet-code-box" style="padding:14px 18px;background:rgba(0,0,0,0.30);border-bottom:1px solid rgba(255,255,255,0.06);">
                <pre class="snippet-pre" style="margin:0;font-family:'JetBrains Mono',monospace;font-size:12px;color:#7dd3fc;line-height:1.5;overflow-x:auto;"><code id="snippet-code">curl -s "https://ceps-pro-api.vicknovais03.workers.dev/api/cep/01310100" \
  -H "Authorization: ******" \
  -H "x-api-key: cep_live_dne_2026"</code></pre>
              </div>

              <!-- Barra de Execução Sandbox -->
              <div class="playground-bar">
                <span class="method-tag get">GET</span>
                <code class="endpoint-code" id="endpoint-display" style="font-size:12px;">/api/cep/01310100</code>
                <button class="primary-button accent test-btn" id="btn-run-sandbox" style="white-space:nowrap;padding:0 14px;height:32px;">
                  <i data-lucide="play"></i> <span>Executar</span>
                </button>
              </div>

              <!-- Console de Resposta JSON -->
              <div class="playground-console" style="min-height:300px;max-height:540px;overflow-y:auto;padding:16px;">
                <div class="console-response-header" id="console-header" style="font-size:11.5px;margin-bottom:10px;">
                  <span class="badge-200" id="console-status">200 OK</span>
                  <span id="console-latency">Latência: 4.2ms</span>
                  <span>Cloudflare Anycast</span>
                </div>
                <pre class="console-json" id="console-output" style="margin:0;font-family:'JetBrains Mono',monospace;font-size:11.5px;color:#f8fafc;line-height:1.5;"></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Script da Aplicação e Integração -->
  <script type="module">

    // Controle do Menu Lateral Mobile (Drawer)
    function setupMobileNav() {
      const drawerBtn = document.getElementById('mobile-hamburger-btn');
      const drawerClose = document.getElementById('sidebar-drawer-close');
      const drawerBackdrop = document.getElementById('sidebar-drawer-backdrop');
      const sidebarEl = document.querySelector('.sidebar');

      function openDrawer() {
        if (sidebarEl) sidebarEl.classList.add('is-open');
        if (drawerBackdrop) drawerBackdrop.hidden = false;
      }
      function closeDrawer() {
        if (sidebarEl) sidebarEl.classList.remove('is-open');
        if (drawerBackdrop) drawerBackdrop.hidden = true;
      }

      drawerBtn?.addEventListener('click', openDrawer);
      drawerClose?.addEventListener('click', closeDrawer);
      drawerBackdrop?.addEventListener('click', closeDrawer);

      // Sincronização de Abas (Desktop, Sidebar e Mobile Bottom Nav)
      const allTabBtns = document.querySelectorAll('.tab-nav-btn, .primary-nav .nav-link[data-view], .mobile-bottom-nav .mobile-nav-item[data-tab]');
      allTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const tabKey = btn.dataset.tab || btn.dataset.view;
          if (!tabKey) return;
          document.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tabKey));
          document.querySelectorAll('.primary-nav .nav-link[data-view]').forEach(b => b.classList.toggle('is-active', b.dataset.view === tabKey));
          document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item[data-tab]').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tabKey));
          document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
          const target = document.getElementById('section-' + tabKey);
          if (target) target.style.display = 'block';
          closeDrawer();
          if (typeof updateSnippet === 'function') updateSnippet();
          if (window.lucide) window.lucide.createIcons();
        });
      });
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupMobileNav);
    } else {
      setupMobileNav();
    }

    // Tema Claro / Escuro
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'light';
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ponte.theme', next);
        
    // Controle do Menu Lateral Mobile (Drawer)
    const drawerBtn = document.getElementById('mobile-hamburger-btn');
    const drawerClose = document.getElementById('sidebar-drawer-close');
    const drawerBackdrop = document.getElementById('sidebar-drawer-backdrop');
    const sidebarEl = document.querySelector('.sidebar');

    function openDrawer() {
      if (sidebarEl) sidebarEl.classList.add('is-open');
      if (drawerBackdrop) drawerBackdrop.hidden = false;
    }
    function closeDrawer() {
      if (sidebarEl) sidebarEl.classList.remove('is-open');
      if (drawerBackdrop) drawerBackdrop.hidden = true;
    }

    drawerBtn?.addEventListener('click', openDrawer);
    drawerClose?.addEventListener('click', closeDrawer);
    drawerBackdrop?.addEventListener('click', closeDrawer);

    // Sincronização de Abas (Desktop, Sidebar e Mobile Bottom Nav)
    const allTabBtns = document.querySelectorAll('.tab-nav-btn, .primary-nav .nav-link[data-view], .mobile-bottom-nav .mobile-nav-item[data-tab]');
    allTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabKey = btn.dataset.tab || btn.dataset.view;
        if (!tabKey) return;
        document.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tabKey));
        document.querySelectorAll('.primary-nav .nav-link[data-view]').forEach(b => b.classList.toggle('is-active', b.dataset.view === tabKey));
        document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item[data-tab]').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tabKey));
        document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
        const target = document.getElementById('section-' + tabKey);
        if (target) target.style.display = 'block';
        closeDrawer();
        if (typeof updateSnippet === 'function') updateSnippet();
        if (window.lucide) window.lucide.createIcons();
      });
    });

    renderLucide();
      });
    }

    function renderLucide() {
      if (window.lucide) window.lucide.createIcons();
    }

    // Navegação de Abas
    const tabBtns = document.querySelectorAll('.tab-nav-btn, .primary-nav .nav-link[data-view]');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabKey = btn.dataset.tab || btn.dataset.view;
        if (!tabKey) return;
        document.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tabKey));
        document.querySelectorAll('.primary-nav .nav-link[data-view]').forEach(b => b.classList.toggle('is-active', b.dataset.view === tabKey));
        document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
        const target = document.getElementById('section-' + tabKey);
        if (target) target.style.display = 'block';

        const bread = document.getElementById('breadcrumb-title');
        const titles = {
          consulta: 'Consulta Postal CEP',
          geolog: 'Geolog & GPS',
          lote: 'Consulta em Lote',
          docs: 'Documentação REST'
        };
        if (bread && titles[tabKey]) bread.textContent = titles[tabKey];
        updateSnippet();
        renderLucide();
      });
    });

    let currentSnippetLang = 'curl';
    document.querySelectorAll('.snippet-tab').forEach(t => {
      t.addEventListener('click', () => {
        document.querySelectorAll('.snippet-tab').forEach(b => b.classList.remove('is-active'));
        t.classList.add('is-active');
        currentSnippetLang = t.dataset.lang;
        updateSnippet();
      });
    });

    function getEndpointInfo() {
      const clean = (document.getElementById('cep-input').value || '01310100').replace(/\\D/g, '');
      return { ep: \`/api/cep/\${clean}\`, full: \`https://ceps-pro-api.vicknovais03.workers.dev/api/cep/\${clean}\` };
    }

    function updateSnippet() {
      const info = getEndpointInfo();
      document.getElementById('endpoint-display').textContent = info.ep;
      const codeEl = document.getElementById('snippet-code');

      if (currentSnippetLang === 'curl') {
        codeEl.textContent = \`curl -s "\${info.full}" \\\n  -H "Authorization: ******" \\\n  -H "x-api-key: cep_live_dne_2026"\`;
      } else if (currentSnippetLang === 'nodejs') {
        codeEl.textContent = \`const res = await fetch("\${info.full}", {\n  headers: { "Authorization": "******", "x-api-key": "cep_live_dne_2026" }\n});\nconst data = await res.json();\nconsole.log(data);\`;
      } else if (currentSnippetLang === 'python') {
        codeEl.textContent = \`import requests\nres = requests.get("\${info.full}", headers={"Authorization": "******", "x-api-key": "cep_live_dne_2026"})\nprint(res.json())\`;
      } else if (currentSnippetLang === 'php') {
        codeEl.textContent = \`$ch = curl_init("\${info.full}");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: ******", "x-api-key: cep_live_dne_2026"]);\n$res = curl_exec($ch);\nprint_r(json_decode($res, true));\`;
      }
    }

    document.getElementById('btn-copy-code').addEventListener('click', () => {
      const txt = document.getElementById('snippet-code').textContent;
      navigator.clipboard.writeText(txt).then(() => alert('Snippet copiado com sucesso!'));
    });

    // â”€â”€ LÓGICA DE BUSCA DE CEP â”€â”€
    async function executarBuscaCep() {
      const raw = document.getElementById('cep-input').value;
      const clean = raw.replace(/\\D/g, '');
      updateSnippet();

      const consoleOutput = document.getElementById('console-output');
      const consoleStatus = document.getElementById('console-status');
      const consoleLat = document.getElementById('console-latency');
      consoleOutput.textContent = 'Buscando CEP na base postal soberana Anycast...';

      const t0 = performance.now();
      try {
        const res = await fetch(\`https://ceps-pro-api.vicknovais03.workers.dev/api/cep/\${clean}\`);
        const data = await res.json();
        const lat = Math.round(performance.now() - t0);

        consoleStatus.textContent = res.ok ? '200 OK' : '400 ERRO';
        consoleStatus.className = res.ok ? 'badge-200' : 'badge-500';
        consoleLat.textContent = \`Latência: \${lat}ms\`;
        consoleOutput.textContent = JSON.stringify(data, null, 2);

        if (data.cep || data.logradouro) {
          document.getElementById('val-logradouro').textContent = data.logradouro || 'Não informado';
          document.getElementById('val-bairro').textContent = data.bairro || 'Não informado';
          document.getElementById('val-cidade-uf').textContent = \`\${data.cidade || data.localidade || ''} (\${data.uf || ''})\`;
          document.getElementById('val-ibge').textContent = data.ibge || data.codigoIbge || '-';
          
          if (data.coordenadas) {
            document.getElementById('val-coordenadas').textContent = \`\${data.coordenadas.latitude}, \${data.coordenadas.longitude}\`;
          } else {
            document.getElementById('val-coordenadas').textContent = 'Disponível na versão Pro';
          }

          document.getElementById('val-ddd').textContent = data.ddd || '-';
        }
      } catch (err) {
        consoleOutput.textContent = \`Erro: \${err.message}\`;
      }
    }

    document.getElementById('btn-exec-cep').addEventListener('click', executarBuscaCep);
    document.getElementById('cep-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') executarBuscaCep();
    });

    document.querySelectorAll('.sample-cep').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('cep-input').value = btn.dataset.cep;
        executarBuscaCep();
      });
    });

    document.getElementById('btn-run-sandbox').addEventListener('click', executarBuscaCep);

    // Inicialização
    renderLucide();
    setTimeout(() => {
      renderLucide();
      executarBuscaCep();
    }, 100);
  </script>

    <!-- Barra de Navegação Inferior Mobile Oficial -->
    <nav class="mobile-bottom-nav" id="mobile-bottom-nav" aria-label="Navegação mobile">
      <button class="mobile-nav-item is-active" data-tab="consulta">
        <i data-lucide="map-pin"></i><span>CEP</span>
      </button>
      <button class="mobile-nav-item " data-tab="geolog">
        <i data-lucide="compass"></i><span>Geolog</span>
      </button>
      <button class="mobile-nav-item " data-tab="lote">
        <i data-lucide="layers"></i><span>Lote</span>
      </button>
      <button class="mobile-nav-item " data-tab="docs">
        <i data-lucide="book-open"></i><span>Docs</span>
      </button>
      <a class="mobile-nav-item" href="https://ponte-marketplace.maputo2.workers.dev" target="_blank" rel="noopener">
        <i data-lucide="layout-grid"></i><span>Market</span>
      </a>
    </nav>

</body>
</html>
`;

fs.writeFileSync('index.html', html, 'utf8');
console.log('ceps-pro index.html updated with marketplace design system!');

