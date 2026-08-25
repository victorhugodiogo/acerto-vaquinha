import { useState } from "react";
import { ChevronDown, Check, ArrowRight, Receipt, TrendingUp, TrendingDown } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow.jsx";
import { Btn } from "../ui/Btn.jsx";
import { BalanceGroup } from "./BalanceGroup.jsx";
import { T } from "../../theme/tokens.js";
import { splitCents, brl } from "../../lib/money.js";
import { labelDate } from "../../lib/format.js";
import { shortName } from "../../lib/validation.js";

/* ---------------------------------------------------------------
   Dashboard do acerto
--------------------------------------------------------------- */
export function Dashboard({ calc, transfers, membersById, days, grandTotal, closed, onBack }) {
  const ids = Object.keys(membersById);
  const max = Math.max(1, ...ids.map((id) => Math.abs(calc.balances[id])));
  const receivers = ids.filter((id) => calc.balances[id] > 0)
    .sort((a, b) => calc.balances[b] - calc.balances[a]);
  const payers = ids.filter((id) => calc.balances[id] < 0)
    .sort((a, b) => calc.balances[a] - calc.balances[b]);
  const settled = ids.filter((id) => calc.balances[id] === 0);
  const sum = (list) => list.reduce((s, id) => s + Math.abs(calc.balances[id]), 0);

  // Memória de cálculo começa recolhida; cada dia abre e fecha por conta própria.
  const [memoOpen, setMemoOpen] = useState(false);
  const [openDays, setOpenDays] = useState([]);
  const allOpen = days.length > 0 && openDays.length === days.length;
  const toggleDay = (id) =>
    setOpenDays((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <section>
      <Eyebrow>{closed ? "vaquinha fechada" : "prévia"}</Eyebrow>
      <h1 className="text-3xl font-bold mb-1 tracking-tight">Acerto final</h1>
      <p className="text-sm mb-8" style={{ color: T.inkSoft }}>
        {brl(grandTotal)} em {days.length} dias · {ids.length} pessoas
      </p>

      <div className="grid gap-6 mb-8">
        <BalanceGroup title="Recebem" total={sum(receivers)} tone={T.receive} icon={TrendingUp}
          ids={receivers} calc={calc} membersById={membersById} max={max}
          empty="Ninguém tem valor a receber." />
        <BalanceGroup title="Pagam" total={sum(payers)} tone={T.pay} icon={TrendingDown}
          ids={payers} calc={calc} membersById={membersById} max={max}
          empty="Ninguém tem valor a pagar." />
        {settled.length > 0 && (
          <p className="text-xs" style={{ color: T.inkSoft, fontFamily: T.mono }}>
            já quites: {settled.map((id) => membersById[id].name).join(", ")}
          </p>
        )}
      </div>

      <Eyebrow>transferências para zerar tudo</Eyebrow>
      <div className="grid gap-2 mb-8">
        {transfers.length === 0 && (
          <p className="text-sm flex items-center gap-2" style={{ color: T.receive }}>
            <Check size={16} /> Ninguém deve nada a ninguém.
          </p>
        )}
        {transfers.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm"
            style={{ background: T.surface, border: `1px solid ${T.line}` }}>
            <span className="font-medium">{membersById[t.from].name}</span>
            <ArrowRight size={14} style={{ color: T.inkSoft }} />
            <span className="font-medium flex-1">{membersById[t.to].name}</span>
            <span style={{ fontFamily: T.mono }} className="font-bold">{brl(t.amount)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setMemoOpen(!memoOpen)} className="flex items-center gap-2">
          <ChevronDown size={14} style={{ color: T.inkSoft, transform: memoOpen ? "rotate(180deg)" : "none" }} />
          <span className="text-xs uppercase tracking-widest" style={{ fontFamily: T.mono, color: T.inkSoft }}>
            memória de cálculo · {days.length} dias
          </span>
        </button>
        {memoOpen && (
          <button onClick={() => setOpenDays(allOpen ? [] : days.map((d) => d.id))}
            className="text-xs" style={{ fontFamily: T.mono, color: T.receive }}>
            {allOpen ? "recolher todos" : "expandir todos"}
          </button>
        )}
      </div>

      <div className="grid gap-2 mb-8" hidden={!memoOpen}>
        {days.map((day, i) => {
          const d = calc.perDay[i];
          const cota = d.total > 0 ? splitCents(d.total, d.present.length, i) : [];
          const open = openDays.includes(day.id);
          return (
            <div key={day.id} className="rounded-lg overflow-hidden"
              style={{ background: T.surface, border: `1px solid ${T.line}` }}>
              <button onClick={() => toggleDay(day.id)}
                className="w-full px-4 py-2 flex items-center gap-2 text-xs text-left"
                style={{ background: T.paper, fontFamily: T.mono,
                  borderBottom: open ? `1px solid ${T.line}` : "none" }}>
                <ChevronDown size={12} className="shrink-0"
                  style={{ color: T.inkSoft, transform: open ? "rotate(180deg)" : "none" }} />
                <span className="font-bold">D{String(i + 1).padStart(2, "0")}</span>
                <span className="capitalize" style={{ color: T.inkSoft }}>{labelDate(day.date)}</span>
                <span className="flex-1" />
                <span style={{ color: d.total ? T.ink : T.inkSoft }}>
                  {brl(d.total)} ÷ {d.present.length}
                  {d.total > 0 && `${d.total % d.present.length === 0 ? " = " : " ≈ "}${brl(cota[0])}`}
                </span>
              </button>

              {!open ? null : day.expenses.length === 0 ? (
                <p className="px-4 py-3 text-xs" style={{ color: T.inkSoft }}>Sem lançamentos neste dia.</p>
              ) : (
                <>
                  <ul className="px-4 py-3 grid gap-1.5 text-xs" style={{ fontFamily: T.mono }}>
                    {day.expenses.map((e) => (
                      <li key={e.id} className="flex items-center gap-2">
                        <Receipt size={12} className="shrink-0" style={{ color: T.receive }} />
                        <span className="font-bold shrink-0">{membersById[e.payerId]?.name}</span>
                        <span className="flex-1 truncate" style={{ color: T.inkSoft }}>
                          {e.desc || "despesa"}
                        </span>
                        <a href={e.receipt.url} target="_blank" rel="noreferrer" title={e.receipt.name}
                          className="underline decoration-dotted shrink-0 hidden sm:inline"
                          style={{ color: T.inkSoft }}>
                          {shortName(e.receipt.name)}
                        </a>
                        <span className="shrink-0">{brl(e.cents)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="px-4 py-3 grid gap-1.5 text-xs"
                    style={{ borderTop: `1px dashed ${T.line}`, fontFamily: T.mono }}>
                    {d.rows.map((r) => {
                      const net = r.paid - r.share;
                      return (
                        <div key={r.id} className="flex items-center gap-2">
                          <span className="flex-1 truncate">{membersById[r.id].name}</span>
                          <span style={{ color: T.inkSoft }} className="shrink-0">
                            pagou {brl(r.paid)} · cota {brl(r.share)}
                          </span>
                          <span className="font-bold shrink-0 text-right" style={{ width: 92, color: net >= 0 ? T.receive : T.pay }}>
                            {net >= 0 ? "+" : "−"}{brl(Math.abs(net))}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {!closed && <Btn tone="ghost" onClick={onBack}>Voltar para a cronologia</Btn>}
    </section>
  );
}
