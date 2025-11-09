export type DrivingStyle = "cautious" | "balanced" | "spirited";
export type SensoryPreference = "quiet" | "balanced" | "sporty";
export type TechComfort = "minimal" | "connected" | "cuttingEdge";
export type MaintenanceApproach = "handsOff" | "balanced" | "enthusiast";

export interface PriorityWeights {
  safety: number; // 0-10
  performance: number; // 0-10
  cargo: number; // 0-10
}

export interface BehavioralProfile {
  carId: string;
  msrp: number;
  powerScore: number; // 1-10
  safetyScore: number; // 1-10
  efficiencyScore: number; // 1-10
  comfortScore: number; // 1-10
  techScore: number; // 1-10
  quietnessScore: number; // 1-10
  maintenanceEaseScore: number; // 1-10 (higher = easier to maintain)
  cargoScore: number; // 1-10 cargo/utility versatility
}

export interface QuizOption {
  label: string;
  value: string;
  weights: {
    drivingStyle?: Partial<Record<DrivingStyle, number>>;
    sensory?: Partial<Record<SensoryPreference, number>>;
    tech?: Partial<Record<TechComfort, number>>;
    maintenance?: Partial<Record<MaintenanceApproach, number>>;
  };
}

export interface QuizQuestion {
  id: string;
  title: string;
  description?: string;
  category: "driving" | "sensory" | "tech" | "maintenance";
  options: QuizOption[];
}

export interface QuizResponses {
  driving: DrivingStyle;
  sensory: SensoryPreference;
  tech: TechComfort;
  maintenance: MaintenanceApproach;
  priorities: PriorityWeights;
  budget: number;
}

export interface MatchResult {
  carId: string;
  matchScore: number;
  highlights: string[];
}
