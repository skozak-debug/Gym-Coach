import { useState, useEffect, useRef } from "react";

// ─── STEVE'S PRE-LOADED PROFILE ───────────────────────────────────────────────
// Imported from 260621-Workout_Tracker_v3.xlsx — 9 sessions, 23 PBs
const STEVE_PROFILE = {
  name: "Steve",
  goal: "recomp",
  experience: "advanced",
  daysPerWeek: "4",
  cardioMins: "20",
  equipment: ["dumbbells","trap_bar","cable_machine","lat_pulldown","pull_up_bar","leg_press","leg_curl","shoulder_press_machine","rear_delt_machine","bicep_curl_machine","ab_bench","cardio"],
  importedFromTracker: true,
  pbs: {
    "Dumbbell Incline Bench Press": { reps: 12, weight: 80, e1rm: 112.0 },
    "Dumbbell Incline Fly":         { reps: 11, weight: 35, e1rm: 47.8 },
    "Dumbbell Squeeze Press":       { reps: 16, weight: 30, e1rm: 46.0 },
    "Low Cable Chest Fly":          { reps: 14, weight: 20, e1rm: 29.3 },
    "Cable Lateral Raise":          { reps: 15, weight: 15, e1rm: 22.5 },
    "Dumbbell Lateral Raise":       { reps: 20, weight: 20, e1rm: 33.3 },
    "Machine Rear Delt Fly":        { reps: 13, weight: 150, e1rm: 215.0 },
    "Machine Shoulder Press":       { reps: 13, weight: 95, e1rm: 136.2 },
    "Cable Tricep Pushdown":        { reps: 10, weight: 80, e1rm: 106.7 },
    "Cable Rope Tricep Extension":  { reps: 6,  weight: 70, e1rm: 84.0 },
    "Assisted Pull Up":             { reps: 13, weight: -50, e1rm: null },
    "Cable Row":                    { reps: 13, weight: 210, e1rm: 301.0 },
    "Lat Pulldown (dual pulley)":   { reps: 12, weight: 60, e1rm: 84.0 },
    "Straight-Arm Pulldown":        { reps: 11, weight: 72.5, e1rm: 99.1 },
    "Hammer Curl":                  { reps: 14, weight: 45, e1rm: 66.0 },
    "Machine Bicep Curl":           { reps: 14, weight: 95, e1rm: 139.3 },
    "Trap Bar Deadlift":            { reps: 10, weight: 315, e1rm: 420.0 },
    "Leg Press":                    { reps: 14, weight: 450, e1rm: 660.0 },
    "Seated Leg Curl":              { reps: 10, weight: 200, e1rm: 266.7 },
    "Calf Press":                   { reps: 15, weight: 450, e1rm: 675.0 },
    "Standing Dumbbell Calf Raise": { reps: 28, weight: 70, e1rm: 135.3 },
    "Seated Dumbbell Calf Raise":   { reps: 27, weight: 45, e1rm: 85.5 },
    "Dumbbell Walking Lunge":       { reps: 8,  weight: 55, e1rm: 69.7 },
  }
};

const STEVE_HISTORY = [
  { date: "10 Jun 2026", dayId: "pull", dayName: "Pull Day",  totalSets: 12, duration: 50, pbs: 0,
    exercises: { "Lat Pulldown (dual pulley)": {reps:8,weight:70,e1rm:88.7}, "Cable Row": {reps:12,weight:200,e1rm:280.0}, "Machine Bicep Curl": {reps:15,weight:90,e1rm:135.0}, "Hammer Curl": {reps:8,weight:50,e1rm:63.3} }
  },
  { date: "11 Jun 2026", dayId: "push", dayName: "Push Day",  totalSets: 20, duration: 50, pbs: 0,
    exercises: { "Dumbbell Incline Bench Press": {reps:10,weight:80,e1rm:106.7}, "Cable Lateral Raise": {reps:5,weight:20,e1rm:23.3}, "Machine Rear Delt Fly": {reps:13,weight:145,e1rm:207.8}, "Machine Shoulder Press": {reps:10,weight:95,e1rm:126.7} }
  },
  { date: "12 Jun 2026", dayId: "legs", dayName: "Legs Day",  totalSets: 20, duration: 50, pbs: 0,
    exercises: { "Trap Bar Deadlift": {reps:8,weight:315,e1rm:399.0}, "Leg Press": {reps:12,weight:450,e1rm:630.0}, "Calf Press": {reps:15,weight:450,e1rm:675.0}, "Seated Leg Curl": {reps:12,weight:190,e1rm:266.0} }
  },
  { date: "14 Jun 2026", dayId: "push", dayName: "Push Day",  totalSets: 15, duration: 50, pbs: 0,
    exercises: { "Dumbbell Incline Bench Press": {reps:12,weight:80,e1rm:112.0}, "Machine Rear Delt Fly": {reps:14,weight:145,e1rm:212.7}, "Machine Shoulder Press": {reps:12,weight:95,e1rm:133.0}, "Dumbbell Incline Fly": {reps:10,weight:35,e1rm:46.7} }
  },
  { date: "15 Jun 2026", dayId: "pull", dayName: "Pull Day",  totalSets: 18, duration: 50, pbs: 0,
    exercises: { "Machine Rear Delt Fly": {reps:12,weight:145,e1rm:203.0}, "Cable Row": {reps:12,weight:210,e1rm:294.0}, "Machine Bicep Curl": {reps:16,weight:90,e1rm:138.0}, "Straight-Arm Pulldown": {reps:11,weight:70,e1rm:95.7} }
  },
  { date: "16 Jun 2026", dayId: "legs", dayName: "Legs Day",  totalSets: 19, duration: 50, pbs: 0,
    exercises: { "Trap Bar Deadlift": {reps:10,weight:315,e1rm:420.0}, "Leg Press": {reps:14,weight:450,e1rm:660.0}, "Seated Leg Curl": {reps:10,weight:200,e1rm:266.7}, "Dumbbell Walking Lunge": {reps:8,weight:55,e1rm:69.7} }
  },
  { date: "17 Jun 2026", dayId: "push", dayName: "Push Day",  totalSets: 16, duration: 50, pbs: 0,
    exercises: { "Dumbbell Incline Bench Press": {reps:12,weight:75,e1rm:105.0}, "Machine Rear Delt Fly": {reps:12,weight:150,e1rm:210.0}, "Machine Shoulder Press": {reps:10,weight:95,e1rm:126.7}, "Dumbbell Incline Fly": {reps:11,weight:35,e1rm:47.8} }
  },
  { date: "19 Jun 2026", dayId: "pull", dayName: "Pull Day",  totalSets: 21, duration: 50, pbs: 0,
    exercises: { "Cable Row": {reps:13,weight:210,e1rm:301.0}, "Straight-Arm Pulldown": {reps:11,weight:72.5,e1rm:99.1}, "Machine Rear Delt Fly": {reps:6,weight:150,e1rm:180.0}, "Machine Bicep Curl": {reps:14,weight:95,e1rm:139.3} }
  },
  { date: "21 Jun 2026", dayId: "push", dayName: "Push Day",  totalSets: 19, duration: 50, pbs: 0,
    exercises: { "Dumbbell Incline Bench Press": {reps:13,weight:75,e1rm:107.5}, "Machine Shoulder Press": {reps:13,weight:95,e1rm:136.2}, "Dumbbell Lateral Raise": {reps:20,weight:20,e1rm:33.3}, "Machine Rear Delt Fly": {reps:13,weight:150,e1rm:215.0} }
  },
];

