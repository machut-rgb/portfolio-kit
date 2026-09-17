import type { Certification } from "@/lib/content/types";

export const certifications: Certification[] = [
  {
    id: "terraform-gcp",
    name: {
      en: "Infrastructure with Terraform on Google Cloud",
      fr: "Infrastructure avec Terraform sur Google Cloud",
      mg: "Fotodrafitrasa miaraka amin'ny Terraform amin'ny Google Cloud",
    },
    issuer: "Google Cloud Skills Boost",
    year: "2024",
    icon: "cloud",
    description: {
      en: "Hands-on badge: provisioning and managing cloud infrastructure as code.",
      fr: "Badge pratique : provisionnement et gestion d'infrastructure cloud as code.",
      mg: "Badge azo tamin'ny fanao: fananganana sy fitantanana fotodrafitrasa cloud as code.",
    },
  },
  {
    id: "gcp-networking",
    name: {
      en: "Google Cloud Networking",
      fr: "Réseaux Google Cloud",
      mg: "Tambajotra Google Cloud",
    },
    issuer: "Google Cloud Skills Boost",
    year: "2024",
    icon: "network",
    description: {
      en: "VPCs, subnets and firewall rules — full network configuration on GCP.",
      fr: "VPC, sous-réseaux et règles de pare-feu — configuration réseau complète sur GCP.",
      mg: "VPC, subnet ary fitsipika firewall — fandrindrana tambajotra feno amin'ny GCP.",
    },
  },
  {
    id: "load-balancing",
    name: {
      en: "Load Balancing on Compute Engine",
      fr: "Load balancing sur Compute Engine",
      mg: "Load balancing amin'ny Compute Engine",
    },
    issuer: "Google Cloud Skills Boost",
    year: "2024",
    icon: "scale",
    description: {
      en: "Implemented load balancing across Windows-based Compute Engine instances.",
      fr: "Mise en œuvre du load balancing sur des instances Compute Engine Windows.",
      mg: "Nampihatra load balancing amin'ny instance Compute Engine Windows.",
    },
  },
  {
    id: "netacad-cyber",
    name: {
      en: "Introduction to Cybersecurity",
      fr: "Introduction à la cybersécurité",
      mg: "Fampidirana amin'ny cybersécurité",
    },
    issuer: "Cisco NetAcad",
    year: "2026",
    icon: "shield",
    description: {
      en: "Core cybersecurity concepts, threat landscape and defensive practice.",
      fr: "Concepts fondamentaux, panorama des menaces et pratiques défensives.",
      mg: "Fototra momba ny cybersécurité, ny loza ary ny fomba fiarovana.",
    },
  },
];
