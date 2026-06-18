# TechKid 🎮

> Jogo educativo de tecnologia para crianças de 5 anos — 5 fases independentes em HTML/JS puro, sem backend.

## Visão Geral

TechKid ensina conceitos de tecnologia para crianças pequenas por meio de mini-jogos interativos.
Cada fase é um arquivo HTML autocontido que roda direto no navegador, offline, sem instalação.

## Estrutura do Projeto

```
congif-game-davi/
│
├── index.html                  ← Menu principal com seletor de fases
│
├── shared/                     ← Utilitários compartilhados entre fases
│   ├── styles.css              ← Design tokens, animações, victory modal
│   ├── audio.js                ← Web Audio API (sons sem assets externos)
│   ├── fireworks.js            ← Fogos de artifício em CSS puro
│   ├── drag.js                 ← Drag & Drop (mouse + touch)
│   └── storage.js              ← LocalStorage helpers
│
├── phase1/
│   └── phase.html              ← 📱 Organizar a tela do celular (Drag & Drop)
├── phase2/
│   └── phase.html              ← 📶 Conectar o Wi-Fi (Sequência de passos)
├── phase3/
│   └── phase.html              ← 🖥️ Montar o computador (Snap puzzle)
├── phase4/
│   └── phase.html              ← 🤖 Programar o robô (Visual coding)
├── phase5/
│   └── phase.html              ← 🧠 Falar com a IA (Chat Anthropic API)
│
├── docs/
│   └── techkid_game_spec.html  ← Especificação completa das 5 fases
│
├── config.example.js           ← Template de configuração da API (Phase 5)
│
└── .agents/
    └── skills/
        └── techkid-game/
            └── SKILL.md        ← Skill de IA para implementar novas fases
```

## Como Jogar

Abra o `index.html` diretamente no navegador (sem servidor necessário).

## Contrato de cada Fase

| Regra              | Valor                                             |
|--------------------|---------------------------------------------------|
| Salvar conclusão   | `localStorage.setItem('phaseN_done', 'true')`    |
| Salvar estrelas    | `localStorage.setItem('phaseN_stars', '1\|2\|3')`|
| Voltar ao menu     | `window.location.href = '../index.html'`          |
| Sons               | Web Audio API — sem assets externos               |
| Fontes             | Nunito (Google Fonts)                             |

## Paleta de Cores

| Fase | Nome    | Hex       |
|------|---------|-----------|
| 1    | Coral   | `#FF6B6B` |
| 2    | Teal    | `#4ECDC4` |
| 3    | Yellow  | `#FFE66D` |
| 4    | Mint    | `#A8E6CF` |
| 5    | Lavender| `#C3B1E1` |

## Status das Fases

| Fase | Título               | Status        |
|------|----------------------|---------------|
| 1    | Organizar o Celular  | ✅ Feito       |
| 2    | Conectar o Wi-Fi     | 🔜 Em breve   |
| 3    | Montar o Computador  | 🔜 Em breve   |
| 4    | Programar o Robô     | 🔜 Em breve   |
| 5    | Falar com a IA       | 🔜 Em breve   |

## Para Implementar uma Nova Fase

1. Leia `.agents/skills/techkid-game/SKILL.md`
2. Crie `phaseN/phase.html`
3. Use os utilitários de `shared/`
4. Teste no celular (viewport 375px)
5. Commit: `feat(phaseN): add [nome da fase] game`
