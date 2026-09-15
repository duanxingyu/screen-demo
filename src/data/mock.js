/** Demo mock data — 与渲染分离，方便后续换接口 */

export const kpiDefs = [
  { id: 'alerts', label: '今日告警', value: 128, unit: '件', delta: '+12%', deltaClass: 'up', cardClass: '' },
  { id: 'online', label: '在线节点', value: 1842, unit: '台', delta: '+3.2%', deltaClass: 'down', cardClass: 'kpi-card--ok' },
  { id: 'load', label: '反应堆负载', value: 67, unit: '%', delta: '+5%', deltaClass: 'up', cardClass: 'kpi-card--warn' },
  { id: 'power', label: '电弧输出', value: 98.4, unit: '%', delta: 'STABLE', deltaClass: 'down', cardClass: 'kpi-card--gold', decimals: 1 },
]

export const systems = [
  { name: '主电弧稳定器', value: 96, unit: '%', tone: 'ok' },
  { name: '推进矢量阵列', value: 88, unit: '%', tone: 'ok' },
  { name: '装甲完整性', value: 74, unit: '%', tone: 'warn' },
  { name: '热交换回路', value: 61, unit: '%', tone: 'warn' },
  { name: '光学目标链路', value: 92, unit: '%', tone: 'ok' },
  { name: '备用电容组', value: 45, unit: '%', tone: 'crit' },
]

export const reticles = [
  { label: 'LOCK', value: '04' },
  { label: 'RANGE', value: '1.2km' },
  { label: 'AZ', value: '247°' },
  { label: 'EL', value: '+12°' },
]

export const diagLogs = [
  { lvl: 'ok', tag: 'SYNC', text: 'Holo mesh layer refreshed · rev 2026.09.15' },
  { lvl: 'warn', tag: 'THERM', text: 'East bay heat exchanger approaching soft limit' },
  { lvl: 'info', tag: 'LINK', text: 'Uplink RTT 42ms · jitter 3ms' },
  { lvl: 'crit', tag: 'PERIM', text: 'North perimeter breach · CAM-17 track open' },
  { lvl: 'ok', tag: 'PWR', text: 'Arc core output nominal · 98.4%' },
  { lvl: 'warn', tag: 'UAV', text: 'Drone relay packet loss 2.1%' },
  { lvl: 'info', tag: 'BIM', text: 'Workshop blueprint overlay v3.8 loaded' },
  { lvl: 'ok', tag: 'NAV', text: 'Waypoint grid calibrated' },
]

export const alerts = [
  { lvl: 'critical', text: '北侧周界入侵告警 · 摄像头 CAM-17' },
  { lvl: 'warn', text: '东区热交换接近阈值 · 建议降载' },
  { lvl: 'info', text: '全息蓝图层已同步 · 版本 2026.09.15' },
  { lvl: 'warn', text: '无人机中继抖动 · RTT 185ms' },
  { lvl: 'critical', text: '备用电容组电量低于 50% · 需补能' },
  { lvl: 'info', text: '光学链路握手完成 · 4 目标锁定' },
]

export const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

export const seriesA = [42, 48, 51, 47, 55, 62, 70, 78, 85, 88, 82, 76, 74, 79, 91, 96, 102, 98, 90, 84, 77, 68, 58, 50]
export const seriesB = [30, 32, 35, 34, 38, 44, 52, 58, 61, 64, 60, 55, 53, 57, 63, 70, 74, 71, 66, 60, 54, 48, 40, 34]
export const seriesC = [12, 14, 15, 13, 18, 22, 28, 32, 36, 34, 30, 27, 26, 29, 33, 38, 41, 39, 35, 30, 24, 20, 16, 13]

export const sectorStack = {
  categories: ['东区', '南区', '西区', '北区', '中枢'],
  power: [42, 35, 48, 28, 55],
  thermal: [18, 14, 22, 12, 24],
  compute: [12, 9, 11, 5, 14],
}

export const assetMix = [
  { name: '传感', value: 38 },
  { name: '视频', value: 26 },
  { name: 'BIM', value: 18 },
  { name: '链路', value: 12 },
  { name: '其他', value: 6 },
]

export const radarScores = [
  { name: '算力', value: 86 },
  { name: '链路', value: 72 },
  { name: '能源', value: 91 },
  { name: '装甲', value: 68 },
  { name: '光学', value: 80 },
  { name: '热控', value: 64 },
]

/** 热力图：[小时索引, 星期索引, 值] 星期 0=一 … 6=日，小时抽 8 档 */
export const heatHours = ['00', '03', '06', '09', '12', '15', '18', '21']
export const heatDays = ['一', '二', '三', '四', '五', '六', '日']
export const heatData = (() => {
  const out = []
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 8; h++) {
      const peak = h >= 3 && h <= 6 ? 1 : 0.45
      const weekend = d >= 5 ? 0.7 : 1
      const v = Math.round((35 + Math.random() * 55) * peak * weekend)
      out.push([h, d, v])
    }
  }
  return out
})()

export const rankNodes = [
  { name: 'BAY-01 ARC', value: 98 },
  { name: 'OPTIC-LINK', value: 92 },
  { name: 'MESH-N3', value: 88 },
  { name: 'THERM-E', value: 76 },
  { name: 'UAV-RLY', value: 64 },
  { name: 'CAP-BANK', value: 45 },
]

/** 散点：[负载%, 时延ms, 流量] */
export const scatterPoints = Array.from({ length: 28 }, () => {
  const load = 20 + Math.random() * 75
  const latency = 18 + Math.random() * 90 + (load > 70 ? 20 : 0)
  const traffic = 8 + Math.random() * 40
  return [Math.round(load), Math.round(latency), Math.round(traffic)]
})
