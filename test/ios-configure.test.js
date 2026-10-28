// tools/ios-configure.mjs against Capacitor's own iOS template (the project the
// Mac generates with `npx cap add ios`): every setting lands, and a second run
// changes nothing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { x } from 'tar';
import plist from 'plist';
import { configure } from '../tools/ios-configure.mjs';

test('ios-configure: iPhone-only, encryption answered, privacy manifest in the app, idempotent', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'strata-ios-'));
  try {
    await x({ file: 'node_modules/@capacitor/cli/assets/ios-spm-template.tar.gz', cwd: dir });
    const release = { version: '1.0', build: 2, devices: 'iphone' };
    assert.ok(configure(dir, release).length > 0);

    const info = plist.parse(readFileSync(join(dir, 'App/App/Info.plist'), 'utf8'));
    assert.equal(info.ITSAppUsesNonExemptEncryption, false);
    assert.equal(info.CFBundleDisplayName, 'Strata');
    assert.deepEqual(info.UISupportedInterfaceOrientations, ['UIInterfaceOrientationPortrait']);
    assert.equal(info['UISupportedInterfaceOrientations~ipad'], undefined);
    assert.equal(info.UIStatusBarHidden, true);
    assert.equal(info.UIViewControllerBasedStatusBarAppearance, false);

    const pbx = readFileSync(join(dir, 'App/App.xcodeproj/project.pbxproj'), 'utf8');
    assert.doesNotMatch(pbx, /TARGETED_DEVICE_FAMILY = "1,2"/);
    assert.equal(pbx.match(/TARGETED_DEVICE_FAMILY = 1;/g).length, 2);   // Debug and Release
    assert.equal(pbx.match(/MARKETING_VERSION = 1\.0;/g).length, 2);
    assert.equal(pbx.match(/CURRENT_PROJECT_VERSION = 2;/g).length, 2);
    // the manifest: a file reference, in the App group, built into the app's Resources
    assert.match(pbx, /PrivacyInfo\.xcprivacy \*\/ = \{isa = PBXFileReference/);
    assert.match(pbx, /isa = PBXResourcesBuildPhase;\s*buildActionMask = \d+;\s*files = \(\s*\w+ \/\* PrivacyInfo\.xcprivacy in Resources \*\//);
    assert.match(pbx, /\/\* App \*\/ = \{\s*isa = PBXGroup;\s*children = \(\s*\w+ \/\* PrivacyInfo\.xcprivacy \*\//);
    const manifest = plist.parse(readFileSync(join(dir, 'App/App/PrivacyInfo.xcprivacy'), 'utf8'));
    assert.equal(manifest.NSPrivacyTracking, false);
    assert.deepEqual(manifest.NSPrivacyAccessedAPITypes[0].NSPrivacyAccessedAPITypeReasons, ['CA92.1']);

    assert.deepEqual(configure(dir, release), []);   // a second run: nothing to do
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
