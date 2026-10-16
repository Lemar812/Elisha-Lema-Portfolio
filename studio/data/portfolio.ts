import { identity, contactLinks } from "./aboutMe";
import { techStack } from "@/data/skills";
const portfolio = {
  personalInfo: {
    ...identity,
    email: contactLinks.email,
    phone: "+255 674 175 613",
    github: contactLinks.github,
  },
  skills: {
    categories: [
      {
        name: "Design & development",
        skills: techStack.map((name) => ({ name })),
      },
    ],
  },
};

export default portfolio;
