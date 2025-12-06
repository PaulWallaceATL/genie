"use client";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, description, actions, align = "left" }: SectionHeaderProps) {
  const isCenter = align === "center";
  return (
    <div
      className={`flex flex-col gap-2 ${isCenter ? "items-center text-center" : "items-start text-left"} md:flex-row md:items-center md:justify-between`}
    >
      <div className={`space-y-1 ${isCenter ? "md:text-left" : ""}`}>
        {eyebrow ? <p className="badge w-fit">{eyebrow}</p> : null}
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {description ? <p className="max-w-2xl text-sm text-white/70">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}


