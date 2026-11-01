# Strata · App Store listing, Traditional Chinese (zh-Hant, Taiwan first, readable in Hong Kong)

**Approved for the store by Kellan, 2026-10-31, without a native speaker's review** ("Your translations are world class"; docs/l10n/zh-Hant.md lists the open doubts).

Translated from [app-store-listing.md](app-store-listing.md) (the live English, same claims, same order), with the level count updated to **194** (`SHAPES` after build 7), and checked against [listing-zh-Hans.md](listing-zh-Hans.md). Written in Taiwan's words, not converted from the simplified page. Counts are measured by script: characters for text fields, UTF-8 bytes for keywords, as App Store Connect counts them.

App Store Connect has one Traditional Chinese locale, **Chinese (Traditional)**, and it serves both the Taiwan and the Hong Kong storefronts, so this one page is both. Its words are Taiwan's (螢幕, 離線, 帳號, 裝置, 療癒); a Hong Kong reader understands all of them.

Notes for the reviewer:
- The English description says "stars" for the reward; the game says gems (◆), so this uses 寶石 throughout, as the game's Chinese does. The claims are unchanged.
- "No timers" is 不限時: a small clock counts up, so "no timer at all" would not be true; nothing runs out.
- Words follow the game's glossary (docs/l10n/zh-Hant.md): 石塊 (stone), 方塊 (cube), 鑿掉 (chisel), 標記 (mark), 失誤 (slip), 寶石 (gem), 圖鑑 (Finds), 數織 (nonogram), 列 (row).

---

## App name (30)

```
Strata：石塊謎題
```
(11 / 30 characters)

The home-screen label stays **Strata**.

## Subtitle (30)

```
一款安靜的 3D 解謎遊戲
```
(13 / 30 characters)

## Promotional text (170)

```
每個石塊都藏著一個祕密。讀懂它各個面上的數字，鑿掉不屬於它的部分，看一個小小的、可愛的東西從石頭裡現身。不限時，沒有廣告。
```
(61 / 170 characters)

## Description (4000)

```
每個石塊裡，都藏著一樣東西。

Strata 是一款安靜的謎題遊戲，玩的是把它找出來。每一關都是一個石塊，裡面藏著一樣東西：一盞燈籠、一隻蜷著睡覺的狐狸、一座燈塔、一條還小到噴不出火的龍。石塊三個面上的數字，告訴你每一列有幾個方塊屬於它。讀懂這些數字，鑿掉每一個不屬於它的方塊，它的樣子就會慢慢浮現。

這是一款立體的數織（Nonogram）。把石塊拿在手裡轉動，一層層剝開看到裡面，一列一列推下去，直到只剩下藏著的那樣東西。

走過十五個世界
194 個石塊，分布在 15 個章節裡：從初光、苔園，到燈會、深海和星落。每個章節都是一個地方，有自己的光和色彩；你發現的每個石塊，都會化成一座小雕塑，留在地圖上。每個章節還有一個獎勵石塊，留給集滿寶石的人。

輕鬆上手
十二堂短課，邊玩邊教會你所有規則：怎麼讀數字、怎麼鑿、怎麼標記你想留下的方塊。越往後走，石塊越大、線索越少，但規則從不改變。卡住了，就稍等一下，能推進的那一列會輕輕發光。

照你的步調來
有一個小時鐘在往上計時，但什麼都不會用完，花多少時間也不會讓你少拿寶石。失誤可以收回。寶石獎勵的是穩，不是快。

安靜，是刻意的
• 完全離線可玩
• 沒有廣告，沒有追蹤
• 不需要帳號，不用登入
• 沒有 App 內購買
• 進度只存在你的裝置上

找一段安靜的時間，拿起一個石塊，看看它一直守著什麼。
```
(580 / 4000 characters)

## Keywords (100 bytes)

```
數織,數圖,繪圖邏輯,填圖,益智,立體,方塊,像素,療癒,放鬆,離線,燒腦,雕刻
```
(96 / 100 bytes in UTF-8; 40 characters)

Comma-separated, no spaces. Leaves out the name and subtitle's words (Strata, 石塊, 謎題, 3D, 解謎, 遊戲, 安靜), which Apple already indexes. Taiwan's search terms for nonograms: 數織 and 數圖 (the common names), 繪圖邏輯 (from the Japanese イラストロジック, the name Taiwan's puzzle magazines and apps use), and 填圖 (fill-in-the-picture). 像素 catches the pixel-picture searches picross players make; 療癒 is Taiwan's word for a calming game (the mainland's 治愈), and 燒腦 is used in both. No trademarks (Picross, ピクロス), and no 數獨: Strata isn't sudoku.

## What's New

The English listing has none for 1.0, so none here.

---

## Alternatives from the Hopkins copy (not picked; listing-copy-hopkins.md)

Only if Kellan picks the Hopkins lines in English too. "One answer per stone, no guessing" is checked by `node tools/aha-audit.mjs`; re-run it before using the claim.

Subtitle, "3D logic puzzles: no guessing":
```
3D 邏輯謎題，不用猜
```
(11 / 30 characters)

Promotional text:
```
讀懂數字，鑿開石塊，一隻狐狸或一條小龍就會留在那裡。每個石塊只有一個答案，不用猜。沒有廣告，不限時。
```
(50 / 170 characters)
