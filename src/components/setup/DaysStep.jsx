import { Eyebrow } from "../ui/Eyebrow.jsx";
import { Btn } from "../ui/Btn.jsx";
import { Field } from "../ui/Field.jsx";
import { T } from "../../theme/tokens.js";
import { sanitizeInt, clampInt } from "../../lib/validation.js";

export function DaysStep({
  startDate, setStartDate, dayCount, setDayCount,
  setupError, setSetupError, onBack, onConfirm,
}) {
  return (
    <section>
      <Eyebrow>passo 3 de 3</Eyebrow>
      <h1 className="text-3xl font-bold mb-6 tracking-tight">Quando foi a viagem?</h1>
      <div className="grid gap-4 mb-6" style={{ maxWidth: 340 }}>
        <label className="text-sm">
          <span style={{ color: T.inkSoft }} className="block mb-1">Primeiro dia</span>
          <Field type="date" value={startDate} min="2000-01-01" max="2100-12-31"
            onChange={(e) => { setStartDate(e.target.value); setSetupError(""); }} />
        </label>
        <label className="text-sm">
          <span style={{ color: T.inkSoft }} className="block mb-1">Quantos dias</span>
          <Field type="text" inputMode="numeric" value={dayCount} mono
            onChange={(e) => setDayCount(sanitizeInt(e.target.value))}
            onBlur={() => setDayCount(clampInt(dayCount, 1, 60))}
            style={{ fontFamily: T.mono }} />
          <span className="text-xs" style={{ color: T.inkSoft, fontFamily: T.mono }}>
            de 1 a 60 dias
          </span>
        </label>
      </div>
      {setupError && (
        <p className="text-sm mb-4" style={{ color: T.pay }}>{setupError}</p>
      )}
      <div className="flex gap-2">
        <Btn tone="ghost" onClick={onBack}>Voltar</Btn>
        <Btn onClick={onConfirm}>Abrir cronologia</Btn>
      </div>
    </section>
  );
}
