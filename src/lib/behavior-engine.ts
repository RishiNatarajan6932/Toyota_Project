import {
  BehavioralProfile,
  DrivingStyle,
  MaintenanceApproach,
  MatchResult,
  QuizQuestion,
  QuizResponses,
  SensoryPreference,
  TechComfort,
} from "@/types/behavior";

interface CategoryScores {
  driving: Record<DrivingStyle, number>;
  sensory: Record<SensoryPreference, number>;
  tech: Record<TechComfort, number>;
  maintenance: Record<MaintenanceApproach, number>;
}

const createEmptyScores = (): CategoryScores => ({
  driving: { cautious: 0, balanced: 0, spirited: 0 },
  sensory: { quiet: 0, balanced: 0, sporty: 0 },
  tech: { minimal: 0, connected: 0, cuttingEdge: 0 },
  maintenance: { handsOff: 0, balanced: 0, enthusiast: 0 },
});

export type QuizSelections = Record<string, string>;

export const deriveQuizResponses = (
  questions: QuizQuestion[],
  selections: QuizSelections
): QuizResponses => {
  const scores = createEmptyScores();

  questions.forEach((question) => {
    const picked = selections[question.id];
    if (!picked) return;

    const option = question.options.find((opt) => opt.value === picked);
    if (!option) return;

    const { weights } = option;

    if (weights.drivingStyle) {
      Object.entries(weights.drivingStyle).forEach(([style, value]) => {
        scores.driving[style as DrivingStyle] += value ?? 0;
      });
    }
    if (weights.sensory) {
      Object.entries(weights.sensory).forEach(([pref, value]) => {
        scores.sensory[pref as SensoryPreference] += value ?? 0;
      });
    }
    if (weights.tech) {
      Object.entries(weights.tech).forEach(([pref, value]) => {
        scores.tech[pref as TechComfort] += value ?? 0;
      });
    }
    if (weights.maintenance) {
      Object.entries(weights.maintenance).forEach(([pref, value]) => {
        scores.maintenance[pref as MaintenanceApproach] += value ?? 0;
      });
    }
  });

  const selectTop = <T extends string>(record: Record<T, number>, fallback: T): T => {
    const entries = Object.entries(record) as [T, number][];
    const top = entries.reduce((best, current) => (current[1] > best[1] ? current : best), [fallback, -Infinity] as [T, number]);
    return top[1] === -Infinity ? fallback : top[0];
  };

  return {
    driving: selectTop(scores.driving, "balanced"),
    sensory: selectTop(scores.sensory, "balanced"),
    tech: selectTop(scores.tech, "connected"),
    maintenance: selectTop(scores.maintenance, "balanced"),
  };
};

interface AttributeWeights {
  powerScore: number;
  safetyScore: number;
  efficiencyScore: number;
  comfortScore: number;
  techScore: number;
  quietnessScore: number;
  maintenanceEaseScore: number;
}

const drivingWeights: Record<DrivingStyle, AttributeWeights> = {
  cautious: {
    powerScore: 0.1,
    safetyScore: 0.25,
    efficiencyScore: 0.2,
    comfortScore: 0.15,
    techScore: 0.1,
    quietnessScore: 0.15,
    maintenanceEaseScore: 0.25,
  },
  balanced: {
    powerScore: 0.18,
    safetyScore: 0.2,
    efficiencyScore: 0.18,
    comfortScore: 0.18,
    techScore: 0.14,
    quietnessScore: 0.12,
    maintenanceEaseScore: 0.2,
  },
  spirited: {
    powerScore: 0.35,
    safetyScore: 0.15,
    efficiencyScore: 0.05,
    comfortScore: 0.1,
    techScore: 0.15,
    quietnessScore: 0.05,
    maintenanceEaseScore: 0.05,
  },
};

const sensoryWeights: Record<SensoryPreference, AttributeWeights> = {
  quiet: {
    powerScore: 0.05,
    safetyScore: 0.2,
    efficiencyScore: 0.2,
    comfortScore: 0.2,
    techScore: 0.1,
    quietnessScore: 0.25,
    maintenanceEaseScore: 0.2,
  },
  balanced: {
    powerScore: 0.15,
    safetyScore: 0.2,
    efficiencyScore: 0.2,
    comfortScore: 0.15,
    techScore: 0.15,
    quietnessScore: 0.1,
    maintenanceEaseScore: 0.15,
  },
  sporty: {
    powerScore: 0.3,
    safetyScore: 0.15,
    efficiencyScore: 0.05,
    comfortScore: 0.1,
    techScore: 0.15,
    quietnessScore: 0.05,
    maintenanceEaseScore: 0.05,
  },
};

