import { AlertTriangle } from "lucide-react";
import { Modal } from "../ui/Modal.jsx";
import { Btn } from "../ui/Btn.jsx";
import { T } from "../../theme/tokens.js";
import { brl } from "../../lib/money.js";
import { labelDate } from "../../lib/format.js";

export function CloseConfirmModal({ grandTotal, days, emptyDays, onClose, onConfirm, onJumpToDay }) {
  return (
    <Modal onClose={onClose} title="Fechar a vaquinha?">
      <p className="text-sm mb-4" style={{ color: T.inkSoft }}>
        O acerto será calculado com {brl(grandTotal)} em {days.length} dias. Depois disso ninguém
        adiciona nem apaga despesas.
      </p>
      {emptyDays.length > 0 && (
        <div className="p-3 rounded-md mb-4" style={{ background: T.warnBg, color: T.warnInk }}>
          <div className="flex gap-2 items-start text-sm mb-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>
              {emptyDays.length === 1 ? "Um dia está" : `${emptyDays.length} dias estão`} sem
              nenhuma despesa lançada. Confira antes de travar.
            </span>
          </div>
          <ul className="grid gap-1 pl-6 text-xs" style={{ fontFamily: T.mono }}>
            {emptyDays.map((d) => (
              <li key={d.id} className="flex gap-2">
                <span className="font-bold">D{String(d.index + 1).padStart(2, "0")}</span>
                <span className="capitalize">{labelDate(d.date)}</span>
                <button className="underline" onClick={() => onJumpToDay(d.id)}>
                  lançar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex gap-2 justify-end">
        <Btn tone="ghost" onClick={onClose}>Voltar para a cronologia</Btn>
        <Btn tone="gold" onClick={onConfirm}>Fechar e calcular</Btn>
      </div>
    </Modal>
  );
}
