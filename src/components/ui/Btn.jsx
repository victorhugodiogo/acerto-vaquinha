import { T } from "../../theme/tokens.js";

export const Btn = ({ children, onClick, tone = "ink", disabled, full, type = "button" }) => {
  const bg = disabled ? "var(--disabled)" : tone === "gold" ? T.gold : tone === "ghost" ? "transparent" : T.ink;
  const fg = disabled ? "var(--on-disabled)"
    : tone === "ghost" ? T.ink
    : tone === "gold" ? "var(--on-gold)" : "var(--on-ink)";
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`px-4 py-2 rounded-md text-sm transition-opacity hover:opacity-85 disabled:cursor-not-allowed ${full ? "w-full" : ""}`}
      style={{
        background: bg,
        color: fg,
        border: tone === "ghost" ? `1px solid ${T.line}` : "none",
        fontFamily: T.sans, fontWeight: 500,
      }}>
      {children}
    </button>
  );
};
