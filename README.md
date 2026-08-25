# Acerto — vaquinha por dia

Protótipo de divisão de despesas de viagem: cada dia tem seus próprios participantes
e lançamentos, e o acerto final calcula quem paga e quem recebe.

## Rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Stack

- Vite + React 18
- Tailwind CSS v4 (plugin `@tailwindcss/vite`, sem `tailwind.config.js`)
- `lucide-react` para os ícones

## Mapa do código

O código é dividido por contexto, um arquivo por peça:

| Caminho | O que faz |
|---|---|
| `App.jsx` | Orquestra a máquina de passos (count → names → days → timeline → dashboard) e o estado global |
| `theme/tokens.js` | `T` (tokens de cor/fonte) e `THEME_CSS` (variáveis dos temas claro e escuro) |
| `lib/money.js` | `splitCents`, `computeBalances`, `settle` e formatação monetária (`brl`, `parseBRL`, `maskBRL`) |
| `lib/format.js` | Formatação de datas (`addDays`, `labelDate`, `weekdayLong`, `labelDateLong`) |
| `lib/validation.js` | Sanitização e validação de entrada dos formulários (`sanitizeName/Money/Desc/Int`, `isValidDate`, `uid`) |
| `components/ui/` | Peças reutilizáveis: `Btn`, `Field`, `Modal`, `Eyebrow`, `Perf` |
| `components/setup/` | Telas dos passos 1–3: `CountStep`, `NamesStep`, `DaysStep` |
| `components/timeline/` | `Timeline`, `DayCard`, `ExpenseForm`, `CrewModal`, `CloseConfirmModal` |
| `components/dashboard/` | `Dashboard` (acerto final) e `BalanceGroup` (quem recebe/paga) |

## Estado atual e próximos passos

O estado inteiro vive em memória (`useState`), então recarregar a página zera tudo.
Os comprovantes usam `URL.createObjectURL`, ou seja, existem só enquanto a aba está aberta.

Para virar produto:

1. **Persistência.** Modelar `grupos`, `dias`, `participacoes_por_dia`, `despesas`,
   `comprovantes` e `fechamentos`. Gravar a participação de cada dia como snapshot,
   para que remover alguém do grupo não altere dias já lançados.
2. **Comprovantes.** Upload direto do navegador para storage (S3/R2) com URL assinada;
   guardar só a chave no banco, nunca base64.
3. **Fechamento imutável.** Gravar `closed_at` junto com o snapshot dos saldos e das
   transferências geradas, em vez de recalcular a cada leitura.
4. **Valores sempre em centavos** (`bigint` ou `integer`), nunca `float`.
5. **Repetir as validações no backend.** As do front são conveniência, não segurança.
