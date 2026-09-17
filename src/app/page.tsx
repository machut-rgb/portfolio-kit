import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

/** "/" always redirects to the default locale; middleware handles the rest. */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
