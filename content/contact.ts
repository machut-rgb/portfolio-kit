import type { ContactChannel, SocialLink } from "@/lib/content/types";

export const social: SocialLink[] = [
  { id: "gitlab", label: "GitLab", href: "https://gitlab.com/emachut", icon: "git", handle: "emachut" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
  { id: "email", label: "Email", href: "mailto:contact@example.com", icon: "mail" },
];

export const contact = {
  heading: {
    en: "Open to new work",
    fr: "Ouvert aux nouvelles missions",
    mg: "Vonona amin'ny asa vaovao",
  },
  body: {
    en: "A role, a project, or a question about something on this site — all fine. I read everything and reply within a day or two.",
    fr: "Un poste, un projet ou une question sur ce site — tout est bienvenu. Je lis tout et je réponds sous un ou deux jours.",
    mg: "Asa, tetikasa, na fanontaniana momba ity tranonkala ity — tongasoa. Vakiako daholo ary mamaly ao anatin'ny andro iray na roa aho.",
  },
  channels: [
    {
      id: "location",
      icon: "pin",
      label: { en: "Based in", fr: "Basé à", mg: "Monina any" },
      value: { en: "Antananarivo, Madagascar", fr: "Antananarivo, Madagascar", mg: "Antananarivo, Madagasikara" },
    },
    {
      id: "code",
      icon: "git",
      label: { en: "Code", fr: "Code", mg: "Kaody" },
      value: "gitlab.com/emachut",
      href: "https://gitlab.com/emachut",
    },
    {
      id: "availability",
      icon: "check",
      label: { en: "Availability", fr: "Disponibilité", mg: "Fahavitrihana" },
      value: { en: "Immediate", fr: "Immédiate", mg: "Avy hatrany" },
    },
  ] satisfies ContactChannel[],
};
