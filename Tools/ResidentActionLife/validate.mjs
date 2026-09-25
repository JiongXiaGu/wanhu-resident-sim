import assert from 'node:assert/strict';
import { recordRecentActions } from './record-policy.mjs';

const presentationById = new Map([
  ['resident-action.alpha', {
    id: 'resident-action.alpha',
    cooldownDays: 3,
    variants: [
      { text: '甲一', weight: 1 },
      { text: '甲二', weight: 2 },
    ],
  }],
  ['resident-action.beta', {
    id: 'resident-action.beta',
    cooldownDays: 0,
    variants: [
      { text: '乙一', weight: 1 },
      { text: '乙二', weight: 1 },
    ],
  }],
]);

const completedEvents = [
  { residentId: 9, actionId: 'resident-action.alpha', day: 1 },
  { residentId: 9, actionId: 'resident-action.alpha', day: 2 },
  { residentId: 9, actionId: 'resident-action.beta', day: 3 },
  { residentId: 9, actionId: 'resident-action.alpha', day: 3 },
  { residentId: 9, actionId: 'resident-action.alpha', day: 4, targetResidentId: 42, placeId: 'place.test.1' },
  { residentId: 9, actionId: 'resident-action.alpha', day: 5 },
  { residentId: 9, actionId: 'resident-action.no-presentation', day: 5 },
  { residentId: 9, actionId: 'resident-action.beta', day: 6 },
];

const input = {
  residentId: 9,
  residentSeed: 123456,
  completedEvents,
  presentationById,
  capacity: 3,
};

const first = recordRecentActions(input);
const second = recordRecentActions(input);
assert.deepEqual(first, second, 'RecordPolicy must be deterministic for the same resident seed and completed events.');
assert.deepEqual(first.map((record) => [record.actionId, record.day]), [
  ['resident-action.beta', 6],
  ['resident-action.alpha', 4],
  ['resident-action.beta', 3],
], 'Cooldown, adjacent duplicate removal and capacity should be applied in that order.');

const alpha = first.find((record) => record.actionId === 'resident-action.alpha');
assert.equal(alpha?.targetResidentId, 42, 'targetResidentId must pass through from the completed event.');
assert.equal(alpha?.placeId, 'place.test.1', 'placeId must pass through from the completed event.');
for (const record of first) {
  assert.ok(Number.isInteger(record.variantIndex) && record.variantIndex >= 0, 'Variant index must be compact and valid.');
  assert.equal('text' in record, false, 'RecentAction must not store display text.');
  assert.equal('title' in record, false, 'RecentAction must not store display titles.');
}
assert.deepEqual(recordRecentActions({ ...input, capacity: 0 }), [], 'Zero capacity should produce an empty recent-action buffer.');
assert.throws(
  () => recordRecentActions({
    ...input,
    completedEvents: [{ residentId: 10, actionId: 'resident-action.alpha', day: 1 }],
  }),
  /does not match/,
  'Recorder must reject events belonging to another resident.',
);

console.log('ResidentActionLife RecordPolicy validated: deterministic variants, cooldown, adjacent dedupe, capacity and context pass-through.');
