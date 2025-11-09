import {
  BehavioralProfile,
  DrivingStyle,
  MaintenanceApproach,
  MatchResult,
  PriorityWeights,
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
  selections: QuizSelections,
  priorities: PriorityWeights,
  budget: number
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
    priorities,
    budget,
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
  cargoScore: number;
}

const drivingWeights: Record<DrivingStyle, AttributeWeights> = {
  cautious: {
    powerScore: 0.08,
    safetyScore: 0.26,
    efficiencyScore: 0.2,
    comfortScore: 0.14,
    techScore: 0.1,
    quietnessScore: 0.14,
    maintenanceEaseScore: 0.2,
    cargoScore: 0.08,
  },
  balanced: {
    powerScore: 0.16,
    safetyScore: 0.2,
    efficiencyScore: 0.18,
    comfortScore: 0.16,
    techScore: 0.14,
    quietnessScore: 0.1,
    maintenanceEaseScore: 0.18,
    cargoScore: 0.12,
  },
  spirited: {
    powerScore: 0.36,
    safetyScore: 0.14,
    efficiencyScore: 0.05,
    comfortScore: 0.08,
    techScore: 0.15,
    quietnessScore: 0.04,
    maintenanceEaseScore: 0.05,
    cargoScore: 0.13,
  },
};

const sensoryWeights: Record<SensoryPreference, AttributeWeights> = {
  quiet: {
    powerScore: 0.06,
    safetyScore: 0.2,
    efficiencyScore: 0.18,
    comfortScore: 0.22,
    techScore: 0.1,
    quietnessScore: 0.24,
    maintenanceEaseScore: 0.18,
    cargoScore: 0.12,
  },
  balanced: {
    powerScore: 0.15,
    safetyScore: 0.2,
    efficiencyScore: 0.2,
    comfortScore: 0.16,
    techScore: 0.15,
    quietnessScore: 0.1,
    maintenanceEaseScore: 0.14,
    cargoScore: 0.1,
  },
  sporty: {
    powerScore: 0.32,
    safetyScore: 0.14,
    efficiencyScore: 0.05,
    comfortScore: 0.08,
    techScore: 0.15,
    quietnessScore: 0.04,
    maintenanceEaseScore: 0.04,
    cargoScore: 0.18,
  },
};

const techWeights: Record<TechComfort, AttributeWeights> = {
  minimal: {
    powerScore: 0.1,
    safetyScore: 0.22,
    efficiencyScore: 0.2,
    comfortScore: 0.18,
    techScore: 0.05,
    quietnessScore: 0.15,
    maintenanceEaseScore: 0.2,
    cargoScore: 0.1,
  },
  connected: {
    powerScore: 0.16,
    safetyScore: 0.2,
    efficiencyScore: 0.18,
    comfortScore: 0.16,
    techScore: 0.18,
    quietnessScore: 0.1,
    maintenanceEaseScore: 0.18,
    cargoScore: 0.14,
  },
  cuttingEdge: {
    powerScore: 0.22,
    safetyScore: 0.14,
    efficiencyScore: 0.1,
    comfortScore: 0.12,
    techScore: 0.3,
    quietnessScore: 0.05,
    maintenanceEaseScore: 0.05,
    cargoScore: 0.12,
  },
};

const maintenanceWeights: Record<MaintenanceApproach, AttributeWeights> = {
  handsOff: {
    powerScore: 0.1,
    safetyScore: 0.22,
    efficiencyScore: 0.2,
    comfortScore: 0.14,
    techScore: 0.1,
    quietnessScore: 0.1,
    maintenanceEaseScore: 0.34,
    cargoScore: 0.1,
  },
  balanced: {
    powerScore: 0.16,
    safetyScore: 0.2,
    efficiencyScore: 0.18,
    comfortScore: 0.16,
    techScore: 0.1,
    quietnessScore: 0.08,
    maintenanceEaseScore: 0.2,
    cargoScore: 0.12,
  },
  enthusiast: {
    powerScore: 0.26,
    safetyScore: 0.14,
    efficiencyScore: 0.1,
    comfortScore: 0.08,
    techScore: 0.16,
    quietnessScore: 0.04,
    maintenanceEaseScore: 0.18,
    cargoScore: 0.14,
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
    cargoScore: 0,
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
  "cargoScore",
];

const applyPriorityWeights = (
  desired: AttributeWeights,
  priorities: PriorityWeights
): AttributeWeights => {
  const adjusted: AttributeWeights = { ...desired };

  const boost = (value: number) => 1 + value / 10;

  adjusted.safetyScore *= boost(priorities.safety);
  adjusted.powerScore *= boost(priorities.performance);
  adjusted.cargoScore *= boost(priorities.cargo);

  const sum = (Object.values(adjusted) as number[]).reduce((acc, val) => acc + val, 0);
  if (sum === 0) return adjusted;
  (Object.keys(adjusted) as (keyof AttributeWeights)[]).forEach((key) => {
    adjusted[key] = adjusted[key] / sum;
  });

  return adjusted;
};

const budgetAdjustment = (msrp: number, budget: number): number => {
  if (budget <= 0) return 1;
  if (msrp <= budget) {
    const savingsRatio = (budget - msrp) / budget;
    return 1 + Math.min(0.2, savingsRatio * 0.5);
  }
  const overRatio = (msrp - budget) / budget;
  return Math.max(0.6, 1 - Math.min(0.4, overRatio * 0.6));
};

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

  const weightedPreferences = applyPriorityWeights(desired, responses.priorities);

  return profiles
    .map((profile) => {
      const baseScore = attributeKeys.reduce((sum, attribute) => {
        const preferenceWeight = weightedPreferences[attribute];
        const attributeValue = profile[attribute] / 10; // normalize 0-1
        return sum + preferenceWeight * attributeValue;
      }, 0);

      const affordabilityFactor = budgetAdjustment(profile.msrp, responses.budget);
      const score = baseScore * affordabilityFactor;

      const highlights: string[] = [];
      if (profile.powerScore >= 8 && weightedPreferences.powerScore > 0.2) {
        highlights.push("Powertrain tuned for drivers who enjoy quick acceleration");
      }
      if (profile.quietnessScore >= 8 && weightedPreferences.quietnessScore > 0.18) {
        highlights.push("Exceptional cabin isolation for peaceful drives");
      }
      if (profile.techScore >= 8 && weightedPreferences.techScore > 0.18) {
        highlights.push("Rich technology suite that matches your tech comfort");
      }
      if (profile.cargoScore >= 8 && weightedPreferences.cargoScore > 0.18) {
        highlights.push("Flexible cargo space for your hauling priorities");
      }
      if (profile.maintenanceEaseScore >= 8 && weightedPreferences.maintenanceEaseScore > 0.18) {
        highlights.push("Low-effort ownership aligned with your maintenance style");
      }
      if (profile.msrp <= responses.budget) {
        highlights.push("Stays within your budget preference");
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
