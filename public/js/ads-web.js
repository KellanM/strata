// The web prototype's ad provider (ads.js describes the interface): a full-screen
// placeholder, clearly labelled, with a countdown; and a simulated purchase.
// Each is built when it opens and removed whole when it closes. A Capacitor
// build replaces this file's role with AppLovin MAX and the store's billing.

const RING = 2 * Math.PI * 15;

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// kind: 'interstitial' | 'rewarded'. Resolves true when it runs its course,
// false when a rewarded ad is closed early.
function placeholder(kind, placement) {
  const AD_SEC = webProvider.adSec;   // ads.js sets it from CONFIG.web.adSec
  return new Promise((resolve) => {
    const rewarded = kind === 'rewarded';
    const ad = el(`
      <div class="sim-ad" role="dialog" aria-modal="true" aria-label="Simulated ad" data-placement="${placement}">
        <span class="sim-timer" aria-live="off"><svg viewBox="0 0 34 34"><circle cx="17" cy="17" r="15"/></svg><b>${AD_SEC}</b></span>
        <button class="sim-close" aria-label="Close the ad" hidden><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
        <span class="sim-label">simulated ad</span>
        <div class="sim-slot">ad creative</div>
        <p class="sim-what">${rewarded
          ? 'In the store build an AppLovin MAX rewarded video plays here. Watch to the end for the gift.'
          : `In the store build an AppLovin MAX interstitial plays here. It can be closed after ${AD_SEC} s.`}</p>
        ${rewarded ? '<button class="sim-early">close early · no gift</button>' : ''}
      </div>`);
    document.body.appendChild(ad);
    const ring = ad.querySelector('circle');
    ring.style.strokeDasharray = RING;
    const num = ad.querySelector('.sim-timer b');
    const t0 = performance.now();
    let raf = 0, done = false;
    const finish = (earned) => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      ad.classList.add('leaving');
      setTimeout(() => { ad.remove(); resolve(earned); }, 260);
    };
    const tick = () => {
      const left = Math.max(0, AD_SEC - (performance.now() - t0) / 1000);
      num.textContent = Math.ceil(left);
      ring.style.strokeDashoffset = (RING * (1 - left / AD_SEC)).toFixed(2);
      if (left > 0) { raf = requestAnimationFrame(tick); return; }
      ad.querySelector('.sim-timer').hidden = true;
      ad.querySelector('.sim-early')?.remove();
      if (rewarded) ad.querySelector('.sim-what').textContent = 'Gift earned. Close to return.';
      const close = ad.querySelector('.sim-close');
      close.hidden = false;
      close.addEventListener('click', () => finish(true), { once: true });
    };
    ad.querySelector('.sim-early')?.addEventListener('click', () => finish(false), { once: true });
    requestAnimationFrame(() => ad.classList.add('in'));
    raf = requestAnimationFrame(tick);
  });
}

// the store's purchase sheet, simulated: a card that says so
function confirmPurchase(price) {
  return new Promise((resolve) => {
    const card = el(`
      <div class="sim-buy" role="dialog" aria-modal="true" aria-label="Simulated purchase">
        <div class="offer-card">
          <span class="sim-label">simulated purchase</span>
          <p>Remove ads · ${price}</p>
          <p class="small">in the store build, the App Store or Google Play asks here</p>
          <div class="row"><button data-no>Cancel</button><button class="primary" data-yes>Buy</button></div>
        </div>
      </div>`);
    document.body.appendChild(card);
    requestAnimationFrame(() => card.classList.add('in'));
    const finish = (ok) => { card.classList.remove('in'); setTimeout(() => { card.remove(); resolve(ok); }, 260); };
    card.querySelector('[data-no]').addEventListener('click', () => finish(false), { once: true });
    card.querySelector('[data-yes]').addEventListener('click', () => finish(true), { once: true });
  });
}

export const webProvider = {
  name: 'web',
  ready: () => true,
  interstitial: (placement) => placeholder('interstitial', placement).then(() => {}),
  rewarded: (placement) => placeholder('rewarded', placement),
  adSec: 5,
  purchase: (sku, price) => confirmPurchase(price),
  // the web has no store to ask: the flag kept on this device is the purchase
  restore: async () => globalThis.localStorage?.getItem('strata.ads.removed') === '1',
};
