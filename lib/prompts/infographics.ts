export type InfographicPrompt = {
  id: string;
  category: "Chart" | "Slide" | "Map" | "Diagram";
  title: string;
  prompt: string;
};

export const INFOGRAPHIC_PROMPTS: InfographicPrompt[] = [
  {
    id: "bar-chart",
    category: "Chart",
    title: "Bar chart — top 5 EU economies by 2025 GDP",
    prompt:
      "A clean editorial-style bar chart titled 'Top 5 EU economies by nominal GDP, 2025'. Horizontal bars, each labelled with the country name and its GDP value in trillions of USD. Use plausible figures consistent with public 2025 estimates. Include a small source footnote. Light background, single accent colour, modern sans-serif, tight numeric labels.",
  },
  {
    id: "org-chart",
    category: "Diagram",
    title: "Org chart — classic three-tier",
    prompt:
      "A minimalist org chart for a fictional 40-person design consultancy called 'Northline'. Top: 'Founder & CEO — Alex Ruiz'. Second tier: 'Head of Design — Priya Shah', 'Head of Engineering — Tomás Lagos', 'Head of Operations — Clara Dupont'. Third tier: three or four direct reports under each. Rounded rectangles, hairline connectors, soft grey palette.",
  },
  {
    id: "slide",
    category: "Slide",
    title: "Pitch-deck slide — Q3 Results",
    prompt:
      "A single pitch-deck slide, 16:9, titled 'Q3 — The quarter we broke out'. Three column layout, each with an icon, a large headline number, and a one-line subtitle: '+42% revenue growth — quarter over quarter', '17 new enterprise logos — up from 6 in Q2', 'NPS 71 — best result in company history'. Bottom-right page number '04 / 18'. Clean corporate design, muted navy + coral palette.",
  },
  {
    id: "map",
    category: "Map",
    title: "Map — European tech hubs",
    prompt:
      "A stylised outline map of Europe with labelled dots for major tech hubs: London, Dublin, Amsterdam, Berlin, Munich, Paris, Zurich, Stockholm, Helsinki, Madrid, Barcelona, Lisbon, Milan, Warsaw, Tallinn. Land in warm beige, water in soft teal. Dot sizes proportional to rough 2024 venture funding (use plausible figures). Title: 'Europe's tech hubs — funding by city, 2024'. Legend bottom-left.",
  },
  {
    id: "flow",
    category: "Diagram",
    title: "Flow diagram — customer onboarding",
    prompt:
      "A left-to-right flow diagram titled 'Customer onboarding — first 14 days'. Five stages with icons: 'Day 0 — Sign-up', 'Day 1 — Welcome email', 'Day 3 — First workspace created', 'Day 7 — Invite teammates', 'Day 14 — First paid upgrade'. Each stage has a one-line metric beneath. Soft pastel palette, rounded corners, tidy sans-serif.",
  },
  {
    id: "comparison-table",
    category: "Chart",
    title: "Comparison table — plan tiers",
    prompt:
      "A pricing comparison table for a fictional product 'Atlas'. Three columns: Starter €19, Growth €49, Enterprise 'Contact us'. Seven rows of features with check marks or dashes: 'Up to 5 seats', 'Up to 25 seats', 'Unlimited seats', 'Community support', 'Priority email support', 'Dedicated CSM', 'SSO & audit logs'. Clean hairline rules, bold header row, one accent colour for the recommended tier.",
  },
];
