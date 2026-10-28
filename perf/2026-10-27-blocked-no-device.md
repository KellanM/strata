# 2026-10-27 — iPhone profiling run: blocked, no device

**Status: not measured.** This is a status note, not a baseline. No `strata.bench()` table, no
Instruments traces, no cold-start times. Nothing here should be read as a phone number.

Mac session, on Kellan's Mac Mini, against commit `f1e62ce` (`dist/` stamped `v0.3.296 · f1e62ce`).

## Why

No iOS device has ever been paired with this Mac:

- `xcrun xctrace list devices` lists only *Kellan's Mac Mini*;
- `xcrun devicectl list devices` → "No devices found";
- `~/Library/Developer/Xcode/iOS DeviceSupport/` does not exist;
- nothing on the USB bus;
- no iOS simulator runtimes installed (and a simulator is the wrong instrument for hitch work anyway).

So steps 2–4 of `docs/profiling.md` have nothing to run on. Desktop or simulator numbers were
deliberately **not** filed in their place: `docs/profiling.md` already treats desktop as "for shape
only", and a proxy under a device filename would corrupt this directory.

The desktop leads in `docs/profiling.md` (a ~117 ms frame in `intro`, ~100 ms in `reveal`, both
guessed to be shader compiles or first-use GPU uploads) are therefore **still unconfirmed**.

## What is verified ready, so the build side won't be what fails

Checked on this Mac today, with `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer`
(Xcode 27.1):

- `git pull`, `npm ci`, `npm run build:app` (incl. `cap sync` and `tools/ios-configure.mjs`): clean.
- `npm test`: 32/32 pass.
- **The iOS Debug build compiles for a real device.** `xcodebuild -project ios/App/App.xcodeproj
  -scheme App -configuration Debug -destination 'generic/platform=iOS'` → **BUILD SUCCEEDED**,
  0 warnings (signing skipped for the compile check only).
- **The bench harness ships in the app bundle:** `ios/App/App/public/js/perf.js` is present, and the
  built `main.js` exposes `bench: (o) => perf.bench(window.strata, o)` on `window.strata`.
- **Web Inspector will work on Debug:** `ios/debug.xcconfig` sets `CAPACITOR_DEBUG = true` and is the
  Debug `baseConfigurationReference`; Capacitor sets `webView.isInspectable` from it on iOS 16.4+.
- **Signing is ready:** a valid *Apple Development: Kellan Mythen* identity, `DEVELOPMENT_TEAM =
  4JS6BJKPQZ`, automatic signing. No cached provisioning profile yet, but
  `-allowProvisioningUpdates` will mint one once a device is attached.

Nothing was uploaded to App Store Connect. No game code was changed.

## To unblock

On the phone: connect it (USB or Wi-Fi pairing), unlock and trust this Mac, enable Developer Mode
(Settings › Privacy & Security), and Web Inspector (Settings › Safari › Advanced).

On the Mac, optional: `xcode-select` points at CommandLineTools rather than Xcode 27.1. Fixing it
permanently needs `sudo`, so it is Kellan's to run; `DEVELOPER_DIR` is a password-free workaround and
is not blocking.

## Open question for whoever runs this next

This Mac session cannot drive Safari's Web Inspector console or the Instruments GUI — it has no
desktop-control tools. With the phone attached there are two routes, and Kellan has not picked one:

1. A human runs `await strata.bench()` in Web Inspector and pastes the three tables; the Mac session
   takes the Instruments side via `xctrace record` from the CLI.
2. Fully headless: a one-line `?bench` auto-trigger that `console.log`s the table, captured off the
   device's unified log, then reverted and mentioned — the diagnostic exception in
   `docs/profiling.md`. Repeatable, and keeps Kellan out of the loop.

## Note for the PC session

`docs/profiling.md` says commit messages end with "the attribution lines in HANDOFF.md §8", but §8
has no attribution lines — it only covers commit style and the git rules. Worth adding them there, or
pointing the reference somewhere that has them.
