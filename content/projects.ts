import type { Project } from "@/lib/content/types";

/**
 * Order here is the order on the page unless a section variant sorts it.
 * `featured: true` promotes a project to the home page grid; every project
 * gets its own detail route at /[locale]/projects/[slug].
 */
export const projects: Project[] = [
  {
    slug: "soc-home-lab",
    name: "SOC Home Lab",
    category: { en: "Infrastructure & security", fr: "Infrastructure & sécurité", mg: "Fotodrafitrasa & fiarovana" },
    summary: {
      en: "A full detection-to-response pipeline in a virtualised environment: SIEM, IDS and SOAR automation, built from scratch.",
      fr: "Pipeline complet de la détection à la réponse dans un environnement virtualisé : SIEM, IDS et automatisation SOAR, construit de zéro.",
      mg: "Pipeline feno hatramin'ny fahitana ka hatramin'ny valiny ao amin'ny tontolo virtoaly: SIEM, IDS ary SOAR, naorina hatrany am-boalohany.",
    },
    body: [
      {
        en: "Three Proxmox nodes host the lab: a Wazuh manager, a Snort sensor on a mirrored port, and a Shuffle instance that reacts to alerts. Agents run on Windows and Ubuntu endpoints so detections can be tested against real telemetry rather than replayed logs.",
        fr: "Trois nœuds Proxmox hébergent le lab : un manager Wazuh, une sonde Snort sur un port miroir et une instance Shuffle qui réagit aux alertes. Des agents tournent sur des postes Windows et Ubuntu pour tester les détections sur de la vraie télémétrie plutôt que sur des logs rejoués.",
        mg: "Node Proxmox telo no mitazona ny lab: manager Wazuh, sensor Snort amin'ny port mirror, ary Shuffle mamaly ny alerte. Misy agent amin'ny Windows sy Ubuntu mba hitsapana ny detection amin'ny angona tena izy.",
      },
      {
        en: "Playbooks cover the boring-but-critical cases: brute force on SSH, suspicious PowerShell, and unexpected outbound DNS volume. Each one enriches the alert, opens a ticket, and — for a small set of high-confidence rules — isolates the host.",
        fr: "Les playbooks couvrent les cas ennuyeux mais critiques : brute force SSH, PowerShell suspect, volume DNS sortant anormal. Chacun enrichit l'alerte, ouvre un ticket et, pour quelques règles à forte confiance, isole la machine.",
        mg: "Ny playbook dia mandrakotra ny tranga manan-danja: brute force SSH, PowerShell mampiahiahy, ary DNS mivoaka be loatra. Manampy fanazavana izy, manokatra ticket, ary manasaraka ny host raha azo antoka ny fitsipika.",
      },
    ],
    highlights: [
      { en: "Detection rules mapped to MITRE ATT&CK techniques", fr: "Règles de détection alignées sur MITRE ATT&CK", mg: "Fitsipika detection mifanaraka amin'ny MITRE ATT&CK" },
      { en: "Automated triage cuts manual work on repeat alerts", fr: "Le triage automatisé réduit le travail manuel sur les alertes répétitives", mg: "Ny triage otomatika mampihena ny asa an-tanana" },
      { en: "Runbooks written so a second analyst can pick it up", fr: "Runbooks rédigés pour qu'un second analyste puisse reprendre", mg: "Runbook voasoratra mba hahafahan'ny analyste hafa manohy" },
    ],
    year: 2025,
    tags: ["Wazuh", "Snort", "Shuffle", "Proxmox", "MITRE ATT&CK"],
    featured: true,
    status: "live",
  },
  {
    slug: "zero-trust-lab",
    name: "Zero Trust Lab",
    category: { en: "Infrastructure & security", fr: "Infrastructure & sécurité", mg: "Fotodrafitrasa & fiarovana" },
    summary: {
      en: "Multi-VM deployment with VLAN segmentation, firewall hardening and an explicit network security policy.",
      fr: "Déploiement multi-VM avec segmentation VLAN, durcissement du pare-feu et politique de sécurité réseau explicite.",
      mg: "Fametrahana VM maro miaraka amin'ny fizarazarana VLAN, fanamafisana firewall ary politika fiarovana mazava.",
    },
    body: [
      {
        en: "Every device authenticates to FreeRADIUS before it gets an address, and PfSense rules are written deny-by-default per VLAN. The interesting part was not the tooling but the policy: deciding what each segment is actually allowed to reach, and writing it down.",
        fr: "Chaque équipement s'authentifie auprès de FreeRADIUS avant d'obtenir une adresse, et les règles PfSense sont écrites en deny-by-default par VLAN. L'intérêt n'était pas l'outillage mais la politique : décider ce que chaque segment a le droit d'atteindre, et l'écrire.",
        mg: "Ny fitaovana rehetra dia manamarina amin'ny FreeRADIUS alohan'ny hahazoany adiresy, ary deny-by-default ny fitsipika PfSense isaky ny VLAN. Ny politika no sarotra, tsy ny fitaovana.",
      },
    ],
    year: 2025,
    tags: ["PfSense", "FreeRADIUS", "VLAN", "Proxmox"],
    featured: true,
    status: "live",
  },
  {
    slug: "job-board-app",
    name: "Job Board App",
    category: { en: "Mobile & full-stack", fr: "Mobile & full-stack", mg: "Mobile & full-stack" },
    summary: {
      en: "Android app for job listings and user management. React Native front end on a Laravel API.",
      fr: "Application Android d'offres d'emploi et de gestion des utilisateurs. Front React Native sur une API Laravel.",
      mg: "Rindrambaiko Android ho an'ny asa sy fitantanana mpampiasa. React Native amin'ny API Laravel.",
    },
    year: 2024,
    tags: ["React Native", "Laravel", "Android", "MySQL"],
    featured: true,
    status: "live",
  },
  {
    slug: "website-auto-translator",
    name: "Website Auto-Translator",
    category: { en: "AI & web", fr: "IA & web", mg: "IA & web" },
    summary: {
      en: "A deep learning translation module wired into a live web pipeline, measured with BLEU.",
      fr: "Module de traduction par deep learning intégré à un pipeline web en production, évalué au score BLEU.",
      mg: "Modely fandikan-teny deep learning tafiditra ao amin'ny pipeline web, refesina amin'ny BLEU.",
    },
    year: 2023,
    tags: ["Python", "Deep Learning", "BLEU", "NLP"],
    featured: true,
    status: "live",
  },
  {
    slug: "floyd-warshall-visualizer",
    name: "Floyd–Warshall Visualiser",
    category: { en: "Web & algorithms", fr: "Web & algorithmes", mg: "Web & algoritma" },
    summary: {
      en: "Step-through visualisation of the all-pairs shortest path algorithm. Plain JavaScript, deployed on Vercel.",
      fr: "Visualisation pas à pas de l'algorithme de plus court chemin entre toutes les paires. JavaScript pur, déployé sur Vercel.",
      mg: "Fanehoana tsikelikely ny algoritma lalana fohy indrindra. JavaScript madio, apetraka amin'ny Vercel.",
    },
    year: 2023,
    tags: ["JavaScript", "Algorithms", "Vercel"],
    status: "live",
  },
  {
    slug: "interactive-map-visualizer",
    name: "Interactive Map Visualiser",
    category: { en: "Web mapping", fr: "Webmapping", mg: "Webmapping" },
    summary: {
      en: "Web map with real-time data overlays, backed by PostGIS.",
      fr: "Carte web avec superposition de données en temps réel, adossée à PostGIS.",
      mg: "Sarintany web misy angona mivantana, miorina amin'ny PostGIS.",
    },
    year: 2024,
    tags: ["Laravel", "React", "PostgreSQL", "PostGIS"],
    status: "live",
  },
];
