import type { Locale } from "./config";

/**
 * Interface chrome only. Everything that is *about you* lives in `/content`
 * as localized values — keeping the two apart means a fork can rewrite all
 * the content without touching a single UI string, and vice versa.
 */
const en = {
  nav: {
    about: "About",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    certifications: "Certifications",
    contact: "Contact",
    resume: "Résumé",
    menu: "Menu",
    close: "Close",
  },
  actions: {
    getInTouch: "Get in touch",
    viewProjects: "View projects",
    viewAll: "See everything on GitLab",
    readMore: "Read more",
    back: "Back",
    backToProjects: "All projects",
    downloadResume: "Download résumé",
    print: "Print",
    copy: "Copy",
    copied: "Copied",
    openSource: "Source",
    liveDemo: "Live demo",
    viewCredential: "View credential",
  },
  form: {
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    send: "Send message",
    sending: "Sending",
    success: "Message sent. I'll reply within a day or two.",
    error: "That didn't send. Email me directly instead.",
    required: "Required",
    invalidEmail: "Use a valid email address so I can reply.",
    tooShort: "Add a little more detail.",
    rateLimited: "Too many messages from this address. Try again later.",
  },
  projects: {
    all: "All",
    featured: "Featured",
    stack: "Built with",
    year: "Year",
    role: "Role",
    empty: "Nothing here yet.",
    highlights: "What it does",
    sourcePrivate: "Source code is not public for this project.",
  },
  theme: {
    title: "Theme studio",
    subtitle: "Change anything. It saves to this browser only.",
    preset: "Preset",
    mode: "Mode",
    light: "Light",
    dark: "Dark",
    system: "System",
    colors: "Colours",
    typography: "Typography",
    layout: "Layout & shape",
    effects: "Effects",
    motion: "Motion",
    reset: "Reset to preset",
    export: "Export config",
    exportHint: "Paste this into config/theme.config.ts to make it the default.",
    open: "Customise appearance",
    close: "Close theme studio",
    randomize: "Surprise me",
  },
  a11y: {
    skipToContent: "Skip to content",
    changeLanguage: "Change language",
    toggleMode: "Switch light or dark",
    scrollDown: "Scroll to content",
  },
  footer: {
    builtWith: "Source on",
    rights: "All rights reserved",
  },
  notFound: {
    title: "No page here",
    body: "The link is wrong or the page has moved.",
    home: "Go home",
  },
};

/** Every leaf widened to `string` — `en` fixes the *shape*, not the exact wording. */
type Widen<T> = { [K in keyof T]: T[K] extends object ? Widen<T[K]> : string };
export type Dictionary = Widen<typeof en>;
type PartialDeep<T> = { [K in keyof T]?: T[K] extends object ? PartialDeep<T[K]> : T[K] };

const fr: PartialDeep<Dictionary> = {
  nav: {
    about: "À propos",
    experience: "Expérience",
    projects: "Projets",
    skills: "Compétences",
    certifications: "Certifications",
    contact: "Contact",
    resume: "CV",
    menu: "Menu",
    close: "Fermer",
  },
  actions: {
    getInTouch: "Me contacter",
    viewProjects: "Voir les projets",
    viewAll: "Tout voir sur GitLab",
    readMore: "Lire la suite",
    back: "Retour",
    backToProjects: "Tous les projets",
    downloadResume: "Télécharger le CV",
    print: "Imprimer",
    copy: "Copier",
    copied: "Copié",
    openSource: "Code",
    liveDemo: "Démo",
    viewCredential: "Voir le certificat",
  },
  form: {
    name: "Nom",
    email: "Email",
    subject: "Objet",
    message: "Message",
    send: "Envoyer",
    sending: "Envoi",
    success: "Message envoyé. Je réponds sous un ou deux jours.",
    error: "L'envoi a échoué. Écrivez-moi directement.",
    required: "Obligatoire",
    invalidEmail: "Indiquez une adresse valide pour que je puisse répondre.",
    tooShort: "Ajoutez un peu plus de détail.",
    rateLimited: "Trop de messages depuis cette adresse. Réessayez plus tard.",
  },
  projects: {
    all: "Tous",
    featured: "En vedette",
    stack: "Réalisé avec",
    year: "Année",
    role: "Rôle",
    empty: "Rien pour l'instant.",
    highlights: "Ce que ça fait",
    sourcePrivate: "Le code source de ce projet n'est pas public.",
  },
  theme: {
    title: "Studio de thème",
    subtitle: "Modifiez tout. Enregistré uniquement dans ce navigateur.",
    preset: "Préréglage",
    mode: "Mode",
    light: "Clair",
    dark: "Sombre",
    system: "Système",
    colors: "Couleurs",
    typography: "Typographie",
    layout: "Mise en page et formes",
    effects: "Effets",
    motion: "Animations",
    reset: "Revenir au préréglage",
    export: "Exporter la config",
    exportHint: "Collez ceci dans config/theme.config.ts pour en faire le défaut.",
    open: "Personnaliser l'apparence",
    close: "Fermer le studio",
    randomize: "Au hasard",
  },
  a11y: {
    skipToContent: "Aller au contenu",
    changeLanguage: "Changer de langue",
    toggleMode: "Basculer clair ou sombre",
    scrollDown: "Défiler vers le contenu",
  },
  footer: { builtWith: "Code sur", rights: "Tous droits réservés" },
  notFound: {
    title: "Page introuvable",
    body: "Le lien est incorrect ou la page a été déplacée.",
    home: "Accueil",
  },
};

