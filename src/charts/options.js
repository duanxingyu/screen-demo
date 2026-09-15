/**
 * Iron Workshop — ECharts option builders
 * 图表类型集中在此，main 只负责 init + 刷新。
 */
export const animIn = { animationDuration: 1200, animationEasing: 'cubicOut' }

export function optionTrend(hours, seriesA, seriesB, seriesC) {
  return {
    ...animIn,
    legend: {
      data: ['告警量', '巡检', '能耗'],
      top: 0,
      right: 2,
      itemWidth: 8,
      itemHeight: 6,
      textStyle: { fontSize: 10 },
    },
    tooltip: { trigger: 'axis' },
    grid: { left: 36, right: 10, top: 24, bottom: 20 },
    xAxis: {
      type: 'category',
      data: hours,
      boundaryGap: false,
      axisLabel: { interval: 5, fontSize: 9 },
    },
    yAxis: { type: 'value', splitNumber: 3 },
    series: [
      {
        name: '告警量',
        type: 'line',
        data: seriesA,
        showSymbol: false,
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0,232,255,0.4)' },
              { offset: 1, color: 'rgba(0,232,255,0.02)' },
            ],
          },
        },
        markPoint: {
          symbol: 'diamond',
          symbolSize: 8,
          data: [{ type: 'max', name: '峰值' }],
          label: { fontSize: 9, color: '#E8F7FF' },
          itemStyle: { color: '#FF3D57' },
        },
      },
      {
        name: '巡检',
        type: 'line',
        data: seriesB,
        showSymbol: false,
        smooth: true,
        lineStyle: { width: 1.5 },
        areaStyle: { color: 'rgba(61,158,255,0.12)' },
      },
      {
        name: '能耗',
        type: 'line',
        data: seriesC,
        showSymbol: false,
        smooth: true,
        lineStyle: { width: 1.5, type: 'dashed', color: '#E8B84A' },
        itemStyle: { color: '#E8B84A' },
      },
    ],
  }
}

export function optionHeat(heatHours, heatDays, heatData) {
  return {
    ...animIn,
    tooltip: {
      position: 'top',
      formatter: (p) => `${heatDays[p.value[1]]} ${heatHours[p.value[0]]}:00<br/>负荷 ${p.value[2]}`,
    },
    grid: { left: 28, right: 8, top: 12, bottom: 18 },
    xAxis: {
      type: 'category',
      data: heatHours,
      splitArea: { show: true },
      axisLabel: { fontSize: 9 },
    },
    yAxis: {
      type: 'category',
      data: heatDays,
      axisLabel: { fontSize: 9 },
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      itemWidth: 8,
      itemHeight: 60,
      show: false,
      inRange: {
        color: ['rgba(0,40,60,0.3)', '#0a6a88', '#00E8FF', '#E8B84A', '#FF3D57'],
      },
    },
    series: [
      {
        type: 'heatmap',
        data: heatData,
        label: { show: false },
        itemStyle: {
          borderColor: 'rgba(3,8,15,0.65)',
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,232,255,0.55)' },
        },
      },
    ],
  }
}

export function optionRose(assetMix) {
  return {
    ...animIn,
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'middle',
      itemWidth: 7,
      itemHeight: 7,
      textStyle: { fontSize: 9 },
    },
    series: [
      {
        type: 'pie',
        roseType: 'area',
        radius: ['18%', '68%'],
        center: ['38%', '52%'],
        itemStyle: {
          borderRadius: 2,
          borderColor: 'rgba(3,8,15,0.85)',
          borderWidth: 1,
        },
        label: { show: false },
        data: assetMix,
      },
    ],
  }
}

export function optionStack(sectorStack) {
  const colors = [
    ['#00E8FF', 'rgba(0,232,255,0.15)'],
    ['#3D9EFF', 'rgba(61,158,255,0.12)'],
    ['#E8B84A', 'rgba(232,184,74,0.12)'],
  ]
  const mk = (name, data, i) => ({
    name,
    type: 'bar',
    stack: 'total',
    barWidth: 16,
    emphasis: { focus: 'series' },
    data: data.map((v) => ({
      value: v,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: colors[i][0] },
            { offset: 1, color: colors[i][1] },
          ],
        },
      },
    })),
  })
  return {
    ...animIn,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      data: ['电力', '热控', '算力'],
      top: 0,
      right: 2,
      itemWidth: 8,
      itemHeight: 6,
      textStyle: { fontSize: 9 },
    },
    grid: { left: 32, right: 6, top: 22, bottom: 18 },
    xAxis: { type: 'category', data: sectorStack.categories, axisLabel: { fontSize: 9 } },
    yAxis: { type: 'value', splitNumber: 3 },
    series: [
      mk('电力', sectorStack.power, 0),
      mk('热控', sectorStack.thermal, 1),
      mk('算力', sectorStack.compute, 2),
    ],
  }
}

