function StatCard({
  title,
  value,
  description,
  icon,
  variant = "purple",
}) {
  return (
    <article className={`dashboard-stat-card stat-${variant}`}>
      <div className="dashboard-stat-icon">{icon}</div>

      <div className="dashboard-stat-content">
        <p>{title}</p>
        <h3>{value}</h3>
        <span>{description}</span>
      </div>

      <div className="dashboard-stat-decoration" />
    </article>
  );
}

export default StatCard;