const mg: PartialDeep<Dictionary> = {
  nav: {
    about: "Momba ahy",
    experience: "Traikefa",
    projects: "Tetikasa",
    skills: "Fahaiza-manao",
    certifications: "Fanamarinana",
    contact: "Fifandraisana",
    resume: "CV",
    menu: "Karazana",
    close: "Hidiana",
  },
  actions: {
    getInTouch: "Mifandraisa amiko",
    viewProjects: "Jereo ny tetikasa",
    viewAll: "Jereo daholo ao amin'ny GitLab",
    readMore: "Hamaky bebe kokoa",
    back: "Hiverina",
    backToProjects: "Tetikasa rehetra",
    downloadResume: "Alaina ny CV",
    print: "Atonta",
    copy: "Adikao",
    copied: "Voadika",
    openSource: "Kaody",
    liveDemo: "Fanehoana",
    viewCredential: "Jereo ny fanamarinana",
  },
  form: {
    name: "Anarana",
    email: "Email",
    subject: "Lohahevitra",
    message: "Hafatra",
    send: "Handefa",
    sending: "Alefa",
    success: "Voalefa ny hafatra. Hamaly ao anatin'ny andro iray na roa aho.",
    error: "Tsy lasa ilay hafatra. Alefaso mivantana amin'ny email.",
    required: "Ilaina",
    invalidEmail: "Asio adiresy mety mba hahafahako mamaly.",
    tooShort: "Fenoy kely ny antsipiriany.",
    rateLimited: "Be loatra ny hafatra avy amin'ity adiresy ity. Andramo indray afaka kely.",
  },
  projects: {
    all: "Rehetra",
    featured: "Voafantina",
    stack: "Natao tamin'ny",
    year: "Taona",
    role: "Andraikitra",
    empty: "Mbola tsy misy.",
    highlights: "Izay ataony",
    sourcePrivate: "Tsy miseho ampahibemaso ny kaody an'ity tetikasa ity.",
  },
  theme: {
    title: "Studio endrika",
    subtitle: "Ovay izay tianao. Tehirizina eto amin'ity navigateur ity ihany.",
    preset: "Endrika efa vonona",
    mode: "Mode",
    light: "Mazava",
    dark: "Maizina",
    system: "Rafitra",
    colors: "Loko",
    typography: "Endri-tsoratra",
    layout: "Fandrindrana sy bika",
    effects: "Fiantraikany",
    motion: "Fihetsika",
    reset: "Averina amin'ny endrika",
    export: "Havoaka ny config",
    exportHint: "Apetaho ao amin'ny config/theme.config.ts mba ho lasa default.",
    open: "Ovay ny endrika",
    close: "Hidiana ny studio",
    randomize: "An-kisendrasendra",
  },
  a11y: {
    skipToContent: "Mankany amin'ny votoaty",
    changeLanguage: "Hanova fiteny",
    toggleMode: "Mazava na maizina",
    scrollDown: "Midina any amin'ny votoaty",
  },
  footer: { builtWith: "Kaody ao amin'ny", rights: "Zo rehetra voatokana" },
  notFound: {
    title: "Tsy hita ny pejy",
    body: "Diso ny rohy na nafindra ny pejy.",
    home: "Fandraisana",
  },
};

const dictionaries: Record<Locale, PartialDeep<Dictionary>> = { en, fr, mg };

function deepMerge<T>(base: T, patch: PartialDeep<T> | undefined): T {
  if (!patch) return base;
  const out = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
    const current = out[key];
    out[key] =
      value && typeof value === "object" && !Array.isArray(value) && current && typeof current === "object"
        ? deepMerge(current, value as never)
        : value;
  }
  return out as T;
}

/** Full dictionary for a locale, with English filling any gap. */
export function getDictionary(locale: Locale): Dictionary {
  return deepMerge(en, dictionaries[locale]);
}
