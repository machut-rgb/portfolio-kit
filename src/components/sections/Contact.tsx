import { getContent } from "@/lib/content";
import { t } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { SectionConfig, SectionVariants } from "@config/sections.config";
import { getSiteSettings } from "@/lib/settings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "./contact/ContactForm";

export async function Contact({
  locale,
  variant,
  config,
}: {
  locale: Locale;
  variant: SectionVariants["contact"];
  config: SectionConfig & { type: "contact" };
}) {
  const { contact } = await getContent();
  const dict = getDictionary(locale);
  const siteConfig = await getSiteSettings();

  const info = (
    <div>
      <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--p-font-display)" }}>
        {t(contact.heading, locale)}
      </h3>
      <p className="text-sm mb-6 measure" style={{ color: "var(--p-fg-muted)" }}>
        {t(contact.body, locale)}
      </p>
      <ul className="flex flex-col gap-3">
        {contact.channels.map((channel) => {
          const value = t(channel.value, locale);
          const content = channel.href ? (
            <a href={channel.href} target={channel.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener" className="link-quiet">
              {value}
            </a>
          ) : (
            <span style={{ color: "var(--p-fg-muted)" }}>{value}</span>
          );
          return (
            <li key={channel.id} className="flex items-center gap-3 text-sm">
              <span
                className="w-8 h-8 rounded-[var(--p-radius-sm)] flex items-center justify-center flex-none border"
                style={{ borderColor: "var(--p-border)", background: "var(--p-surface-alt)" }}
              >
                <Icon name={channel.icon} />
              </span>
              {content}
            </li>
          );
        })}
      </ul>
    </div>
  );

  const form = siteConfig.features.contactForm ? <ContactForm locale={locale} dict={dict.form} /> : null;

  return (
    <section id="contact" className="section-block page-shell">
      <SectionHeading
        eyebrow={config.eyebrow ?? { en: "Contact", fr: "Contact", mg: "Fifandraisana" }}
        title={config.title}
        intro={config.intro}
        locale={locale}
        align={variant === "centered" ? "center" : "left"}
      />
      <Reveal>
        {variant === "centered" ? (
          <div className="max-w-lg mx-auto">
            {form}
            <div className="mt-8 text-center">{info}</div>
          </div>
        ) : (
          <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
            {info}
            {form}
          </div>
        )}
      </Reveal>
    </section>
  );
}
