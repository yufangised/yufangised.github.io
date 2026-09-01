# Image Optimization / 图片优化

Images total **503MB**, 141 `<img>` tags, 0 with lazy loading.
图片总量 **503MB**，141 个 `<img>` 标签，0 个懒加载。

## Current state / 现状

| Page / 页面 | Payload / 首屏下载 | Images / 图片 | Lazy-able / 可懒加载 |
|---|---|---|---|
| resilience_thread.html | 92.4 MB | 30 | 25 |
| conbricks.html | 73.2 MB | 33 | 24 |
| augmented_ears.html | 35.0 MB | 17 | 14 |
| fireworks_latern.html | 25.3 MB | 14 | 11 |
| function.html | 23.4 MB | 10 | 8 |
| mutic_box.html | 20.5 MB | 7 | 6 |
| channel_of_mindfulness.html | 18.7 MB | 23 | 18 |
| toy_painters.html | 6.8 MB | 4 | 3 |
| painting_migration.html | 5.4 MB | 3 | 2 |

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

- [ ] Branch and back up originals (`_originals/`, add to `.gitignore`)
      建分支，备份原图到 `_originals/` 并加入 `.gitignore`
- [ ] Add `loading="lazy"` to non-`active` carousel images (111 total) — biggest win, no pixels changed
      给非 `active` 的轮播图加 `loading="lazy"`（共 111 张）— 收益最大，不动任何像素
- [ ] Run per-image SSIM scan, pick lowest quality meeting SSIM ≥ 0.98
      逐图跑 SSIM，选满足 SSIM ≥ 0.98 的最低质量
- [ ] Generate WebP at native size + 1200/1800 variants. Keep original JPEG/PNG as fallback
      生成原生尺寸 WebP + 1200/1800 两档。原 JPEG/PNG 保留作兜底
- [ ] Switch content images to `<picture>` + `srcset`; `sizes` must match the 1800px/2400px CSS breakpoints
      正文图改用 `<picture>` + `srcset`；`sizes` 必须与 CSS 的 1800px/2400px 断点一致
- [ ] Homepage: 400px thumbnail (~12KB) as instant placeholder, swap in full-size after it loads
      首页：400px 缩略图（约 12KB）做即时占位，全尺寸图加载完成后替换
- [ ] `painting_migration` SVGs — 7 files, 161MB, 100k+ paths each. Simplify paths in Illustrator
      `painting_migration` 的 SVG — 7 个文件共 161MB，每个 10 万以上路径。在 Illustrator 里简化路径
- [ ] Verify at 390 / 1440 / 2560 / 5120 viewports, then merge
      在 390 / 1440 / 2560 / 5120 视口下验证，然后合并

## Open questions / 待确认

- Any originals larger than 2500px? If so, re-export backgrounds from those to fix 5K stretching.
  有比 2500px 更大的原图吗？有的话背景图应从原图重导，顺便解决 5K 拉伸。
- Quality floor: SSIM ≥ 0.98 (default) or ≥ 0.99 (~1.4x the size)?
  质量下限：SSIM ≥ 0.98（默认）还是 ≥ 0.99（体积约 1.4 倍）？
- AVIF too? ~20–30% smaller than WebP, needs `brew install libavif`. Optional.
  要不要一并上 AVIF？比 WebP 再小 20–30%，需要 `brew install libavif`。可选。

## Notes / 备注

- `cwebp` / `dwebp` already installed. Python PIL + numpy available for SSIM.
  `cwebp` / `dwebp` 已安装。Python PIL + numpy 可用于计算 SSIM。
- `.git` holds another 450MB of historical images. Does not affect page load — separate issue.
  `.git` 另有 450MB 历史大图。不影响页面加载，是独立议题。
