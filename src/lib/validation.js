export const uid = () => Math.random().toString(36).slice(2, 10);

// Nome de pessoa: só letras (com acento) e números, no máximo 30 caracteres.
export const NAME_MAX = 30;
export const sanitizeName = (v = "") => v.replace(/[^\p{L}\p{N}]/gu, "").slice(0, NAME_MAX);

// Valor: só dígitos e uma vírgula decimal, com no máximo dois decimais.
// O ponto é descartado — a máscara reinsere o separador de milhar ao sair do campo.
export function sanitizeMoney(v = "") {
  let s = v.replace(/[^\d,]/g, "");
  const i = s.indexOf(",");
  if (i >= 0) s = s.slice(0, i + 1) + s.slice(i + 1).replace(/,/g, "").slice(0, 2);
  return s.slice(0, 16);
}

// Descrição: letras, números, espaço e pontuação simples.
export const DESC_MAX = 40;
export const sanitizeDesc = (v = "") => v.replace(/[^\p{L}\p{N} .,\-/]/gu, "").slice(0, DESC_MAX);

// Campos de contagem: só dígitos, mantidos dentro do intervalo permitido.
export const sanitizeInt = (v = "") => v.replace(/\D/g, "").slice(0, 3);
export const clampInt = (v, min, max) => String(Math.max(min, Math.min(max, parseInt(v, 10) || min)));

export const MAX_FILE_MB = 10;
export const isValidDate = (iso) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const y = Number(iso.slice(0, 4));
  return y >= 2000 && y <= 2100 && !Number.isNaN(new Date(iso + "T12:00:00").getTime());
};
export const normalize = (s) => s.trim().toLowerCase();

// Nome do comprovante em no máximo 20 caracteres: 7 iniciais + "..." + 10 finais.
export function shortName(name = "") {
  return name.length <= 20 ? name : `${name.slice(0, 7)}...${name.slice(-10)}`;
}
