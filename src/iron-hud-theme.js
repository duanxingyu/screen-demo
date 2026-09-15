/** ECharts theme: iron-hud */
export const ironHudTheme = {
  color: [
    '#00E5FF',
    '#3D9EFF',
    '#7C4DFF',
    '#00D68F',
    '#FFC107',
    '#FF3D57',
  ],
  backgroundColor: 'rgba(6, 17, 31, 0.0)',
  textStyle: {
    color: '#E8F7FF',
    fontFamily: 'Inter, PingFang SC, Microsoft YaHei, sans-serif',
  },
  title: {
    textStyle: {
      color: '#E8F7FF',
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: 2,
    },
    subtextStyle: { color: '#8FB6C9', fontSize: 12 },
  },
  legend: {
    textStyle: { color: '#BDEFFF', fontSize: 12 },
    inactiveColor: '#5A7A8C',
    pageTextStyle: { color: '#8FB6C9' },
  },
  tooltip: {
    backgroundColor: 'rgba(5, 22, 38, 0.94)',
    borderColor: '#00E5FF',
    borderWidth: 1,
    textStyle: { color: '#E8F7FF', fontSize: 12 },
  },
  grid: {
    left: 48,
    right: 24,
    top: 40,
    bottom: 32,
    containLabel: true,
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: '#24506B', width: 1 } },
    axisTick: { lineStyle: { color: '#24506B' } },
    axisLabel: { color: '#8FB6C9', fontSize: 11 },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8FB6C9', fontSize: 11 },
    splitLine: {
      lineStyle: { color: 'rgba(0,229,255,0.10)', type: 'dashed' },
    },
  },
  line: {
    itemStyle: { borderWidth: 1 },
    lineStyle: { width: 2 },
    symbolSize: 6,
    symbol: 'circle',
    smooth: false,
  },
  bar: {
    itemStyle: {
      borderRadius: [2, 2, 0, 0],
    },
  },
  pie: {
    itemStyle: {
      borderColor: 'rgba(3,8,15,0.85)',
      borderWidth: 2,
    },
  },
};
