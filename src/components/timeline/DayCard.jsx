import { useState } from "react";
import { Users, Receipt, ChevronDown, Trash2 } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow.jsx";
import { Perf } from "../ui/Perf.jsx";
import { ExpenseForm } from "./ExpenseForm.jsx";
import { T } from "../../theme/tokens.js";
import { splitCents, brl } from "../../lib/money.js";
import { labelDate } from "../../lib/format.js";
import { shortName } from "../../lib/validation.js";

/* ---------------------------------------------------------------
   Cartão de dia — desenhado como um cupom fiscal
--------------------------------------------------------------- */
export function DayCard({ day, index, membersById, defaultMemberIds, open, onToggle, onAdd, onRemove, onEditCrew }) {
  const [payerId, setPayerId] = useState(null);
  const crew = (day.members ?? defaultMemberIds).filter((id) => membersById[id]);
  const total = day.expenses.reduce((s, e) => s + e.cents, 0);
  const share = total > 0 ? splitCents(total, crew.length, index) : [];
  const custom = day.members !== null;

  return (
    <article className="rounded-lg overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.line}` }}>
      <button onClick={onToggle} className="w-full px-4 py-3 flex items-center gap-3 text-left">
        <span style={{ fontFamily: T.mono, color: T.inkSoft }} className="text-xs">
          D{String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1">
          <span className="block text-sm font-medium capitalize">{labelDate(day.date)}</span>
          <span className="block text-xs" style={{ color: T.inkSoft }}>
            {crew.length} na divisão{custom ? " · ajustado" : ""} · {day.expenses.length} lançamento{day.expenses.length === 1 ? "" : "s"}
          </span>
        </span>
        <span style={{ fontFamily: T.mono, color: total ? T.ink : T.inkSoft }} className="text-sm font-bold">
          {total ? brl(total) : "—"}
        </span>
        <ChevronDown size={16} style={{ color: T.inkSoft, transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <>
          <Perf />
          <div className="px-4 pb-4" style={{ background: T.surface }}>
            <div className="flex items-center justify-between mb-2">
              <Eyebrow>quem estava no dia</Eyebrow>
              <button onClick={onEditCrew} className="text-xs flex items-center gap-1 mb-2"
                style={{ color: T.receive, fontFamily: T.mono }}>
                <Users size={12} /> alterar participantes
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {crew.map((id) => (
                <button key={id} onClick={() => setPayerId(payerId === id ? null : id)}
                  className="px-3 py-1.5 rounded-full text-sm"
                  style={{
                    border: `1px solid ${payerId === id ? T.ink : T.line}`,
                    background: payerId === id ? T.ink : "transparent",
                    color: payerId === id ? "var(--on-ink)" : T.ink,
                  }}>
                  {membersById[id].name}
                </button>
              ))}
            </div>

            {payerId ? (
              <ExpenseForm payer={membersById[payerId]}
                onCancel={() => setPayerId(null)}
                onSubmit={(exp) => { onAdd({ ...exp, payerId }); setPayerId(null); }} />
            ) : (
              <p className="text-xs mb-4" style={{ color: T.inkSoft }}>
                Toque em quem pagou para lançar uma despesa deste dia.
              </p>
            )}

            {day.expenses.length > 0 && (
              <div className="mt-4 pt-3" style={{ borderTop: `1px dashed ${T.line}` }}>
                <Eyebrow>lançamentos</Eyebrow>
                <ul className="grid gap-1 mb-3">
                  {day.expenses.map((e) => (
                    <li key={e.id} className="flex items-center gap-2 text-sm">
                      <Receipt size={13} style={{ color: T.receive }} className="shrink-0" />
                      <a href={e.receipt.url} target="_blank" rel="noreferrer"
                        title={e.receipt.name}
                        className="underline decoration-dotted shrink-0"
                        style={{ color: T.inkSoft, fontFamily: T.mono, fontSize: 11 }}>
                        {shortName(e.receipt.name)}
                      </a>
                      <span className="flex-1 truncate" style={{ color: T.inkSoft }}>
                        {e.desc && `· ${e.desc}`}
                      </span>
                      <span style={{ fontFamily: T.mono }}>{membersById[e.payerId]?.name}</span>
                      <span style={{ fontFamily: T.mono }} className="font-bold">{brl(e.cents)}</span>
                      <button onClick={() => onRemove(e.id)} aria-label="Remover lançamento">
                        <Trash2 size={13} style={{ color: T.pay }} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="text-sm p-3 rounded-md" style={{ background: T.paper, fontFamily: T.mono }}>
                  {brl(total)} ÷ {crew.length} ={" "}
                  {crew.map((id, i) => (
                    <span key={id}>{i > 0 && " · "}{membersById[id].name} {brl(share[i])}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </article>
  );
}
