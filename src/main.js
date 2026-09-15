import './style.css'
import * as echarts from 'echarts'
import { ironHudTheme } from './iron-hud-theme.js'

echarts.registerTheme('iron-hud', ironHudTheme)

const kpiDefs = [
  { id: 'alerts', label: '今日告警', value: 128, unit: '件', delta: '+12%', deltaClass: 'up', cardClass: '' },
  { id: 'online', label: '在线设备', value: 1842, unit: '台', delta: '+3.2%', deltaClass: 'down', cardClass: 'kpi-card--ok' },
  { id: 'load', label: '系统负载', value: 67, unit: '%', delta: '+5%', deltaClass: 'up', cardClass: 'kpi-card--warn' },
  { id: 'latency', label: '链路时延', value: 42, unit: 'ms', delta: '-8%', deltaClass: 'down', cardClass: '' },
]

const alerts = [
  { lvl: 'critical', text: '东区 3 号变电站温度超限 · 需立即处置' },
  { lvl: 'warn', text: '南门车流密度接近阈值 · 建议分流' },
  { lvl: 'info', text: 'A 栋 BIM 图层已同步 · 版本 2026.09.14' },
  { lvl: 'warn', text: '无人机巡检链路抖动 · RTT 185ms' },
  { lvl: 'critical', text: '园区北侧周界入侵告警 · 摄像头 CAM-17' },
]

function frame(title, inner, extraClass = '') {
  return `
    <div class="hud-frame ${extraClass}">
      <div class="hud-frame__title">${title}</div>
      <div class="hud-frame__corners"><span class="bl"></span><span class="br"></span></div>
      <div class="hud-frame__scan"></div>
      ${inner}
    </div>
  `
}

function renderKpis() {
  return kpiDefs.map((k) => frame(
    'MODULE',
    `<div class="kpi-card ${k.cardClass}">
      <div class="kpi-card__label">${k.label}</div>
      <div class="kpi-card__value-row">
        <span class="kpi-card__value" data-kpi="${k.id}">0</span>
        <span class="kpi-card__unit">${k.unit}</span>
      </div>
      <span class="kpi-card__delta ${k.deltaClass}">${k.delta} · 较昨日</span>
    </div>`,
    'kpi-card',
  )).join('')
}

function renderAlerts() {
  const items = [...alerts, ...alerts].map((a) => `
    <span class="alert-item">
      <span class="alert-item__lvl ${a.lvl}">${a.lvl}</span>
      <span>${a.text}</span>
    </span>
  `).join('')
  return `
    <div class="hud-alert-strip">
      <div class="alert-badge"><span class="alert-badge__pulse"></span>ALERT FEED</div>
      <div class="alert-marquee"><div class="alert-marquee__track">${items}</div></div>
    </div>
  `
}

function hexChunk() {
  const chars = '0123456789ABCDEF'
  let s = ''
  for (let i = 0; i < 18; i++) {
    s += chars[(Math.random() * 16) | 0]
    if (i % 2 === 1) s += ' '
  }
  return s.trim()
}

function streamHtml(side) {
  const lines = Array.from({ length: 24 }, () => `<span>${hexChunk()}</span>`).join('')
  return `<div class="data-stream data-stream--${side}" aria-hidden="true">${lines}</div>`
}

document.querySelector('#app').innerHTML = `
  <div class="stage" id="stage">
    <div class="holo-bg" aria-hidden="true">
      <div class="holo-grid"></div>
      <div class="holo-radar"></div>
      <div class="holo-orbit"><span class="holo-orbit__dot"></span></div>
      <div class="holo-orbit holo-orbit--sm"><span class="holo-orbit__dot"></span></div>
      <canvas class="holo-particles" id="particles"></canvas>
      <div class="holo-scanbeam"></div>
      <div class="holo-vignette"></div>
    </div>
    ${streamHtml('left')}
    ${streamHtml('right')}
    <div class="hud-layer">
      <header class="hud-header">
        <div class="hud-brand">
          <div class="hud-brand__title" id="brand-title">COMMAND HUD</div>
          <div class="hud-brand__sub">FUI Tech Overlay · Holo Demo</div>
        </div>
        <div class="hud-clock" id="clock">--:--:--</div>
        <div class="hud-status"><span class="hud-status__dot"></span>SYSTEM NOMINAL</div>
      </header>
      <div class="hud-main">
        <div class="kpi-row">${renderKpis()}</div>
        <div class="charts-row">
          ${frame('TREND · 24H', '<div class="chart-panel__body"><div class="chart-el" id="chart-line"></div></div>', 'chart-panel')}
          ${frame('SECTOR LOAD', '<div class="chart-panel__body"><div class="chart-el" id="chart-bar"></div></div>', 'chart-panel')}
          ${frame('ASSET MIX', '<div class="chart-panel__body"><div class="chart-el" id="chart-ring"></div></div>', 'chart-panel')}
        </div>
      </div>
      ${renderAlerts()}
    </div>
  </div>
`

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

// occasional title glitch
const brand = document.getElementById('brand-title')
setInterval(() => {
  brand.classList.add('is-glitch')
  setTimeout(() => brand.classList.remove('is-glitch'), 450)
}, 7000)

