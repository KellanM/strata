// Sets up the generated iOS project (ios/, made on the Mac by `npx cap add ios`)
// the way the App Store submission needs it, so no setting depends on someone
// remembering it (docs/compliance-study.md, hit list 1). Safe to run again: a
// second run changes nothing. `npm run build:app` runs it after `cap sync ios`.
//
//   node tools/ios-configure.mjs [iosDir = ios]
//
// Info.plist (ios/App/App/Info.plist):
//   ITSAppUsesNonExemptEncryption = NO   only the system's own encryption, so the
//                                        export question isn't asked per build
//   CFBundleDisplayName = Strata         the Home Screen label (the store name is
//                                        "Strata: Stone Puzzles")
//   portrait only; the status bar hidden (the plist way needs both keys)
//   no iPad orientations: the app is iPhone-only (store/release.json "devices")
// project.pbxproj:
//   TARGETED_DEVICE_FAMILY = 1 (iPhone; "1,2" would need 13" iPad screenshots)
//   MARKETING_VERSION / CURRENT_PROJECT_VERSION from store/release.json
//   ios-config/PrivacyInfo.xcprivacy copied in and added to the app's resources
//   (the template lists its files one by one, so copying alone isn't enough)
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import plist from 'plist';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function configure(iosDir, release = JSON.parse(readFileSync(join(root, 'store/release.json'), 'utf8'))) {
  const app = join(iosDir, 'App', 'App');
  const changed = [];

  // ---- Info.plist
  const infoPath = join(app, 'Info.plist');
  const before = readFileSync(infoPath, 'utf8');
  const info = plist.parse(before);
  const want = {
    ITSAppUsesNonExemptEncryption: false,
    CFBundleDisplayName: 'Strata',
    UISupportedInterfaceOrientations: ['UIInterfaceOrientationPortrait'],
    UIStatusBarHidden: true,
    UIViewControllerBasedStatusBarAppearance: false,
  };
  for (const [k, v] of Object.entries(want)) {
    if (JSON.stringify(info[k]) !== JSON.stringify(v)) { info[k] = v; changed.push(`Info.plist ${k}`); }
  }
  if (release.devices === 'iphone' && 'UISupportedInterfaceOrientations~ipad' in info) {
    delete info['UISupportedInterfaceOrientations~ipad'];
    changed.push('Info.plist UISupportedInterfaceOrientations~ipad removed');
  }
  if (changed.length) writeFileSync(infoPath, plist.build(info));

  // ---- the privacy manifest, on disk
  const manifest = readFileSync(join(root, 'ios-config', 'PrivacyInfo.xcprivacy'), 'utf8');
  const manifestPath = join(app, 'PrivacyInfo.xcprivacy');
  if (!existsSync(manifestPath) || readFileSync(manifestPath, 'utf8') !== manifest) {
    copyFileSync(join(root, 'ios-config', 'PrivacyInfo.xcprivacy'), manifestPath);
    changed.push('PrivacyInfo.xcprivacy copied');
  }

  // ---- project.pbxproj (plain text edits, anchored on its section markers)
  const pbxPath = join(iosDir, 'App', 'App.xcodeproj', 'project.pbxproj');
  let pbx = readFileSync(pbxPath, 'utf8');
  const was = pbx;
  const family = release.devices === 'iphone' ? '1' : '"1,2"';
  pbx = pbx.replace(/TARGETED_DEVICE_FAMILY = [^;]+;/g, `TARGETED_DEVICE_FAMILY = ${family};`);
  pbx = pbx.replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${release.version};`);
  pbx = pbx.replace(/CURRENT_PROJECT_VERSION = [^;]+;/g, `CURRENT_PROJECT_VERSION = ${release.build};`);
  if (!pbx.includes('PrivacyInfo.xcprivacy')) {
    const FILE = 'F00DCAFE5A7A000000000001', BUILD = 'F00DCAFE5A7A000000000002';
    const at = (marker, line) => {
      if (!pbx.includes(marker)) throw new Error(`project.pbxproj: no "${marker}" (has the Capacitor template changed?)`);
      pbx = pbx.replace(marker, `${line}\n${marker}`);
    };
    at('/* End PBXBuildFile section */', `\t\t${BUILD} /* PrivacyInfo.xcprivacy in Resources */ = {isa = PBXBuildFile; fileRef = ${FILE} /* PrivacyInfo.xcprivacy */; };`);
    at('/* End PBXFileReference section */', `\t\t${FILE} /* PrivacyInfo.xcprivacy */ = {isa = PBXFileReference; lastKnownFileType = text.xml; path = PrivacyInfo.xcprivacy; sourceTree = "<group>"; };`);
    // the App group's children, and the App target's Resources phase
    const group = /(\/\* App \*\/ = \{\s*isa = PBXGroup;\s*children = \()/;
    const phase = /(\/\* Resources \*\/ = \{\s*isa = PBXResourcesBuildPhase;\s*buildActionMask = \d+;\s*files = \()/;
    if (!group.test(pbx) || !phase.test(pbx)) throw new Error('project.pbxproj: the App group or Resources phase is not where expected');
    pbx = pbx.replace(group, `$1\n\t\t\t\t${FILE} /* PrivacyInfo.xcprivacy */,`);
    pbx = pbx.replace(phase, `$1\n\t\t\t\t${BUILD} /* PrivacyInfo.xcprivacy in Resources */,`);
  }
  if (pbx !== was) { writeFileSync(pbxPath, pbx); changed.push('project.pbxproj'); }
  return changed;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('ios-configure.mjs')) {
  const dir = process.argv[2] ?? join(root, 'ios');
  if (!existsSync(join(dir, 'App', 'App', 'Info.plist'))) {
    console.error(`no iOS project at ${dir} - run \`npx cap add ios\` first (on the Mac)`);
    process.exit(1);
  }
  const changed = configure(dir);
  console.log(changed.length ? `ios-configure: ${changed.join(', ')}` : 'ios-configure: already set up, nothing changed');
}
