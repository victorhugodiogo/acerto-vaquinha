import { Eyebrow } from "../ui/Eyebrow.jsx";
import { Btn } from "../ui/Btn.jsx";
import { Field } from "../ui/Field.jsx";
import { T } from "../../theme/tokens.js";
import { NAME_MAX, sanitizeName } from "../../lib/validation.js";

export function NamesStep({ names, setNames, setupError, onBack, onConfirm }) {
  return (
    <section>
      <Eyebrow>passo 2 de 3</Eyebrow>
      <h1 className="text-3xl font-bold mb-6 tracking-tight">Quem são?</h1>
      <div className="grid gap-2 mb-6">
        {names.map((n, i) => (
          <div key={i} className="flex items-center gap-3">
            <span style={{ fontFamily: T.mono, color: T.inkSoft }} className="text-xs w-6">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Field value={n} placeholder={`Pessoa ${i + 1}`} maxLength={NAME_MAX}
              onChange={(e) => setNames((p) =>
                p.map((v, k) => (k === i ? sanitizeName(e.target.value) : v)))} />
            <span style={{ fontFamily: T.mono, color: T.inkSoft }}
              className="text-xs w-12 text-right">{n.length}/{NAME_MAX}</span>
          </div>
        ))}
      </div>
      {setupError && (
        <p className="text-sm mb-4" style={{ color: T.pay }}>{setupError}</p>
      )}
      <div className="flex gap-2">
        <Btn tone="ghost" onClick={onBack}>Voltar</Btn>
        <Btn onClick={onConfirm}>Continuar</Btn>
      </div>
    </section>
  );
}
