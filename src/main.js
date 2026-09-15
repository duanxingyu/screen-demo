import './theme/index.css'
import * as echarts from 'echarts'
import { ironWorkshopTheme } from './theme/echarts-theme.js'
import {
  kpiDefs,
  systems,
  reticles,
  diagLogs,
  alerts,
  hours,
  seriesA,
  seriesB,
  seriesC,
  sectorStack,
  assetMix,
  radarScores,
  heatHours,
  heatDays,
  heatData,
  rankNodes,
  scatterPoints,
} from './data/mock.js'
import {
  optionTrend,
  optionHeat,
  optionRose,
  optionStack,
  optionRank,
  optionScatter,
  optionRadar,
  optionGauge,
} from './charts/options.js'

echarts.registerTheme('iron-workshop', ironWorkshopTheme)

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function frame(title, inner, extraClass = '', titleClass = '') {
  return `
    <div class="hud-frame ${extraClass}">
      <div class="hud-frame__title ${titleClass}">${title}</div>
      <div class="hud-frame__corners"><span class="bl"></span><span class="br"></span></div>
      <div class="hud-frame__scan"></div>
      ${inner}
    </div>
  `
}

function hexChunk() {
  const chars = '0123456789ABCDEF'
  let s = ''
  for (let i = 0; i < 16; i++) {
    s += chars[(Math.random() * 16) | 0]
    if (i % 2 === 1) s += ' '
  }
  return s.trim()
}

function streamHtml(side) {
  const lines = Array.from({ length: 28 }, () => `<span>${hexChunk()}</span>`).join('')
  return `<div class="data-stream data-stream--${side}" aria-hidden="true">${lines}</div>`
}

function renderKpis() {
  return kpiDefs
    .map((k) =>
      frame(
        'TELEMETRY',
        `<div class="kpi-card ${k.cardClass}">
          <div class="kpi-card__label">${k.label}</div>
          <div class="kpi-card__value-row">
            <span class="kpi-card__value" data-kpi="${k.id}">0</span>
            <span class="kpi-card__unit">${k.unit}</span>
          </div>
          <span class="kpi-card__delta ${k.deltaClass}">${k.delta} · 较昨日</span>
        </div>`,
        'kpi-card',
      ),
    )
    .join('')
}

function renderSystems() {
  const rows = systems
    .map((s) => {
      const fillClass = s.tone === 'ok' ? '' : s.tone
      return `
      <li class="sys-row">
        <span class="sys-row__name">${s.name}</span>
        <span class="sys-row__val ${s.tone}">${s.value}${s.unit}</span>
        <div class="progress-track"><div class="progress-track__fill ${fillClass}" style="width:${s.value}%"></div></div>
      </li>`
    })
    .join('')
  return frame('SUIT SYSTEMS', `<ul class="sys-list">${rows}</ul>`)
}

function renderReticles() {
  const cells = reticles
    .map(
      (r) => `
    <div class="reticle-cell">
      <div class="reticle-ring"></div>
      <div class="reticle-cell__label">${r.label}</div>
      <div class="reticle-cell__val">${r.value}</div>
    </div>`,
    )
    .join('')
  return frame('TARGETING', `<div class="reticle-board">${cells}</div>`, 'hud-frame--fixed')
}

function renderDiagLog() {
  const lines = diagLogs
    .map((l) => {
      const ts = new Date().toTimeString().slice(0, 8)
      return `<div class="diag-log__line ${l.lvl}"><span class="ts">${ts}</span><span class="tag">[${l.tag}]</span>${l.text}</div>`
    })
    .join('')
  return frame('DIAGNOSTIC BUS', `<div class="diag-log" id="diag-log">${lines}</div>`)
}

function blueprintSvg() {
  /* Generic mech wireframe — not a licensed character silhouette */
  return `
  <svg viewBox="0 0 200 260" aria-hidden="true">
    <ellipse class="fill-ghost" cx="100" cy="248" rx="48" ry="8"/>
    <circle class="stroke" cx="100" cy="42" r="18"/>
    <circle class="stroke-dim" cx="100" cy="42" r="10"/>
    <path class="stroke" d="M100 60 L100 120"/>
    <path class="stroke" d="M100 78 L58 110 L48 160"/>
    <path class="stroke" d="M100 78 L142 110 L152 160"/>
    <path class="gold" d="M72 95 L100 108 L128 95"/>
    <path class="stroke" d="M100 120 L70 210 L62 240"/>
    <path class="stroke" d="M100 120 L130 210 L138 240"/>
    <path class="stroke-dim" d="M58 110 L42 100 M142 110 L158 100"/>
    <circle class="stroke gold" cx="100" cy="96" r="14"/>
    <circle class="fill-ghost" cx="100" cy="96" r="6"/>
    <path class="stroke-dim" d="M85 70 L115 70 M88 200 L112 200"/>
  </svg>`
}

