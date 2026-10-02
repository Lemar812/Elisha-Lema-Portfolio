export type WorkCategory = "Logo" | "Poster/Banner" | "Website";

export interface Work {
  id: string;
  title: string;
  category: WorkCategory;
  imageSrc: string;
  description: string;
  tags: string[];
  websiteUrl?: string;
}

export const works: Work[] = [
  { id: "work-1", title: "Kili Expeditions", category: "Logo", imageSrc: "/works/Logos/Kili Expeditions.jpg", description: "Logo design for Kili Expeditions, part of my travel and tourism identity portfolio.", tags: ["Logo", "Brand", "Identity"] },
  { id: "work-2", title: "Macha Stores", category: "Logo", imageSrc: "/works/Logos/Macha Stores.jpg", description: "A logo for Macha Stores, developed as a recognizable mark for the business.", tags: ["Logo", "Brand", "Identity"] },
  { id: "work-3", title: "Mountain Expeditions", category: "Logo", imageSrc: "/works/Logos/Mountain Expeditions.jpg", description: "Logo artwork for Mountain Expeditions, exploring a visual identity for a travel brand.", tags: ["Logo", "Brand", "Identity"] },
  { id: "work-4", title: "Mtumba Classic", category: "Logo", imageSrc: "/works/Logos/Mtumba Classic.jpg", description: "A brand mark for Mtumba Classic, presented here as a standalone logo design.", tags: ["Logo", "Brand", "Identity"] },
  { id: "work-5", title: "RestoPulse", category: "Logo", imageSrc: "/works/Logos/RestoPulse Logo.png", description: "The RestoPulse logo, a visual identity project from my design portfolio.", tags: ["Logo", "Brand", "Identity"] },
  { id: "work-6", title: "TANGAZENI INJILI CHOIR", category: "Logo", imageSrc: "/works/Logos/TANGAZENI INJILI CHOIR .jpg", description: "Logo design for Tangazeni Injili Choir, giving the group a consistent visual identifier.", tags: ["Logo", "Brand", "Identity"] },
  { id: "work-20", title: "Our Destiny", category: "Logo", imageSrc: "/works/Logos/Our Destiny.png", description: "The Our Destiny logo, created to represent the organization through a distinct visual mark.", tags: ["Logo", "Identity", "Brand"] },
  { id: "work-7", title: "A&B Accessories Brochure — Back", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/A and B Accessories Bronchure BP.jpg", description: "The back panel of an A&B Accessories brochure, part of a coordinated set of promotional materials.", tags: ["Poster", "Promo", "Design"] },
  { id: "work-8", title: "A&B Accessories Brochure — Front", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/A and B Accessories Bronchure FP.jpg", description: "The front panel of an A&B Accessories brochure, designed alongside the matching back panel.", tags: ["Poster", "Promo", "Design"] },
  { id: "work-9", title: "A&B Accessories Poster", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/A and B Accessories Poster.jpg", description: "Promotional poster artwork for A&B Accessories, extending the business’s visual presentation.", tags: ["Poster", "Promo", "Design"] },
  { id: "work-10", title: "Angiee's Hair Saloon", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/Angiees Hair Saloon.jpg", description: "Promotional design for Angiee’s Hair Saloon, created for the salon’s business communication.", tags: ["Poster", "Promo", "Design"] },
  { id: "work-11", title: "Digital Networking Poster", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/Digital Networking Poster.jpg", description: "A Digital Networking event poster, bringing the event’s information into one promotional layout.", tags: ["Poster", "Promo", "Design"] },
  { id: "work-12", title: "Food Poster", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/Food Poster.jpg", description: "Food promotional artwork from my commercial graphic design portfolio.", tags: ["Poster", "Promo", "Design"] },
  { id: "work-13", title: "Hilda Wakala Banner", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/Hilda Wakala Banner.jpg", description: "A business banner for Hilda Wakala, designed as a larger-format promotional asset.", tags: ["Poster", "Promo", "Design"] },
  { id: "work-14", title: "Serval Wildlife Poster", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/Serval Wildlife Poster.jpg", description: "Travel promotional artwork featuring Serval Wildlife.", tags: ["Poster", "Promo", "Design"] },
  { id: "work-15", title: "Social Night Poster", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/Social Night Poster.jpg", description: "A Social Night event poster, combining the event identity and promotional information.", tags: ["Poster", "Promo", "Design"] },
  { id: "work-16", title: "TIC New Year Poster", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/TIC New Year Poster.jpg", description: "New Year greeting artwork for Tangazeni Injili Choir.", tags: ["Poster", "Promo", "Design"] },
  { id: "work-17", title: "TIC Youtube Thumbnail", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/TIC Youtube Thumbnail.jpg", description: "A YouTube thumbnail for Tangazeni Injili Choir, designed for its video presentation.", tags: ["Poster", "Promo", "Design"] },
  { id: "work-18", title: "Usaili 2024", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/Usaili 2024.jpg", description: "Usaili 2024 announcement artwork, designed to communicate the event in a single poster.", tags: ["Poster", "Promo", "Design"] },
  { id: "work-21", title: "Lemosho Poster", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/Lemosho Poster.jpg", description: "A travel poster featuring Lemosho, part of my tourism promotional design work.", tags: ["Poster", "Travel", "Promo"] },
  { id: "work-22", title: "Tanzania & Zanzibar", category: "Poster/Banner", imageSrc: "/works/Posters and Banners/Tanzania and Zanzibar Poster.jpg", description: "Destination promotional artwork featuring Tanzania and Zanzibar.", tags: ["Poster", "Travel", "Campaign"] },
  { id: "work-19", title: "NatureWiseTours", category: "Website", imageSrc: "/works/Websites Screenshots/NatureWiseTours.jpg", description: "A preview of the NatureWiseTours website. Open the live site to explore the complete web experience.", tags: ["Web", "UI", "Design"], websiteUrl: "https://naturewisetours.netlify.app" },
];
