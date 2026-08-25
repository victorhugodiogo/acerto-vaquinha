/* ---------------------------------------------------------------
   Tokens — os valores vivem em CSS variables, trocadas pelo tema
--------------------------------------------------------------- */
export const T = {
  ink: "var(--ink)",
  inkSoft: "var(--ink-soft)",
  paper: "var(--paper)",
  surface: "var(--surface)",
  line: "var(--line)",
  receive: "var(--receive)",
  pay: "var(--pay)",
  gold: "var(--gold)",
  warnBg: "var(--warn-bg)",
  warnInk: "var(--warn-ink)",
  mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
  sans: "'Space Grotesk', ui-sans-serif, system-ui, -apple-system, sans-serif",
};

export const THEME_CSS = `
.theme-light{
  color-scheme:light;
  --ink:#122130; --ink-soft:#4A5C6B; --paper:#E9EDE7; --surface:#FFFFFF;
  --line:#C9D2CB; --receive:#1F6F5C; --pay:#B3453B; --gold:#C79A3C;
  --warn-bg:#FBF3E0; --warn-ink:#7A5A14; --overlay:rgba(18,33,48,.45);
  --disabled:#B9C2BA; --on-disabled:#F3F6F3; --on-ink:#FFFFFF; --on-gold:#FFFFFF;
}
.theme-dark{
  color-scheme:dark;
  --ink:#E7EDE8; --ink-soft:#8DA1AB; --paper:#0E1920; --surface:#182630;
  --line:#2D3F4B; --receive:#57BE9E; --pay:#E48375; --gold:#D9AE55;
  --warn-bg:#2C2513; --warn-ink:#E6CB8A; --overlay:rgba(0,0,0,.62);
  --disabled:#2A3A44; --on-disabled:#6C7F89; --on-ink:#0E1920; --on-gold:#0E1920;
}`;
