# Strata · App Store listing, Simplified Chinese (zh-Hans, mainland China)

**Approved for the store by Kellan, 2026-10-31, without a native speaker's review** (docs/localisation.md lists the open doubts).

Translated from [app-store-listing.md](app-store-listing.md) (the live English, same claims, same order), with the level count updated to **200** (`SHAPES` after build 7). Counts are measured by script: characters for text fields, UTF-8 bytes for keywords, as App Store Connect counts them.

Notes for the reviewer:
- The English description says "stars" for the reward; the game says gems (◆), so this uses 宝石 throughout, as the game's Chinese does. The claims are unchanged.
- "No timers" is 不限时: a small clock counts up, so "no timer at all" would not be true; nothing runs out.
- No 最 / 第一 style absolutes (China's advertising law), and none in the English either.
- Words follow the game's glossary: 石块 (stone), 方块 (cube), 凿掉 (chisel), 标记 (mark), 失误 (slip), 宝石 (gem), 图鉴 (Finds), 数织 (nonogram).

---

## App name (30)

```
Strata：石块谜题
```
(11 / 30 characters)

The home-screen label stays **Strata**.

## Subtitle (30)

```
一款安静的 3D 解谜游戏
```
(13 / 30 characters)

## Promotional text (170)

```
每个石块都藏着一个秘密。读懂它各个面上的数字，凿掉不属于它的部分，看一个小小的、可爱的东西从石头里显现出来。不限时，没有广告。
```
(63 / 170 characters)

## Description (4000)

```
每个石块里，都藏着一样东西。

Strata 是一款安静的谜题游戏，讲的是把它找出来。每一关都是一个石块，里面藏着一样东西：一盏灯笼、一只蜷着睡觉的狐狸、一座灯塔、一条还小得喷不出火的龙。石块三个面上的数字，告诉你每一行有几个方块属于它。读懂这些数字，凿掉每一个不属于它的方块，它的样子就会慢慢显现。

这是一款三维的数织（Nonogram）。把石块拿在手里转动，一层层剥开看到里面，一行一行推下去，直到只剩下藏着的那样东西。

穿越十五片土地
200 个石块，分布在 15 个章节里：从初光、苔园，到灯会、深海和星落。每个章节都是一个地方，有自己的光和色彩；你发现的每个石块，都会化作一座小雕塑，留在地图上。每个章节还有一个奖励石块，留给攒够宝石的人。

轻松上手
十二节短课，边玩边教会你所有规则：怎么读数字，怎么凿，怎么标记你想留下的方块。越往后走，石块越大，线索越少，但规则从不改变。卡住了，就稍等一会儿，能推进的那一行会轻轻发光。

按你的节奏来
有一个小时钟在往上计时，但什么都不会耗尽，用时也从不让你少拿宝石。失误可以撤回。宝石奖励的是稳当，不是快。

安静，是有意为之
• 完全离线可玩
• 没有广告，没有追踪
• 不需要账号，不用登录
• 没有应用内购买
• 进度只保存在你的设备上

找一段安静的时间，拿起一个石块，看看它一直守着什么。
```
(578 / 4000 characters)

## Keywords (100 bytes)

```
数织,数图,逻辑,填色,益智,立体,方块,体素,放松,治愈,离线,烧脑,雕刻,数字
```
(97 / 100 bytes in UTF-8; 41 characters)

Comma-separated, no spaces. Leaves out the name and subtitle's words (Strata, 石块, 谜题, 3D, 解谜, 游戏, 安静), which Apple already indexes. 数织 and 数图 are the two common Chinese names for nonograms; 填色 is how many Chinese players search for picross-style games. No trademarks (Picross, ピクロス), and no 数独: Strata isn't sudoku.

## What's New

The English listing has none for 1.0, so none here.

---

## Alternatives from the Hopkins copy (not picked; listing-copy-hopkins.md)

Only if Kellan picks the Hopkins lines in English too. "One answer per stone, no guessing" is checked by `node tools/aha-audit.mjs`; re-run it before using the claim.

Subtitle, "3D logic puzzles: no guessing":
```
3D 逻辑谜题，不用猜
```
(11 / 30 characters)

Promotional text:
```
读懂数字，凿开石块，一只狐狸或一条小龙就会留在那里。每个石块只有一个答案，不用猜。没有广告，不限时。
```
(50 / 170 characters)
