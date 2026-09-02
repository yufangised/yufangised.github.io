# Image Optimization / 图片优化

Images total **503MB**, 141 `<img>` tags, 0 with lazy loading.
图片总量 **503MB**，141 个 `<img>` 标签，0 个懒加载。

## Current state / 现状

| Page / 页面 | Before / 优化前 | After step 1 / 第 1 步后 | Images / 图片 | Lazy / 已懒加载 |
|---|---|---|---|---|
| resilience_thread.html | 92.4 MB | **15.3 MB** | 30 | 25 |
| conbricks.html | 73.2 MB | **20.1 MB** | 33 | 24 |
| augmented_ears.html | 35.0 MB | **5.3 MB** | 17 | 14 |
| fireworks_latern.html | 25.3 MB | **5.7 MB** | 14 | 11 |
| function.html | 23.4 MB | **5.9 MB** | 10 | 8 |
| mutic_box.html | 20.5 MB | **2.9 MB** | 7 | 6 |
| channel_of_mindfulness.html | 18.7 MB | **3.1 MB** | 23 | 18 |
| toy_painters.html | 6.8 MB | **1.9 MB** | 4 | 3 |
| painting_migration.html | 5.4 MB | **1.6 MB** | 3 | 2 |
| **Total / 合计** | **300.7 MB** | **61.7 MB** | 141 | 111 |

`conbricks.html` stays highest at 20.1MB because it has 9 carousels, so 9 slides are eagerly loaded. Format conversion is what brings that down.
`conbricks.html` 仍有 20.1MB，因为它有 9 个轮播、9 张首屏图。这部分要靠格式转换来降。

Bootstrap carousels download every slide at once. Homepage hover pulls the full-size image each time (26MB to hover the whole menu).
Bootstrap 轮播会一次性下载所有 slide。首页悬停每次都拉全尺寸原图（整个菜单划一遍 26MB）。

## Key decision / 关键决策

**Do not downscale.** `.full-screen-container` is `100vh` + `cover`; `.content-container` is 1200px → 1500px (≥1800px screens) → 1800px (≥2400px). At 2x retina that needs 2400–3600px, and backgrounds need ~5120px on a 5K display. Sources are only 2500px — already being stretched. Savings come from **format**, not size.

**不要降尺寸。** `.full-screen-container` 是 `100vh` + `cover`；`.content-container` 为 1200px → 1500px（≥1800px 屏）→ 1800px（≥2400px 屏）。按 2x 视网膜需要 2400–3600px，全屏背景在 5K 屏需要约 5120px。而源图只有 2500px，本来就在被拉伸。收益应该来自**格式**，不是尺寸。

Measured at native 2500px, WebP only (size / SSIM, 1.0 = identical):
保持 2500px 原生尺寸，仅换 WebP 实测（体积 / SSIM，1.0 = 完全一致）：

| Image / 图片 | Original | q95 | q90 |
|---|---|---|---|
| resilience_thread | 3.4 MB | 1642K / .993 | 1155K / .983 |
| fireworks_lantern | 2.9 MB | 1121K / .983 | 571K / .964 |
| my_lego_touch | 3.6 MB | 880K / .993 | 664K / .987 |

SSIM ≥ 0.98 is visually lossless. Pick quality per image rather than one fixed value — dark, detailed images (fireworks) need q95.
SSIM ≥ 0.98 基本肉眼无法分辨。逐图选质量，不要固定一个值——暗部细节多的图（fireworks）需要 q95。

## Steps / 步骤

- [x] Branch `image-optimization`. All 168 images are tracked in git and originals stay in place as `<picture>` fallback, so no separate copy is needed — `git checkout -- .` is the rollback.
      建分支 `image-optimization`。168 张图全部在 git 追踪中，且原图保留在原位作 `<picture>` 兜底，无需另存副本 — 回滚用 `git checkout -- .`
- [x] Added `loading="lazy"` to 111 non-`active` carousel images across 9 pages. First-screen payload **300.7MB → 61.7MB (-79%)**, zero pixels changed.
      已给 9 个页面共 111 张非 `active` 轮播图加上 `loading="lazy"`。首屏总量 **300.7MB → 61.7MB（-79%）**，未改动任何像素。
- [x] Scanned all 156 images at q85/q90/q95. **SSIM ≥ 0.99 turned out to be unreachable** — 93 images miss it even at q95, so it would just pin everything to q95 for 15MB more. Settled on **≥ 0.98 with q98 added to the top of the ladder** for the 13 stubborn images.
      已扫描全部 156 张（q85/q90/q95）。**SSIM ≥ 0.99 不可达** — 93 张连 q95 都到不了，选它只会把大部分图无脑顶到 q95，多花 15MB。最终定为 **≥ 0.98，并在阶梯顶端加 q98** 处理 13 张顽固图。
