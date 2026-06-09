# TODO

## High Priority / 高优先级

- [ ] Fix HTML bug in `about.html:185` — extra `</p>` before `<b>Danish:</b>` breaks structure
  修复 `about.html:185` 的 HTML 标签错误 — `<b>Danish:</b>` 前多了一个 `</p>`，导致结构断裂
- [ ] Fix unclosed `<p>` tag in `conbricks.html:70`
  修复 `conbricks.html:70` 未闭合的 `<p>` 标签
- [ ] Fix CSS `left: 200` missing unit (`px`) in `style.css:113`
  修复 `style.css:113` 的 `left: 200` 缺少单位 (`px`)
- [ ] Fix CSS `align-items: left` (invalid value, should be `flex-start`) in `style.css:121`
  修复 `style.css:121` 的 `align-items: left`（无效值，应为 `flex-start`）
- [ ] Fix CSS selector `.content-container p,li` — missing `.content-container` before `li` in `style.css:103`
  修复 `style.css:103` 的选择器 `.content-container p,li` — `li` 前缺少 `.content-container`，导致选中了页面所有 `li` 元素

## Medium Priority / 中优先级

- [ ] Compress images (about_main.jpg 1.3MB, presentink.jpg 1.1MB, project images) — target ~1/5 original size
  压缩图片（about_main.jpg 1.3MB、presentink.jpg 1.1MB、项目图片）— 目标压缩到原始大小的 1/5
- [ ] Add lazy loading to carousel images (`loading="lazy"`)
  给轮播图片添加懒加载（`loading="lazy"`）
- [ ] Improve mobile menu — current fixed 200px sidebar overlaps content on small screens, consider hamburger menu or collapsible nav
  改善移动端菜单 — 目前 200px 固定侧边栏在小屏幕上会遮挡内容，考虑使用汉堡菜单或可折叠导航

## Low Priority / 低优先级

- [ ] Customize `<title>` per page (e.g. "Conbricks - Yufan Wang" instead of just "conbricks")
  为每个页面定制 `<title>`（如 "Conbricks - Yufan Wang" 而不是 "conbricks"）
- [ ] Customize `<meta description>` per page instead of generic "creative technologies"
  为每个页面定制 `<meta description>`，而不是统一的 "creative technologies"
- [ ] Replace generic image alt text ("Image 1", "Image 2") with descriptive text
  将通用的图片 alt 文本（"Image 1"、"Image 2"）替换为有描述性的文字
- [ ] Add Open Graph meta tags for social media sharing previews
  添加 Open Graph meta 标签，优化社交媒体分享时的预览效果
- [ ] Migrate from Universal Analytics (UA) to GA4 or remove analytics — UA stopped processing data July 2023, and current gtag.js is missing `gtag('config', ...)` initialization
  从 Universal Analytics (UA) 迁移到 GA4 或移除分析代码 — UA 已于 2023 年 7 月停止处理数据，且当前 gtag.js 缺少 `gtag('config', ...)` 初始化调用
- [ ] Replace manual CSS cache busting (`?rnd=132`) with automated approach
  将手动的 CSS 缓存清除（`?rnd=132`）替换为自动化方案
- [ ] Consider templating (Jekyll / includes) to reduce duplicated `<head>` and script blocks across 15+ HTML files
  考虑使用模板化（Jekyll / includes）来减少 15+ 个 HTML 文件中重复的 `<head>` 和脚本代码
