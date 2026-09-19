export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  badge?: string;
}

export interface PrizeItem {
  id: string;
  title: string;
  reward: string;
  description: string;
  bounty: string;
  icon: string;
}

export interface JuryMember {
  name: string;
  role: string;
  round: string;
  badgeColor: string;
}

export interface Mentor {
  name: string;
  title: string;
}

export interface CoreTeamRole {
  role: string;
  members: string[];
}

export interface EvaluationCriterion {
  category: string;
  marks: number;
  description: string;
  checkMethod?: string;
}

export const EVENT_DATA = {
  name: "Frontend Roulette",
  subTitle: "NEXASOUL",
  theme: "One Piece & Gol D. Roger — The Grand Line Frontend Challenge",
  tagline: "Spin the Wheel of Destiny. Conquer the Code. Claim the Ultimate Bounty!",
  date: "August 2026",
  venue: "B4 UCRD",
  duration: "9:30 AM – 4:25 PM",
  mainEventBegins: "10:00 AM Sharp",
  techStack: "FULL STACK DEV / FRONTEND PROTOTYPE",
  teamSize: "3–4 Participants per Pirate Crew",
  evaluationMethod: "Jury-based 100-Point System",
  finalOutput: "Functional frontend prototype + presentation",

  concept: `Frontend Roulette is a team-based frontend development challenge where participants spin a digital roulette wheel to receive a random Hackathon/Ideathon problem statement. Each team of 3–4 participants must understand the assigned problem, plan a solution, design the user interface, and develop a functional frontend prototype within the given time. The randomness of the roulette adds an element of surprise, adaptability, creativity, and time management to the traditional hackathon format.`,

  rogerQuote: `"Wealth, Fame, Power... The King of the Pirates, Gol D. Roger, acquired everything this world had to offer! You want the ultimate frontend prototype? You can have it! Search the Grand Line! NEXASOUL Frontend Roulette begins now!"`,

  objectives: [
    {
      title: "Master Frontend Craftsmanship",
      description: "Develop participants' frontend development skills with cutting-edge UI/UX and responsive engineering.",
      icon: "code"
    },
    {
      title: "Creative Problem-Solving",
      description: "Encourage unexpected and imaginative problem-solving when confronted with random Grand Line constraints.",
      icon: "compass"
    },
    {
      title: "Time-Pressure Resilience",
      description: "Test participants' ability to prioritize, execute, and deliver under strict time constraints.",
      icon: "hourglass"
    },
    {
      title: "Crew Camaraderie & Git Ops",
      description: "Foster effective team collaboration evaluated through CI/CD pipelines and team synergy.",
      icon: "anchor"
    },
    {
      title: "Real-World Hackathon Paradigm",
      description: "Introduce participants to industry-grade rapid prototyping, UI/UX aesthetics, and jury pitching.",
      icon: "award"
    }
  ],

  skillsDeveloped: [
    "UI / UX Design",
    "Frontend Development",
    "Product Thinking",
    "Rapid Prototyping",
    "Jury Pitching & Presentation",
    "Teamwork & Git Collaboration"
  ],

  schedule: [
    {
      time: "9:30 AM",
      title: "Pirate Fleet Assembly & Verification",
      description: "Crews arrive at B4 UCRD, check in with Attendance officers (Kashish & Avni), and verify their Crew Wanted Passes.",
      badge: "Arrival"
    },
    {
      time: "10:00 AM Sharp",
      title: "Main Event Begins: Gol D. Roger's Roulette",
      description: "Opening addresses by anchors Kohana & Drishti. Dual Roulette wheels open for official spin allocation (Problem + Special Constraint).",
      badge: "Main Event"
    },
    {
      time: "10:15 AM - 1:00 PM",
      title: "Sprint 1: UI/UX Wireframing & Code Setup",
      description: "Pirate crews design architectures, establish repository CI/CD pipelines, and construct core interactive interfaces.",
      badge: "Coding Sprint"
    },
    {
      time: "1:00 PM - 1:45 PM",
      title: "Midday Fuel & Re-Roll Mini-Game Challenge",
      description: "Crew lunch break. Teams seeking an official re-roll must play and conquer the on-site mini-game to unlock their Re-Roll Token.",
      badge: "Mini-Game Window"
    },
    {
      time: "1:45 PM - 3:45 PM",
      title: "Sprint 2: Functionality, API & Polish",
      description: "Implementing bonus features, responsive layouts, data visualisations, animations, and preparing final deployed prototypes.",
      badge: "Final Sprint"
    },
    {
      time: "3:45 PM - 4:25 PM",
      title: "Grand Jury Pitching & Awards Ceremony",
      description: "Prototype presentations to High Admirals Dr. Navjyot Kaur, Dr. Kiranjeet Kaur Sandhu, Ayush Negi, Sumanshu Jindal. Trophy & Medals awarded!",
      badge: "Evaluation & Victory"
    }
  ],

  prizes: [
    {
      id: "best-overall",
      title: "Best Overall Project",
      reward: "TROPHY WITH MEDALS",
      bounty: "฿1,500,000,000",
      description: "Awarded to the pirate crew with the highest overall aggregate score across all judging categories. The true Kings of Frontend!",
      icon: "trophy"
    },
    {
      id: "best-ui-ux",
      title: "Best UI/UX Design",
      reward: "MEDALS",
      bounty: "฿750,000,000",
      description: "Awarded for exceptional visual aesthetics, design system consistency, intuitive user experience, and aesthetic delight.",
      icon: "palette"
    },
    {
      id: "most-innovative",
      title: "Most Innovative Solution",
      reward: "MEDALS",
      bounty: "฿600,000,000",
      description: "Awarded to the crew demonstrating the most creative and out-of-the-box conceptual interpretation of the problem statement.",
      icon: "sparkles"
    },
    {
      id: "best-rapid-prototype",
      title: "Best Rapid Prototype",
      reward: "MEDALS",
      bounty: "฿500,000,000",
      description: "Recognizing outstanding engineering execution, functional completeness, and polish delivered under tight time constraints.",
      icon: "zap"
    },
    {
      id: "roulette-master",
      title: "Roulette Master Award",
      reward: "MEDALS",
      bounty: "฿500,000,000",
      description: "Awarded to the pirate crew that best conquered and flawlessly integrated their unexpected random Roulette twist condition.",
      icon: "flame"
    }
  ],

  judges: [
    {
      name: "Dr. Navjyot Kaur",
      role: "High Admiral of the Grand Fleet",
      round: "Final Round Jury",
      badgeColor: "#d97706"
    },
    {
      name: "Dr. Kiranjeet Kaur Sandhu",
      role: "High Admiral of the Grand Fleet",
      round: "Final Round Jury",
      badgeColor: "#d97706"
    },
    {
      name: "Ayush Negi",
      role: "Fleet Vice Admiral",
      round: "2nd Round Jury",
      badgeColor: "#0284c7"
    },
    {
      name: "Sumanshu Jindal",
      role: "Fleet Vice Admiral",
      round: "2nd Round Jury",
      badgeColor: "#0284c7"
    },
    {
      name: "Senior Guest Jury 1",
      role: "First Fleet Inspector",
      round: "1st Round Jury",
      badgeColor: "#16a34a"
    },
    {
      name: "Senior Guest Jury 2",
      role: "Second Fleet Inspector",
      round: "2nd Round Jury",
      badgeColor: "#16a34a"
    }
  ],

  mentors: [
    { name: "Nitin Patel", title: "Chief Navigation Officer" },
    { name: "Garvit Amit Bhutani", title: "Grand Line Tech Strategist" },
    { name: "Suraj", title: "Full Stack Helmsman" },
    { name: "Darshna Parihar", title: "UI/UX Quartermaster" }
  ],

  coreTeamRoles: [
    { role: "Anchors & MCs", members: ["Kohana", "Drishti"] },
    { role: "Attendance & Gatekeepers", members: ["Kashish", "Avni"] },
    { role: "Certifier & Bounty Records", members: ["Manas"] },
    { role: "Tech Operations & Logistics", members: ["Aditi", "Kashish (Post-Checkin)", "Avni (Post-Checkin)"] },
    { role: "Media, Film & Chronicles", members: ["Akshaj", "Manas"] },
    { role: "Fleet Discipline & Marshals", members: ["Tanmay", "Mentors Guild"] }
  ],

  evaluationCriteria: [
    {
      category: "Problem Understanding",
      marks: 10,
      description: "Clarity in grasping the assigned problem statement domain, targeted users, and core challenge."
    },
    {
      category: "Innovation & Creativity",
      marks: 20,
      description: "Novel approach, imaginative features, and distinctive value proposition beyond generic templates."
    },
    {
      category: "UI/UX Design",
      marks: 20,
      description: "Aesthetic appeal, visual hierarchy, color harmony, typography, responsiveness, and micro-interactions."
    },
    {
      category: "Frontend Implementation",
      marks: 25,
      description: "Code architecture, modularity, performance, responsive execution, state handling, and component structure."
    },
    {
      category: "Functionality",
      marks: 15,
      description: "Working user flows, dynamic feature completion, error handling, and fulfillment of core requirements."
    },
    {
      category: "Presentation & Pitch",
      marks: 5,
      description: "Clear communication, confident demo walkthrough, structured articulation, and team pitch delivery."
    },
    {
      category: "Teamwork & Collaboration",
      marks: 5,
      description: "Checked through Git commit logs / CI/CD pipeline contributions; questionnaire assessment for 1st years."
    }
  ],

  rouletteRules: {
    oneSpinOnly: "Each team gets strictly ONE official spin. Once the result appears, it is locked into the Grand Line ledger.",
    reRollToken: "To unlock a second spin, teams MUST play and win the on-site 'Gol D. Roger Treasure Trial' mini-game.",
    penaltyWarning: "WARNING: If any team requests a re-roll without having played and won the official mini-game, an automatic -5 Marks penalty will be deducted from their score!"
  },

  specialConditions: [
    {
      id: "dark-mode",
      name: "Must Support Dark Mode",
      desc: "Implement a seamless, high-contrast dark/light mode toggle with persistent state.",
      badge: "Theme Twist"
    },
    {
      id: "mobile-responsive",
      name: "Must Be Mobile Responsive",
      desc: "Pixel-perfect experience across mobile, tablet, and widescreen viewports with custom mobile navigation.",
      badge: "Layout Twist"
    },
    {
      id: "animation",
      name: "Must Include Animation",
      desc: "Fluid CSS / micro-animations, loading state transitions, or interactive hover choreographies.",
      badge: "Motion Twist"
    },
    {
      id: "api",
      name: "Must Use an API",
      desc: "Integrate at least one live public REST or GraphQL API (or realistic mock API engine) with dynamic fetching.",
      badge: "Data Twist"
    },
    {
      id: "accessibility",
      name: "Must Include Accessibility (a11y)",
      desc: "WCAG compliance, keyboard navigability, ARIA labels, semantic markup, and high-readability contrasts.",
      badge: "Inclusion Twist"
    },
    {
      id: "data-viz",
      name: "Must Have Data Visualization",
      desc: "Engaging charts, metric graphs, real-time gauges, or dynamic visual analytics summarizing data.",
      badge: "Analytics Twist"
    }
  ]
};
