export const featuredWorkIds = ["work-1", "work-9", "work-19"];
export interface ProjectStory {
  context: string;
  focus: string;
  decisions: string[];
  deliverables: string[];
  relatedIds?: string[];
  result?: string;
}
export const projectStories: Record<string, ProjectStory> = {
  "work-1": {
    context: "A visual identity for Kili Expeditions, a travel and expedition brand.",
    focus: "Making the expedition theme clear in a compact, single-color mark.",
    decisions: ["A mountain silhouette and a hiker establish the outdoor setting.", "Bold lettering gives the business name a clear place beneath the symbol.", "The handwritten tagline adds a contrasting, personal detail to the black-and-white composition."],
    deliverables: ["Logo artwork", "Symbol, business name, and tagline lockup"],
  },
  "work-9": {
    context: "Promotional design for A&B Accessories, presented alongside the matching brochure panels.",
    focus: "Organizing a varied product range, prices, and contact information within one promotional layout.",
    decisions: ["Product images and price labels create a repeated structure for browsing the range.", "Yellow and blue accents connect the product sections with the business identity.", "The closing contact area gives the viewer a next step after exploring the products."],
    deliverables: ["Product poster", "Brochure front panel", "Brochure back panel"],
    relatedIds: ["work-8", "work-7"],
  },
  "work-19": {
    context: "A website project for NatureWiseTours, bringing a tourism brand into a digital browsing experience.",
    focus: "Presenting travel imagery and tour information within a consistent website.",
    decisions: ["Destination photography establishes the travel setting.", "Dark green and warm gold accents connect the page sections.", "The live website lets visitors explore beyond the portfolio screenshot."],
    deliverables: ["Website design and development", "Live website"],
  },
};
