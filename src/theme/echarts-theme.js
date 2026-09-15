/**
 * ECharts theme: iron-workshop
 * 与 tokens.css 色板对齐，Skill 抽取时与 tokens 一并带走。
 */
export const ironWorkshopTheme = {
  color: [
    '#00E8FF',
    '#3D9EFF',
    '#E8B84A',
    '#00D68F',
    '#7C9CFF',
    '#FF3D57',
  ],
  backgroundColor: 'rgba(6, 20, 34, 0)',
  textStyle: {
    color: '#E8F7FF',
    fontFamily: 'Exo 2, PingFang SC, Microsoft YaHei, sans-serif',
  },
  title: {
    textStyle: {
      color: '#E8F7FF',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: 2,
    },
    subtextStyle: { color: '#8FB6C9', fontSize: 11 },
  },
  legend: {
    textStyle: { color: '#BDEFFF', fontSize: 11 },
    inactiveColor: '#5A7A8C',
    pageTextStyle: { color: '#8FB6C9' },
  },
  tooltip: {
    backgroundColor: 'rgba(5, 18, 32, 0.94)',
    borderColor: '#00E8FF',
    borderWidth: 1,
    textStyle: { color: '#E8F7FF', fontSize: 12 },
  },
  grid: {
    left: 40,
    right: 16,
    top: 36,
    bottom: 28,
    containLabel: true,
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: '#24506B', width: 1 } },
    axisTick: { lineStyle: { color: '#24506B' } },
    axisLabel: { color: '#8FB6C9', fontSize: 10 },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8FB6C9', fontSize: 10 },
    splitLine: {
      lineStyle: { color: 'rgba(0,232,255,0.09)', type: 'dashed' },
    },
  },
  line: {
    itemStyle: { borderWidth: 1 },
    lineStyle: { width: 2 },
    symbolSize: 5,
    symbol: 'circle',
    smooth: false,
  },
  bar: {
    itemStyle: { borderRadius: [2, 2, 0, 0] },
  },
  pie: {
    itemStyle: {
      borderColor: 'rgba(3,8,15,0.85)',
      borderWidth: 2,
    },
  },
  radar: {
    axisName: { color: '#8FB6C9', fontSize: 10 },
    splitArea: {
      areaStyle: {
        color: ['rgba(0,232,255,0.02)', 'rgba(0,232,255,0.06)'],
      },
    },
    axisLine: { lineStyle: { color: 'rgba(0,232,255,0.2)' } },
    splitLine: { lineStyle: { color: 'rgba(0,232,255,0.18)' } },
  },
  gauge: {
    axisLine: {
      lineStyle: {
        color: [
          [0.3, '#00D68F'],
          [0.7, '#00E8FF'],
          [1, '#FF3D57'],
        ],
      },
    },
  },
}

/** @deprecated 兼容旧名 */
export const ironHudTheme = ironWorkshopTheme