function waveHtml(n = 36) {
  return `<div class="holo-wave" id="holo-wave" aria-hidden="true">${Array.from(
    { length: n },
    (_, i) => `<span style="--i:${i}"></span>`,
  ).join('')}</div>`
}

function conduitsSvg() {
  return `
  <svg class="energy-conduits" id="energy-conduits" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
    <path class="conduit" d="M420 220 C560 220, 700 380, 960 420"/>
    <path class="conduit-flow" d="M420 220 C560 220, 700 380, 960 420"/>
    <path class="conduit" d="M420 720 C580 700, 720 560, 960 500"/>
    <path class="conduit-flow conduit-flow--slow" d="M420 720 C580 700, 720 560, 960 500"/>
    <path class="conduit conduit--gold" d="M1500 240 C1360 260, 1180 360, 960 420"/>
    <path class="conduit-flow conduit-flow--gold" d="M1500 240 C1360 260, 1180 360, 960 420"/>
    <path class="conduit conduit--gold" d="M1500 700 C1340 680, 1160 560, 960 500"/>
    <path class="conduit-flow conduit-flow--gold conduit-flow--slow" d="M1500 700 C1340 680, 1160 560, 960 500"/>
  </svg>`
}

function bootOverlayHtml() {
  return `
  <div class="boot-overlay" id="boot-overlay">
    <div class="boot-overlay__ring"></div>
    <div class="boot-overlay__label">HOLO DECK</div>
    <div class="boot-overlay__sub" id="boot-sub">Calibrating projector…</div>
    <div class="boot-overlay__bar"><span id="boot-bar"></span></div>
  </div>`
}

function renderHoloStage() {
  return frame(
    'HOLO PROJECTOR · BAY-01',
    `
    <div class="holo-stage" id="holo-stage">
      <div class="holo-beam holo-beam--soft" aria-hidden="true"></div>
      <div class="holo-beam" aria-hidden="true"></div>
      <div class="holo-parallax" id="holo-parallax">
        <div class="holo-blueprint">
          ${blueprintSvg()}
          <div class="holo-blueprint__scanline"></div>
        </div>
        <div class="holo-core" aria-hidden="true">
          <div class="holo-core__ring"><span class="holo-core__dot"></span></div>
          <div class="holo-core__ring holo-core__ring--2"><span class="holo-core__dot"></span></div>
          <div class="holo-core__ring holo-core__ring--3"><span class="holo-core__dot"></span></div>
          <div class="holo-core__ring holo-core__ring--4"></div>
          <div class="holo-core__heart"></div>
          <div class="holo-core__label">ARC CORE</div>
        </div>
        <div class="holo-pedestal"></div>
        <div class="holo-chip holo-chip--l">THRUST <strong>88%</strong></div>
        <div class="holo-chip holo-chip--l2">THERMAL <strong>61°C</strong></div>
        <div class="holo-chip holo-chip--r">LINK <strong>LOCK×4</strong></div>
        <div class="holo-chip holo-chip--r2 holo-chip--gold">POWER <strong>98.4%</strong></div>
      </div>
      ${waveHtml()}
      <div class="holo-aim" id="holo-aim"><span class="holo-aim__dot"></span></div>
    </div>
    `,
  )
}

function renderAlerts() {
  const items = [...alerts, ...alerts]
    .map(
      (a) => `
    <span class="alert-item">
      <span class="alert-item__lvl ${a.lvl}">${a.lvl}</span>
      <span>${a.text}</span>
    </span>`,
    )
    .join('')
  return `
    <div class="hud-alert-strip">
      <div class="alert-badge"><span class="alert-badge__pulse"></span>ALERT FEED</div>
      <div class="alert-marquee"><div class="alert-marquee__track">${items}</div></div>
    </div>`
}

