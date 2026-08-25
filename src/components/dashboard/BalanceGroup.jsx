import { T } from "../../theme/tokens.js";
import { brl } from "../../lib/money.js";

/* ---------------------------------------------------------------
   Bloco de saldos (recebem / pagam)
--------------------------------------------------------------- */
export function BalanceGroup({ title, ids, calc, membersById, max, tone, icon: Icon, total, empty }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={15} style={{ color: tone }} />
          <span className="text-sm font-bold tracking-tight">{title}</span>
          <span className="text-xs" style={{ color: T.inkSoft, fontFamily: T.mono }}>
            {ids.length}
          </span>
        </div>
        <span style={{ fontFamily: T.mono, color: tone }} className="text-sm font-bold">{brl(total)}</span>
      </div>

      {ids.length === 0 ? (
        <p className="text-xs px-4 py-3 rounded-lg"
          style={{ color: T.inkSoft, background: T.surface, border: `1px dashed ${T.line}` }}>{empty}</p>
      ) : (
        <div className="rounded-lg overflow-hidden"
          style={{ background: T.surface, border: `1px solid ${T.line}`, borderLeft: `3px solid ${tone}` }}>
          {ids.map((id, i) => (
            <div key={id} className="px-4 py-3"
              style={{ borderTop: i ? `1px solid ${T.line}` : "none" }}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-medium">{membersById[id].name}</span>
                <span style={{ fontFamily: T.mono, color: tone }} className="font-bold">
                  {brl(Math.abs(calc.balances[id]))}
                </span>
              </div>
              <div className="h-1.5 rounded-full mb-1.5" style={{ background: T.paper }}>
                <div className="h-1.5 rounded-full"
                  style={{ width: `${(Math.abs(calc.balances[id]) / max) * 100}%`, background: tone }} />
              </div>
              <div className="text-xs" style={{ color: T.inkSoft, fontFamily: T.mono }}>
                pagou {brl(calc.paid[id])} · cota {brl(calc.owed[id])}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
