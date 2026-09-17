import type { ReactNode } from "react";

function Wrap({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="field-label">
        {label}
        {required && <span style={{ color: "var(--p-danger)" }}> *</span>}
      </label>
      {children}
      {hint && (
        <span className="text-2xs" style={{ color: "var(--p-fg-subtle)" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

export function TextField({
  name,
  label,
  defaultValue,
  hint,
  required,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  required?: boolean;
  type?: "text" | "email" | "url" | "tel" | "number";
  placeholder?: string;
}) {
  return (
    <Wrap label={label} hint={hint} required={required}>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="field"
      />
    </Wrap>
  );
}

export function TextAreaField({
  name,
  label,
  defaultValue,
  hint,
  required,
  rows = 3,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Wrap label={label} hint={hint} required={required}>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="field resize-y"
      />
    </Wrap>
  );
}

export function SelectField({
  name,
  label,
  defaultValue,
  options,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <Wrap label={label} hint={hint}>
      <select name={name} defaultValue={defaultValue} className="field">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Wrap>
  );
}

export function CheckboxField({
  name,
  label,
  defaultChecked,
  hint,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="w-4 h-4 accent-[var(--p-primary)]"
      />
      <span className="text-sm" style={{ color: "var(--p-fg)" }}>
        {label}
      </span>
      {hint && (
        <span className="text-2xs" style={{ color: "var(--p-fg-subtle)" }}>
          {hint}
        </span>
      )}
    </label>
  );
}