// ─── EQUIPMENT DATABASE ───────────────────────────────────────────────────────
// Each piece of equipment tagged with exercises it enables and muscle groups
const EQUIPMENT_DB = [
  {
    id: "dumbbells",
    name: "Dumbbells",
    emoji: "🏋️",
    exercises: [
      { name: "DB Incline Press",       muscles: ["Upper Chest", "Front Delts", "Triceps"] },
      { name: "DB Flat Press",          muscles: ["Chest", "Front Delts", "Triceps"] },
      { name: "DB Lateral Raise",       muscles: ["Side Delts"] },
      { name: "DB Rear Delt Fly",       muscles: ["Rear Delts"] },
      { name: "DB Incline Fly",         muscles: ["Upper Chest"] },
      { name: "Hammer Curl",            muscles: ["Biceps", "Brachialis"] },
      { name: "DB Bicep Curl",          muscles: ["Biceps"] },
      { name: "DB Overhead Press",      muscles: ["Shoulders", "Triceps"] },
      { name: "DB Row",                 muscles: ["Back", "Biceps"] },
      { name: "DB Romanian Deadlift",   muscles: ["Hamstrings", "Glutes"] },
      { name: "DB Walking Lunge",       muscles: ["Quads", "Glutes"] },
      { name: "DB Goblet Squat",        muscles: ["Quads", "Glutes"] },
      { name: "DB Calf Raise",          muscles: ["Calves"] },
      { name: "DB Shrug",               muscles: ["Traps"] },
      { name: "DB Tricep Kickback",     muscles: ["Triceps"] },
      { name: "DB Skull Crusher",       muscles: ["Triceps"] },
    ]
  },
  {
    id: "barbell",
    name: "Barbell",
    emoji: "🔩",
    exercises: [
      { name: "Barbell Bench Press",    muscles: ["Chest", "Front Delts", "Triceps"] },
      { name: "Barbell Incline Press",  muscles: ["Upper Chest", "Front Delts", "Triceps"] },
      { name: "Barbell Row",            muscles: ["Back", "Biceps"] },
      { name: "Barbell Curl",           muscles: ["Biceps"] },
      { name: "Barbell Squat",          muscles: ["Quads", "Glutes"] },
      { name: "Barbell Deadlift",       muscles: ["Back", "Hamstrings", "Glutes"] },
      { name: "Barbell Overhead Press", muscles: ["Shoulders", "Triceps"] },
      { name: "Barbell Hip Thrust",     muscles: ["Glutes", "Hamstrings"] },
      { name: "Barbell Shrug",          muscles: ["Traps"] },
    ]
  },
  {
    id: "trap_bar",
    name: "Trap Bar",
    emoji: "⬡",
    exercises: [
      { name: "Trap Bar Deadlift",      muscles: ["Back", "Quads", "Hamstrings", "Glutes"] },
      { name: "Trap Bar Shrug",         muscles: ["Traps"] },
    ]
  },
  {
    id: "cable_machine",
    name: "Cable Machine",
    emoji: "🔗",
    exercises: [
      { name: "Cable Row",              muscles: ["Back", "Biceps"] },
      { name: "Cable Lateral Raise",    muscles: ["Side Delts"] },
      { name: "Cable Fly",              muscles: ["Chest"] },
      { name: "Low-to-High Cable Fly",  muscles: ["Upper Chest"] },
      { name: "High-to-Low Cable Fly",  muscles: ["Lower Chest"] },
      { name: "Cable Curl",             muscles: ["Biceps"] },
      { name: "Cable Tricep Pushdown",  muscles: ["Triceps"] },
      { name: "Cable Rope Extension",   muscles: ["Triceps"] },
      { name: "Straight-Arm Pulldown",  muscles: ["Back", "Lats"] },
      { name: "Cable Crunch",           muscles: ["Abs"] },
      { name: "Cable Pull-Through",     muscles: ["Glutes", "Hamstrings"] },
      { name: "Cable Face Pull",        muscles: ["Rear Delts", "Traps"] },
    ]
  },
  {
    id: "lat_pulldown",
    name: "Lat Pulldown Machine",
    emoji: "⬇️",
    exercises: [
      { name: "Lat Pulldown",           muscles: ["Back", "Lats", "Biceps"] },
      { name: "Lat Pulldown Dual Pulley", muscles: ["Back", "Lats"] },
      { name: "Close Grip Pulldown",    muscles: ["Back", "Biceps"] },
    ]
  },
  {
    id: "pull_up_bar",
    name: "Pull Up Bar / Assisted",
    emoji: "🏗️",
    exercises: [
      { name: "Pull Up",                muscles: ["Back", "Lats", "Biceps"] },
      { name: "Assisted Pull Up",       muscles: ["Back", "Lats", "Biceps"] },
      { name: "Chin Up",                muscles: ["Back", "Biceps"] },
      { name: "Hanging Knee Raise",     muscles: ["Abs"] },
      { name: "Hanging Leg Raise",      muscles: ["Abs"] },
    ]
  },
  {
    id: "leg_press",
    name: "Leg Press Machine",
    emoji: "🦵",
    exercises: [
      { name: "Leg Press",              muscles: ["Quads", "Glutes"] },
      { name: "Calf Press",             muscles: ["Calves"] },
      { name: "Single Leg Press",       muscles: ["Quads", "Glutes"] },
    ]
  },
  {
    id: "leg_curl",
    name: "Leg Curl Machine",
    emoji: "🦿",
    exercises: [
      { name: "Seated Leg Curl",        muscles: ["Hamstrings"] },
      { name: "Lying Leg Curl",         muscles: ["Hamstrings"] },
    ]
  },
  {
    id: "leg_extension",
    name: "Leg Extension Machine",
    emoji: "🦵",
    exercises: [
      { name: "Leg Extension",          muscles: ["Quads"] },
    ]
  },
  {
    id: "chest_press_machine",
    name: "Chest Press Machine",
    emoji: "💪",
    exercises: [
      { name: "Machine Chest Press",    muscles: ["Chest", "Front Delts", "Triceps"] },
      { name: "Machine Incline Press",  muscles: ["Upper Chest", "Front Delts"] },
    ]
  },
  {
    id: "shoulder_press_machine",
    name: "Shoulder Press Machine",
    emoji: "🔝",
    exercises: [
      { name: "Machine Shoulder Press", muscles: ["Shoulders", "Front Delts", "Triceps"] },
    ]
  },
  {
    id: "rear_delt_machine",
    name: "Rear Delt / Pec Deck Machine",
    emoji: "🔄",
    exercises: [
      { name: "Machine Rear Delt Fly",  muscles: ["Rear Delts"] },
      { name: "Machine Chest Fly",      muscles: ["Chest"] },
    ]
  },
  {
    id: "bicep_curl_machine",
    name: "Bicep Curl Machine",
    emoji: "💪",
    exercises: [
      { name: "Machine Bicep Curl",     muscles: ["Biceps"] },
    ]
  },
  {
    id: "tricep_machine",
    name: "Tricep Machine",
    emoji: "💪",
    exercises: [
      { name: "Machine Tricep Extension", muscles: ["Triceps"] },
    ]
  },
  {
    id: "smith_machine",
    name: "Smith Machine",
    emoji: "🏗️",
    exercises: [
      { name: "Smith Machine Squat",    muscles: ["Quads", "Glutes"] },
      { name: "Smith Machine Press",    muscles: ["Chest", "Triceps"] },
      { name: "Smith Machine Row",      muscles: ["Back"] },
      { name: "Smith Machine Hip Thrust", muscles: ["Glutes"] },
    ]
  },
  {
    id: "hack_squat",
    name: "Hack Squat Machine",
    emoji: "🦵",
    exercises: [
      { name: "Hack Squat",             muscles: ["Quads", "Glutes"] },
    ]
  },
  {
    id: "calf_raise_machine",
    name: "Standing Calf Raise Machine",
    emoji: "🦶",
    exercises: [
      { name: "Standing Calf Raise",    muscles: ["Calves"] },
      { name: "Seated Calf Raise",      muscles: ["Calves", "Soleus"] },
    ]
  },
  {
    id: "ab_bench",
    name: "Decline Bench / Ab Bench",
    emoji: "📐",
    exercises: [
      { name: "Decline Crunch",         muscles: ["Abs"] },
      { name: "Decline Sit Up",         muscles: ["Abs"] },
    ]
  },
  {
    id: "bodyweight",
    name: "Bodyweight",
    emoji: "🤸",
    exercises: [
      { name: "Push Up",                muscles: ["Chest", "Triceps", "Front Delts"] },
      { name: "Dip",                    muscles: ["Chest", "Triceps"] },
      { name: "Bodyweight Squat",       muscles: ["Quads", "Glutes"] },
      { name: "Glute Bridge",           muscles: ["Glutes", "Hamstrings"] },
      { name: "Plank",                  muscles: ["Abs", "Core"] },
      { name: "Crunch",                 muscles: ["Abs"] },
    ]
  },
  {
    id: "cardio",
    name: "Cardio (Treadmill / Bike / Rower)",
    emoji: "🏃",
    exercises: [
      { name: "Incline Treadmill",      muscles: ["Cardio"] },
      { name: "Stationary Bike",        muscles: ["Cardio", "Quads"] },
      { name: "Rowing Machine",         muscles: ["Cardio", "Back"] },
      { name: "Stair Climber",          muscles: ["Cardio", "Glutes", "Calves"] },
    ]
  },
];

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#07090F", surface: "#0D1117", border: "#1C2333",
  text: "#E2E8F0", muted: "#64748B", dim: "#334155",
  blue: "#3B82F6", blueDark: "#1D4ED8",
  green: "#10B981", greenDark: "#052E16", greenBorder: "#166534",
  gold: "#F59E0B", red: "#EF4444", purple: "#A855F7",
};

