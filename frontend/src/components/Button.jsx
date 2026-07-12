/*
  API: Button variants — primary (default), secondary, ghost, danger
*/
function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  return (
    <button
      className={`Btn Btn--${variant} Btn--${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