const techWeights: Record<TechComfort, AttributeWeights> = {
  minimal: {
    powerScore: 0.1,
    safetyScore: 0.2,
    efficiencyScore: 0.2,
    comfortScore: 0.2,
    techScore: 0.05,
    quietnessScore: 0.15,
    maintenanceEaseScore: 0.2,
  },
  connected: {
    powerScore: 0.18,
    safetyScore: 0.2,
    efficiencyScore: 0.18,
    comfortScore: 0.16,
    techScore: 0.18,
    quietnessScore: 0.1,
    maintenanceEaseScore: 0.2,
  },
  cuttingEdge: {
    powerScore: 0.2,
    safetyScore: 0.15,
    efficiencyScore: 0.1,
    comfortScore: 0.15,
    techScore: 0.3,
    quietnessScore: 0.05,
    maintenanceEaseScore: 0.05,
  },
};

const maintenanceWeights: Record<MaintenanceApproach, AttributeWeights> = {
  handsOff: {
    powerScore: 0.1,
    safetyScore: 0.2,
    efficiencyScore: 0.2,
    comfortScore: 0.15,
    techScore: 0.1,
    quietnessScore: 0.1,
    maintenanceEaseScore: 0.35,
  },
  balanced: {
    powerScore: 0.16,
    safetyScore: 0.2,
    efficiencyScore: 0.18,
    comfortScore: 0.17,
    techScore: 0.1,
    quietnessScore: 0.09,
    maintenanceEaseScore: 0.2,
  },
  enthusiast: {
    powerScore: 0.25,
    safetyScore: 0.15,
    efficiencyScore: 0.1,
    comfortScore: 0.1,
    techScore: 0.15,
    quietnessScore: 0.05,
    maintenanceEaseScore: 0.2,
  },
};

const mergeWeights = (weights: AttributeWeights[]): AttributeWeights => {
  const merged: AttributeWeights = {
    powerScore: 0,
    safetyScore: 0,
    efficiencyScore: 0,
    comfortScore: 0,
    techScore: 0,
    quietnessScore: 0,
    maintenanceEaseScore: 0,
  };

  weights.forEach((set) => {
    (Object.keys(set) as (keyof AttributeWeights)[]).forEach((attribute) => {
      merged[attribute] += set[attribute];
    });
  });

  const total = (Object.values(merged) as number[]).reduce((sum, value) => sum + value, 0);
  if (total === 0) return merged;

  (Object.keys(merged) as (keyof AttributeWeights)[]).forEach((attribute) => {
    merged[attribute] = merged[attribute] / total;
  });

  return merged;
};

const attributeKeys: (keyof AttributeWeights)[] = [
  "powerScore",
  "safetyScore",
  "efficiencyScore",
  "comfortScore",
  "techScore",
  "quietnessScore",
  "maintenanceEaseScore",
];

export const rankCarsByBehavioralFit = (
  profiles: BehavioralProfile[],
  responses: QuizResponses
): MatchResult[] => {
  const desired = mergeWeights([
    drivingWeights[responses.driving],
    sensoryWeights[responses.sensory],
    techWeights[responses.tech],
    maintenanceWeights[responses.maintenance],
  ]);

  return profiles
    .map((profile) => {
      const score = attributeKeys.reduce((sum, attribute) => {
        const preferenceWeight = desired[attribute];
        const attributeValue = profile[attribute] / 10; // normalize 0-1
        return sum + preferenceWeight * attributeValue;
      }, 0);

      const highlights: string[] = [];
      if (profile.powerScore >= 8 && desired.powerScore > 0.2) {
        highlights.push("Engaging performance that matches your spirited driving style");
      }
      if (profile.quietnessScore >= 8 && desired.quietnessScore > 0.2) {
        highlights.push("Exceptional cabin quietness for sensory comfort");
      }
      if (profile.techScore >= 8 && desired.techScore > 0.2) {
        highlights.push("Advanced technology package that fits your tech preferences");
      }
      if (profile.maintenanceEaseScore >= 8 && desired.maintenanceEaseScore > 0.2) {
        highlights.push("Low-effort maintenance experience aligned with your expectations");
      }
      if (highlights.length === 0) {
        highlights.push("Balanced match across performance, comfort, and ownership experience");
      }

      return {
        carId: profile.carId,
        matchScore: Math.round(score * 100),
        highlights,
      } as MatchResult;
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};
