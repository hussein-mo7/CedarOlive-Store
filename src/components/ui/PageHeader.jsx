export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-text">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl text-title md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-text">{description}</p>}
      </div>
      {action}
    </div>
  );
}
