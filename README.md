# Iron HUD Demo

科技全息指挥风（FUI）图表大屏 Demo，风格启发自电影 HUD，不含漫威商标素材。

## 启动

```bash
cd /workspace/iron-hud-demo
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

浏览器打开：http://127.0.0.1:5173

## 内容

- `src/hud-tokens.css` — 设计 Token
- `src/iron-hud-theme.js` — ECharts 主题
- `src/style.css` — HUD 边框 / KPI / 告警条
- `src/main.js` — 布局与图表
