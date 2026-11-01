# Korean (ko): the glossary, the register, and the doubts to fix first (2026-10-31)

**Live (Kellan, 2026-10-31):** `public/i18n/ko.js` is marked reviewed and `ko` is in `LANGS_LIVE` and in the iOS app's `CFBundleLocalizations`, without a native speaker's review. The system is in `docs/localisation.md`. This page is what the Korean drafter decided, and what to fix first if players report it.

## Register

- **The interface speaks in the polite 해요체** (…해요, …하세요, …할까요?): buttons, Rules, Touch, lessons, coach cards, offers, the store page. It is what calm Korean mobile games use. It is polite without the stiffness of 합니다체, and it suits a game that never raises its voice.
- **Labels are nouns or bare verb stems**, as Korean apps write them: 계속, 다시 하기, 광고 보기, 큐브 깎기.
- **Story lines, chapter lines and blurbs are plain written Korean** (한다체, or a noun ending: …기다린다, …하나, …중). They are captions, not speech to the player, the same choice the Japanese drafter made with plain endings. Where the English says "you", the story lines say 당신 (the watchtower, the torchbearer fox, the chameleon, the beacon hills). That is the literary "you", which reads as warm in a caption. It is never used in the interface, which has no pronoun for the player.
- **No exclamation marks and no praise**, as in English.

## Glossary (one term per thing; docs/copy-study.md C1)

