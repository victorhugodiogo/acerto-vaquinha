import { Eyebrow } from "../ui/Eyebrow.jsx";
import { Btn } from "../ui/Btn.jsx";
import { Field } from "../ui/Field.jsx";
import { T } from "../../theme/tokens.js";
import { sanitizeInt, clampInt } from "../../lib/validation.js";

export function CountStep({ count, setCount, onConfirm }) {
  return (
    <section>
      <Eyebrow>passo 1 de 3</Eyebrow>
      <h1 className="text-3xl font-bold mb-2 tracking-tight">Quantas pessoas entram na vaquinha?</h1>
      <p className="text-sm mb-6" style={{ color: T.inkSoft }}>
        Dá para incluir mais gente depois, em qualquer dia da viagem.
      </p>
      <div className="flex gap-2">
        <Field type="text" inputMode="numeric" value={count} mono
          onChange={(e) => setCount(sanitizeInt(e.target.value))}
          onBlur={() => setCount(clampInt(count, 2, 30))}
          style={{ maxWidth: 120, fontFamily: T.mono }} />
        <Btn onClick={onConfirm}>Continuar</Btn>
      </div>
      <p className="text-xs mt-2" style={{ color: T.inkSoft, fontFamily: T.mono }}>
        de 2 a 30 pessoas
      </p>
    </section>
  );
}
