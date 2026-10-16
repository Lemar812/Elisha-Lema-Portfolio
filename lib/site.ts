// Set SITE_URL to the real public origin before deployment. No guessed production domain.
export const siteUrl = new URL(process.env.SITE_URL || "https://elishalema.netlify.app").origin;
export const brand = { name: "Elisha Creatives", description: "Graphic design and web development by Elisha Lema in Tanzania. Explore logos, promotional design, and websites for businesses." };
