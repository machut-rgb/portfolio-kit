import type { Profile } from "@/lib/content/types";

export const profile: Profile = {
  firstName: "Machut",
  lastName: "Eliandraza",
  handle: "~/machut.dev",
  headline: {
    en: "I secure infrastructure and build the software that runs on it.",
    fr: "Je sécurise des infrastructures et je développe les applications qui tournent dessus.",
    mg: "Miaro fotodrafitrasa aho ary manamboatra ny rindrambaiko mandeha ao anatiny.",
  },
  roles: [
    { en: "Cybersecurity Engineer", fr: "Ingénieur Cybersécurité", mg: "Injeniera Cybersécurité" },
    { en: "Systems & Network Admin", fr: "Admin Systèmes & Réseaux", mg: "Admin Rafitra & Tambajotra" },
    { en: "Full-Stack Developer", fr: "Développeur Full-Stack", mg: "Mpamorona Full-Stack" },
    { en: "AI Developer", fr: "Développeur IA", mg: "Mpamorona IA" },
  ],
  summary: {
    en: "Master II in Computer Science from ENI Fianarantsoa. I build secure infrastructures, deploy SOC pipelines, and develop intelligent applications — based in Antananarivo, open to local and international work.",
    fr: "Master II en Informatique à l'ENI Fianarantsoa. Je conçois des infrastructures sécurisées, déploie des pipelines SOC et développe des applications intelligentes — basé à Antananarivo, ouvert aux missions locales et internationales.",
    mg: "Master II amin'ny Informatique avy amin'ny ENI Fianarantsoa. Manamboatra fotodrafitrasa voaro aho, mametraka pipeline SOC ary mamorona rindrambaiko manan-tsaina — monina any Antananarivo, vonona amin'ny asa eto an-toerana sy any ivelany.",
  },
  availability: {
    en: "Available for work",
    fr: "Disponible pour de nouvelles missions",
    mg: "Vonona handray asa",
  },
  location: {
    en: "Antananarivo, Madagascar",
    fr: "Antananarivo, Madagascar",
    mg: "Antananarivo, Madagasikara",
  },
  email: "contact@example.com",
  photo: {
    src: "/images/profile.png",
    alt: { en: "Machut Eliandraza", fr: "Machut Eliandraza", mg: "Machut Eliandraza" },
    width: 520,
    height: 600,
  },
  resume: "/resume",
};
