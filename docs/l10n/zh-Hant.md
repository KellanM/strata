# Traditional Chinese (zh-Hant): glossary, choices and doubts (2026-10-31)

**Live** (Kellan, 2026-10-31: "Your translations are world class"), without a native speaker's review. Table: `public/i18n/zh-Hant.js` (all 712 keys). Store page: `store/listing-zh-Hant.md`. Which players get it: `match()` in `public/js/i18n.js` sends zh-TW, zh-HK, zh-MO and any -Hant tag here, and everything else Chinese to zh-Hans.

**Who it's for.** Taiwan first, readable in Hong Kong. The words are Taiwan's (螢幕, 拖曳, 設定, 選單, 程式, 酪梨, 無尾熊, 夾腳拖, 六角恐龍). Hong Kong readers know all of them, though some are not what they would say themselves (see doubts). There is no separate zh-HK table.

**How it was made.** Adapted from `zh-Hans.js` and re-read against the English, not converted character by character. Where Taiwan's word or habit differs, Taiwan's wins. Taiwan also leads on three conventions:
- **列, not 行, for a row.** In Taiwan 直行橫列: 行 runs down and 列 runs across. Its spreadsheets use 列 for row and 欄 for column. The mainland is the other way round. So the Simplified table's 行 would read as "column" here. The game's "row" is any line of cubes (across, down or back), so it is 列 everywhere, and the column the lessons point straight down is 直列.
- **Apple Taiwan's gesture words:** 點一下 (tap), 點兩下 (double-tap), 按住 (hold). With a mouse: 按一下, 按兩下 (double-click), 按右鍵 (right-click), 滾輪 (scroll).
- **牠 for animals.** Things and the hidden object are 它. Animals that English calls he or she stay 他 or 她 (the ram, the hen, the cat, the beaver, the stag).
- Quotation marks are 「」; the ellipsis is ……; 台 rather than the formal 臺 (台階, 天文台), as most Taiwanese text writes it.

## Glossary (one term per thing; docs/copy-study.md C1)

