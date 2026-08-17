export default function StatusBadge({ open }) {
  return (
    <span className={`status-badge ${open ? "is-open" : "is-closed"}`}>
      <span className="status-dot" />
      {open ? "OPEN" : "CLOSED"}
    </span>
  );
}
