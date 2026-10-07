import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ value, onChange }) {
  return (
    <div className="inline-flex items-center rounded-full border border-borderColor bg-white">
      <button
        type="button"
        className="px-2.5 py-1.5 text-title disabled:text-[#c9bfb6]"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="w-6 text-center text-sm">{value}</span>
      <button
        type="button"
        className="px-2.5 py-1.5"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
