import { T } from "../../theme/tokens.js";

export const Eyebrow = ({ children }) => (
  <div style={{ fontFamily: T.mono, color: T.inkSoft }}
       className="text-xs uppercase tracking-widest mb-2">{children}</div>
);
