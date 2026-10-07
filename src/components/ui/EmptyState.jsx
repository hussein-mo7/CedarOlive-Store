export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-borderColor bg-white px-6 py-16 text-center">
      <h2 className="text-2xl text-title">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-md text-text">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
