import { QuizQuestion } from "@/types/behavior";

export const behavioralQuestions: QuizQuestion[] = [
  {
    id: "driving-pace",
    title: "How would you describe your typical driving pace?",
    category: "driving",
    options: [
      {
        label: "I take it easy and prioritize smoothness",
        value: "calm",
        weights: {
          drivingStyle: { cautious: 2 },
        },
      },
      {
        label: "I go with the flow and adapt to traffic",
        value: "adaptive",
        weights: {
          drivingStyle: { balanced: 2 },
        },
      },
      {
        label: "I enjoy quick acceleration and confident passing",
        value: "assertive",
        weights: {
          drivingStyle: { spirited: 3 },
        },
      },
    ],
  },
  {
    id: "driving-confidence",
    title: "How do you feel about taking tight curves or highway merges?",
    category: "driving",
    options: [
      {
        label: "I prefer a calmer vehicle that feels planted and predictable",
        value: "steady",
        weights: {
          drivingStyle: { cautious: 2 },
        },
      },
      {
        label: "I like confidence and responsiveness without being too aggressive",
        value: "responsive",
        weights: {
          drivingStyle: { balanced: 2 },
        },
      },
      {
        label: "Give me sharp handling and power on tap",
        value: "dynamic",
        weights: {
          drivingStyle: { spirited: 3 },
        },
      },
    ],
  },
  {
    id: "sensory-cabin",
    title: "What kind of cabin experience do you prefer?",
    category: "sensory",
    options: [
      {
        label: "Whisper-quiet with minimal vibration",
        value: "quiet",
        weights: {
          sensory: { quiet: 3 },
        },
      },
      {
        label: "A thoughtful balance of calm and engaging",
        value: "balanced",
        weights: {
          sensory: { balanced: 2 },
        },
      },
      {
        label: "I love hearing the engine and feeling the road",
        value: "engaging",
        weights: {
          sensory: { sporty: 3 },
        },
      },
    ],
  },
  {
    id: "sensory-seating",
    title: "How sensitive are you to seating comfort during long drives?",
    category: "sensory",
    options: [
      {
        label: "Extremely — I need plush, supportive seating",
        value: "comfort",
        weights: {
          sensory: { quiet: 1.5, balanced: 1 },
        },
      },
      {
        label: "I appreciate comfort but can compromise a bit",
        value: "practical",
        weights: {
          sensory: { balanced: 1.5 },
        },
      },
      {
        label: "Seat firmness doesn’t bother me much",
        value: "firm",
        weights: {
          sensory: { sporty: 1.5 },
        },
      },
    ],
  },
  {
    id: "tech-attitude",
    title: "How do you feel about in-car technology?",
    category: "tech",
    options: [
      {
        label: "Keep it simple — CarPlay/Android Auto is enough",
        value: "basic-tech",
        weights: {
          tech: { minimal: 3 },
        },
      },
      {
        label: "I enjoy smart features and modern conveniences",
        value: "connected-tech",
        weights: {
          tech: { connected: 3 },
        },
      },
      {
        label: "I want cutting-edge tech and driver assistance",
        value: "advanced-tech",
        weights: {
          tech: { cuttingEdge: 3 },
        },
      },
    ],
  },
  {
    id: "tech-learning",
    title: "How much time are you willing to spend learning new vehicle tech?",
    category: "tech",
    options: [
      {
        label: "Very little — I prefer intuitive controls",
        value: "intuitive",
        weights: {
          tech: { minimal: 2 },
        },
      },
      {
        label: "Some — I’ll learn features that add value",
        value: "moderate",
        weights: {
          tech: { connected: 2 },
        },
      },
      {
        label: "As much as needed — I love exploring tech",
        value: "deep-dive",
        weights: {
          tech: { cuttingEdge: 2 },
        },
      },
    ],
  },
  {
    id: "maintenance-attitude",
    title: "What kind of ownership experience do you prefer?",
    category: "maintenance",
    options: [
      {
        label: "Set it and forget it — I want minimal upkeep",
        value: "minimal",
        weights: {
          maintenance: { handsOff: 3 },
        },
      },
      {
        label: "I’ll follow the schedule but don’t want complicated work",
        value: "scheduled",
        weights: {
          maintenance: { balanced: 3 },
        },
      },
      {
        label: "I enjoy tinkering or customizing my vehicle",
        value: "hands-on",
        weights: {
          maintenance: { enthusiast: 3 },
        },
      },
    ],
  },
  {
    id: "maintenance-diy",
    title: "How comfortable are you with DIY maintenance?",
    category: "maintenance",
    options: [
      {
        label: "I prefer to leave everything to the dealer",
        value: "dealer",
        weights: {
          maintenance: { handsOff: 2 },
        },
      },
      {
        label: "I can do basics like wipers and fluids",
        value: "basic",
        weights: {
          maintenance: { balanced: 2 },
        },
      },
      {
        label: "I handle most jobs in my garage",
        value: "advanced",
        weights: {
          maintenance: { enthusiast: 2 },
        },
      },
    ],
  },
];
