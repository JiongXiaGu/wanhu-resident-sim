import type { Gender, LifeStageId } from '../domain/resident';

type Props = {
  seed: number;
  gender: Gender;
  lifeStage: LifeStageId;
  occupationId: string;
};

export function ResidentAvatar({ seed, gender, lifeStage, occupationId }: Props) {
  const faceVariant = seed % 5;
  const hairVariant = Math.floor(seed / 7) % 6;
  const clothVariant = Math.floor(seed / 43) % 4;
  const occupationClass = occupationId.replace(/[^a-z0-9-]/gi, '-');

  return (
    <div
      className={`generated-portrait gender-${gender} age-${lifeStage} face-${faceVariant} hair-${hairVariant} cloth-${clothVariant} occupation-${occupationClass}`}
      aria-hidden="true"
    >
      <span className="generated-portrait__body" />
      <span className="generated-portrait__neck" />
      <span className="generated-portrait__face" />
      <span className="generated-portrait__hair" />
      <span className="generated-portrait__detail" />
    </div>
  );
}
