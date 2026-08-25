export function addDays(iso, n) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function labelDate(iso) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", weekday: "short" });
}

// Dia da semana por extenso, ex.: "quinta-feira".
export function weekdayLong(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long" });
}

// Data por extenso, ex.: "14 de agosto de 2026".
export function labelDateLong(iso) {
  return new Date(iso + "T12:00:00")
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