document.querySelector('#app').innerHTML = `
  <div class="stage is-booting" id="stage">
    ${bootOverlayHtml()}
    <div class="holo-bg" aria-hidden="true">
      <div class="holo-grid"></div>
      <div class="holo-radar"></div>
      <canvas class="holo-particles" id="particles"></canvas>
      <div class="holo-scanbeam"></div>
      <div class="holo-vignette"></div>
    </div>
    ${streamHtml('left')}
    ${streamHtml('right')}
    ${conduitsSvg()}
    <div class="hud-layer">
      <header class="hud-header">
        <div class="hud-brand">
          <div class="hud-brand__title" id="brand-title">WORKSHOP HUD</div>
          <div class="hud-brand__sub">Holo Deck · FUI Overlay · Bay Control</div>
        </div>
        <div class="hud-clock">
          <span class="hud-clock__label">Local Time</span>
          <span id="clock">--:--:--</span>
        </div>
        <div class="hud-status">
          <div class="hud-status__item"><span class="hud-status__dot"></span>SYSTEM NOMINAL</div>
          <div class="hud-status__item hud-status__item--gold"><span class="hud-status__dot"></span>ARC ONLINE</div>
        </div>
      </header>
      <div class="hud-body">
        <aside class="side-col">
          ${renderSystems()}
          ${renderReticles()}
        </aside>
        <main class="center-col">
          ${renderKpis()}
          ${renderHoloStage()}
          <div class="holo-footer-charts">
            ${frame('TREND · 24H', '<div class="chart-el" id="chart-line"></div>')}
            ${frame('BAY HEATMAP', '<div class="chart-el" id="chart-heat"></div>')}
            ${frame('ASSET ROSE', '<div class="chart-el" id="chart-rose"></div>')}
            ${frame('SECTOR STACK', '<div class="chart-el" id="chart-stack"></div>')}
            ${frame('NODE RANK', '<div class="chart-el" id="chart-rank"></div>')}
            ${frame('LOAD × LATENCY', '<div class="chart-el" id="chart-scatter"></div>')}
          </div>
        </main>
        <aside class="side-col">
          ${frame('CAPABILITY MATRIX', '<div class="chart-el" id="chart-radar"></div>')}
          ${frame('POWER SPECTRUM', '<div class="chart-el" id="chart-gauge"></div>', '', 'hud-frame__title--gold')}
          ${renderDiagLog()}
        </aside>
      </div>
      ${renderAlerts()}
    </div>
  </div>
`

/* ——— Stage scale ——— */
function fitStage() {
  const stage = document.getElementById('stage')
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
  stage.style.transform = `scale(${scale})`
}
fitStage()

const charts = []
window.addEventListener('resize', () => {
  fitStage()
  charts.forEach((c) => c.resize())
  resizeParticles()
})

function tickClock() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  document.getElementById('clock').textContent =
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}  ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
tickClock()
setInterval(tickClock, 1000)

const brand = document.getElementById('brand-title')
setInterval(() => {
  brand.classList.add('is-glitch')
  setTimeout(() => brand.classList.remove('is-glitch'), 450)
}, 7000)

function animateValue(el, target, duration = 1100, decimals = 0) {
  const start = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - t, 3)
    const v = target * eased
    el.textContent = decimals
      ? v.toFixed(decimals)
      : Math.round(v).toLocaleString('en-US')
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/* ——— Particles ——— */
const canvas = document.getElementById('particles')
const ctx = canvas.getContext('2d')
let particles = []
let raf = 0
let particlePaused = false

function resizeParticles() {
  canvas.width = 1920
  canvas.height = 1080
  particles = Array.from({ length: 64 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.35,
    vy: -Math.random() * 0.45 - 0.1,
    a: Math.random() * 0.5 + 0.15,
  }))
}

function drawParticles() {
  if (particlePaused) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.y < -10) {
      p.y = canvas.height + 10
      p.x = Math.random() * canvas.width
    }
    if (p.x < 0) p.x = canvas.width
    if (p.x > canvas.width) p.x = 0
    ctx.beginPath()
    ctx.fillStyle = `rgba(0, 232, 255, ${p.a})`
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i]
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d2 = dx * dx + dy * dy
      if (d2 < 130 * 130) {
        ctx.strokeStyle = `rgba(0, 232, 255, ${0.1 * (1 - Math.sqrt(d2) / 130)})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }
  raf = requestAnimationFrame(drawParticles)
}

document.addEventListener('visibilitychange', () => {
  particlePaused = document.hidden
  if (!document.hidden && !reduceMotion) {
    cancelAnimationFrame(raf)
    drawParticles()
  }
})

/* ——— Charts (deferred until boot completes) ——— */
let line
let gauge

function initCharts() {
  const mount = (id, option) => {
    const c = echarts.init(document.getElementById(id), 'iron-workshop')
    c.setOption(option)
    charts.push(c)
    return c
  }

  line = mount('chart-line', optionTrend(hours, seriesA, seriesB, seriesC))
  mount('chart-heat', optionHeat(heatHours, heatDays, heatData))
  mount('chart-rose', optionRose(assetMix))
  mount('chart-stack', optionStack(sectorStack))
  mount('chart-rank', optionRank(rankNodes))
  mount('chart-scatter', optionScatter(scatterPoints))
  mount('chart-radar', optionRadar(radarScores))
  gauge = mount('chart-gauge', optionGauge(98.4))
}

/* ——— Parallax + aim reticle ——— */
function setupParallax() {
  const stageEl = document.getElementById('holo-stage')
  const parallax = document.getElementById('holo-parallax')
  const aim = document.getElementById('holo-aim')
  if (!stageEl || !parallax || reduceMotion) return

  stageEl.addEventListener('pointermove', (e) => {
    const rect = stageEl.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    parallax.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`
    const lx = e.clientX - rect.left
    const ly = e.clientY - rect.top
    aim.style.left = `${lx}px`
    aim.style.top = `${ly}px`
    stageEl.classList.add('is-aiming')
  })

  stageEl.addEventListener('pointerleave', () => {
    parallax.style.transform = 'rotateY(0deg) rotateX(0deg)'
    stageEl.classList.remove('is-aiming')
  })
}

