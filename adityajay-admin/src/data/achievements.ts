export type Achievement = {
  id: string;
  year: string;
  title: string;
  body: string;
  seal: string;
  icon: "credential" | "award" | "contributor";
};

export const achievements: Achievement[] = [
  {
    id: "c1",
    year: "2024",
    title: "Press Credential",
    body: "Accredited by the Press Council Nepal, granting field access to public bodies, parliamentary proceedings, and restricted civic events.",
    seal: "Press Council Nepal",
    icon: "credential",
  },
  {
    id: "c2",
    year: "2023",
    title: "Excellence in Investigative Reporting",
    body: "National Journalism Award recognizing the Kathmandu land-deal investigation and a body of work holding public officials to account.",
    seal: "National Journalism Award",
    icon: "award",
  },
  {
    id: "c3",
    year: "2022",
    title: "Recognized Contributor",
    body: "Cited contributor to the Nepali Republic Daily for sustained coverage of provincial budgets and post-flood reconstruction efforts.",
    seal: "Nepali Republic Daily",
    icon: "contributor",
  },
];
