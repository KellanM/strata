// The v3 ad with opening b (timeline-v3ad.mjs, OPENINGS): only the first 2.3 s differ.
import { buildTimeline as ad, prerollFor } from './timeline-v3ad.mjs';
export * from './timeline-v3ad.mjs';
export const buildTimeline = () => ad('b');
export const PREROLL = prerollFor('b');