const DAY_COLORS = {
  push:  { color: "#2563EB", accent: "#3B82F6", emoji: "🔵" },
  pull:  { color: "#059669", accent: "#10B981", emoji: "🟢" },
  legs:  { color: "#D97706", accent: "#F59E0B", emoji: "🟠" },
  upper: { color: "#7C3AED", accent: "#A855F7", emoji: "🟣" },
  full:  { color: "#DC2626", accent: "#EF4444", emoji: "🔴" },
};

const SPLITS = {
  "3": { days: ["push", "pull", "legs"], names: ["Push Day", "Pull Day", "Legs Day"] },
  "4": { days: ["push", "pull", "legs", "push"], names: ["Push Day", "Pull Day", "Legs Day", "Push Day+"] },
  "5": { days: ["push", "pull", "legs", "upper", "pull"], names: ["Push Day", "Pull Day", "Legs Day", "Upper Body", "Pull Day+"] },
  "6": { days: ["push", "pull", "legs", "push", "pull", "legs"], names: ["Push A", "Pull A", "Legs A", "Push B", "Pull B", "Legs B"] },
};

const font = "'Inter', system-ui, sans-serif";

const RPE_STYLE = {
  "5": { bg: "#1C2333", color: "#64748B" }, "6": { bg: "#052E16", color: "#10B981" },
  "7": { bg: "#1E3A5F", color: "#60A5FA" }, "8": { bg: "#1E2D5C", color: "#818CF8" },
  "8-9": { bg: "#2D1B69", color: "#A78BFA" }, "9": { bg: "#3B0764", color: "#C084FC" },
};

// ─── REST TIMER ───────────────────────────────────────────────────────────────
function RestTimer({ seconds, onDone, onSkip }) {
  const [rem, setRem] = useState(seconds);
  useEffect(() => {
    if (rem <= 0) { onDone(); return; }
    const t = setTimeout(() => setRem(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [rem]);
  const pct = (seconds - rem) / seconds;
  const r = 72, circ = 2 * Math.PI * r;
  const m = Math.floor(rem / 60), s = rem % 60;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(7,9,15,0.97)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 200, fontFamily: font }}>
      <div style={{ color: C.muted, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>Rest</div>
      <div style={{ position: "relative", width: 180, height: 180, marginBottom: 32 }}>
        <svg width="180" height="180" style={{ transform: "rotate(-90deg)", position: "absolute" }}>
          <circle cx="90" cy="90" r={r} fill="none" stroke={C.border} strokeWidth="6" />
          <circle cx="90" cy="90" r={r} fill="none" stroke={C.blue} strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: C.text, fontVariantNumeric: "tabular-nums", letterSpacing: -2 }}>
            {m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : s}
          </div>
        </div>
      </div>
      <button onClick={onSkip} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "11px 32px", borderRadius: 10, fontSize: 13, cursor: "pointer", fontFamily: font }}>Skip Rest</button>
    </div>
  );
}

