import { useState } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { Modal } from "../ui/Modal.jsx";
import { Btn } from "../ui/Btn.jsx";
import { Field } from "../ui/Field.jsx";
import { T } from "../../theme/tokens.js";
import { weekdayLong, labelDateLong } from "../../lib/format.js";
import { NAME_MAX, sanitizeName, normalize } from "../../lib/validation.js";

export function CrewModal({ day, index, members, defaultMemberIds, onClose, onSave, onAddMember }) {
  const [sel, setSel] = useState(day.members ?? defaultMemberIds);
  const [newName, setNewName] = useState("");
  const [pending, setPending] = useState(null); // "save" | "close"
  const [crewError, setCrewError] = useState("");

  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  // Inclui a pessoa e mantém o pop-up aberto, já marcada no dia.
  const addMember = () => {
    const name = newName.trim();
    if (!name) return;
    if (members.some((m) => normalize(m.name) === normalize(name))) {
      return setCrewError(`"${name}" já está na viagem.`);
    }
    const id = onAddMember(name);
    if (id) setSel((s) => (s.includes(id) ? s : [...s, id]));
    setNewName(""); setCrewError("");
  };

  const run = (action) => (action === "save" ? onSave(sel) : onClose());
  // Qualquer saída com nome digitado passa por confirmação.
  const guard = (action) => (newName.trim() ? setPending(action) : run(action));

  return (
    <Modal title={`Dia ${index + 1} · ${weekdayLong(day.date)}`} onClose={() => guard("close")}>
      <p className="text-sm mb-4" style={{ color: T.inkSoft }}>
        <span style={{ fontFamily: T.mono }}>{labelDateLong(day.date)}</span> — só quem estiver
        marcado entra na divisão deste dia.
      </p>

      <div className="grid gap-1 mb-4">
        {members.map((m) => (
          <label key={m.id} className="flex items-center gap-3 py-2 px-2 rounded-md cursor-pointer"
            style={{ background: sel.includes(m.id) ? T.paper : "transparent" }}>
            <input type="checkbox" checked={sel.includes(m.id)} onChange={() => toggle(m.id)} />
            <span className="text-sm">{m.name}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-2 items-center mb-1">
        <Field placeholder="Adicionar alguém novo" value={newName} maxLength={NAME_MAX}
          onChange={(e) => { setNewName(sanitizeName(e.target.value)); setCrewError(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMember(); } }} />
        <Btn tone="ghost" disabled={!newName.trim()} onClick={addMember}>
          <Plus size={14} />
        </Btn>
      </div>
      <p className="text-xs mb-4" style={{ color: crewError ? T.pay : T.inkSoft, fontFamily: T.mono }}>
        {crewError || `letras e números · ${newName.length}/${NAME_MAX}`}
      </p>

      {pending ? (
        <div className="p-3 rounded-md" style={{ background: T.warnBg, color: T.warnInk }}>
          <div className="flex gap-2 items-start text-sm mb-3">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span><strong>{newName.trim()}</strong> foi digitado mas ainda não entrou na lista.
              Continuar sem incluir?</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <Btn tone="ghost" onClick={() => setPending(null)}>Voltar e incluir</Btn>
            <Btn onClick={() => { const a = pending; setNewName(""); setPending(null); run(a); }}>
              Continuar sem incluir
            </Btn>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 justify-end">
          <Btn tone="ghost" onClick={() => guard("close")}>Cancelar</Btn>
          <Btn onClick={() => guard("save")} disabled={sel.length === 0}>Salvar o dia</Btn>
        </div>
      )}
    </Modal>
  );
}
