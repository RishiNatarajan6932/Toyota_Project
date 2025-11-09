import { BehavioralProfile } from "@/types/behavior";

export const behavioralProfiles: BehavioralProfile[] = [
  {
    carId: "1", // Camry
    msrp: 28400,
    powerScore: 5,
    safetyScore: 9,
    efficiencyScore: 8,
    comfortScore: 8,
    techScore: 7,
    quietnessScore: 8,
    maintenanceEaseScore: 9,
    cargoScore: 6,
  },
  {
    carId: "2", // RAV4
    msrp: 29575,
    powerScore: 6,
    safetyScore: 8,
    efficiencyScore: 7,
    comfortScore: 7,
    techScore: 7,
    quietnessScore: 7,
    maintenanceEaseScore: 8,
    cargoScore: 8,
  },
  {
    carId: "3", // Corolla
    msrp: 22050,
    powerScore: 4,
    safetyScore: 8,
    efficiencyScore: 9,
    comfortScore: 6,
    techScore: 6,
    quietnessScore: 7,
    maintenanceEaseScore: 9,
    cargoScore: 5,
  },
  {
    carId: "4", // Highlander
    msrp: 38520,
    powerScore: 7,
    safetyScore: 9,
    efficiencyScore: 6,
    comfortScore: 9,
    techScore: 8,
    quietnessScore: 8,
    maintenanceEaseScore: 7,
    cargoScore: 9,
  },
  {
    carId: "5", // Prius
    msrp: 28545,
    powerScore: 4,
    safetyScore: 8,
    efficiencyScore: 10,
    comfortScore: 7,
    techScore: 7,
    quietnessScore: 9,
    maintenanceEaseScore: 8,
    cargoScore: 6,
  },
  {
    carId: "6", // Tacoma
    msrp: 30750,
    powerScore: 7,
    safetyScore: 7,
    efficiencyScore: 5,
    comfortScore: 6,
    techScore: 6,
    quietnessScore: 5,
    maintenanceEaseScore: 6,
    cargoScore: 9,
  },
  {
    carId: "7", // 4Runner
    msrp: 41515,
    powerScore: 7,
    safetyScore: 7,
    efficiencyScore: 5,
    comfortScore: 6,
    techScore: 6,
    quietnessScore: 5,
    maintenanceEaseScore: 6,
    cargoScore: 9,
  },
  {
    carId: "8", // GR Supra
    msrp: 46440,
    powerScore: 10,
    safetyScore: 7,
    efficiencyScore: 4,
    comfortScore: 6,
    techScore: 8,
    quietnessScore: 4,
    maintenanceEaseScore: 4,
    cargoScore: 3,
  },
  {
    carId: "9", // Tundra
    msrp: 40790,
    powerScore: 9,
    safetyScore: 8,
    efficiencyScore: 4,
    comfortScore: 7,
    techScore: 8,
    quietnessScore: 6,
    maintenanceEaseScore: 5,
    cargoScore: 10,
  },
  {
    carId: "10", // bZ4X
    msrp: 42000,
    powerScore: 6,
    safetyScore: 8,
    efficiencyScore: 9,
    comfortScore: 7,
    techScore: 9,
    quietnessScore: 9,
    maintenanceEaseScore: 8,
    cargoScore: 7,
  },
  {
    carId: "11", // Sienna
    msrp: 37155,
    powerScore: 6,
    safetyScore: 9,
    efficiencyScore: 7,
    comfortScore: 9,
    techScore: 8,
    quietnessScore: 8,
    maintenanceEaseScore: 7,
    cargoScore: 10,
  },
  {
    carId: "12", // Crown
    msrp: 41045,
    powerScore: 7,
    safetyScore: 8,
    efficiencyScore: 7,
    comfortScore: 8,
    techScore: 8,
    quietnessScore: 8,
    maintenanceEaseScore: 7,
    cargoScore: 6,
  },

  {
    carId: "13", // Sequoia Capstone
    msrp: 61460,
    powerScore: 8,
    safetyScore: 9,
    efficiencyScore: 4,
    comfortScore: 9,
    techScore: 8,
    quietnessScore: 7,
    maintenanceEaseScore: 6,
    cargoScore: 10,
  },
  {
    carId: "14", // Land Cruiser
    msrp: 65500,
    powerScore: 8,
    safetyScore: 9,
    efficiencyScore: 5,
    comfortScore: 8,
    techScore: 9,
    quietnessScore: 7,
    maintenanceEaseScore: 6,
    cargoScore: 9,
  },
  {
    carId: "15", // GR Supra Premium
    msrp: 55850,
    powerScore: 10,
    safetyScore: 8,
    efficiencyScore: 4,
    comfortScore: 7,
    techScore: 9,
    quietnessScore: 5,
    maintenanceEaseScore: 4,
    cargoScore: 3,
  },
];

export const getBehavioralProfile = (carId: string) =>
  behavioralProfiles.find((profile) => profile.carId === carId);
