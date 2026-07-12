/* Base card container — used across all pages */
function Card({ children, className = "", onClick, ...props }) {
  return (
    <div
      className={`Card ${className}${onClick ? " Card--clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