| English | Korean | Notes |
|---|---|---|
| stone (the block, a level) | 돌 | 오늘의 돌 for the Daily Stone. Never used for a cube. |
| cube | 큐브 | |
| object (what's found) | 모양 | "Shape", as the Japanese かたち. 모양의 큐브 = the object's cubes. |
| chisel: the tool / the verb | 끌 / 깎다 (끌로 깎아 내다) | The gesture is 탭. |
| mark: the tool / the verb | 표시 / 표시하다 | The gesture is 길게 누르기. "Safe from the chisel" = 끌로부터 안전해요. |
| slip | 실수 | Also the HUD's "mistakes" and the ✕. |
| gem | 보석 | |
| shrine | 사당 | A small shrine; 신전 would be a temple. |
| Finds | 도감 | The usual Korean word for a game's collection book. |
| lesson / Learn | 레슨 / 배우기 | |
| circled number (two pieces) | 동그라미 숫자 (동그라미 2) | In lesson 6's own line, just 동그라미. |
| squared number (three or more pieces) | 네모 숫자 | 네모 is also the 네모 of 네모로직; that is a happy accident, not a clash. |
| piece (touching cubes in a row) | 덩어리 | |
| gap | 틈 | |
| row / column | 줄 / 세로줄 | 줄 for every direction, as English "row"; 세로줄 where English says "column". Directions: 가로, 세로, 안쪽. |
| world (chapter) | 세계 | |
| Drift | 표류 | See doubt 1. |
| Today, Daily #N | 오늘, 데일리 #N | The share line's first line stays "Strata · Daily #N". |
| tap, double-tap, hold | 탭, 두 번 탭, 길게 누르기 | Mouse: 클릭, 더블클릭, 우클릭. |
| Larger text | 큰 글씨 | |

**Particles.** Korean particles change with the word before them (을/를, 이/가, 은/는). The table never puts one straight after a `{placeholder}` or an icon (`{g1} 버튼을`, `보석 {n}개에`), and `test/i18n.test.js` checks it. After a digit the particle follows the Sino-Korean reading: 0을, 1인, 2예요, 3이고, 4를, 5예요.

## Story lines

- 209 lines, all in plain Korean, at most 36 characters counted with spaces (the longest is 34; the average is 26, against Japanese's 23 without spaces). The budget's reasoning is in `test/i18n.test.js`.
- The jokes are kept where Korean can carry them: the alpaca's opinions, the broody hen's polite refusal (정중히 거절했다), the kettle that never stood a chance, the coelacanth (본인만 모른다, "only it doesn't know"), the baby shark's "yet" (아직은).
- The red grouse's "go back, go back" is a pun on its call only in English. Korean keeps the line ("돌아가, 돌아가" 운다) without the pun, as the Chinese did.
- 달토끼 (the moon rabbit) is a Korean legend too, so that line lands better than in English.

## Open doubts: the first things to fix if players report them

1. **표류 for Drift.** Like 漂流 in Japanese and Chinese, it means being cast adrift at sea. It may read as a shipwreck rather than an endless, gentle mode. Alternatives: 무한 (endless), 떠돌이 돌, 자유 모드. It appears in 5 keys (`hud.drift`, `map.drift`, `map.driftMeta`, `map.driftAria`, `win.drift`).
2. **모양 for the object.** It's clear in the lessons ("모양의 큐브"), but it's an abstract word in the result's "찾아낸 것" and the Rules lead. 그림 (picture) is the word 네모로직 players know, but copy-study C1 retired "picture". Watch whether lesson 1 reads at once.
3. **The lessons**, especially `hint.lesson-keep.0.text` and `.1.text` (the longest, 52 and 53 characters), `touch.full` ("다 남는 줄", for a row whose number fills it) and `rules.plain`.
4. **Names that may not be known:** 대왕구소베기 (giant isopod, known from aquarium memes), 초롱아귀 (anglerfish; 아귀 alone is a dinner), 쓰쿠바이, 미코시, 고이노보리, 아카베코 and 갓파 (Japanese words kept in transliteration, as the Japanese table keeps them), 정동석 (geode), 환상 열석 (stone circle), 열수 굴뚝 (black smoker), 수상 가옥 (stilt house).
5. **초롱 for chochin.** 초롱 is a Korean lantern (청사초롱), which makes the Japanese festival object read as Korean. 제등 or 일본 등롱 would be more exact and less familiar.
6. **The store page** (`store/listing-ko.md`): the subtitle carries 네모로직 and the keywords 노노그램 and 네모네모. Check them against App Store search in Korea once live.
7. **당신 in the story lines.** It's literary and warm, but some players read it as distant. If it jars, drop the pronoun (Korean doesn't need one) rather than use 너.

## Layout, checked

`tools/a11y-shots.mjs ko --lang ko` and `ko-large --lang ko --large` shot all 17 screens at 390×844 and 375×667: title, lesson card and pause, map, Settings, Rules, Touch, Finds and a find, the lessons list, the chapter card, the level's tip, reminder and pause, the result, and the shrine card. Its measure found no text off screen or clipped, in either run. The shots are in `shots/a11y/ko` and `shots/a11y/ko-large` (`shots/` isn't committed).

What the shots showed, and what was done:

- **Words split mid-word.** Browsers break Hangul between any two syllables. `html:lang(ko) body { word-break: keep-all; overflow-wrap: break-word; }` (the Korean block at the end of `style.css`) wraps at the spaces, as Korean is printed, and still breaks a word too long for its box.
- **A last word left alone.** With keep-all, a story line could end with one short word on line two ("…열지 않은 / 문."). `text-wrap: balance` on the story lines, the chapter card's line and the coach card evens the lines out. The steps line was also shortened (아직 dropped).
- **Touch page.** "다 남는 줄을 두 번 / 탭" left 탭 alone in the gesture column with Larger text. It's now 다 남는 줄 두 번 탭 (and 더블클릭), which fits on one line.

Nothing else needed a change: the Rules page, the lesson and reminder cards, the result and Finds all fit in two or three lines with Larger text at 375 px.

The type comes from the shared CJK rules (`:lang(ko)` with Japanese and Chinese: .04em tracking, the 11 px / 13 px floor) and the Korean font stack (Apple SD Gothic Neo on iOS, Noto Sans CJK KR on Android, Malgun Gothic on Windows). The shots were taken on Windows, so in Malgun Gothic. Apple SD Gothic Neo is a little narrower, so iPhones have more room, not less.
