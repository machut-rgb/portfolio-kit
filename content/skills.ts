import type { SkillGroup } from "@/lib/content/types";

/** `level` (1–5) is optional and only rendered by the `bars` variant. */
export const skills: SkillGroup[] = [
  {
    id: "security",
    title: { en: "Security", fr: "Sécurité", mg: "Fiarovana" },
    icon: "shield",
    items: [
      { name: "Zero Trust / ZTNA", level: 5 },
      { name: "Wazuh SIEM/XDR", level: 5 },
      { name: "Snort IDS", level: 4 },
      { name: "SOAR / Shuffle", level: 4 },
      { name: "PfSense", level: 5 },
      { name: "FreeRADIUS", level: 4 },
      { name: "Metasploit", level: 3 },
      { name: "Burp Suite", level: 3 },
      { name: "Nmap", level: 4 },
    ],
  },
  {
    id: "cloud",
    title: { en: "Cloud & infrastructure", fr: "Cloud & infrastructure", mg: "Cloud & fotodrafitrasa" },
    icon: "cloud",
    items: [
      { name: "Google Cloud", level: 4 },
      { name: "Proxmox", level: 5 },
      { name: "Docker", level: 4 },
      { name: "Terraform", level: 3 },
      { name: "Linux (Ubuntu)", level: 5 },
      { name: "Asterisk VoIP", level: 4 },
      { name: "VMware", level: 3 },
    ],
  },
  {
    id: "development",
    title: { en: "Development", fr: "Développement", mg: "Fampandrosoana" },
    icon: "code",
    items: [
      { name: "Python", level: 5 },
      { name: "JavaScript", level: 4 },
      { name: "Kotlin", level: 3 },
      { name: "Java", level: 4 },
      { name: "PHP", level: 4 },
      { name: "React Native", level: 4 },
      { name: "Laravel", level: 4 },
      { name: "Node.js", level: 4 },
      { name: "JavaFX", level: 3 },
    ],
  },
  {
    id: "networking",
    title: { en: "Networking", fr: "Réseaux", mg: "Tambajotra" },
    icon: "network",
    items: [
      { name: "TCP/IP", level: 5 },
      { name: "VLANs", level: 5 },
      { name: "Firewall policy", level: 5 },
      { name: "VPN", level: 4 },
      { name: "SIP / VoIP", level: 4 },
      { name: "DNS / DHCP", level: 4 },
      { name: "Wireshark", level: 4 },
    ],
  },
];
