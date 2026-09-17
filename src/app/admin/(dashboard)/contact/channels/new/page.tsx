import Link from "next/link";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { ChannelForm } from "../ChannelForm";
import { createChannelAction } from "../../actions";

export default function NewChannelPage() {
  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/contact/channels")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Channels
      </Link>
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">Add a channel</h1>
      <ChannelForm action={createChannelAction} />
    </div>
  );
}
