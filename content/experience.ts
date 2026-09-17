import type { EducationItem, ExperienceItem } from "@/lib/content/types";

export const experience: ExperienceItem[] = [
  {
    id: "uprim",
    role: { en: "Cybersecurity Engineer", fr: "Ingénieur Cybersécurité", mg: "Injeniera Cybersécurité" },
    org: "UPRIM",
    location: "Antananarivo, Madagascar",
    start: "2025-06",
    end: "2025-10",
    bullets: [
      {
        en: "Designed and deployed a Zero Trust Network Access architecture on PfSense and FreeRADIUS with full network segmentation.",
        fr: "Conception et déploiement d'une architecture Zero Trust Network Access sur PfSense et FreeRADIUS avec segmentation réseau complète.",
        mg: "Nanangana sy nametraka rafitra Zero Trust Network Access tamin'ny PfSense sy FreeRADIUS miaraka amin'ny fizarazarana tambajotra feno.",
      },
      {
        en: "Built an end-to-end SOC: Wazuh SIEM/XDR, Snort IDS, and incident automation through SOAR/Shuffle.",
        fr: "Mise en place d'un SOC complet : Wazuh SIEM/XDR, Snort IDS et automatisation des incidents via SOAR/Shuffle.",
        mg: "Nanamboatra SOC feno: Wazuh SIEM/XDR, Snort IDS, ary fanaovana otomatika ny incident amin'ny SOAR/Shuffle.",
      },
      {
        en: "Wrote the technical documentation, security procedures, and operational runbooks the team runs on.",
        fr: "Rédaction de la documentation technique, des procédures de sécurité et des runbooks opérationnels utilisés par l'équipe.",
        mg: "Nanoratra ny antontan-taratasy ara-teknika, ny fomba fiarovana ary ny runbook ampiasain'ny ekipa.",
      },
    ],
    stack: ["PfSense", "FreeRADIUS", "Wazuh", "Snort", "Shuffle", "Proxmox"],
  },
  {
    id: "arato",
    role: { en: "AI Developer", fr: "Développeur IA", mg: "Mpamorona IA" },
    org: "ARATO",
    location: "Fianarantsoa, Madagascar",
    start: "2023-09",
    end: "2023-11",
    bullets: [
      {
        en: "Designed and trained a deep learning module that translates websites automatically.",
        fr: "Conception et entraînement d'un module de deep learning traduisant automatiquement des sites web.",
        mg: "Nanangana sy nampiofana modely deep learning mandika tranonkala ho azy.",
      },
      {
        en: "Measured translation quality with BLEU and shipped the model into the production web pipeline.",
        fr: "Évaluation de la qualité par score BLEU et mise en production dans le pipeline web.",
        mg: "Nandrefy ny kalitao tamin'ny BLEU ary nametraka ny modely tao amin'ny pipeline web.",
      },
    ],
    stack: ["Python", "PyTorch", "BLEU", "Docker"],
  },
  {
    id: "univ-fianarantsoa",
    role: {
      en: "Systems & Network Administrator",
      fr: "Administrateur Systèmes & Réseaux",
      mg: "Mpitantana Rafitra & Tambajotra",
    },
    org: "University of Fianarantsoa",
    location: "Fianarantsoa, Madagascar",
    start: "2022-09",
    end: "2022-12",
    bullets: [
      {
        en: "Deployed a full VoIP infrastructure on Asterisk and Ubuntu: SIP trunks, dialplan, end-to-end testing.",
        fr: "Déploiement d'une infrastructure VoIP complète sur Asterisk et Ubuntu : trunks SIP, dialplan, tests de bout en bout.",
        mg: "Nametraka fotodrafitrasa VoIP feno tamin'ny Asterisk sy Ubuntu: SIP, dialplan, fitsapana feno.",
      },
    ],
    stack: ["Asterisk", "SIP", "Ubuntu", "Wireshark"],
  },
];

export const education: EducationItem[] = [
  {
    id: "eni-master",
    degree: {
      en: "Master II, Computer Science — Cybersecurity",
      fr: "Master II Informatique — Cybersécurité",
      mg: "Master II Informatique — Cybersécurité",
    },
    school: "ENI Fianarantsoa",
    location: "Fianarantsoa, Madagascar",
    start: "2022",
    end: "2024",
    note: {
      en: "Professional track, cybersecurity specialisation.",
      fr: "Parcours professionnel, spécialisation cybersécurité.",
      mg: "Lalana matihanina, manokana amin'ny cybersécurité.",
    },
  },
];