function animateValue(el, target, duration = 1100) {
  const start = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - t, 3)
    el.textContent = Math.round(target * eased).toLocaleString('en-US')
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
kpiDefs.forEach((k) => {
  const el = document.querySelector(`[data-kpi="${k.id}"]`)
  if (el) animateValue(el, k.value)
})

/* floating particles */
const canvas = document.getElementById('particles')
const ctx = canvas.getContext('2d')
let particles = []
let raf = 0

function resizeParticles() {
  const stage = document.getElementById('stage')
  canvas.width = 1920
  canvas.height = 1080
  particles = Array.from({ length: 56 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.35,
    vy: -Math.random() * 0.45 - 0.1,
    a: Math.random() * 0.5 + 0.15,
  }))
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
    if (p.x < 0) p.x = canvas.width
    if (p.x > canvas.width) p.x = 0
    ctx.beginPath()
    ctx.fillStyle = `rgba(0, 229, 255, ${p.a})`
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }
  // link nearby
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j]
      const dx = a.x - b.x, dy = a.y - b.y
      const d2 = dx * dx + dy * dy
      if (d2 < 140 * 140) {
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.12 * (1 - Math.sqrt(d2) / 140)})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }
  raf = requestAnimationFrame(drawParticles)
}

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!reduce) {
  resizeParticles()
  drawParticles()
}

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
const seriesA = [42, 48, 51, 47, 55, 62, 70, 78, 85, 88, 82, 76, 74, 79, 91, 96, 102, 98, 90, 84, 77, 68, 58, 50]
const seriesB = [30, 32, 35, 34, 38, 44, 52, 58, 61, 64, 60, 55, 53, 57, 63, 70, 74, 71, 66, 60, 54, 48, 40, 34]

const animIn = { animationDuration: 1400, animationEasing: 'cubicOut' }

const line = echarts.init(document.getElementById('chart-line'), 'iron-hud')
line.setOption({
  ...animIn,
  legend: { data: ['告警量', '巡检任务'], top: 4, right: 8 },
  tooltip: { trigger: 'axis' },
  grid: { left: 44, right: 16, top: 36, bottom: 28 },
  xAxis: { type: 'category', data: hours, boundaryGap: false },
  yAxis: { type: 'value' },
  series: [
    {
      name: '告警量',
      type: 'line',
      data: seriesA,
      showSymbol: false,
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0,229,255,0.35)' },
            { offset: 1, color: 'rgba(0,229,255,0.02)' },
          ],
        },
      },
    },
    { name: '巡检任务', type: 'line', data: seriesB, showSymbol: false },
  ],
})
charts.push(line)

const bar = echarts.init(document.getElementById('chart-bar'), 'iron-hud')
bar.setOption({
  ...animIn,
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 12, top: 28, bottom: 28 },
  xAxis: { type: 'category', data: ['东区', '南区', '西区', '北区', '中枢'] },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar',
    barWidth: 22,
    animationDelay: (idx) => idx * 120,
    data: [72, 58, 81, 45, 93].map((v) => ({
      value: v,
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#00E5FF' },
            { offset: 1, color: 'rgba(0,229,255,0.15)' },
          ],
        },
        shadowBlur: 12,
        shadowColor: 'rgba(0,229,255,0.45)',
      },
    })),
  }],
})
charts.push(bar)

const ring = echarts.init(document.getElementById('chart-ring'), 'iron-hud')
ring.setOption({
  ...animIn,
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', right: 8, top: 'middle', itemWidth: 10, itemHeight: 10 },
  series: [{
    type: 'pie',
    radius: ['52%', '70%'],
    center: ['38%', '50%'],
    label: { show: false },
    animationType: 'scale',
    data: [
      { name: '传感', value: 38 },
      { name: '视频', value: 26 },
      { name: 'BIM', value: 18 },
      { name: '其他', value: 18 },
    ],
  }],
  graphic: [{
    type: 'text',
    left: '30%',
    top: '44%',
    style: {
      text: '1842\nASSETS',
      fill: '#E8F7FF',
      fontSize: 14,
      fontFamily: 'Orbitron, sans-serif',
      align: 'center',
      lineHeight: 20,
    },
  }],
})
charts.push(ring)

setInterval(() => {
  const nextA = seriesA.map((v) => Math.max(20, Math.min(120, v + Math.round((Math.random() - 0.5) * 6))))
  const nextB = seriesB.map((v) => Math.max(15, Math.min(100, v + Math.round((Math.random() - 0.5) * 4))))
  seriesA.splice(0, seriesA.length, ...nextA)
  seriesB.splice(0, seriesB.length, ...nextB)
  line.setOption({ series: [{ data: nextA }, { data: nextB }] })
}, 4000)

// refresh stream hex occasionally
setInterval(() => {
  document.querySelectorAll('.data-stream').forEach((el) => {
    el.querySelectorAll('span').forEach((s, i) => {
      if (i % 3 === 0) s.textContent = hexChunk()
    })
  })
}, 1200)
