function hash32(value) {
  const text = String(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function validateCompletedEvent(event, residentId) {
  if (!event || typeof event !== 'object') throw new Error('ResidentActionCompletedEvent must be an object.');
  if (!Number.isInteger(event.residentId) || event.residentId !== residentId) {
    throw new Error(`ResidentActionCompletedEvent residentId ${event.residentId} does not match ${residentId}.`);
  }
  if (typeof event.actionId !== 'string' || !event.actionId.startsWith('resident-action.')) {
    throw new Error(`ResidentActionCompletedEvent has invalid actionId ${event.actionId}.`);
  }
  if (!Number.isInteger(event.day)) throw new Error(`${event.actionId}: completed day must be an integer.`);
  if (event.targetResidentId !== undefined && (!Number.isInteger(event.targetResidentId) || event.targetResidentId <= 0)) {
    throw new Error(`${event.actionId}: targetResidentId must be a positive integer when present.`);
  }
  if (event.placeId !== undefined && (typeof event.placeId !== 'string' || !event.placeId.trim())) {
    throw new Error(`${event.actionId}: placeId must be a non-empty string when present.`);
  }
}

export function variantIndexForCompletedAction(residentSeed, event, presentation) {
  const total = presentation.variants.reduce((sum, variant) => sum + Math.max(0, Number(variant.weight ?? 1)), 0);
  if (total <= 0) return 0;
  let cursor = (hash32(`${residentSeed}:action-variant:${event.actionId}:${event.day}`) / 4294967296) * total;
  for (let index = 0; index < presentation.variants.length; index += 1) {
    cursor -= Math.max(0, Number(presentation.variants[index].weight ?? 1));
    if (cursor <= 0) return index;
  }
  return presentation.variants.length - 1;
}

export function recordRecentActions({
  residentId,
  residentSeed,
  completedEvents,
  presentationById,
  capacity,
}) {
  if (!Number.isInteger(residentId) || residentId <= 0) throw new Error('residentId must be a positive integer.');
  if (!Number.isFinite(residentSeed)) throw new Error('residentSeed must be finite.');
  if (!Array.isArray(completedEvents)) throw new Error('completedEvents must be an array.');
  if (!(presentationById instanceof Map)) throw new Error('presentationById must be a Map.');
  if (!Number.isInteger(capacity) || capacity < 0) throw new Error('capacity must be an integer >= 0.');

  const chronological = completedEvents
    .map((event, index) => ({ event, index }))
    .sort((left, right) => left.event.day - right.event.day || left.index - right.index);

  const accepted = [];
  const lastDayByAction = new Map();

  for (const { event } of chronological) {
    validateCompletedEvent(event, residentId);
    const presentation = presentationById.get(event.actionId);
    if (!presentation) continue;
    if (!Array.isArray(presentation.variants) || presentation.variants.length === 0) {
      throw new Error(`${event.actionId}: Action Presentation must contain variants.`);
    }

    if (accepted.at(-1)?.actionId === event.actionId) continue;

    const previousDay = lastDayByAction.get(event.actionId);
    if (previousDay !== undefined && event.day - previousDay < presentation.cooldownDays) continue;

    accepted.push({
      id: `${residentId}:${event.actionId}:${event.day}`,
      day: event.day,
      actionId: event.actionId,
      variantIndex: variantIndexForCompletedAction(residentSeed, event, presentation),
      ...(event.targetResidentId !== undefined ? { targetResidentId: event.targetResidentId } : {}),
      ...(event.placeId !== undefined ? { placeId: event.placeId } : {}),
    });
    lastDayByAction.set(event.actionId, event.day);
  }

  return accepted
    .sort((left, right) => right.day - left.day)
    .slice(0, capacity);
}
