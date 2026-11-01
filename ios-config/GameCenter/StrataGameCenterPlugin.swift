// StrataGameCenter: the small local Capacitor plugin the Daily Stone's Game
// Center calls go to (public/js/native.js: signInGameCenter, submitDaily,
// challengeFriends, onDailyActivity). Not yet in the Xcode project: the Mac
// build adds it by docs/game-center-handoff.md. Until then the game sees no
// plugin and every call is a quiet no-op.
//
// JS name "StrataGameCenter". Methods:
//   authenticate()                              -> { authenticated: Bool }
//   submitScore({ leaderboardID, score, context }) -> {}
//   presentChallenge({ challengeID })           -> {}   (iOS 26: Apple's Challenge sheet; earlier: the leaderboard)
// Event "activity" { activityID }: a Challenge or the Games app asks to play.

import Foundation
import Capacitor
import GameKit

@objc(StrataGameCenterPlugin)
public class StrataGameCenterPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "StrataGameCenterPlugin"
    public let jsName = "StrataGameCenter"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "authenticate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "submitScore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "presentChallenge", returnType: CAPPluginReturnPromise),
    ]

    private var waiting: [CAPPluginCall] = []
    private var handlerSet = false
    private var activityListener: AnyObject?

    // Game Center's own sign-in: its sheet if needed, else a "Welcome back" banner.
    // Called once by the game, after the lessons.
    @objc func authenticate(_ call: CAPPluginCall) {
        let local = GKLocalPlayer.local
        if local.isAuthenticated { call.resolve(["authenticated": true]); return }
        waiting.append(call)
        if handlerSet { return }
        handlerSet = true
        local.authenticateHandler = { [weak self] viewController, error in
            guard let self = self else { return }
            if let vc = viewController {
                DispatchQueue.main.async { self.bridge?.viewController?.present(vc, animated: true) }
                return   // the handler runs again once the sheet is done
            }
            let ok = error == nil && local.isAuthenticated
            if ok { self.listenForActivities() }
            let calls = self.waiting
            self.waiting = []
            for c in calls { c.resolve(["authenticated": ok]) }
        }
    }

    // The day's first solve: one score to the daily (recurring) leaderboard.
    // Challenges on that leaderboard take the same score (Apple: "the system
    // automatically submits the same scores submitted for that leaderboard").
    @objc func submitScore(_ call: CAPPluginCall) {
        guard let id = call.getString("leaderboardID"), let score = call.getInt("score") else {
            call.reject("leaderboardID and score are required"); return
        }
        let context = call.getInt("context") ?? 0
        guard GKLocalPlayer.local.isAuthenticated else { call.reject("not signed in to Game Center"); return }
        GKLeaderboard.submitScore(score, context: context, player: GKLocalPlayer.local, leaderboardIDs: [id]) { error in
            if let error = error { call.reject(error.localizedDescription) } else { call.resolve() }
        }
    }

    // Challenge friends on today's stone: iOS 26's Challenge sheet for our
    // challenge definition; before iOS 26, the daily leaderboard instead.
    @objc func presentChallenge(_ call: CAPPluginCall) {
        guard let challengeID = call.getString("challengeID") else { call.reject("challengeID is required"); return }
        DispatchQueue.main.async {
            if #available(iOS 26.0, *) {
                GKAccessPoint.shared.trigger(challengeDefinitionID: challengeID) { call.resolve() }
            } else {
                let vc = GKGameCenterViewController(leaderboardID: "strata.daily.score", playerScope: .friendsOnly, timeScope: .today)
                vc.gameCenterDelegate = self
                self.bridge?.viewController?.present(vc, animated: true)
                call.resolve()
            }
        }
    }

    // A Challenge notification (or the Games app) opens the game at the day's
    // stone: the activity strata.daily.activity is passed on to the page.
    private func listenForActivities() {
        if #available(iOS 26.0, *) {
            guard activityListener == nil else { return }
            let listener = ActivityListener { [weak self] id in
                self?.notifyListeners("activity", data: ["activityID": id], retainUntilConsumed: true)
            }
            activityListener = listener
            GKLocalPlayer.local.register(listener)
        }
    }
}

extension StrataGameCenterPlugin: GKGameCenterControllerDelegate {
    public func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
        gameCenterViewController.dismiss(animated: true)
    }
}

@available(iOS 26.0, *)
private final class ActivityListener: NSObject, GKGameActivityListener {
    let onActivity: (String) -> Void
    init(_ onActivity: @escaping (String) -> Void) { self.onActivity = onActivity }
    func player(_ player: GKPlayer, wantsToPlay activity: GKGameActivity, completionHandler: @escaping (Bool) -> Void) {
        onActivity(activity.activityDefinition.identifier)
        completionHandler(true)
    }
}