// ─── SET LOGGER ───────────────────────────────────────────────────────────────
function SetLogger({ exercise, setNum, totalSets, onLog, onCancel }) {
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState(exercise.weight === "BW" ? "BW" : exercise.weight || "");
  const [rpe, setRpe] = useState("8");
  const [note, setNote] = useState("");
  const inp = { background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: "12px 14px", fontSize: 16, width: "100%", outline: "none", boxSizing: "border-box", fontFamily: font };
  const lbl = { color: C.muted, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, display: "block" };
  const canLog = reps !== "" || weight === "BW";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(7,9,15,0.98)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px", zIndex: 200, fontFamily: font }}>
      <button onClick={onCancel} style={{ position: "absolute", top: 20, right: 20, background: C.border, border: "none", color: C.muted, width: 38, height: 38, borderRadius: 10, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      <div style={{ color: C.blue, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", marginBottom: 6 }}>Set {setNum} of {totalSets}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>{exercise.name}</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>Target: <span style={{ color: C.gold }}>{exercise.target}</span></div>
      <div style={{ fontSize: 12, color: C.dim, fontStyle: "italic", marginBottom: 24 }}>{exercise.cue}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div><label style={lbl}>Reps</label><input type="number" inputMode="numeric" placeholder="0" value={reps} onChange={e => setReps(e.target.value)} style={inp} autoFocus /></div>
        <div><label style={lbl}>Weight</label><input type="text" value={weight} onChange={e => setWeight(e.target.value)} style={inp} /></div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>RPE</label>
        <div style={{ display: "flex", gap: 6 }}>
          {["5","6","7","8","9","10"].map(r => {
            const active = rpe === r; const rs = RPE_STYLE[r] || RPE_STYLE["8"];
            return <button key={r} onClick={() => setRpe(r)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${active ? rs.color : C.border}`, background: active ? rs.bg : "transparent", color: active ? rs.color : C.dim, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font }}>{r}</button>;
          })}
        </div>
      </div>
      <div style={{ marginBottom: 24 }}><label style={lbl}>Note (optional)</label><input type="text" placeholder="felt strong, form off..." value={note} onChange={e => setNote(e.target.value)} style={{ ...inp, fontSize: 13 }} /></div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "14px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 15, cursor: "pointer", fontFamily: font }}>Cancel</button>
        <button onClick={() => canLog && onLog({ reps: parseInt(reps) || 0, weight, rpe, note })} style={{ flex: 2, padding: "14px", borderRadius: 10, border: "none", background: canLog ? C.blueDark : C.border, color: canLog ? "#fff" : C.dim, fontSize: 15, fontWeight: 700, cursor: canLog ? "pointer" : "default", fontFamily: font }}>Log Set →</button>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [cardioMins, setCardioMins] = useState("20");

  const steps = ["name", "goal", "experience", "days", "equipment", "cardio"];
  const totalSteps = steps.length;
  const pct = ((step) / totalSteps) * 100;

  function toggleEquipment(id) {
    setSelectedEquipment(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  }

  function finish() {
    const profile = { name, goal, experience, daysPerWeek, equipment: selectedEquipment, cardioMins, createdAt: new Date().toISOString() };
    onComplete(profile);
  }

  const card = { background: C.surface, borderRadius: 14, padding: "20px", border: `1px solid ${C.border}` };
  const optBtn = (active, color = C.blue) => ({
    padding: "13px 16px", borderRadius: 10, border: `1px solid ${active ? color : C.border}`,
    background: active ? `${color}22` : "transparent", color: active ? color : C.muted,
    fontSize: 14, fontWeight: active ? 700 : 400, cursor: "pointer", fontFamily: font,
    textAlign: "left", width: "100%", marginBottom: 8,
  });

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: font, color: C.text }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ background: "transparent", border: "none", color: C.muted, fontSize: 20, cursor: "pointer", padding: 0 }}>←</button>}
          <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2 }}>
            <div style={{ height: "100%", background: C.blue, borderRadius: 2, width: `${pct}%`, transition: "width 0.3s" }} />
          </div>
          <div style={{ color: C.muted, fontSize: 12 }}>{step + 1}/{totalSteps}</div>
        </div>

        {/* Step 0: Name */}
        {step === 0 && (
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Welcome 👋</div>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>Let's set up your personal coaching profile</div>
            <div style={card}>
              <div style={{ color: C.muted, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>What's your name?</div>
              <input type="text" placeholder="Your first name" value={name} onChange={e => setName(e.target.value)}
                style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 10, padding: "14px", fontSize: 18, width: "100%", outline: "none", boxSizing: "border-box", fontFamily: font }}
                onKeyDown={e => e.key === "Enter" && name && setStep(1)} autoFocus />
            </div>
            <button onClick={() => name && setStep(1)} style={{ width: "100%", marginTop: 16, padding: "16px", borderRadius: 12, border: "none", background: name ? C.blueDark : C.border, color: name ? "#fff" : C.dim, fontSize: 16, fontWeight: 700, cursor: name ? "pointer" : "default", fontFamily: font }}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 1: Goal */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Hey {name} 👊</div>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>What's your main goal right now?</div>
            {[
              { id: "recomp", label: "Recomp", sub: "Build muscle while losing fat", emoji: "⚡" },
              { id: "bulk", label: "Build Muscle", sub: "Focus on size and strength gains", emoji: "💪" },
              { id: "cut", label: "Cut", sub: "Maintain muscle while losing fat", emoji: "🔥" },
              { id: "strength", label: "Pure Strength", sub: "Maximise your lifts", emoji: "🏆" },
              { id: "fitness", label: "General Fitness", sub: "Stay fit and healthy", emoji: "🌟" },
            ].map(g => (
              <button key={g.id} onClick={() => { setGoal(g.id); setStep(2); }} style={optBtn(goal === g.id)}>
                <span style={{ marginRight: 12 }}>{g.emoji}</span>
                <strong>{g.label}</strong> — <span style={{ color: C.muted, fontSize: 13 }}>{g.sub}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Experience */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Training Experience</div>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>This sets your starting weights and volume</div>
            {[
              { id: "beginner", label: "Beginner", sub: "Less than 1 year consistent training", emoji: "🌱" },
              { id: "intermediate", label: "Intermediate", sub: "1–3 years, know the basics", emoji: "📈" },
              { id: "advanced", label: "Advanced", sub: "3+ years, comfortable with most movements", emoji: "🔥" },
            ].map(e => (
              <button key={e.id} onClick={() => { setExperience(e.id); setStep(3); }} style={optBtn(experience === e.id)}>
                <span style={{ marginRight: 12 }}>{e.emoji}</span>
                <strong>{e.label}</strong> — <span style={{ color: C.muted, fontSize: 13 }}>{e.sub}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Days */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Days Per Week</div>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>How many days can you realistically train?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {["3", "4", "5", "6"].map(d => (
                <button key={d} onClick={() => { setDaysPerWeek(d); setStep(4); }}
                  style={{ ...optBtn(daysPerWeek === d), textAlign: "center", padding: "20px" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: daysPerWeek === d ? C.blue : C.text }}>{d}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>days/week</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Equipment */}
        {step === 4 && (
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Your Equipment</div>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 8 }}>Select everything available at your gym</div>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 20 }}>
              {selectedEquipment.length} selected · Tap to toggle
            </div>
            <div style={{ maxHeight: "55vh", overflowY: "auto", marginBottom: 16 }}>
              {EQUIPMENT_DB.map(eq => {
                const active = selectedEquipment.includes(eq.id);
                return (
                  <button key={eq.id} onClick={() => toggleEquipment(eq.id)}
                    style={{ width: "100%", marginBottom: 6, padding: "12px 14px", borderRadius: 12, border: `1px solid ${active ? C.green : C.border}`, background: active ? `${C.green}18` : C.surface, cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12, fontFamily: font, textAlign: "left" }}>
                    <span style={{ fontSize: 20, marginTop: 1 }}>{eq.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: active ? 700 : 500, fontSize: 14, color: active ? C.green : C.text }}>{eq.name}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>
                        {eq.exercises.slice(0, 3).map(e => e.name).join(", ")}{eq.exercises.length > 3 ? ` +${eq.exercises.length - 3} more` : ""}
                      </div>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${active ? C.green : C.border}`, background: active ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      {active && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => selectedEquipment.length > 0 && setStep(5)}
              style={{ width: "100%", padding: "16px", borderRadius: 12, border: "none", background: selectedEquipment.length > 0 ? C.blueDark : C.border, color: selectedEquipment.length > 0 ? "#fff" : C.dim, fontSize: 16, fontWeight: 700, cursor: selectedEquipment.length > 0 ? "pointer" : "default", fontFamily: font }}>
              Continue with {selectedEquipment.length} items →
            </button>
          </div>
        )}

        {/* Step 5: Cardio */}
        {step === 5 && (
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Cardio</div>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>How long after lifting? (0 = no cardio)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
              {["0", "10", "15", "20", "30", "45"].map(m => (
                <button key={m} onClick={() => setCardioMins(m)}
                  style={{ ...optBtn(cardioMins === m), textAlign: "center", padding: "18px 10px" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: cardioMins === m ? C.blue : C.text }}>{m}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>min</div>
                </button>
              ))}
            </div>
            <button onClick={finish} style={{ width: "100%", padding: "18px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${C.blueDark}, ${C.blue})`, color: "#fff", fontSize: 17, fontWeight: 800, cursor: "pointer", fontFamily: font }}>
              Start Training 💪
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BUILD AI PROMPT ──────────────────────────────────────────────────────────
function buildPrompt(profile, dayType, sessionHistory) {
  // Get available exercises from selected equipment
  const availableExercises = EQUIPMENT_DB
    .filter(eq => profile.equipment.includes(eq.id))
    .flatMap(eq => eq.exercises.map(ex => ({
      ...ex,
      equipment: eq.name,
      equipmentId: eq.id
    })));

  const exerciseList = availableExercises.map(e =>
    `- ${e.name} (${e.equipment}) → targets: ${e.muscles.join(", ")}`
  ).join("\n");

  const recentHistory = sessionHistory.slice(-9).map(s => {
    const exSummary = s.exercises
      ? Object.entries(s.exercises).map(([name, d]) => `    ${name}: ${d.reps}x${d.weight}${d.e1rm ? ` (e1RM ${d.e1rm})` : ""}`).join("\n")
      : "";
    return `${s.date}: ${s.dayName} (${s.totalSets} sets)\n${exSummary}`;
  }).join("\n\n") || "No previous sessions — this is their first workout.";

  const pbList = Object.entries(profile.pbs || {}).map(([ex, pb]) =>
    `${ex}: ${pb.reps}r @ ${pb.weight}`
  ).join("\n") || "No PBs recorded yet — use beginner-appropriate starting weights.";

  const startingWeights = {
    beginner: "Use light weights, 60-70% of estimated max, focus on form and rep completion",
    intermediate: "Use moderate weights, 70-80% of estimated max, push to RPE 8",
    advanced: "Use challenging weights, 80-85% of estimated max, chase progressive overload"
  }[profile.experience];

  return `You are a personal fitness coach building a workout session for ${profile.name}.

=== PROFILE ===
Name: ${profile.name}
Goal: ${profile.goal}
Experience: ${profile.experience}
Days per week: ${profile.daysPerWeek}
Cardio after lifting: ${profile.cardioMins} minutes

=== AVAILABLE EQUIPMENT & EXERCISES ===
ONLY use exercises from this list. Do not suggest exercises for equipment not listed.
${exerciseList}

=== PERSONAL BESTS ===
${pbList}

=== RECENT SESSION HISTORY ===
${recentHistory}

=== STARTING WEIGHT GUIDANCE ===
${startingWeights}

=== COACHING RULES ===
- Build smart supersets pairing non-competing muscle groups
- Calves and abs should always be paired within supersets (zero interference)
- Priority muscles (based on goal: ${profile.goal}) trained first while fresh
- Include 1 warmup set for primary compound movements
- RPE 8-9 for working sets, RPE 6 for pump/recovery work
- Rest: 90s after compound supersets, 60s after isolation, 45s after finishers
- Volume: ~18-22 working sets total for 50 min lifting
- Progressive overload: always target 1 more rep or slightly more weight than last PB
- For beginners: keep it simple, 2-3 exercises per muscle group max, focus on form cues
- Tag exercises as "priority", "warmup", or "" based on importance

=== TODAY'S SESSION ===
Day type: ${dayType.toUpperCase()}
Date: ${new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}

Build the session as a JSON object with this EXACT structure:
{
  "dayName": "Pull Day",
  "focus": "Back, Biceps & Rear Delts",
  "coachNote": "2-3 sentence personalised coaching note for ${profile.name} based on their history and today's focus",
  "pbs": [{"exercise": "Cable Row", "current": "60x12", "target": "60x13 or 65x10"}],
  "blocks": [
    {
      "id": "A",
      "rest": 90,
      "label": "Superset A — Back + Calves",
      "exercises": [
        {
          "id": "A1",
          "name": "Cable Row",
          "sets": 3,
          "target": "60x12+",
          "weight": "60",
          "unit": "lbs",
          "rpe": "8-9",
          "cue": "Drive elbows back, squeeze at the end of each rep",
          "tag": "priority"
        }
      ]
    }
  ]
}

CRITICAL: Only use exercises available in the equipment list above. Respond with ONLY the JSON object.`;
}

// ─── CALL AI ──────────────────────────────────────────────────────────────────
async function buildSessionWithAI(profile, dayType, sessionHistory) {
  const prompt = buildPrompt(profile, dayType, sessionHistory);
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 4000, messages: [{ role: "user", content: prompt }] })
  });
  const data = await response.json();
  const text = data.content.map(c => c.text || "").join("").trim();
  const clean = text.replace(/```json|```/g, "").trim();
  const lastBrace = clean.lastIndexOf("}");
  const safeJson = lastBrace > 0 ? clean.substring(0, lastBrace + 1) : clean;
  try {
    const parsed = JSON.parse(safeJson);
    if (!parsed.blocks || !Array.isArray(parsed.blocks)) throw new Error("Invalid structure");
    parsed.blocks = parsed.blocks.map(b => ({ ...b, exercises: Array.isArray(b.exercises) ? b.exercises : [] }));
    return parsed;
  } catch(e) {
    throw new Error("Session build failed — tap retry.");
  }
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
function LoadingScreen({ dayName, colors }) {
  const [dots, setDots] = useState(".");
  const msgs = ["Reading your profile...", "Checking your equipment...", "Building smart supersets...", "Setting targets from your PBs...", "Applying progressive overload...", "Almost ready..."];
  const [msgIdx, setMsgIdx] = useState(0);
  useEffect(() => {
    const d = setInterval(() => setDots(p => p.length >= 3 ? "." : p + "."), 500);
    const m = setInterval(() => setMsgIdx(i => (i + 1) % msgs.length), 2000);
    return () => { clearInterval(d); clearInterval(m); };
  }, []);
  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: font, color: C.text, padding: 20 }}>
      <div style={{ fontSize: 48, marginBottom: 24 }}>🤖</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Building your session</div>
      <div style={{ color: C.muted, fontSize: 14, marginBottom: 40 }}>{dayName}</div>
      <div style={{ width: 48, height: 48, border: `3px solid ${C.border}`, borderTop: `3px solid ${colors?.accent || C.blue}`, borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 32 }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ color: C.muted, fontSize: 13, textAlign: "center", maxWidth: 260 }}>{msgs[msgIdx]}{dots}</div>
    </div>
  );
}

// ─── SESSION SCREEN ───────────────────────────────────────────────────────────
function SessionScreen({ session, dayColorKey, externalLogs, onLogsChange, onBack, onAbandon, onComplete }) {
  const [logs, setLogs] = useState(externalLogs || {});
  const [activeSet, setActiveSet] = useState(null);
  const [resting, setResting] = useState(null);
  const [expanded, setExpanded] = useState(session.blocks[0]?.id);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const colors = DAY_COLORS[dayColorKey] || DAY_COLORS.pull;

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  function updateLogs(newLogs) { setLogs(newLogs); onLogsChange(newLogs); }
  function logSet(exId, data, rest) {
    const newLogs = { ...logs, [exId]: [...(logs[exId] || []), data] };
    updateLogs(newLogs);
    setActiveSet(null);
    setResting({ seconds: rest });
  }

  const totalSets = (session.blocks || []).reduce((s, b) => s + (b.exercises || []).reduce((ss, e) => ss + e.sets, 0), 0);
  const totalLogged = Object.values(logs).reduce((s, a) => s + a.length, 0);
  const em = Math.floor(elapsed / 60), es = elapsed % 60;
  function exLogged(id) { return logs[id] || []; }
  function blockDone(b) { return (b.exercises || []).every(e => exLogged(e.id).length >= e.sets); }
  function sessionDone() { return (session.blocks || []).every(b => blockDone(b)); }
  const newPBs = Object.entries(logs).reduce((count, [exId, sets]) => {
    const ex = (session.blocks || []).flatMap(b => b.exercises || []).find(e => e.id === exId);
    const pb = session.pbs?.find(p => p.exercise === ex?.name);
    if (!pb || !ex) return count;
    return count + sets.filter(s => { const pbReps = parseInt(pb.current?.split("x")[1]) || 0; return s.reps > pbReps; }).length;
  }, 0);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: font, color: C.text }}>
      {resting && <RestTimer seconds={resting.seconds} onDone={() => setResting(null)} onSkip={() => setResting(null)} />}
      {activeSet && <SetLogger exercise={activeSet.ex} setNum={activeSet.setNum} totalSets={activeSet.ex.sets} onLog={d => logSet(activeSet.exId, d, activeSet.rest)} onCancel={() => setActiveSet(null)} />}

      <div style={{ position: "sticky", top: 0, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => { clearInterval(timerRef.current); onBack(); }} style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted, width: 36, height: 36, borderRadius: 8, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{session.dayName}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{totalLogged}/{totalSets} sets</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontVariantNumeric: "tabular-nums", fontSize: 22, fontWeight: 800, color: colors.accent }}>{em}:{es.toString().padStart(2, "0")}</div>
          {newPBs > 0 && <div style={{ fontSize: 10, color: C.gold, fontWeight: 700 }}>🏆 {newPBs} PB{newPBs > 1 ? "s" : ""}</div>}
        </div>
      </div>

      <div style={{ height: 3, background: C.border }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${colors.color}, ${colors.accent})`, width: `${(totalLogged / totalSets) * 100}%`, transition: "width 0.4s" }} />
      </div>

      <div style={{ padding: "14px 14px 100px", maxWidth: 480, margin: "0 auto" }}>
        {session.coachNote && (
          <div style={{ background: "#0D1B2A", border: `1px solid ${colors.color}44`, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ color: colors.accent, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>💬 Coach</div>
            <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{session.coachNote}</div>
          </div>
        )}

        {session.pbs?.length > 0 && (
          <div style={{ background: "#1C1400", border: "1px solid #3D2900", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
            <div style={{ color: C.gold, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>🎯 PBs on the line</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {session.pbs.map(pb => (
                <span key={pb.exercise} style={{ background: "#2D1F00", color: C.gold, fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>
                  {pb.exercise}: {pb.current} → {pb.target}
                </span>
              ))}
            </div>
          </div>
        )}

        {(session.blocks || []).map(block => {
          const done = blockDone(block);
          const open = expanded === block.id;
          return (
            <div key={block.id} style={{ marginBottom: 10, borderRadius: 14, border: `1px solid ${done ? C.greenBorder : open ? `${colors.color}55` : C.border}`, background: done ? C.greenDark : C.surface, overflow: "hidden" }}>
              <button onClick={() => setExpanded(open ? null : block.id)} style={{ width: "100%", padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: font }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: done ? C.greenBorder : colors.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff" }}>{done ? "✓" : block.id}</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{block.label || `Block ${block.id}`}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{block.rest}s rest · {(block.exercises || []).length} exercises</div>
                  </div>
                </div>
                <span style={{ color: C.dim, fontSize: 18 }}>{open ? "▲" : "▼"}</span>
              </button>
              {open && (
                <div style={{ padding: "0 12px 12px" }}>
                  {(block.exercises || []).map(ex => {
                    const logged = exLogged(ex.id);
                    const isDone = logged.length >= ex.sets;
                    const rpeStyle = RPE_STYLE[ex.rpe] || RPE_STYLE["8"];
                    return (
                      <div key={ex.id} style={{ background: isDone ? "#052E16" : ex.tag === "warmup" ? "#0D1117" : C.bg, borderRadius: 10, padding: "12px 13px", marginBottom: 8, border: `1px solid ${isDone ? C.greenBorder : ex.tag === "priority" ? `${colors.color}44` : C.border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <div style={{ flex: 1, paddingRight: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, marginBottom: 3 }}>
                              <span style={{ fontWeight: 700, fontSize: 13, color: isDone ? C.green : C.text }}>{ex.id}. {ex.name}</span>
                              {ex.tag === "priority" && <span style={{ background: `${colors.color}33`, color: colors.accent, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>PRIORITY</span>}
                              {ex.tag === "warmup" && <span style={{ background: C.border, color: C.muted, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>WARM-UP</span>}
                            </div>
                            <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>{ex.weight} {ex.unit} · <span style={{ color: C.gold }}>{ex.target}</span></div>
                            <div style={{ fontSize: 11, color: C.dim, fontStyle: "italic" }}>{ex.cue}</div>
                          </div>
                          <div style={{ background: rpeStyle.bg, color: rpeStyle.color, fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 6, letterSpacing: 1, flexShrink: 0 }}>RPE {ex.rpe}</div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: logged.length ? 8 : 0 }}>
                          {Array.from({ length: ex.sets }).map((_, i) => {
                            const isLogged = i < logged.length;
                            const isNext = i === logged.length;
                            return (
                              <button key={i} onClick={() => !isLogged && setActiveSet({ exId: ex.id, ex, setNum: i + 1, rest: block.rest })}
                                style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${isLogged ? C.greenBorder : isNext ? colors.color : C.border}`, background: isLogged ? C.greenDark : isNext ? `${colors.color}22` : "transparent", color: isLogged ? C.green : isNext ? colors.accent : C.dim, fontSize: 12, fontWeight: 700, cursor: isLogged ? "default" : "pointer", fontFamily: font }}>
                                {isLogged ? `✓ ${logged[i].reps}` : `Set ${i + 1}`}
                              </button>
                            );
                          })}
                        </div>
                        {logged.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {logged.map((s, i) => (
                              <div key={i} style={{ fontSize: 10, color: C.green, background: "#052E16", padding: "3px 8px", borderRadius: 5 }}>
                                {s.reps}r @ {s.weight} · RPE {s.rpe}{s.note ? ` · ${s.note}` : ""}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {sessionDone() && (
          <button onClick={() => { clearInterval(timerRef.current); onComplete({ dayId: dayColorKey, dayName: session.dayName, logs, duration: em, totalSets: totalLogged, pbs: newPBs }); }}
            style={{ width: "100%", padding: "18px", borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${colors.color}, ${colors.accent})`, color: "#fff", fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: font, marginBottom: 12 }}>
            Complete Session ✓
          </button>
        )}

        <button onClick={() => window.confirm("Cancel workout? Progress will be lost.") && (clearInterval(timerRef.current), onAbandon())}
          style={{ width: "100%", padding: "13px", borderRadius: 12, border: "1px solid #3D1515", background: "transparent", color: C.red, fontSize: 14, cursor: "pointer", fontFamily: font, marginTop: 4 }}>
          Cancel Workout
        </button>
      </div>
    </div>
  );
}

// ─── DONE SCREEN ──────────────────────────────────────────────────────────────
function DoneScreen({ result, session, onHome }) {
  const allEx = (session.blocks || []).flatMap(b => b.exercises || []);
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: font, color: C.text, padding: "40px 20px 60px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>💪</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 8px", letterSpacing: -0.5 }}>Session Done</h1>
          <div style={{ color: C.muted, fontSize: 14 }}>{result.duration}m · {result.totalSets} sets{result.pbs > 0 ? ` · 🏆 ${result.pbs} PB${result.pbs > 1 ? "s" : ""}` : ""}</div>
        </div>
        {allEx.filter(ex => (result.logs[ex.id] || []).length > 0).map(ex => (
          <div key={ex.id} style={{ background: C.surface, borderRadius: 12, padding: "13px 15px", marginBottom: 8, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 7 }}>{ex.name}</div>
            {(result.logs[ex.id] || []).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, fontSize: 12, color: C.muted, padding: "3px 0" }}>
                <span style={{ color: C.dim, minWidth: 40 }}>Set {i + 1}</span>
                <span style={{ color: C.text }}>{s.reps} reps</span>
                <span>@ {s.weight}</span>
                <span style={{ color: RPE_STYLE[s.rpe]?.color || C.muted }}>RPE {s.rpe}</span>
                {s.note && <span style={{ color: C.dim, fontStyle: "italic" }}>— {s.note}</span>}
              </div>
            ))}
          </div>
        ))}
        <button onClick={onHome} style={{ width: "100%", marginTop: 20, padding: "15px", borderRadius: 12, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 15, cursor: "pointer", fontFamily: font }}>← Home</button>
      </div>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ profile, history, activeSession, onStart, onResume }) {
  const [showAll, setShowAll] = useState(false);
  const today = new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short" });
  const split = SPLITS[profile.daysPerWeek] || SPLITS["3"];
  const lastDayIdx = history.length > 0 ? split.days.indexOf(history[history.length - 1]?.dayId) : -1;
  const nextIdx = (lastDayIdx + 1) % split.days.length;
  const nextDayKey = split.days[nextIdx];
  const nextDayName = split.names[nextIdx];
  const colors = DAY_COLORS[nextDayKey] || DAY_COLORS.push;
  const lastSession = history[history.length - 1];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: font, color: C.text }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "36px 20px 80px" }}>

        <div style={{ color: C.muted, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{today}</div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5, marginBottom: 2 }}>{profile.name}'s Gym</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{ color: C.muted, fontSize: 13 }}>AI-powered · {profile.daysPerWeek} days/week</div>
          {profile.importedFromTracker && (
            <span style={{ background: "#052E16", color: C.green, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5, letterSpacing: 1 }}>
              📊 TRACKER IMPORTED
            </span>
          )}
        </div>

        {/* Resume banner */}
        {activeSession && (
          <div style={{ background: "#0D2137", border: `1px solid ${C.blue}`, borderRadius: 14, padding: "16px 18px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: C.blue, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>⏸ In Progress</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{activeSession.dayName}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{Object.values(activeSession.logs || {}).reduce((s, a) => s + a.length, 0)} sets logged</div>
            </div>
            <button onClick={onResume} style={{ background: C.blueDark, border: "none", color: "#fff", padding: "12px 18px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font }}>Resume →</button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
          {[
            { val: history.length, label: "Sessions" },
            { val: history.reduce((s, h) => s + (h.totalSets || 0), 0), label: "Sets" },
            { val: history.reduce((s, h) => s + (h.pbs || 0), 0), label: "PBs" },
          ].map(s => (
            <div key={s.label} style={{ background: C.surface, borderRadius: 12, padding: "14px 10px", textAlign: "center", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.blue }}>{s.val}</div>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {lastSession && (
          <div style={{ background: C.surface, borderRadius: 10, padding: "10px 14px", marginBottom: 20, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: C.muted, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>Last Session</div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{lastSession.dayName} · {lastSession.date}</div>
            </div>
            {lastSession.pbs > 0 && <span style={{ background: "#451A03", color: C.gold, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>🏆 {lastSession.pbs}</span>}
          </div>
        )}

        {/* Today's session — big card */}
        <div style={{ color: C.muted, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Today's Session</div>
        <div style={{ background: `${colors.color}18`, border: `1.5px solid ${colors.color}`, borderRadius: 16, padding: "22px 20px", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: colors.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{colors.emoji}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: C.text }}>{nextDayName}</div>
              <div style={{ fontSize: 13, color: C.muted }}>
                {history.length === 0 ? "First session — let's go!" : `Based on your rotation · Session ${history.length + 1}`}
              </div>
            </div>
          </div>
          <button onClick={() => onStart(nextDayKey, nextDayName)} style={{ width: "100%", padding: "16px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${colors.color}, ${colors.accent})`, color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: font }}>
            Start {nextDayName} →
          </button>
        </div>

        {/* Override */}
        <button onClick={() => setShowAll(v => !v)} style={{ width: "100%", padding: "11px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: font, marginBottom: showAll ? 10 : 0 }}>
          {showAll ? "▲ Hide other days" : "▼ Train a different day"}
        </button>

        {showAll && split.days.map((dayId, i) => {
          if (i === nextIdx) return null;
          const dc = DAY_COLORS[dayId] || DAY_COLORS.push;
          return (
            <button key={i} onClick={() => onStart(dayId, split.names[i])}
              style={{ width: "100%", marginBottom: 8, padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: font, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{dc.emoji}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{split.names[i]}</div>
              </div>
              <span style={{ color: C.dim, fontSize: 18 }}>›</span>
            </button>
          );
        })}

        {/* Recent history */}
        {history.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ color: C.muted, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Recent</div>
            {[...history].reverse().slice(0, 3).map((h, i) => (
              <div key={i} style={{ background: C.surface, borderRadius: 10, padding: "11px 14px", marginBottom: 6, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{h.dayName}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{h.date} · {h.totalSets} sets · {h.duration}m</div>
                </div>
                {h.pbs > 0 && <span style={{ background: "#451A03", color: C.gold, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>🏆 {h.pbs}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

// Storage helpers — localStorage so each browser/user gets isolated data
const store = {
  async get(key) {
    try {
      const val = localStorage.getItem("gymcoach_" + key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
  async set(key, value) {
    try {
      localStorage.setItem("gymcoach_" + key, JSON.stringify(value));
    } catch {}
  },
  async del(key) {
    try {
      localStorage.removeItem("gymcoach_" + key);
    } catch {}
  }
};

export default function App() {
  const [screen, setScreen] = useState("loading_init");
  const [profile, setProfile] = useState(null);
  const [activeDayKey, setActiveDayKey] = useState(null);
  const [activeDayName, setActiveDayName] = useState(null);
  const [session, setSession] = useState(null);
  const [logs, setLogs] = useState({});
  const [completedResult, setCompletedResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [lastAttempt, setLastAttempt] = useState(null);
  const [resuming, setResuming] = useState(false);

  useEffect(() => {
    async function init() {
      let loadedProfile = null;
      let loadedHistory = [];

      loadedProfile = await store.get("profile");

      if (loadedProfile) {
        loadedHistory = await store.get("history") || [];
        setProfile(loadedProfile);
        setHistory(loadedHistory);
      } else {
        setProfile(null);
      }

      const active = await store.get("active_session");
      if (active) {
        const { session, dayKey, dayName, logs } = active;
        setSession(session); setActiveDayKey(dayKey); setActiveDayName(dayName); setLogs(logs || {});
        setResuming(true);
        setTimeout(() => setResuming(false), 3000);
      }
      setScreen("home");
    }
    init();
  }, []);

  useEffect(() => {
    if (screen === "session" && session) {
      store.set("active_session", { session, dayKey: activeDayKey, dayName: activeDayName, logs });
    }
  }, [logs, screen, session]);

  async function saveProfile(p) {
    let initialHistory = [];
    if (p.name.toLowerCase() === "steve") {
      const seededProfile = { ...p, ...STEVE_PROFILE, name: p.name, goal: p.goal, experience: p.experience, daysPerWeek: p.daysPerWeek, cardioMins: p.cardioMins, equipment: p.equipment, importedFromTracker: true };
      initialHistory = STEVE_HISTORY;
      setProfile(seededProfile);
      setHistory(initialHistory);
      await store.set("profile", seededProfile);
      await store.set("history", initialHistory);
    } else {
      setProfile(p);
      await store.set("profile", p);
    }
    setScreen("home");
  }

  async function startSession(dayId, dayName) {
    setActiveDayKey(dayId); setActiveDayName(dayName);
    setLastAttempt({ dayId, dayName }); setLogs({});
    setScreen("building");
    setError(null);
    try {
      const built = await buildSessionWithAI(profile, dayId, history);
      setSession(built); setScreen("session");
    } catch (e) {
      setError(`Couldn't build session: ${e.message}`);
      setScreen("home");
    }
  }

  async function completeSession(result) {
    await store.del("active_session");
    const newPBs = { ...(profile.pbs || {}) };
    const day = session;
    (day.blocks || []).flatMap(b => b.exercises || []).forEach(ex => {
      (result.logs[ex.id] || []).forEach(s => {
        if (!s.reps) return;
        const cur = newPBs[ex.name] || { reps: 0, weight: 0 };
        newPBs[ex.name] = { reps: Math.max(cur.reps, s.reps), weight: Math.max(cur.weight, parseFloat(s.weight) || 0) };
      });
    });
    const updatedProfile = { ...profile, pbs: newPBs };
    setProfile(updatedProfile);
    await store.set("profile", updatedProfile);

    const date = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short" });
    const record = { ...result, date };
    const newHistory = [...history, record];
    setHistory(newHistory);
    await store.set("history", newHistory);
    setCompletedResult(record); setScreen("done");
  }

  function pauseSession() { setScreen("home"); }

  function abandonSession() {
    store.del("active_session");
    setSession(null); setLogs({}); setActiveDayKey(null); setScreen("home");
  }

  const colors = DAY_COLORS[activeDayKey] || DAY_COLORS.pull;

  if (screen === "loading_init") return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>
      <div style={{ fontSize: 48 }}>💪</div>
    </div>
  );

  if (!profile || screen === "onboarding") return <Onboarding onComplete={saveProfile} />;

  if (screen === "building") return <LoadingScreen dayName={activeDayName} colors={colors} />;

  if (screen === "session" && session) return (
    <>
      {resuming && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: "#166534", color: "#4ADE80", padding: "10px 16px", fontSize: 13, zIndex: 999, fontFamily: font, textAlign: "center", fontWeight: 600 }}>
          ✓ Session resumed — progress saved
        </div>
      )}
      <SessionScreen session={session} dayColorKey={activeDayKey} externalLogs={logs} onLogsChange={setLogs} onBack={pauseSession} onAbandon={abandonSession} onComplete={completeSession} />
    </>
  );

  if (screen === "done") return <DoneScreen result={completedResult} session={session} onHome={() => setScreen("home")} />;

  return (
    <>
      {error && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: "#450A0A", color: "#FCA5A5", padding: "12px 16px", fontSize: 13, zIndex: 999, fontFamily: font, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>⚠️ {error}</span>
          <div style={{ display: "flex", gap: 10, flexShrink: 0, marginLeft: 10 }}>
            {lastAttempt && <button onClick={() => { setError(null); startSession(lastAttempt.dayId, lastAttempt.dayName); }} style={{ background: "#FCA5A5", border: "none", color: "#450A0A", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Retry</button>}
            <button onClick={() => setError(null)} style={{ background: "transparent", border: "none", color: "#FCA5A5", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
        </div>
      )}
      <HomeScreen
        profile={profile}
        history={history}
        activeSession={session ? { dayName: activeDayName, logs } : null}
        onStart={startSession}
        onResume={() => setScreen("session")}
      />
    </>
  );
}