export function optionRank(rankNodes) {
  const names = [...rankNodes].reverse().map((r) => r.name)
  const values = [...rankNodes].reverse().map((r) => r.value)
  return {
    ...animIn,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 72, right: 28, top: 8, bottom: 8 },
    xAxis: { type: 'value', splitNumber: 3, axisLabel: { fontSize: 9 } },
    yAxis: {
      type: 'category',
      data: names,
      axisLabel: { fontSize: 9, color: '#8FB6C9' },
    },
    series: [
      {
        type: 'bar',
        barWidth: 10,
        data: values.map((v, idx) => ({
          value: v,
          itemStyle: {
            borderRadius: [0, 2, 2, 0],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: idx >= values.length - 2 ? 'rgba(232,184,74,0.2)' : 'rgba(0,232,255,0.15)',
                },
                {
                  offset: 1,
                  color: idx >= values.length - 2 ? '#E8B84A' : '#00E8FF',
                },
              ],
            },
            shadowBlur: 8,
            shadowColor: 'rgba(0,232,255,0.35)',
          },
          label: {
            show: true,
            position: 'right',
            color: '#BDEFFF',
            fontSize: 9,
            formatter: '{c}',
          },
        })),
      },
    ],
  }
}

export function optionScatter(scatterPoints) {
  return {
    ...animIn,
    tooltip: {
      formatter: (p) => `负载 ${p.value[0]}%<br/>时延 ${p.value[1]}ms<br/>流量 ${p.value[2]}`,
    },
    grid: { left: 36, right: 10, top: 16, bottom: 24 },
    xAxis: {
      name: 'LOAD%',
      nameTextStyle: { color: '#5A7A8C', fontSize: 9 },
      nameGap: 2,
      splitLine: { show: true, lineStyle: { color: 'rgba(0,232,255,0.06)' } },
      axisLabel: { fontSize: 9 },
    },
    yAxis: {
      name: 'RTT',
      nameTextStyle: { color: '#5A7A8C', fontSize: 9 },
      splitNumber: 3,
      axisLabel: { fontSize: 9 },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (val) => Math.max(6, Math.min(22, val[2] / 2.2)),
        data: scatterPoints,
        itemStyle: {
          color: 'rgba(0,232,255,0.55)',
          borderColor: '#00E8FF',
          borderWidth: 1,
          shadowBlur: 10,
          shadowColor: 'rgba(0,232,255,0.45)',
        },
        emphasis: {
          itemStyle: { color: '#E8B84A', borderColor: '#E8B84A' },
        },
      },
    ],
  }
}

export function optionRadar(radarScores) {
  return {
    ...animIn,
    radar: {
      indicator: radarScores.map((r) => ({ name: r.name, max: 100 })),
      center: ['50%', '52%'],
      radius: '62%',
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: radarScores.map((r) => r.value),
            name: 'Capability',
            areaStyle: { color: 'rgba(0,232,255,0.18)' },
            lineStyle: { color: '#00E8FF', width: 2 },
            itemStyle: { color: '#00E8FF' },
          },
        ],
      },
    ],
  }
}

export function optionGauge(value = 98.4) {
  return {
    ...animIn,
    series: [
      {
        type: 'gauge',
        min: 0,
        max: 100,
        splitNumber: 5,
        radius: '88%',
        center: ['50%', '58%'],
        axisLine: {
          lineStyle: {
            width: 10,
            color: [
              [0.55, '#00D68F'],
              [0.8, '#00E8FF'],
              [1, '#E8B84A'],
            ],
          },
        },
        pointer: {
          itemStyle: { color: '#00E8FF' },
          width: 3,
          length: '60%',
        },
        axisTick: { distance: -10, length: 4, lineStyle: { color: '#8FB6C9' } },
        splitLine: { distance: -12, length: 8, lineStyle: { color: '#8FB6C9', width: 1 } },
        axisLabel: { color: '#8FB6C9', fontSize: 9, distance: 12 },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#E8B84A',
          fontSize: 16,
          fontFamily: 'Orbitron, sans-serif',
          offsetCenter: [0, '72%'],
        },
        title: {
          show: true,
          offsetCenter: [0, '92%'],
          color: '#8FB6C9',
          fontSize: 10,
        },
        data: [{ value, name: 'ARC OUT' }],
      },
    ],
  }
}
