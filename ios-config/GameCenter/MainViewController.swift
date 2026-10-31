// Registers the app's own plugin (StrataGameCenterPlugin.swift) with the
// Capacitor bridge. Main.storyboard's view controller must use this class
// (Custom Class: MainViewController, Module: App) in place of
// CAPBridgeViewController. docs/game-center-handoff.md.

import UIKit
import Capacitor

class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(StrataGameCenterPlugin())
    }
}
