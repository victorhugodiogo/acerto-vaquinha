import { Lock } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow.jsx";
import { Btn } from "../ui/Btn.jsx";
import { DayCard } from "./DayCard.jsx";
import { T } from "../../theme/tokens.js";
import { brl } from "../../lib/money.js";

export function Timeline({
  days, members, membersById, defaultMemberIds,
  openDay, onToggleDay, onAddExpense, onRemoveExpense, onEditCrew,
  grandTotal, onRequestClose,
}) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <Eyebrow>cronologia</Eyebrow>
          <h1 className="text-2xl font-bold tracking-tight">
            {days.length} dias · {members.length} pessoas
          </h1>
        </div>
        <div className="text-right">
          <div style={{ fontFamily: T.mono, color: T.inkSoft }} className="text-xs uppercase tracking-widest">
            total gasto
          </div>
          <div style={{ fontFamily: T.mono }} className="text-2xl font-bold">{brl(grandTotal)}</div>
        </div>
      </div>

      <div className="grid gap-3">
        {days.map((day, i) => (
          <DayCard key={day.id} day={day} index={i}
            membersById={membersById} defaultMemberIds={defaultMemberIds}
            open={openDay === day.id}
            onToggle={() => onToggleDay(day.id)}
            onAdd={(exp) => onAddExpense(day.id, exp)}
            onRemove={(id) => onRemoveExpense(day.id, id)}
            onEditCrew={() => onEditCrew(day.id)} />
        ))}
      </div>

      <div className="mt-8 pt-6" style={{ borderTop: `1px dashed ${T.line}` }}>
        <Btn tone="gold" full onClick={onRequestClose}>
          <span className="inline-flex items-center justify-center gap-2">
            <Lock size={15} /> Fechar a vaquinha
          </span>
        </Btn>
        <p className="text-xs mt-2 text-center" style={{ color: T.inkSoft }}>
          Depois de fechar, os lançamentos ficam travados.
        </p>
      </div>
    </section>
  );
}
