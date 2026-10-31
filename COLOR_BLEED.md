# Colour Bleed / 串色

A rendering accident found on 2026-10-31 while splitting `painting_migration.html` into
two drawing stages. Worth keeping as a direction, not just a fixed bug.

2026-10-31 把 `painting_migration.html` 拆成两个舞台时出现的渲染意外。
它是个方向，不只是一个修掉就算的 bug。

## What it looks like / 现象

Load a painting, then load a texture. The painting repaints itself in the texture's
palette — same shapes, same line work, completely different colour. The drawing you
were looking at becomes a third thing that exists in neither file.

先加载一张 painting，再加载一张 texture。painting 会用 texture 的调色板重新上色 ——
形状和线条不变，颜色整个换掉。你正在看的那张图变成了第三件东西，
它不存在于任何一个源文件里。

## Why it happens / 机制

Every one of these SVGs is an Illustrator export, so every one carries a `<style>`
block using the same generated class names — `.st0`, `.st1`, `.st2` … Each file
assigns different colours to those same names:

七个文件都是 Illustrator 导出的，所以每个都带一个 `<style>`，
用的是同一套自动生成的类名 `.st0`、`.st1`、`.st2`…，而各自给同名的类配了不同的颜色：

```
painting_1.svg          .st0 { fill: #0C0C09 }   近黑 / near-black
digital_texture_1.svg   .st0 { fill: #C3BDA5 }   米色 / beige
```

**An SVG `<style>` element is document-scoped, not element-scoped.** With one container
only one drawing existed at a time, so the names never met. With two stages both
drawings are in the page at once, and the later `<style>` wins the cascade for every
class name the two files share.

**SVG 的 `<style>` 是文档级作用域，不是元素级。** 以前只有一个容器，
同一时刻页面上只有一张图，名字撞不上。现在两个舞台能共存，
后加载的那份 `<style>` 就在层叠中赢下所有同名类。

So the second file does not tint the first — it *replaces* the colour of every class
name the two have in common, leaving the rest untouched.

所以第二个文件不是给第一张"染色"，而是**替换**掉两者共有类名的颜色，
其余部分原样保留。

## How much gets repainted / 覆盖程度

The share of a drawing that changes is set by how many class names the other file
has. A file with more classes covers more of the first file's range.

被改动的比例取决于另一个文件的类数量 —— 类越多，覆盖得越广。

| File | `.stN` count |
|---|---|
| painting_1 | 5,820 |
| painting_2 | 17,515 |
| painting_3 | 15,555 |
| digital_texture_1 | 34,865 |
| digital_texture_2 | 13,570 |
| digital_texture_3 | 41,470 |
| digital_texture_4 | 21,056 |

Load A first, then B. The figure is the percentage of A's classes that change colour:

先加载 A，再加载 B。数字是 A 有多少比例的类被改了颜色：

| A \ B | P1 | P2 | P3 | T1 | T2 | T3 | T4 |
|---|---|---|---|---|---|---|---|
| **P1** | — | 100% | 100% | 100% | 100% | 100% | 100% |
| **P2** | 33% | — | 89% | 100% | 77% | 100% | 100% |
| **P3** | 37% | 100% | — | 100% | 87% | 100% | 100% |
| **T1** | 17% | 50% | 45% | — | 39% | 100% | 60% |
| **T2** | 43% | 100% | 100% | 100% | — | 100% | 100% |
| **T3** | 14% | 42% | 38% | 84% | 33% | — | 51% |
| **T4** | 28% | 83% | 74% | 100% | 64% | 100% | — |

**The low numbers are the interesting ones.** 100% is a full reskin — the original
palette is gone. Something like T3 → P1 at 14% leaves most of the original intact and
recolours a scatter of regions through it, which reads much more like collage.

**低百分比才是有意思的。** 100% 是整张换皮，原调色板全没了。
像 T3 → P1 的 14%，大部分原样保留，只有零散区域被换色，
那个效果更接近拼贴。

## How to reproduce / 如何复现

The loader in `painting_migration.html` now isolates each stage in a shadow root, so
the bleed does not happen by default. There is a switch:

`painting_migration.html` 里的加载器现在用 shadow root 隔离每个舞台，
默认不会串色。留了一个开关：

```js
const ISOLATE_STYLES = true;   // 改成 false 就恢复串色
```

With it `false`, both stages share the document scope again and the effect returns
exactly as found. Then:

改成 `false`，两个舞台重新共用文档作用域，效果原样回来。然后：

1. Click a button in the **painting** group, let it finish drawing.
   点 **painting** 组的按钮，等它画完。
2. Click a button in the **texture** group.
   点 **texture** 组的按钮。
3. The painting above repaints as the texture's styles land.
   上面那张 painting 会在 texture 的样式落地时重新上色。

Order decides the result: the **second** file's palette wins. Reloading the first one
afterwards flips it back. Use the matrix above to pick a pair.

顺序决定结果：**后点的**那张赢。之后再重新加载第一张又会翻回来。
配对参考上面的矩阵。

## If it becomes a real feature / 如果要做成功能

The accident is not controllable as it stands — the outcome depends on click order,
and a reload resets it. To make it an instrument rather than a surprise:

现状不可控 —— 结果取决于点击顺序，刷新就没了。
要把它从意外变成乐器：

- Keep the stages isolated, then **deliberately** inject a chosen file's `<style>` into
  another stage's shadow root. One file's shapes, another file's palette, picked on
  purpose. 保持舞台隔离，然后**主动**把选定文件的 `<style>` 注入另一个舞台的影子树。
  一张的形状配另一张的调色板，是选的不是撞的。
- Only the `<style>` block is needed — a few hundred KB — not the whole 25–32MB file.
  只需要 `<style>` 块，几百 KB，不用加载整个 25–32MB 的文件。
- The result is reproducible and shareable: shapes file + palette file is the whole
  recipe. 结果可复现、可转述：形状文件 + 调色板文件就是完整配方。

## Notes / 备注

- The class names are Illustrator's, not authored. Re-exporting any of these files
  will renumber `.stN` and change every pairing in the matrix above.
  类名是 Illustrator 生成的，不是手写的。任何一个文件重新导出，
  `.stN` 的编号就会变，上面矩阵里的所有配对结果都会跟着变。
- This is why the matrix is recorded here rather than recomputed later: it describes
  these seven files as they exist today.
  所以矩阵记在这里而不是以后再算 —— 它描述的是这七个文件当下的状态。
