import { useState, useMemo } from "react";
import { RotateCcw, Sun, Moon } from "lucide-react";

import { T, THEME_CSS } from "./theme/tokens.js";
import { computeBalances, settle } from "./lib/money.js";
import { addDays } from "./lib/format.js";
import { uid, isValidDate, normalize } from "./lib/validation.js";

import { HomeStep } from "./components/setup/HomeStep.jsx";
import { CountStep } from "./components/setup/CountStep.jsx";
import { NamesStep } from "./components/setup/NamesStep.jsx";
import { DaysStep } from "./components/setup/DaysStep.jsx";
import { Timeline } from "./components/timeline/Timeline.jsx";
import { CrewModal } from "./components/timeline/CrewModal.jsx";
import { CloseConfirmModal } from "./components/timeline/CloseConfirmModal.jsx";
import { Dashboard } from "./components/dashboard/Dashboard.jsx";

/* ---------------------------------------------------------------
   App — máquina de passos (count → names → days → timeline → dashboard)
--------------------------------------------------------------- */
export default function App() {
  const [step, setStep] = useState("home");
  const [count, setCount] = useState("3");
  const [names, setNames] = useState(["", "", ""]);
  const [members, setMembers] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [dayCount, setDayCount] = useState("5");
  const [days, setDays] = useState([]);
  const [openDay, setOpenDay] = useState(null);
  const [setupError, setSetupError] = useState("");
  const [editingCrew, setEditingCrew] = useState(null);
  const [closing, setClosing] = useState(false);
  const [closed, setClosed] = useState(false);
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark" : "light"
  );

  const membersById = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m])), [members]
  );
  const defaultMemberIds = useMemo(() => members.map((m) => m.id), [members]);
  const calc = useMemo(
    () => computeBalances(days, membersById, defaultMemberIds),
    [days, membersById, defaultMemberIds]
  );
  const transfers = useMemo(() => settle(calc.balances), [calc]);
  const grandTotal = days.reduce((s, d) => s + d.expenses.reduce((a, e) => a + e.cents, 0), 0);

  /* ---------- setup ---------- */
  const confirmCount = () => {
    const n = Math.max(2, Math.min(30, parseInt(count, 10) || 0));
    setCount(String(n));
    setNames((prev) => Array.from({ length: n }, (_, i) => prev[i] || ""));
    setStep("names");
  };

  const confirmNames = () => {
    const clean = names.map((n) => n.trim());
    if (clean.some((n) => !n)) return setSetupError("Preencha o nome de todas as pessoas.");
    const dup = clean.find((n, i) => clean.findIndex((o) => normalize(o) === normalize(n)) !== i);
    if (dup) return setSetupError(`"${dup}" está repetido. Cada pessoa precisa de um nome único.`);
    setSetupError("");
    setMembers(clean.map((name) => ({ id: uid(), name })));
    setStep("days");
  };

  const confirmDays = () => {
    if (!isValidDate(startDate)) return setSetupError("Informe uma data válida para o primeiro dia.");
    setSetupError("");
    const n = Math.max(1, Math.min(60, parseInt(dayCount, 10) || 0));
    setDays(Array.from({ length: n }, (_, i) => ({
      id: uid(), date: addDays(startDate, i), members: null, expenses: [],
    })));
    setStep("timeline");
  };

  /* ---------- dias ---------- */
  const addExpense = (dayId, expense) =>
    setDays((ds) => ds.map((d) => d.id === dayId ? { ...d, expenses: [...d.expenses, expense] } : d));

  const removeExpense = (dayId, expId) =>
    setDays((ds) => ds.map((d) => d.id === dayId
      ? { ...d, expenses: d.expenses.filter((e) => e.id !== expId) } : d));

  const setDayCrew = (dayId, ids) =>
    setDays((ds) => ds.map((d) => d.id === dayId ? { ...d, members: ids } : d));

  const addMemberToTrip = (name, dayId) => {
    const m = { id: uid(), name };
    setMembers((prev) => [...prev, m]);
    setDays((ds) => ds.map((d) => {
      if (d.id !== dayId) return { ...d, members: d.members ?? defaultMemberIds };
      return { ...d, members: [...(d.members ?? defaultMemberIds), m.id] };
    }));
    return m.id;
  };

  const reset = () => {
    setStep("home"); setMembers([]); setDays([]); setClosed(false);
    setOpenDay(null); setEditingCrew(null);
  };

  const emptyDays = days
    .map((d, i) => ({ ...d, index: i }))
    .filter((d) => d.expenses.length === 0);

  /* ---------- render ---------- */
  return (
    <div className={`theme-${theme} min-h-screen w-full`}
      style={{ background: T.paper, color: T.ink, fontFamily: T.sans }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        ${THEME_CSS}
        *{box-sizing:border-box}
        input[type=file]::file-selector-button{border:1px solid ${T.line};background:${T.paper};color:${T.ink};border-radius:6px;padding:4px 10px;margin-right:10px;font-family:${T.sans};font-size:12px;cursor:pointer}
        @media (prefers-reduced-motion: reduce){*{transition:none!important;animation:none!important}}
      `}</style>

      <header className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${T.line}` }}>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight">DiVaq</span>
          <span style={{ fontFamily: T.mono, color: T.inkSoft }} className="text-xs uppercase tracking-widest">
            dividir vaquinha
          </span>
        </div>
        <div className="flex items-center gap-4">
          {members.length > 0 && (
            <button onClick={reset} title="Recomeçar"
              className="flex items-center gap-1 text-xs" style={{ color: T.inkSoft, fontFamily: T.mono }}>
              <RotateCcw size={13} /> recomeçar
            </button>
          )}
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
            className="flex items-center justify-center rounded-md p-1.5"
            style={{ border: `1px solid ${T.line}`, color: T.ink }}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {step === "home" && (
          <HomeStep onStart={() => setStep("count")} />
        )}

        {step === "count" && (
          <CountStep count={count} setCount={setCount} onConfirm={confirmCount} />
        )}

        {step === "names" && (
          <NamesStep names={names} setNames={setNames} setupError={setupError}
            onBack={() => { setSetupError(""); setStep("count"); }}
            onConfirm={confirmNames} />
        )}

        {step === "days" && (
          <DaysStep startDate={startDate} setStartDate={setStartDate}
            dayCount={dayCount} setDayCount={setDayCount}
            setupError={setupError} setSetupError={setSetupError}
            onBack={() => { setSetupError(""); setStep("names"); }}
            onConfirm={confirmDays} />
        )}

        {step === "timeline" && (
          <Timeline days={days} members={members} membersById={membersById}
            defaultMemberIds={defaultMemberIds}
            openDay={openDay} onToggleDay={(id) => setOpenDay(openDay === id ? null : id)}
            onAddExpense={addExpense} onRemoveExpense={removeExpense}
            onEditCrew={(dayId) => setEditingCrew(dayId)}
            grandTotal={grandTotal} onRequestClose={() => setClosing(true)} />
        )}

        {step === "dashboard" && (
          <Dashboard calc={calc} transfers={transfers} membersById={membersById}
            days={days} grandTotal={grandTotal} closed={closed}
            onBack={() => setStep("timeline")} />
        )}
      </main>

      {/* editor de pessoas do dia */}
      {editingCrew && (
        <CrewModal day={days.find((d) => d.id === editingCrew)}
          index={days.findIndex((d) => d.id === editingCrew)}
          members={members}
          defaultMemberIds={defaultMemberIds}
          onClose={() => setEditingCrew(null)}
          onSave={(ids) => { setDayCrew(editingCrew, ids); setEditingCrew(null); }}
          onAddMember={(name) => addMemberToTrip(name, editingCrew)} />
      )}

      {/* confirmação de fechamento */}
      {closing && (
        <CloseConfirmModal grandTotal={grandTotal} days={days} emptyDays={emptyDays}
          onClose={() => setClosing(false)}
          onConfirm={() => { setClosed(true); setClosing(false); setStep("dashboard"); }}
          onJumpToDay={(dayId) => { setClosing(false); setOpenDay(dayId); }} />
      )}
    </div>
  );
}
