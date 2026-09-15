# Iron Workshop HUD Demo

电影工作室全息投影风（FUI）图表大屏 Demo。风格启发自科幻电影 HUD / 全息工作台，**不含任何漫威商标与角色素材**。

## 启动

```bash
pnpm install
pnpm dev
```

浏览器打开终端提示的本地地址（默认 `http://127.0.0.1:5173`）。

## 目录

```
src/
├── main.js              # 布局编排、图表、粒子
├── data/mock.js         # 演示数据（与渲染分离）
└── theme/               # ★ 可整包抽成 Skill 的主题
    ├── THEME.md         # 设计约束 / Skill 草稿说明
    ├── tokens.css       # --iw-* 设计 Token
    ├── echarts-theme.js # iron-workshop 图表主题
    ├── index.css        # 组件样式入口
    └── components/      # frame / holo / kpi / panels …
```

主题约定与 Skill 抽取步骤见 [`src/theme/THEME.md`](src/theme/THEME.md)。

## 屏上内容

| 区域 | 内容 |
|------|------|
| 顶栏 | WORKSHOP HUD · 时钟 · SYSTEM / ARC 状态 |
| 左栏 | 装甲系统进度条 · 目标锁定准星 |
| 中心 | 全息台：线框蓝图 + 电弧反应堆 + 悬浮标注 |
| 中下 | KPI ×4 · **2×3 图表墙**（折线/热力/玫瑰/堆叠/排名/散点） |
| 右栏 | 能力雷达 · 功率仪表 · 诊断总线日志 |
| 底栏 | 告警走马灯 |
| 氛围 | 透视网格、雷达扫、粒子、十六进制数据流 |

## Skill

已发布为个人 Skill：`~/.cursor/skills/iron-workshop-hud/`

对话中提到「全息 / 工作室 HUD / 钢铁侠风大屏」时可自动选用。改主题时先改本仓库 `src/theme/`，再同步到 skill 的 `pack/`。生产环境请把 Google Fonts 换成本地字体。
