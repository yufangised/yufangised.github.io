# CLAUDE.md

## Project / 项目简介
Personal portfolio website for Yufan Wang, hosted on GitHub Pages.
Multidisciplinary creative practice spanning interactive technology, physical design, fine art, and commercial products (2011–2025).

Yufan Wang 的个人作品集网站，托管在 GitHub Pages 上。
跨学科创作实践，涵盖交互技术、实体设计、纯艺术和商业产品（2011–2025）。

## Tech Stack / 技术栈
- HTML5 / CSS3 / JavaScript (static site, no build tools / 静态站点，无构建工具)
- Bootstrap 4.4.1 (CDN)
- jQuery 3.4.1 (CDN)
- p5.js 1.6.0 (CDN) — canvas-based interactive visualizations / 基于画布的交互可视化
- Google Fonts (Anonymous Pro)
- Google Analytics (UA-163543797-1)

## Structure / 目录结构
```
├── index.html              # Homepage: full-screen bg + fixed left nav menu / 首页：全屏背景 + 固定左侧导航
├── about.html              # Bio page / 个人介绍页
├── cv_yufan_wang.pdf       # Resume / 简历
├── css/style.css           # Single stylesheet (cache-busted via ?rnd=) / 唯一样式表（通过 ?rnd= 清除缓存）
├── script/                 # p5.js visualization scripts / p5.js 可视化脚本
│   ├── partical_three.js   # Particle system (400 particles, mouse interaction) / 粒子系统（400个粒子，鼠标交互）
│   ├── dynamic_three.js    # Dynamic geometry with Perlin noise / Perlin 噪声动态几何
│   └── curve_three.js      # Curve animation / 曲线动画
├── src/favicon.ico         # Favicon / 网站图标
├── images/                 # Global images (about page, default bg) / 全局图片（关于页、默认背景）
├── projects/               # Per-project image assets (13 subdirectories) / 各项目图片素材（13个子目录）
└── *.html (root)           # Individual project pages / 各项目独立页面
```

## Page Pattern / 页面模板
All project pages follow a consistent template:
所有项目页面遵循统一模板：

1. Full-screen background header / 全屏背景头图
2. Simple nav (link back to index) / 简单导航（返回首页链接）
3. Centered content wrapper (Bootstrap col-md-9) / 居中内容区（Bootstrap col-md-9）
4. Title, year, context, description with hashtags / 标题、年份、背景、描述及标签
5. Bootstrap carousels for image galleries / Bootstrap 轮播图展示
6. Embedded videos (Vimeo / YouTube) / 嵌入视频（Vimeo / YouTube）

## Homepage Behavior / 首页交互
- Left sidebar menu (fixed, 200px) / 左侧固定菜单（200px）
- Hovering over a project name swaps the full-screen background image / 鼠标悬停项目名时切换全屏背景图
- Menu items: project links + About + Present Ink / 菜单项：项目链接 + About + Present Ink

## Projects / 项目分类
| Category / 分类 | Projects / 项目 |
|---|---|
| Interactive / Wearable / 交互/可穿戴 | Augmented Ears, Channel of Mindfulness, function(), Mutic Box |
| Physical Design / Art / 实体设计/艺术 | Conbricks, Resilience Thread, Fireworks Lantern, Toy Painters |
| Digital / Software / 数字/软件 | Painting Migration, Instagram Like Bot, p5.js visualizations |
| Commercial (LEGO) / 商业产品 (LEGO) | My Lego Touch (FUSION, Worlds, Super Mario) |
| Fine Art / 纯艺术 | Present Ink (calligraphy, collage / 书法、拼贴) |

## Conventions / 惯例
- Static HTML — no frameworks, no build step / 纯静态 HTML — 无框架、无构建步骤
- One HTML file per project at root level / 每个项目一个 HTML 文件，放在根目录
- Project images stored in `/projects/<project-name>/` / 项目图片存放在 `/projects/<项目名>/`
- CSS uses BEM-like classes; responsive breakpoint at 768px / CSS 使用类 BEM 命名；响应式断点为 768px
- Commit messages: short, lowercase (e.g., "update") / 提交信息：简短、小写（如 "update"）
