export interface Skill {
  name: string;
  percentage: number;
  category: "design" | "development";
}

export const skills: Skill[] = [
  { name: "TailwindCSS", percentage: 93, category: "development" },
  { name: "Adobe Photoshop", percentage: 92, category: "design" },
  { name: "Canva", percentage: 90, category: "design" },
  { name: "Adobe Illustrator", percentage: 88, category: "design" },
  { name: "React", percentage: 85, category: "development" },
  { name: "Node.js", percentage: 82, category: "development" },
];

export const techStack = [
  "React", "TypeScript", "TailwindCSS", "Framer Motion",
  "Node.js", "Adobe Illustrator", "Adobe Photoshop", "Canva", "Brand Identity"
];
