import { getSiteSettings } from "@/lib/settings";
import { providerReadiness, type ProviderId } from "@/lib/mail/providers";
import { AdminForm } from "@/components/admin/forms/AdminForm";
import { SelectField, TextField } from "@/components/admin/forms/Fields";
import { Icon } from "@/components/ui/Icon";
import { updateMailSettingsAction } from "./actions";
import { TestSendButton } from "./TestSendButton";

const PROVIDER_NOTES: Record<ProviderId, string> = {
  console: "Writes submissions to the server log. No delivery, no setup. Fine for testing.",
  smtp: "Sends through your own mail server or a Gmail app password.",
  resend: "Sends through Resend.",
  webhook: "Posts submissions to a URL, for Slack, Discord or an automation tool.",
};

export default async function MailSettingsPage() {
  const { mail } = await getSiteSettings();
  const provider = mail.provider as ProviderId;
  const readiness = providerReadiness(provider);

  return (
    <div className="max-w-2xl">
      <div className="eyebrow mb-2">Site</div>
      <h1 className="text-heading mb-2">Contact form</h1>
      <p className="text-sm mb-6 measure" style={{ color: "var(--p-fg-muted)" }}>
        Where messages from your contact form are delivered, and how often a single visitor may send one.
      </p>

      <div
        className="card mb-6 flex items-start gap-3"
        style={{ borderColor: readiness.ready ? "var(--p-border)" : "var(--p-warning)" }}
      >
        <Icon name={readiness.ready ? "check" : "shield"} className="flex-none mt-0.5" />
        <div className="flex-1">
          <div className="text-sm font-semibold" style={{ fontFamily: "var(--p-font-display)" }}>
            {readiness.ready ? "Ready to send" : "Not ready"}
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--p-fg-muted)" }}>
            {readiness.ready
              ? PROVIDER_NOTES[provider]
              : `Set these environment variables where the site is deployed, then redeploy: ${readiness.missing.join(", ")}.`}
          </p>
        </div>
      </div>

      <AdminForm action={updateMailSettingsAction}>
        <SelectField
          name="provider"
          label="Delivery method"
          defaultValue={mail.provider}
          options={[
            { value: "console", label: "Server log (no delivery)" },
            { value: "smtp", label: "SMTP" },
            { value: "resend", label: "Resend" },
            { value: "webhook", label: "Webhook" },
          ]}
          hint="Credentials for these stay in environment variables, never in the database."
        />

        <TextField
          name="recipient"
          label="Send messages to"
          type="email"
          defaultValue={mail.recipient}
          hint="Leave blank to use the MAIL_TO environment variable."
        />

        <div className="hairline my-2" />
        <div className="eyebrow -mb-2">Abuse limits</div>
        <div className="grid sm:grid-cols-2 gap-5">
          <TextField
            name="rateLimit"
            label="Messages allowed"
            type="number"
            defaultValue={String(mail.rateLimit)}
            hint="Per visitor, per window."
          />
          <TextField
            name="rateWindowSeconds"
            label="Window (seconds)"
            type="number"
            defaultValue={String(mail.rateWindowSeconds)}
            hint="3600 is one hour."
          />
        </div>
      </AdminForm>

      <div className="hairline my-8" />
      <TestSendButton />
    </div>
  );
}