/* ——— Waveform live heights ——— */
function setupWaveform() {
  const wave = document.getElementById('holo-wave')
  if (!wave || reduceMotion) return
  const bars = [...wave.querySelectorAll('span')]
  setInterval(() => {
    bars.forEach((bar, i) => {
      const base = 25 + Math.sin(Date.now() / 240 + i * 0.45) * 20
      const jitter = Math.random() * 35
      bar.style.height = `${Math.max(12, Math.min(100, base + jitter))}%`
      bar.style.animation = 'none'
    })
  }, 120)
}

/* ——— Boot sequence ——— */
function runBoot() {
  const stage = document.getElementById('stage')
  const overlay = document.getElementById('boot-overlay')
  const bar = document.getElementById('boot-bar')
  const sub = document.getElementById('boot-sub')
  const steps = [
    { t: 0, p: 8, text: 'Calibrating projector…' },
    { t: 450, p: 28, text: 'Igniting arc core…' },
    { t: 950, p: 52, text: 'Linking diagnostic bus…' },
    { t: 1450, p: 74, text: 'Unfolding holo mesh…' },
    { t: 1950, p: 92, text: 'Syncing telemetry feeds…' },
    { t: 2400, p: 100, text: 'Workshop HUD online' },
  ]

  const finish = () => {
    overlay?.classList.add('is-done')
    stage.classList.remove('is-booting')
    stage.classList.add('is-live')
    requestAnimationFrame(() => {
      stage.querySelector('.hud-layer').style.opacity = '1'
      initCharts()
      kpiDefs.forEach((k) => {
        const el = document.querySelector(`[data-kpi="${k.id}"]`)
        if (el) animateValue(el, k.value, 1100, k.decimals || 0)
      })
      if (!reduceMotion) {
        resizeParticles()
        drawParticles()
      }
      setupParallax()
      setupWaveform()
    })
  }

  if (reduceMotion) {
    if (bar) bar.style.width = '100%'
    finish()
    return
  }

  steps.forEach(({ t, p, text }) => {
    setTimeout(() => {
      if (bar) bar.style.width = `${p}%`
      if (sub) sub.textContent = text
    }, t)
  })

  setTimeout(finish, 2800)
}

runBoot()

setInterval(() => {
  if (!line || !gauge) return
  const nextA = seriesA.map((v) => Math.max(20, Math.min(120, v + Math.round((Math.random() - 0.5) * 6))))
  const nextB = seriesB.map((v) => Math.max(15, Math.min(100, v + Math.round((Math.random() - 0.5) * 4))))
  const nextC = seriesC.map((v) => Math.max(8, Math.min(50, v + Math.round((Math.random() - 0.5) * 3))))
  seriesA.splice(0, seriesA.length, ...nextA)
  seriesB.splice(0, seriesB.length, ...nextB)
  seriesC.splice(0, seriesC.length, ...nextC)
  line.setOption({ series: [{ data: nextA }, { data: nextB }, { data: nextC }] })

  const g = Math.round((96 + Math.random() * 4) * 10) / 10
  gauge.setOption({ series: [{ data: [{ value: g, name: 'ARC OUT' }] }] })
}, 4000)

setInterval(() => {
  document.querySelectorAll('.data-stream').forEach((el) => {
    el.querySelectorAll('span').forEach((s, i) => {
      if (i % 3 === 0) s.textContent = hexChunk()
    })
  })
}, 1200)

setInterval(() => {
  const log = document.getElementById('diag-log')
  if (!log) return
  const pool = diagLogs
  const item = pool[(Math.random() * pool.length) | 0]
  const ts = new Date().toTimeString().slice(0, 8)
  const lineEl = document.createElement('div')
  lineEl.className = `diag-log__line ${item.lvl}`
  lineEl.innerHTML = `<span class="ts">${ts}</span><span class="tag">[${item.tag}]</span>${item.text}`
  log.prepend(lineEl)
  while (log.children.length > 12) log.lastElementChild.remove()
}, 3500)