- [x] Generated 431 WebP variants at **1280 / 1920 / native**, 37 skipped as they would upscale. Quality spread: q85 ×51, q90 ×26, q95 ×66, q98 ×13. Originals untouched.
      已生成 431 个 WebP，档位 **1280 / 1920 / 原生**，37 个因会放大而跳过。质量分布：q85 ×51、q90 ×26、q95 ×66、q98 ×13。原图未动。
- [x] All 141 content images wrapped in `<picture>`. `sizes` matches the CSS breakpoints: `(max-width:768px) calc(100vw - 80px), (min-width:2400px) 1740px, (min-width:1800px) 1440px, 1140px`.
      141 张正文图全部包进 `<picture>`。`sizes` 与 CSS 断点一致。
- [x] 15 thumbnails, **187KB total**. Hover shows the thumbnail instantly, full-size loads in the background and swaps in only if the pointer is still on that item. Thumbnails prewarmed on idle. Hovering the whole menu: **26MB blocking → 187KB**.
      15 张缩略图共 **187KB**。悬停立即显示缩略图，全尺寸后台加载，仅当指针仍停在该项时才替换。空闲时预热。整个菜单划一遍：**26MB 阻塞 → 187KB**。
- [ ] `painting_migration` SVGs — 7 files, 161MB, 100k+ paths each. Simplify paths in Illustrator
      `painting_migration` 的 SVG — 7 个文件共 161MB，每个 10 万以上路径。在 Illustrator 里简化路径
- [ ] Verify visually in a browser at 390 / 1440 / 2560 viewports, then merge. Automated checks already pass: 683 image references all resolve, 141/141 `<picture>` blocks well-formed, 0 bare `<img>`.
      在浏览器中于 390 / 1440 / 2560 视口目视验证，然后合并。自动检查已通过：683 个图片引用全部有效，141/141 个 `<picture>` 结构完整，0 张裸露 `<img>`。

## Open questions / 待确认

- ~~Any originals larger than 2500px?~~ **Answered: no.** 2500px is the ceiling. Backgrounds stay at native 2500px; 5K stretching persists but does not get worse. Do not upscale — it adds bytes without adding information.
  ~~有比 2500px 更大的原图吗？~~ **已答复：没有。** 2500px 即上限。背景图保持 2500px 原生，5K 拉伸维持现状但不会更差。不做放大 — 放大只增加体积不增加信息。
- ~~Quality floor?~~ **Resolved: SSIM ≥ 0.98, ladder q85→q90→q95→q98.** 0.99 is unreachable for 93 images.
  ~~质量下限？~~ **已定：SSIM ≥ 0.98，阶梯 q85→q90→q95→q98。** 0.99 对 93 张图不可达。
- AVIF too? ~20–30% smaller than WebP, needs `brew install libavif`. Optional.
  要不要一并上 AVIF？比 WebP 再小 20–30%，需要 `brew install libavif`。可选。

## Notes / 备注

- `cwebp` / `dwebp` already installed. Python PIL + numpy available for SSIM.
  `cwebp` / `dwebp` 已安装。Python PIL + numpy 可用于计算 SSIM。
- `.git` holds another 450MB of historical images. Does not affect page load — separate issue.
  `.git` 另有 450MB 历史大图。不影响页面加载，是独立议题。

## Results / 实测结果

First-screen payload by device (was **300.7 MB** on every device):
各设备首屏下载量（优化前一律 **300.7 MB**）：

| Device / 设备 | Payload / 下载量 |
|---|---|
| Phone 390 @3x | **5.0 MB** |
| Laptop 1440 @1x | **5.0 MB** |
| Laptop 1440 @2x | **20.5 MB** |
| Ultrawide 2560 @1x | **11.0 MB** |
| 5K 5120 @2x | **20.5 MB** |

Retina laptops pull 20.5MB because 1440@2x needs 2280 physical pixels, which lands on the 2500px tier. That is correct behaviour, not a regression — it is the point of not downscaling.
视网膜笔记本拿到 20.5MB，是因为 1440@2x 需要 2280 物理像素，只能取 2500 那档。这是正确行为而非退步 —— 正是"不降尺寸"的意义所在。

Homepage hover: **26 MB blocking → 187 KB**, full-size loads in the background.
首页悬停：**26 MB 阻塞 → 187 KB**，全尺寸图后台加载。
