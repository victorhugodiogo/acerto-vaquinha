/* ---------------------------------------------------------------
   Núcleo de cálculo — tudo em CENTAVOS (inteiros), nunca float
--------------------------------------------------------------- */

// Divide `total` centavos entre `n` pessoas sem perder nem criar centavo.
// `offset` gira quem recebe o centavo sobrando, para não penalizar sempre o mesmo.
export function splitCents(total, n, offset = 0) {
  if (n <= 0) return [];
  const base = Math.trunc(total / n);
  const rest = total - base * n;
  const out = new Array(n).fill(base);
  for (let k = 0; k < Math.abs(rest); k++) {
    out[(offset + k) % n] += Math.sign(rest);
  }
  return out;
}

// Saldo de cada pessoa = o que pagou − o que devia (cota).
export function computeBalances(days, membersById, defaultMemberIds) {
  const paid = {}, owed = {}, perDay = [];
  Object.keys(membersById).forEach((id) => { paid[id] = 0; owed[id] = 0; });

  days.forEach((day, dayIndex) => {
    const present = (day.members ?? defaultMemberIds).filter((id) => membersById[id]);
    const total = day.expenses.reduce((s, e) => s + e.cents, 0);
    const shares = splitCents(total, present.length, dayIndex);

    day.expenses.forEach((e) => { paid[e.payerId] = (paid[e.payerId] || 0) + e.cents; });
    present.forEach((id, i) => { owed[id] = (owed[id] || 0) + shares[i]; });

    perDay.push({
      dayId: day.id,
      total,
      present,
      rows: present.map((id, i) => ({
        id,
        share: shares[i],
        paid: day.expenses.filter((e) => e.payerId === id).reduce((s, e) => s + e.cents, 0),
      })),
    });
  });

  const balances = {};
  Object.keys(membersById).forEach((id) => { balances[id] = (paid[id] || 0) - (owed[id] || 0); });
  return { paid, owed, balances, perDay };
}

// Menor número de transferências que zera todos os saldos (guloso credor/devedor).
export function settle(balances) {
  const cred = [], deb = [];
  Object.entries(balances).forEach(([id, v]) => {
    if (v > 0) cred.push({ id, v });
    if (v < 0) deb.push({ id, v: -v });
  });
  cred.sort((a, b) => b.v - a.v);
  deb.sort((a, b) => b.v - a.v);

  const tx = [];
  let i = 0, j = 0;
  while (i < deb.length && j < cred.length) {
    const amount = Math.min(deb[i].v, cred[j].v);
    if (amount > 0) tx.push({ from: deb[i].id, to: cred[j].id, amount });
    deb[i].v -= amount;
    cred[j].v -= amount;
    if (deb[i].v === 0) i++;
    if (cred[j].v === 0) j++;
  }
  return tx;
}

export const MAX_CENTS = 100000000; // R$ 1.000.000,00

export const brl = (cents) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function parseBRL(input) {
  if (!input) return null;
  let s = String(input).trim().replace(/[^\d.,-]/g, "");
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  const n = Number.parseFloat(s);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100);
}

// Centavos → "1.234,50" (sempre com dois dígitos decimais).
export const maskBRL = (cents) =>
  (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