| English | zh-Hant | (zh-Hans, for comparison) |
|---|---|---|
| stone (the block, a level) | 石塊 (石 in compounds: 今日之石) | 石块 |
| cube | 方塊 | 方块 |
| object (what's found) | no noun: 它 / 藏著的東西 | same |
| chisel (tool / verb) | 鑿子 / 鑿掉 | 凿子 / 凿掉 |
| mark (tool / verb) | 標記 | 标记 |
| slip | 失誤 | 失误 |
| take back (a slip) | 收回 (as LINE's 收回訊息) | 撤回 |
| gem | 寶石 (集滿 N 顆) | 宝石 (攒到) |
| shrine | 神龕 | 神龛 |
| Finds | 圖鑑 | 图鉴 |
| lesson | 課 / 課程 (堂 as the counter) | 课 / 节 |
| circled number / squared number | 圓圈數字 / 方框數字 | same |
| piece (touching cubes in a row) | 段 | 段 |
| row (any direction) | 列 | 行 |
| column (straight down) | 直列 | 列 |
| across / down / back | 橫向 / 直向 / 往裡 | 横向 / 竖向 / 朝里 |
| world | 世界 | 世界 |
| Drift | 漂流 | 漂流 |
| Today, the Daily Stone | 今日 / 今日之石 | 今日 / 今日之石 |
| Daily #N | 每日 #N | 每日 #N |
| tap, double-tap, hold | 點一下, 點兩下, 按住 | 轻点, 轻点两下, 按住 |
| drag | 拖曳 | 拖动 |
| skip | 略過 | 跳过 |
| Menu / Settings | 選單 / 設定 | 菜单 / 设置 |
| Larger text | 較大字體 (Apple Taiwan's name) | 大字体 |
| Vibration | 震動 | 振动 |
| Retry | 重來 | 重试 |
| Home Screen | 主畫面 (iOS, Chrome); 主螢幕 (Samsung Internet) | 主屏幕 |
| app (Android) | 應用程式 | 应用 |
| restore purchase | 回復購買 | 恢复购买 |
| Privacy | 隱私權 | 隐私 |
| nonogram | 數織 | 数织 |

Names that differ from the Simplified table on purpose: 酪梨 (avocado), 無尾熊 (koala), 六角恐龍 (axolotl), 鱟 (horseshoe crab), 鬼蝠魟 (manta), 盆栽 (bonsai), 夾腳拖, 冰棒, 小山豬, 糖炒栗子攤, 山屋 (alpine hut), 冰原長毛象 (mammoth), 送子鳥 (stork), 唱盤, 攪拌機, 輸水道 (aqueduct), 口袋指南針, 孵蛋母雞, 洗手缽 (tsukubai; 蹲踞 is not known in Taiwan), 小屋 (Cottage), 環狀行星, 快煮壺 (the kettle in the kitten's box).

## Story lines

All 209 are rewritten in Taiwan's wording; the longest is 23 characters, under the 30-character budget (`test/i18n.test.js`, the same budget as zh-Hans: the same full-width characters in the same box). The alpaca's joke is recast, not carried over: 毯子牠揹著。對路線的意見，牠不揹。 The red grouse's "go back" call is a pun only in English; here it is a plain call, 「回去，回去。」

## Doubts: the first things to fix if players report them

1. **列 / 直列.** This is the most important choice and it is right for Taiwan. A Hong Kong player, whose school habit is closer to the mainland's 行 = row, may hesitate at 直列. If Hong Kong reports confusion, 直列 could become 縱列. Don't change 列: it's in every lesson.
2. **牠.** Standard in Taiwan, less so in Hong Kong, where 牠 still reads fine. It also splits a few lines between 它 and 牠 where English keeps "it" throughout. Check that the result reads naturally across a chapter (The Deep has the most).
3. **Lesson lines** (`hint.*`, `rules.plain`, `coach.first`, `touch.full`/`touch.fullDo`). 「維持『標記』」 and 選「標記」時 are the gesture-heavy ones.
4. **Names Taiwan may not know:** 小芥子, 赤牛 (akabeko), 戴籃小狗, 月影盆, 鬼蝠魟 (correct, but 魟魚 is commoner), 高山羊, 曆石, 乾砌石羊圈.
5. **漂流 for Drift** also means river rafting in Taiwan. It reads as "drifting" in context; 漫遊 would be the alternative.
6. **Hong Kong words that differ** (understood, not used): 屏幕 vs 螢幕, 雪條 vs 冰棒, 人字拖 vs 夾腳拖, 牛油果 vs 酪梨, 樹熊 vs 無尾熊, 馬蹄蟹 vs 鱟. A zh-HK table would be a word swap of about 20 keys, if Hong Kong numbers ever warrant it.
7. **Store keywords:** 繪圖邏輯 and 填圖 are a judgement of Taiwan search habits, not measured. Check App Store search data after a month.

## Layout, checked

`PORT=5371 node server.js`, then `node tools/a11y-shots.mjs zh-Hant --lang zh-Hant` and the same with `--large`: all 17 screens at 390×844 and 375×667, with Larger text off and on (68 shots). The measure found **no text off screen or clipped by its box** in either run. The shots are in `shots/a11y/zh-Hant` and `shots/a11y/zh-Hant-large` (`shots/` isn't committed).

By eye, one fix: with Larger text at 375×667, the Touch page's last row (`touch.menuDo`, 繼續、回地圖或重來) wrapped a single 來 onto a line below the fold. It is now 繼續、地圖或重來, which fits on one line (`shots/a11y/zh-Hant-large-touch/375x667-touch.png`). The fix is in the words, so no `:lang(zh-Hant)` CSS was needed. The other two-line wraps on that page (按住, 點兩下滿列, 滑動 ◆) wrap in English and Simplified Chinese too, as in docs/localisation.md.

The fonts come from the langs branch: `html:lang(zh-Hant)` puts PingFang TC / HK, Noto Sans CJK TC and Microsoft JhengHei after the Latin faces, and the CJK spacing and 11 / 13 px small-label floor apply through `:lang(zh)`.
