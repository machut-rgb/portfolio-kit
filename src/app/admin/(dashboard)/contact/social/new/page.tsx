import Link from "next/link";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { SocialLinkForm } from "../SocialLinkForm";
import { createSocialLinkAction } from "../actions";

export default function NewSocialLinkPage() {
  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/contact/social")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Social links
      </Link>
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">Add a social link</h1>
      <SocialLinkForm action={createSocialLinkAction} />
    </div>
  );
}
