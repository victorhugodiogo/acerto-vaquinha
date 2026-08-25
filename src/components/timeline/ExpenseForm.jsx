import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { Btn } from "../ui/Btn.jsx";
import { Field } from "../ui/Field.jsx";
import { T } from "../../theme/tokens.js";
import { brl, parseBRL, maskBRL, MAX_CENTS } from "../../lib/money.js";
import { uid, sanitizeMoney, DESC_MAX, sanitizeDesc, MAX_FILE_MB, shortName } from "../../lib/validation.js";

/* ---------------------------------------------------------------
   Formulário de despesa (nota fiscal obrigatória)
--------------------------------------------------------------- */
export function ExpenseForm({ payer, onSubmit, onCancel }) {
  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return setFile(null);
    const okType = f.type.startsWith("image/") || f.type === "application/pdf";
    if (!okType) { e.target.value = ""; setFile(null); return setError("O comprovante precisa ser imagem ou PDF."); }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      e.target.value = ""; setFile(null);
      return setError(`O arquivo passa de ${MAX_FILE_MB} MB. Envie uma foto menor.`);
    }
    setFile(f); setError("");
  };

  const submit = () => {
    const cents = parseBRL(value);
    if (!cents) return setError("Informe um valor maior que zero, por exemplo 20,00.");
    if (cents > MAX_CENTS) return setError(`Valor acima do limite de ${brl(MAX_CENTS)}.`);
    if (!file) return setError("Anexe a nota fiscal para comprovar a despesa.");
    onSubmit({
      id: uid(), cents, desc: desc.trim(),
      receipt: { name: file.name, url: URL.createObjectURL(file) },
    });
  };

  return (
    <div className="p-3 rounded-md grid gap-3" style={{ background: T.paper, border: `1px solid ${T.line}` }}>
      <div className="text-sm">
        <strong>{payer.name}</strong> pagou:
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Field placeholder="20,00" inputMode="decimal" value={value}
          onChange={(e) => { setValue(sanitizeMoney(e.target.value)); setError(""); }}
          onBlur={() => { const c = parseBRL(value); if (c) setValue(maskBRL(Math.min(c, MAX_CENTS))); }}
          style={{ fontFamily: T.mono }} />
        <Field placeholder="Almoço, táxi…" value={desc} maxLength={DESC_MAX}
          onChange={(e) => setDesc(sanitizeDesc(e.target.value))} />
      </div>
      <div>
        <input ref={inputRef} type="file" accept="image/*,application/pdf"
          onChange={pickFile} className="text-xs w-full" style={{ color: T.inkSoft }} />
        <p className="text-xs mt-1" style={{ color: T.inkSoft }}>
          {file
            ? <span style={{ fontFamily: T.mono }} title={file.name}>anexado: {shortName(file.name)}</span>
            : `Nota fiscal obrigatória — foto ou PDF, até ${MAX_FILE_MB} MB.`}
        </p>
      </div>
      {error && <p className="text-xs" style={{ color: T.pay }}>{error}</p>}
      <div className="flex gap-2">
        <Btn onClick={submit}>
          <span className="inline-flex items-center gap-1"><Plus size={14} /> Lançar despesa</span>
        </Btn>
        <Btn tone="ghost" onClick={onCancel}>Cancelar</Btn>
      </div>
    </div>
  );
}
