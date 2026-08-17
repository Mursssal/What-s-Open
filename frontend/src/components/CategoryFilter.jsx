import { CATEGORIES } from "../lib/api";

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="category-filter" role="tablist" aria-label="Filter by category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          role="tab"
          aria-selected={active === cat.id}
          className={`category-pill ${active === cat.id ? "is-active" : ""}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
