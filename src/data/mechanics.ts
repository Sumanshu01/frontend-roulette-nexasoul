export interface DevilFruitPower {
  id: string;
  name: string;
  type: "Devil Fruit";
  icon: string;
  themeColor: string;
  bgGradient: string;
  commonEffect: string;
  benefit: string;
  disadvantage: string;
  lore: string;
}

export interface HakiPower {
  id: string;
  name: string;
  type: "Haki";
  icon: string;
  themeColor: string;
  bgGradient: string;
  challenge: string;
  passCondition: string;
  power: string;
  lore: string;
}

export type MechanicPower = DevilFruitPower | HakiPower;

export const DEVIL_FRUIT_POWERS: DevilFruitPower[] = [
  {
    id: "df-overdrive",
    name: "Overdrive",
    type: "Devil Fruit",
    icon: "🔥",
    themeColor: "#ef4444",
    bgGradient: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #ef4444 100%)",
    commonEffect: "Reveal 1 additional hidden evaluation condition.",
    benefit: "+20 points if fully satisfied.",
    disadvantage: "Revealed condition becomes mandatory.",
    lore: "Pushes your system's engine beyond mortal thresholds. An additional hidden jury condition is awakened — conquer it for massive bounty, or suffer zero leeway!",
  },
  {
    id: "df-future-sight",
    name: "Future Sight",
    type: "Devil Fruit",
    icon: "👁️",
    themeColor: "#8b5cf6",
    bgGradient: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)",
    commonEffect: "Reveal 1 upcoming evaluation condition before the team reaches it.",
    benefit: "Early information advantage.",
    disadvantage: "Condition cannot be replaced.",
    lore: "Peer into the flow of time like Katakuri. Uncover an upcoming evaluation checkpoint well in advance, locking your team into pure strategic foresight.",
  },
  {
    id: "df-mirror",
    name: "Mirror",
    type: "Devil Fruit",
    icon: "🪞",
    themeColor: "#06b6d4",
    bgGradient: "linear-gradient(135deg, #164e63 0%, #0891b2 50%, #06b6d4 100%)",
    commonEffect: "Reveal the expected output/behavior for 1 selected condition.",
    benefit: "Team gets a clear reference.",
    disadvantage: "Team is evaluated exactly against the revealed reference.",
    lore: "Brulee's mirror world reflects the jury's exact benchmark. You gain a blueprint for behavior, but your prototype will be scrutinized to the pixel!",
  },
  {
    id: "df-risk-risk",
    name: "Risk-Risk",
    type: "Devil Fruit",
    icon: "🎲",
    themeColor: "#f59e0b",
    bgGradient: "linear-gradient(135deg, #78350f 0%, #d97706 50%, #f59e0b 100%)",
    commonEffect: "Team selects 1 evaluation requirement for all-or-nothing scoring.",
    benefit: "+20 points if fully satisfied.",
    disadvantage: "0 points for that requirement if failed.",
    lore: "A true pirate's gamble! Stake everything on your masterpiece feature. Execute it to absolute perfection for +20 points, or crash with zero.",
  },
];

export const HAKI_POWERS: HakiPower[] = [
  {
    id: "haki-observation",
    name: "Observation Haki",
    type: "Haki",
    icon: "🎯",
    themeColor: "#10b981",
    bgGradient: "linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)",
    challenge: "2 objective questions based on the project's UI/functionality.",
    passCondition: "2/2 correct",
    power: "Reveal 1 additional evaluation condition.",
    lore: "Sharpen your senses across the digital battlefield. Answer 2 UI/functionality questions accurately to unveil an extra evaluation avenue.",
  },
  {
    id: "haki-armament",
    name: "Armament Haki",
    type: "Haki",
    icon: "🛡️",
    themeColor: "#64748b",
    bgGradient: "linear-gradient(135deg, #1e293b 0%, #475569 50%, #64748b 100%)",
    challenge: "2 scenario-based questions about system requirements.",
    passCondition: "2/2 correct",
    power: "Protect 1 requirement from one minor deduction.",
    lore: "Coat your codebase in an invisible armor of Busoshoku Haki. Defend one vulnerable requirement from minor jury deductions.",
  },
  {
    id: "haki-conqueror",
    name: "Conqueror's Haki",
    type: "Haki",
    icon: "👑",
    themeColor: "#eab308",
    bgGradient: "linear-gradient(135deg, #713f12 0%, #ca8a04 50%, #eab308 100%)",
    challenge: "3 rapid-fire questions based on system behavior and edge cases.",
    passCondition: "≥2/3 correct",
    power: "+15 points to current evaluation.",
    lore: "The disposition of a King! Overwhelm the jury with sheer dominance on edge-case logic. Pass the rapid-fire trial for an instant +15 marks boost.",
  },
  {
    id: "haki-advanced",
    name: "Advanced Haki",
    type: "Haki",
    icon: "⚡",
    themeColor: "#ec4899",
    bgGradient: "linear-gradient(135deg, #831843 0%, #db2777 50%, #ec4899 100%)",
    challenge: "60–90 sec practical observation/reasoning challenge related to the submitted system.",
    passCondition: "Challenge successfully completed",
    power: "+25 points to current evaluation.",
    lore: "Ryou and Advanced Conqueror's infusion! A 60–90 second live reasoning demonstration that penetrates jury defenses for the maximum +25 points windfall!",
  },
];

export const ALL_MECHANICS: MechanicPower[] = [
  ...DEVIL_FRUIT_POWERS,
  ...HAKI_POWERS,
];
