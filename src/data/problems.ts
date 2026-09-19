export interface ProblemStatement {
  id: string;
  domain: string;
  title: string;
  difficulty: "Level 1 (Freshers)" | "Level 2 (Medium)" | "Level 3 (Hard)";
  rouletteTier: 1 | 2; // 1 = 1st Roulette (Freshers), 2 = 2nd Roulette (2nd Year & Above)
  bounty: string;
  problem: string;
  requirements: string[];
  bonus: string[];
}

export const PROBLEM_STATEMENTS: ProblemStatement[] = [
  // --- LEVEL 1: FRESHERS 1ST ROULETTE ---
  {
    id: "FR-01",
    domain: "Education",
    title: "Student Timetable & Voyage Scheduler",
    difficulty: "Level 1 (Freshers)",
    rouletteTier: 1,
    bounty: "฿30,000,000",
    problem: "Design an intuitive, interactive student timetable manager that allows scholars and pirate cadets to track lecture blocks, assignment deadlines, room numbers, and instructor details with color-coded course categories.",
    requirements: [
      "Weekly interactive grid view with time slots",
      "Course creation, editing, and color categorization",
      "Upcoming class notifications / reminder indicators",
      "Responsive layout optimized for both mobile and desktop"
    ],
    bonus: [
      "Dark mode support",
      "Export timetable to iCal / PDF",
      "Exam countdown timer widget",
      "Sound effects on course completion"
    ]
  },
  {
    id: "FR-02",
    domain: "FinTech",
    title: "Personal Finance & Beli Budget Dashboard",
    difficulty: "Level 1 (Freshers)",
    rouletteTier: 1,
    bounty: "฿35,000,000",
    problem: "Create a personal financial dashboard that enables students to log income, track daily expenditures across categories, set monthly savings milestones, and visualize spending habits.",
    requirements: [
      "Summary cards for Total Balance, Monthly Income, and Expenses",
      "Transaction entry modal with category tagging",
      "Recent transactions ledger with search/filter",
      "Visual spending breakdown progress bars"
    ],
    bonus: [
      "Pie/Doughnut chart of expenditure categories",
      "One Piece Beli / Berry currency toggle",
      "Monthly savings budget limit warning",
      "Local storage data persistence"
    ]
  },
  {
    id: "FR-03",
    domain: "Social Impact",
    title: "Campus Event & Fest Management Hub",
    difficulty: "Level 1 (Freshers)",
    rouletteTier: 1,
    bounty: "฿40,000,000",
    problem: "Build an engaging college event discovery and RSVP platform where students can browse upcoming technical, cultural, and sports competitions, check schedules, and reserve digital entry passes.",
    requirements: [
      "Categorized event cards with tags and dates",
      "Event details modal with agenda and speaker list",
      "Interactive 'Register / RSVP' flow with pass badge generation",
      "Search bar and category filter (Tech, Cultural, Sports)"
    ],
    bonus: [
      "Live seat / pass availability counter",
      "Add to calendar quick button",
      "Social share pass preview",
      "Night mode aesthetics"
    ]
  },
  {
    id: "FR-04",
    domain: "Health & Fitness",
    title: "Pirate Workout & Calorie Tracker",
    difficulty: "Level 1 (Freshers)",
    rouletteTier: 1,
    bounty: "฿45,000,000",
    problem: "Develop a motivating fitness tracker interface that logs daily routines (reps, sets, running distance), monitors water intake, calculates calories burned, and displays weekly workout streaks.",
    requirements: [
      "Daily workout logger with exercise presets",
      "Water hydration tracker with interactive cup counter",
      "Weekly streak indicator and goal progress bar",
      "Clean, mobile-first responsive design"
    ],
    bonus: [
      "Luffy Gear Second energy meter animation",
      "Rest timer with audio beep alert",
      "Calorie burned estimator",
      "Daily motivational pirate quotes"
    ]
  },
  {
    id: "FR-05",
    domain: "Productivity",
    title: "Campus Lost & Found Fleet Ledger",
    difficulty: "Level 1 (Freshers)",
    rouletteTier: 1,
    bounty: "฿30,000,000",
    problem: "Construct a digital lost and found board allowing university students to quickly report lost belongings, post discovered items with photos/locations, and connect safely with verified owners.",
    requirements: [
      "Filter tabs: 'Lost Items' vs 'Found Items'",
      "Item card with photo preview, date, and location pin",
      "Report Item submission form with verification details",
      "Status badge (Claimed / Pending / Investigating)"
    ],
    bonus: [
      "Filter by location / building zone",
      "Reward bounty tag display",
      "Instant contact / claim request modal",
      "Dark mode support"
    ]
  },
  {
    id: "FR-06",
    domain: "Education",
    title: "Peer-to-Peer Book & Resource Exchange",
    difficulty: "Level 1 (Freshers)",
    rouletteTier: 1,
    bounty: "฿38,000,000",
    problem: "Design a university textbook and study resource exchange marketplace where students can list used books for loan or sale, find study guides, and chat with fellow campus book-swappers.",
    requirements: [
      "Book showcase gallery with search by title/ISBN/course",
      "Listing creation modal with condition rating (New, Good, Fair)",
      "Borrow / Trade request interactive workflow",
      "Responsive navigation and sticky category filter"
    ],
    bonus: [
      "Department and semester filter tags",
      "User trust rating badge",
      "PDF preview modal for notes",
      "Favorite / bookmark wishlist"
    ]
  },
  {
    id: "FR-07",
    domain: "Gamification",
    title: "Flashcard Quest & Memory Battle",
    difficulty: "Level 1 (Freshers)",
    rouletteTier: 1,
    bounty: "฿42,000,000",
    problem: "Build an interactive flashcard learning app featuring card flipping 3D animations, spaced repetition ratings (Easy, Medium, Hard), and mastery progress tracking for exams.",
    requirements: [
      "3D flip flashcard with question on front, answer on back",
      "Deck selector and custom flashcard editor",
      "Spaced repetition scorekeeper",
      "Summary card showing accuracy and mastery streak"
    ],
    bonus: [
      "Sound effects on card flip and correct answer",
      "Timed speed-run quiz mode",
      "Dark mode styling",
      "Confetti burst on deck mastery"
    ]
  },
  {
    id: "FR-08",
    domain: "Productivity",
    title: "Minimalist Pomodoro Ship Timer",
    difficulty: "Level 1 (Freshers)",
    rouletteTier: 1,
    bounty: "฿32,000,000",
    problem: "Create an aesthetic Pomodoro focus station featuring custom work/break intervals, ambient audio soundscapes, session counters, and task checklist integration.",
    requirements: [
      "Circular progress countdown timer (25 min work / 5 min break)",
      "Start, Pause, Reset, and Skip controls",
      "Task list with checkboxes integrated with active session",
      "Session completion tally and statistics"
    ],
    bonus: [
      "Synthesized chime sound effect upon session complete",
      "Ocean waves / Rain background ambiance toggle",
      "Custom interval duration settings",
      "Keyboard spacebar start/pause shortcut"
    ]
  },

  // --- LEVEL 2: MEDIUM 2ND ROULETTE (2ND YEAR & ABOVE) ---
  {
    id: "FR-09",
    domain: "Healthcare",
    title: "Smart Hospital Queue & Doctor Roster",
    difficulty: "Level 2 (Medium)",
    rouletteTier: 2,
    bounty: "฿120,000,000",
    problem: "Design a healthcare management frontend that helps patients check live outpatient queue statuses, estimated waiting times, on-duty specialist doctors, and book instant outpatient tokens.",
    requirements: [
      "Real-time OPD queue status board with wait-time calculation",
      "Doctor profiles with specialty, availability, and cabin number",
      "Interactive appointment reservation stepper",
      "Live patient queue ticket generation with estimated consultation time"
    ],
    bonus: [
      "Emergency triage priority badge",
      "SMS/Den Den Mushi notification simulator",
      "Department floor-map visual indicator",
      "Accessibility high-contrast mode"
    ]
  },
  {
    id: "FR-10",
    domain: "Sustainability",
    title: "Food Waste Reduction & Baratie Redistribution",
    difficulty: "Level 2 (Medium)",
    rouletteTier: 2,
    bounty: "฿140,000,000",
    problem: "Engineer a community platform connecting restaurants, college dining halls, and supermarkets with local food banks and NGOs to salvage surplus fresh meals before spoilage.",
    requirements: [
      "Live surplus donation listings with expiration countdown timers",
      "Claim and pickup coordination workflow with verification codes",
      "Impact analytics dashboard (Meals Saved, CO2 Prevented)",
      "Interactive map / distance radius filter"
    ],
    bonus: [
      "Baratie Chef Sanji theme easter egg",
      "Push alert simulator for urgent meal expirations (<2 hrs)",
      "NGO volunteer assignment board",
      "Dark mode support"
    ]
  },
  {
    id: "FR-11",
    domain: "Smart City",
    title: "Smart Urban Transit & Ferry Command",
    difficulty: "Level 2 (Medium)",
    rouletteTier: 2,
    bounty: "฿160,000,000",
    problem: "Build an interactive municipal transit platform showing live bus/metro/ferry route schedules, crowd density meters per vehicle, transit line delays, and multi-modal route navigation.",
    requirements: [
      "Live transit line status matrix with delay badges",
      "Crowd density heat indicator (Low, Moderate, Full)",
      "Route planner computing transit time and transfers",
      "Interactive station arrival countdown board"
    ],
    bonus: [
      "Simulated real-time vehicle GPS movement on SVG map",
      "Service interruption alert banner",
      "Fare calculator and digital pass barcode",
      "Dark mode high-visibility UI"
    ]
  },
  {
    id: "FR-12",
    domain: "Disaster Management",
    title: "Island Disaster Warning & Evacuation Portal",
    difficulty: "Level 2 (Medium)",
    rouletteTier: 2,
    bounty: "฿175,000,000",
    problem: "Construct an emergency management portal providing instant early warnings for typhoons, floods, or earthquakes, alongside verified evacuation shelter capacities and emergency SOS beacons.",
    requirements: [
      "Severity-coded alert feed (Critical, Warning, Advisory)",
      "Evacuation shelter directory with live bed & supply capacity",
      "Emergency SOS beacon trigger with location coordinates",
      "Offline-ready survival guide and checklist modal"
    ],
    bonus: [
      "Audio siren alarm alert toggle",
      "Grand Line Sea King warning graphic",
      "Family check-in / 'I Am Safe' broadcast toggle",
      "Multilingual translation selector"
    ]
  },
  {
    id: "FR-13",
    domain: "FinTech",
    title: "Decentralized Escrow & Pirate Trade Exchange",
    difficulty: "Level 2 (Medium)",
    rouletteTier: 2,
    bounty: "฿180,000,000",
    problem: "Develop a peer-to-peer asset and escrow trading portal where buyers and sellers can lock funds into multi-signature contracts, inspect trade audits, and track dispute resolution milestones.",
    requirements: [
      "Active escrow contracts ledger with step-by-step state progress",
      "New trade proposal modal with asset valuation and collateral rules",
      "Dispute flag and jury arbitration preview",
      "Wallet balance overview and transaction history"
    ],
    bonus: [
      "Simulated Web3 wallet connect animation",
      "Multi-currency conversion (Beli, Gold, USD, ETH)",
      "Gas fee and transaction speed estimator",
      "Interactive security audit rating score"
    ]
  },
  {
    id: "FR-14",
    domain: "Agriculture",
    title: "Devil Fruit IoT Orchard & Soil Telemetry",
    difficulty: "Level 2 (Medium)",
    rouletteTier: 2,
    bounty: "฿150,000,000",
    problem: "Design an precision IoT agriculture dashboard for orchard managers monitoring soil moisture, ambient humidity, temperature, automated drip irrigation valves, and crop health indices.",
    requirements: [
      "Telemetry sensor gauges (Moisture, Temp, UV Index, pH Level)",
      "Automated irrigation valve toggle switches with schedules",
      "Zone-by-zone field status heat-map",
      "Weather forecast integration with rain prediction"
    ],
    bonus: [
      "Devil Fruit growth stage visual timeline",
      "Pest & disease early detection alert system",
      "Historic telemetry trend line charts",
      "Low moisture threshold automated warning banner"
    ]
  },
  {
    id: "FR-15",
    domain: "Cybersecurity",
    title: "Grand Line Bounty Hunter Breach Monitor",
    difficulty: "Level 2 (Medium)",
    rouletteTier: 2,
    bounty: "฿190,000,000",
    problem: "Build a security analyst console that inspects user access logs, detects suspicious login geolocations, enforces role-based access policies, and displays IP threat severity metrics.",
    requirements: [
      "Real-time authentication log feed with pass/fail indicators",
      "Suspicious anomaly flagger (brute-force, geo-velocity hops)",
      "User role and permission permission matrix editor",
      "Security health score dial (0 - 100%)"
    ],
    bonus: [
      "Interactive threat world map with origin pins",
      "One-click 'Quarantine User Account' security action",
      "Export CSV audit compliance report",
      "Dark hacker cyber aesthetic"
    ]
  },
  {
    id: "FR-16",
    domain: "Education",
    title: "Virtual Coding Dojo & Peer Code Review",
    difficulty: "Level 2 (Medium)",
    rouletteTier: 2,
    bounty: "฿165,000,000",
    problem: "Create an interactive peer programming platform where developers can submit pull requests, conduct inline code reviews with line commenting, and test solutions against automated test suites.",
    requirements: [
      "Code diff viewer comparing Before vs After lines",
      "Inline comment thread system on specific code lines",
      "Automated test case pass/fail execution panel",
      "Review approval workflow (Approve, Request Changes, Comment)"
    ],
    bonus: [
      "Syntax highlighting across multiple languages",
      "Leaderboard of top code reviewers",
      "Keyboard navigation shortcuts",
      "One-click code snippet formatter"
    ]
  },

  // --- LEVEL 3: HARD 2ND ROULETTE (2ND YEAR & ABOVE) ---
  {
    id: "FR-17",
    domain: "AI/ML",
    title: "AI-Powered Career Navigator & Resume Telemetry",
    difficulty: "Level 3 (Hard)",
    rouletteTier: 2,
    bounty: "฿450,000,000",
    problem: "Engineer a next-generation AI career assistant interface that analyzes user resumes against job descriptions, identifies skill gaps, generates targeted interview questions, and creates customized learning roadmaps.",
    requirements: [
      "Resume drag-and-drop parser with parsed skills breakdown",
      "Job description semantic matching score with Venn diagram",
      "Interactive personalized learning skill tree with prerequisites",
      "AI Mock Interview simulator with real-time feedback cards"
    ],
    bonus: [
      "Salary benchmark visual distribution chart",
      "Simulated AI streaming response typewriter animation",
      "One-click ATS optimization checklist",
      "Dark executive glassmorphic interface"
    ]
  },
  {
    id: "FR-18",
    domain: "Cybersecurity",
    title: "Global Cyber Threat Command Center",
    difficulty: "Level 3 (Hard)",
    rouletteTier: 2,
    bounty: "฿500,000,000",
    problem: "Develop a high-intensity Security Operations Center (SOC) dashboard tracking live DDoS attacks, zero-day CVE vulnerability alerts, honeypot telemetry, and incident containment playbooks.",
    requirements: [
      "Real-time animated global threat vector map",
      "Live attack classification stream (DDoS, SQLi, Ransomware)",
      "Incident incident response playbook stepper with containment actions",
      "Telemetry telemetry timeline with packet volume spikes"
    ],
    bonus: [
      "Audio alert sound on Critical Severity zero-day breach",
      "Dr. Vegapunk Cyber Defense HUD styling",
      "Filtering by attack protocol (TCP, UDP, ICMP)",
      "Full keyboard hotkey incident escalation triggers"
    ]
  },
  {
    id: "FR-19",
    domain: "Smart City",
    title: "Smart Megacity Emergency Dispatch & Command",
    difficulty: "Level 3 (Hard)",
    rouletteTier: 2,
    bounty: "฿480,000,000",
    problem: "Architect a centralized metropolitan crisis command center coordinating police, fire, medical ambulances, and utility drones during complex urban emergencies.",
    requirements: [
      "Multi-agency incident dispatcher (911/112 live incoming calls)",
      "Fleet unit tracker with status (En Route, On Scene, Available)",
      "Hospital ICU bed and trauma center capacity matrix",
      "Interactive incident timeline with automated triage tagging"
    ],
    bonus: [
      "Estimated time of arrival (ETA) route computation algorithm",
      "Disaster perimeter geofence drawer on map",
      "Radio transmission simulator with audio waveforms",
      "Night operation high-contrast color scheme"
    ]
  },
  {
    id: "FR-20",
    domain: "Disaster Management",
    title: "Multi-Island Rescue Coordination Platform",
    difficulty: "Level 3 (Hard)",
    rouletteTier: 2,
    bounty: "฿520,000,000",
    problem: "Create a humanitarian logistics command platform for orchestrating disaster relief across scattered archipelago islands, tracking helicopter airlifts, cargo barge supplies, and medical volunteer deployments.",
    requirements: [
      "Archipelago island inventory matrix (Water, MREs, Generators)",
      "Supply flight & barge dispatch scheduling board",
      "Volunteer skillset deployment roster with verification",
      "Satellite damage report assessment with photo comparison"
    ],
    bonus: [
      "Weather storm trajectory overlay on archipelago chart",
      "Emergency beacon triangulation tracker",
      "Low supply automated reorder trigger",
      "Gol D. Roger rescue armada easter egg"
    ]
  },
  {
    id: "FR-21",
    domain: "AI/ML",
    title: "Autonomous Logistics Fleet & Drone Dispatch",
    difficulty: "Level 3 (Hard)",
    rouletteTier: 2,
    bounty: "฿460,000,000",
    problem: "Build an autonomous fleet operations portal managing autonomous delivery drones and self-driving freight trucks, monitoring battery health, optimal trajectory planning, and remote manual takeover.",
    requirements: [
      "Live drone & truck telemetry dashboard (Speed, Battery, Payload)",
      "Real-time waypoint trajectory optimizer with obstacle avoidance flags",
      "Emergency remote pilot override interface with HUD controls",
      "Delivery SLA adherence and throughput performance charts"
    ],
    bonus: [
      "Virtual joystick HUD for manual drone pilot takeover",
      "Weather wind shear warning indicator",
      "Payload temperature control monitor for vaccines/medicine",
      "High-tech futuristic dark interface"
    ]
  },
  {
    id: "FR-22",
    domain: "Gamification",
    title: "Grand Line Multiplayer Code Arena & Boss Battle",
    difficulty: "Level 3 (Hard)",
    rouletteTier: 2,
    bounty: "฿470,000,000",
    problem: "Construct an adrenaline-fueled live competitive coding arena where developer pirates face off in timed code duels against algorithmic bosses (Kaido, Big Mom) with live damage calculations.",
    requirements: [
      "Split-screen live code editor and test suite runner",
      "Boss HP bar that drains as unit tests pass",
      "Opponent battle progress meter showing execution speed",
      "Special power-up triggers (Haki Focus, Gear Second Time Boost)"
    ],
    bonus: [
      "Animated battle effects when tests succeed",
      "Dynamic sound effects (sword slash, cannon fire)",
      "Leaderboard ranking by Beli bounty",
      "Live chat / emote wheel for spectators"
    ]
  },
  {
    id: "FR-23",
    domain: "Sustainability",
    title: "Decentralized Carbon Credit & Green Grid Market",
    difficulty: "Level 3 (Hard)",
    rouletteTier: 2,
    bounty: "฿440,000,000",
    problem: "Engineer a high-frequency carbon credit exchange and smart grid energy trading dashboard where renewable solar/wind micro-generators can sell surplus watt-hours directly to neighboring facilities.",
    requirements: [
      "Live candlestick market chart of Carbon Credit and kWh spot prices",
      "Order book with live bids and asks",
      "Smart microgrid energy flow telemetry (Solar, Wind, Battery Storage)",
      "Certified carbon offset issuance and retirement ledger"
    ],
    bonus: [
      "Interactive energy trading order placement modal",
      "Facility sustainability ESG rating card",
      "Real-time CO2 emissions avoided ticker",
      "Custom dark/emerald green aesthetic"
    ]
  },
  {
    id: "FR-24",
    domain: "Productivity",
    title: "Collaborative Whiteboard & Spatial Architecture Canvas",
    difficulty: "Level 3 (Hard)",
    rouletteTier: 2,
    bounty: "฿490,000,000",
    problem: "Develop a high-performance infinite digital canvas for engineering teams to diagram complex system architectures, drop interactive component blocks, wire data flow arrows, and export blueprints.",
    requirements: [
      "Infinite zoomable/pannable vector canvas",
      "Draggable architecture blocks (Microservice, DB, Cache, API Gateway)",
      "Connecting lines with dynamic snap-to-port routing",
      "Architecture metadata panel showing latency and failure point analysis"
    ],
    bonus: [
      "Simulated multi-cursor live collaborator indicators",
      "Export to SVG, PNG, and JSON schema",
      "Pre-built architecture templates (E-commerce, FinTech, Streaming)",
      "Dark blueprint grid styling"
    ]
  }
];
