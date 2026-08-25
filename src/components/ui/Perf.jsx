import { T } from "../../theme/tokens.js";

// Borda serrilhada de cupom fiscal — o elemento-assinatura da interface
export const Perf = ({ flip }) => (
  <div style={{
    height: 8,
    backgroundImage: `radial-gradient(circle at 5px 0px, transparent 5px, ${T.surface} 5.5px)`,
    backgroundSize: "10px 8px",
    transform: flip ? "rotate(180deg)" : "none",
  }} />
);
