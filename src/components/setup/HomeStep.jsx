import { Btn } from "../ui/Btn.jsx";
import { Eyebrow } from "../ui/Eyebrow.jsx";
import { T } from "../../theme/tokens.js";

export function HomeStep({ onStart }) {
  return (
    <section className="text-center py-10">
      <Eyebrow>divaq · dividir vaquinha</Eyebrow>
      <h1 className="text-4xl font-bold mb-4 tracking-tight">
        Divida os gastos da viagem sem dor de cabeça
      </h1>
      <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: T.inkSoft }}>
        Lance os gastos de cada dia, escolha quem participou e o DiVaq calcula
        quem deve para quem no final.
      </p>
      <Btn onClick={onStart}>Iniciar vaquinha</Btn>
    </section>
  );
}
