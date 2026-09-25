import type {
  ActionPresentationDefinition,
  ResidentCurrentAction,
  ResidentDefinitions,
  ResidentRecentActionRecord,
  ResidentRecord,
} from '../domain/resident';

export type RecentActionViewEntry = {
  id: string;
  day: number;
  actionId: string;
  variantIndex: number;
  text: string;
  targetResidentId?: number;
  placeId?: string;
};

export function actionPresentationFor(definitions: ResidentDefinitions, actionId: string): ActionPresentationDefinition | undefined {
  return definitions.actionPresentations.find((item) => item.id === actionId);
}

export function currentActionText(currentAction: ResidentCurrentAction, definitions: ResidentDefinitions) {
  return actionPresentationFor(definitions, currentAction.actionId)?.currentText ?? '正在忙眼前的事情';
}

function recentActionEntry(record: ResidentRecentActionRecord, definitions: ResidentDefinitions): RecentActionViewEntry | undefined {
  const presentation = actionPresentationFor(definitions, record.actionId);
  const variant = presentation?.variants[record.variantIndex];
  if (!presentation || !variant) return undefined;
  return {
    id: record.id,
    day: record.day,
    actionId: record.actionId,
    variantIndex: record.variantIndex,
    text: variant.text,
    ...(record.targetResidentId !== undefined ? { targetResidentId: record.targetResidentId } : {}),
    ...(record.placeId !== undefined ? { placeId: record.placeId } : {}),
  };
}

export function recentActionEntries(resident: ResidentRecord, definitions: ResidentDefinitions, gameDay: number) {
  return resident.recentActions
    .filter((record) => record.day <= gameDay)
    .map((record) => recentActionEntry(record, definitions))
    .filter((entry): entry is RecentActionViewEntry => Boolean(entry))
    .sort((left, right) => right.day - left.day);
}
