import { BehavioralProfile } from "@/types/behavior";

export const behavioralProfiles: BehavioralProfile[] = [
  {
    carId: "1", // Camry
    powerScore: 5,
    safetyScore: 9,
    efficiencyScore: 8,
    comfortScore: 8,
    techScore: 7,
    quietnessScore: 8,
    maintenanceEaseScore: 9,
  },
  {
    carId: "2", // RAV4
    powerScore: 6,
    safetyScore: 8,
    efficiencyScore: 7,
    comfortScore: 7,
    techScore: 7,
    quietnessScore: 7,
    maintenanceEaseScore: 8,
  },
  {
    carId: "3", // Corolla
    powerScore: 4,
    safetyScore: 8,
    efficiencyScore: 9,
    comfortScore: 6,
    techScore: 6,
    quietnessScore: 7,
    maintenanceEaseScore: 9,
  },
  {
    carId: "4", // Highlander
    powerScore: 7,
    safetyScore: 9,
    efficiencyScore: 6,
    comfortScore: 9,
    techScore: 8,
    quietnessScore: 8,
    maintenanceEaseScore: 7,
  },
  {
    carId: "5", // Prius
    powerScore: 4,
    safetyScore: 8,
    efficiencyScore: 10,
    comfortScore: 7,
    techScore: 7,
    quietnessScore: 9,
    maintenanceEaseScore: 8,
  },
  {
    carId: "6", // Tacoma
    powerScore: 7,
    safetyScore: 7,
    efficiencyScore: 5,
    comfortScore: 6,
    techScore: 6,
    quietnessScore: 5,
    maintenanceEaseScore: 6,
  },
  {
    carId: "7", // 4Runner
    powerScore: 7,
    safetyScore: 7,
    efficiencyScore: 5,
    comfortScore: 6,
    techScore: 6,
    quietnessScore: 5,
    maintenanceEaseScore: 6,
  },
  {
    carId: "8", // GR Supra
    powerScore: 10,
    safetyScore: 7,
    efficiencyScore: 4,
    comfortScore: 6,
    techScore: 8,
    quietnessScore: 4,
    maintenanceEaseScore: 4,
  },
  {
    carId: "9", // Tundra
    powerScore: 9,
    safetyScore: 8,
    efficiencyScore: 4,
    comfortScore: 7,
    techScore: 8,
    quietnessScore: 6,
    maintenanceEaseScore: 5,
  },
  {
    carId: "10", // bZ4X
    powerScore: 6,
    safetyScore: 8,
    efficiencyScore: 9,
    comfortScore: 7,
    techScore: 9,
    quietnessScore: 9,
    maintenanceEaseScore: 8,
  },
  {
    carId: "11", // Sienna
    powerScore: 6,
    safetyScore: 9,
    efficiencyScore: 7,
    comfortScore: 9,
    techScore: 8,
    quietnessScore: 8,
    maintenanceEaseScore: 7,
  },
  {
    carId: "12", // Crown
    powerScore: 7,
    safetyScore: 8,
    efficiencyScore: 7,
    comfortScore: 8,
    techScore: 8,
    quietnessScore: 8,
    maintenanceEaseScore: 7,
  },
];

export const getBehavioralProfile = (carId: string) =>
  behavioralProfiles.find((profile) => profile.carId === carId);
