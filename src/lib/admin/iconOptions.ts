import { icons } from "@config/icons.config";

/** `<select>` options for every icon in the registry — shared by every
 *  admin form with an icon field (certifications, skills, socials, ...). */
export const iconOptions = Object.keys(icons).map((name) => ({ value: name, label: name }));
