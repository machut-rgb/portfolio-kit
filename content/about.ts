import type { AboutContent, Stat } from "@/lib/content/types";

export const about: AboutContent = {
  paragraphs: [
    {
      en: "I'm a cybersecurity engineer and full-stack developer with a Master II from ENI Fianarantsoa, Madagascar.",
      fr: "Je suis ingénieur en cybersécurité et développeur full-stack, diplômé d'un Master II de l'ENI Fianarantsoa, Madagascar.",
      mg: "Injeniera cybersécurité sy mpamorona full-stack aho, nahazo Master II tao amin'ny ENI Fianarantsoa, Madagasikara.",
    },
    {
      en: "The work sits across two disciplines: hardening infrastructure, architecting Zero Trust networks and running SOC operations on one side; shipping web and mobile applications on the other.",
      fr: "Mon travail couvre deux disciplines : durcir l'infrastructure, architecturer des réseaux Zero Trust et opérer un SOC d'un côté ; livrer des applications web et mobiles de l'autre.",
      mg: "Sehatra roa no iasako: manamafy ny fotodrafitrasa, manangana tambajotra Zero Trust ary mitantana SOC; ary koa mamorona rindrambaiko web sy mobile.",
    },
    {
      en: "I've trained deep learning models, deployed VoIP systems, built a web mapping platform, and shipped Android apps to production.",
      fr: "J'ai entraîné des modèles de deep learning, déployé des systèmes VoIP, construit une plateforme de webmapping et livré des applications Android en production.",
      mg: "Efa nampiofana modely deep learning aho, nametraka rafitra VoIP, nanangana sehatra webmapping ary namoaka rindrambaiko Android.",
    },
  ],
  quote: {
    en: "A system you cannot observe is a system you cannot defend.",
    fr: "Un système qu'on ne peut pas observer est un système qu'on ne peut pas défendre.",
    mg: "Ny rafitra tsy azo jerena dia rafitra tsy azo arovana.",
  },
};

export const stats: Stat[] = [
  {
    id: "internships",
    value: "3",
    label: { en: "Internships completed", fr: "Stages effectués", mg: "Fanofanana vita" },
  },
  {
    id: "projects",
    value: "8+",
    label: { en: "Personal projects", fr: "Projets personnels", mg: "Tetikasa manokana" },
  },
  {
    id: "degree",
    value: "M.Sc.",
    label: { en: "Cybersecurity, ENI", fr: "Cybersécurité, ENI", mg: "Cybersécurité, ENI" },
  },
  {
    id: "badges",
    value: "4",
    label: { en: "Google Cloud badges", fr: "Badges Google Cloud", mg: "Badge Google Cloud" },
  },
];
