import { X } from "lucide-react";
import { T } from "../../theme/tokens.js";

export function Modal({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center p-4 z-50"
      style={{ background: "var(--overlay)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-lg p-5" style={{ background: T.surface }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <button onClick={onClose} aria-label="Fechar"><X size={18} style={{ color: T.inkSoft }} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
