export default function NavItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button className={`nav-item ${isActive ? "nav-item-active" : ""}`} onClick={onClick}>
      <span className="nav-icon">
        <Icon size={22} />
      </span>
      <span className="nav-label">
        {label}
      </span>
    </button>
  );
}