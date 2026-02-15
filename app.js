// Medication Computation Trainer (free static app)
// - Practice mode: all filtered questions
// - Escape mode: 4-lock adult scenario (timer + must pass to unlock next)

const $ = (id) => document.getElementById(id);

const questions = [
  // Conversions
  {
    id: "conv_12oz_ml",
    topic: "conversion",
    tag: "Conversion",
    title: "Fluid Intake Conversion",
    prompt: "The patient drank 12 oz of juice. Convert to milliliters. (Use 1 oz = 30 mL)",
    fields: [{ key: "ml", label: "Answer in mL", unit: "mL" }],
    answers: { ml: 360 },
    tolerance: { ml: 0 },
    hint: "Multiply ounces by 30.",
    solution:
      "12 oz × 30 mL/oz = 360 mL."
  },
  {
    id: "conv_950ml_l",
    topic: "conversion",
    tag: "Conversion",
    title: "Urine Output Conversion",
    prompt: "The patient voided 950 mL. Convert to liters.",
    fields: [{ key: "l", label: "Answer in liters", unit: "L" }],
    answers: { l: 0.95 },
    tolerance: { l: 0.001 },
    hint: "Divide mL by 1000.",
    solution:
      "950 mL ÷ 1000 = 0.95 L."
  },

  // Pediatrics
  {
    id: "peds_ctx_30kg_total",
    topic: "peds",
    tag: "Pediatrics",
    title: "Ceftriaxone Daily Dose",
    prompt: "A 6-year-old child weighs 30 kg. Order: Ceftriaxone 50 mg/kg/day IV divided BID. Compute TOTAL daily dose (mg/day).",
    fields: [{ key: "mgday", label: "Total daily dose", unit: "mg/day" }],
    answers: { mgday: 1500 },
    tolerance: { mgday: 0 },
    hint: "Dose/kg/day × weight (kg).",
    solution:
      "50 mg/kg/day × 30 kg = 1500 mg/day."
  },
  {
    id: "peds_ctx_30kg_perdose",
    topic: "peds",
    tag: "Pediatrics",
    title: "Ceftriaxone Dose per Administration",
    prompt: "Same patient (30 kg). Ceftriaxone 50 mg/kg/day divided BID. Compute dose PER administration (mg/dose).",
    fields: [{ key: "mgdose", label: "Dose per administration", unit: "mg/dose" }],
    answers: { mgdose: 750 },
    tolerance: { mgdose: 0 },
    hint: "Compute daily dose then divide by 2 for BID.",
    solution:
      "Daily dose: 1500 mg/day. BID: 1500 ÷ 2 = 750 mg/dose."
  },
  {
    id: "peds_ctx_30kg_ml",
    topic: "peds",
    tag: "Pediatrics",
    title: "Ceftriaxone Volume",
    prompt: "Same patient. Stock after reconstitution: 100 mg/mL. If ordered dose is 750 mg, how many mL will you give per dose?",
    fields: [{ key: "ml", label: "Volume to administer", unit: "mL" }],
    answers: { ml: 7.5 },
    tolerance: { ml: 0.01 },
    hint: "mL = ordered mg ÷ (mg/mL).",
    solution:
      "750 mg ÷ 100 mg/mL = 7.5 mL."
  },
  {
    id: "peds_ibu_lb_to_kg",
    topic: "peds",
    tag: "Pediatrics",
    title: "Ibuprofen: lb to kg",
    prompt: "A 4-year-old weighs 35 lb. Convert to kg (1 kg = 2.2 lb).",
    fields: [{ key: "kg", label: "Weight", unit: "kg" }],
    answers: { kg: 15.9 },
    tolerance: { kg: 0.05 },
    hint: "Divide pounds by 2.2.",
    solution:
      "35 ÷ 2.2 = 15.909... ≈ 15.9 kg."
  },
  {
    id: "peds_ibu_mg",
    topic: "peds",
    tag: "Pediatrics",
    title: "Ibuprofen: Dose in mg",
    prompt: "Same child: 35 lb (≈15.9 kg). Order: Ibuprofen 10 mg/kg. Compute dose in mg.",
    fields: [{ key: "mg", label: "Dose", unit: "mg" }],
    answers: { mg: 159 },
    tolerance: { mg: 1 },
    hint: "10 mg/kg × kg.",
    solution:
      "10 × 15.9 = 159 mg."
  },
  {
    id: "peds_ibu_ml",
    topic: "peds",
    tag: "Pediatrics",
    title: "Ibuprofen: Volume (mL)",
    prompt: "Stock: 100 mg/5 mL. If dose is 159 mg, how many mL will you give?",
    fields: [{ key: "ml", label: "Volume", unit: "mL" }],
    answers: { ml: 8.0 },
    tolerance: { ml: 0.1 },
    hint: "100 mg/5 mL = 20 mg/mL, then mL = mg ÷ 20.",
    solution:
      "100/5 = 20 mg/mL. 159 ÷ 20 = 7.95 mL ≈ 8.0 mL."
  },

  // IV additives
  {
    id: "add_kcl_ml",
    topic: "additives",
    tag: "IV Additives",
    title: "KCl Additive Volume",
    prompt: "Order: D5W 500 mL + 10 mEq KCl. Stock: KCl 2 mEq/mL. How many mL of KCl will you add?",
    fields: [{ key: "ml", label: "KCl volume", unit: "mL" }],
    answers: { ml: 5 },
    tolerance: { ml: 0 },
    hint: "mL = ordered mEq ÷ (mEq/mL).",
    solution:
      "10 mEq ÷ 2 mEq/mL = 5 mL."
  },
  {
    id: "add_d5w_rate",
    topic: "additives",
    tag: "IV Additives",
    title: "Infusion Rate (mL/hr)",
    prompt: "Same order: D5W 500 mL to run over 6 hours. Compute the infusion rate in mL/hr.",
    fields: [{ key: "mlhr", label: "Infusion rate", unit: "mL/hr" }],
    answers: { mlhr: 83.33 },
    tolerance: { mlhr: 0.5 },
    hint: "mL/hr = total volume ÷ hours.",
    solution:
      "500 ÷ 6 = 83.33 mL/hr (≈83 mL/hr)."
  },
  {
    id: "add_mgso4_ml",
    topic: "additives",
    tag: "IV Additives",
    title: "MgSO₄ Additive Volume",
    prompt: "Order: PNSS 1 L + 15 mEq MgSO₄ to run over 10 hours. Stock: MgSO₄ 5 mEq/mL. Compute mL of MgSO₄ to add.",
    fields: [{ key: "ml", label: "MgSO₄ volume", unit: "mL" }],
    answers: { ml: 3 },
    tolerance: { ml: 0 },
    hint: "mL = ordered mEq ÷ (mEq/mL).",
    solution:
      "15 ÷ 5 = 3 mL."
  },
  {
    id: "add_pnss_rate",
    topic: "additives",
    tag: "IV Additives",
    title: "PNSS Infusion Rate",
    prompt: "PNSS 1 liter to run over 10 hours. Compute mL/hr.",
    fields: [{ key: "mlhr", label: "Infusion rate", unit: "mL/hr" }],
    answers: { mlhr: 100 },
    tolerance: { mlhr: 0.1 },
    hint: "1000 mL ÷ hours.",
    solution:
      "1000 ÷ 10 = 100 mL/hr."
  },

  // IV rates / drip
  {
    id: "iv_d5w_mlhr",
    topic: "iv",
    tag: "IV Rate",
    title: "D5W Rate (mL/hr)",
    prompt: "D5W 1 liter to run over 8 hours. Compute mL/hr.",
    fields: [{ key: "mlhr", label: "Rate", unit: "mL/hr" }],
    answers: { mlhr: 125 },
    tolerance: { mlhr: 0.1 },
    hint: "1000 ÷ 8.",
    solution:
      "1000 ÷ 8 = 125 mL/hr."
  },
  {
    id: "iv_d5w_macro",
    topic: "iv",
    tag: "IV Rate",
    title: "Macrodrip gtt/min",
    prompt: "D5W 1 liter over 8 hours. Drop factor: 15 gtt/mL. Compute gtt/min.",
    fields: [{ key: "gttmin", label: "Drop rate", unit: "gtt/min" }],
    answers: { gttmin: 31 },
    tolerance: { gttmin: 1 },
    hint: "gtt/min = (mL × gtt/mL) ÷ minutes.",
    solution:
      "Time: 8×60=480 min. (1000×15)/480=31.25 ≈ 31 gtt/min."
  },
  {
    id: "iv_lr_mlhr",
    topic: "iv",
    tag: "IV Rate",
    title: "LR Rate (mL/hr)",
    prompt: "Lactated Ringer’s 750 mL to run over 5 hours. Compute mL/hr.",
    fields: [{ key: "mlhr", label: "Rate", unit: "mL/hr" }],
    answers: { mlhr: 150 },
    tolerance: { mlhr: 0.1 },
    hint: "750 ÷ 5.",
    solution:
      "750 ÷ 5 = 150 mL/hr."
  },
  {
    id: "iv_lr_micro",
    topic: "iv",
    tag: "IV Rate",
    title: "Microdrip gtt/min",
    prompt: "LR 750 mL over 5 hours using microdrip (60 gtt/mL). Compute gtt/min.",
    fields: [{ key: "gttmin", label: "Drop rate", unit: "gtt/min" }],
    answers: { gttmin: 150 },
    tolerance: { gttmin: 1 },
    hint: "Time in minutes = 5×60.",
    solution:
      "Time: 300 min. (750×60)/300 = 150 gtt/min."
  },

  // Adult meds
  {
    id: "adult_levo_ml",
    topic: "adult",
    tag: "Adult",
    title: "Levofloxacin Volume",
    prompt: "Order: Levofloxacin 750 mg IV. Stock: 500 mg/100 mL premixed. How many mL will be infused?",
    fields: [{ key: "ml", label: "Volume", unit: "mL" }],
    answers: { ml: 150 },
    tolerance: { ml: 0.5 },
    hint: "Find mg/mL then divide ordered dose by concentration.",
    solution:
      "500 mg/100 mL = 5 mg/mL. 750 ÷ 5 = 150 mL."
  },
  {
    id: "adult_levo_mlhr",
    topic: "adult",
    tag: "Adult",
    title: "Levofloxacin Pump Rate",
    prompt: "If 150 mL Levofloxacin is to run over 90 minutes, compute mL/hr.",
    fields: [{ key: "mlhr", label: "Pump rate", unit: "mL/hr" }],
    answers: { mlhr: 100 },
    tolerance: { mlhr: 0.5 },
    hint: "90 minutes = 1.5 hours.",
    solution:
      "150 ÷ 1.5 = 100 mL/hr."
  },
  {
    id: "adult_vanco_ml",
    topic: "adult",
    tag: "Adult",
    title: "Vancomycin Volume",
    prompt: "Order: Vancomycin 1.5 g IV. Final concentration after reconstitution: 50 mg/mL. How many mL will you administer?",
    fields: [{ key: "ml", label: "Volume", unit: "mL" }],
    answers: { ml: 30 },
    tolerance: { ml: 0.2 },
    hint: "1.5 g = 1500 mg. mL = mg ÷ (mg/mL).",
    solution:
      "1500 mg ÷ 50 mg/mL = 30 mL."
  }
];

// Escape room locks (adult scenario)
const escapeLocks = [
  {
    id: "lock1",
    topic: "adult",
    tag: "Escape Lock 1",
    title: "Lock 1: Hypotension – Dose Requirement",
    prompt:
      "Adult patient in shock. Order: Dopamine 5 mcg/kg/min. Weight: 70 kg.\n\nCompute mcg/min required.",
    fields: [{ key: "mcgmin", label: "Required dose", unit: "mcg/min" }],
    answers: { mcgmin: 350 },
    tolerance: { mcgmin: 0.5 },
    hint: "mcg/kg/min × kg.",
    solution: "5 × 70 = 350 mcg/min."
  },
  {
    id: "lock2",
    topic: "adult",
    tag: "Escape Lock 2",
    title: "Lock 2: Set the Pump (mL/hr)",
    prompt:
      "Pharmacy mix: Dopamine 400 mg in 250 mL D5W.\n\nFrom Lock 1: 350 mcg/min.\nCompute the IV pump rate in mL/hr.",
    fields: [{ key: "mlhr", label: "Pump rate", unit: "mL/hr" }],
    answers: { mlhr: 13.125 },
    tolerance: { mlhr: 0.2 },
    hint:
      "Convert: 350 mcg/min → mg/hr, then use concentration (mg/mL).",
    solution:
      "350 mcg/min ÷1000=0.35 mg/min. ×60=21 mg/hr. Concentration: 400/250=1.6 mg/mL. mL/hr=21/1.6=13.125."
  },
  {
    id: "lock3",
    topic: "adult",
    tag: "Escape Lock 3",
    title: "Lock 3: Antibiotic Prep",
    prompt:
      "Order: Piperacillin-Tazobactam 4.5 g IV now.\nVial after reconstitution: concentration 225 mg/mL.\n\nHow many mL will you withdraw?",
    fields: [{ key: "ml", label: "Volume", unit: "mL" }],
    answers: { ml: 20 },
    tolerance: { ml: 0.2 },
    hint: "4.5 g = 4500 mg. mL = mg ÷ (mg/mL).",
    solution: "4500 mg ÷ 225 mg/mL = 20 mL."
  },
  {
    id: "lock4",
    topic: "iv",
    tag: "Escape Lock 4",
    title: "Lock 4: Adjust Infusion Time",
    prompt:
      "IV Fluids: 1000 mL NSS.\nOriginal order: over 8 hours.\nNew order: run over 12 hours.\n\nCompute the new rate in mL/hr.",
    fields: [{ key: "mlhr", label: "New rate", unit: "mL/hr" }],
    answers: { mlhr: 83.3333 },
    tolerance: { mlhr: 0.5 },
    hint: "mL/hr = total volume ÷ hours.",
    solution: "1000 ÷ 12 = 83.33 mL/hr."
  }
];

let state = {
  mode: "practice",
  topic: "all",
  shuffle: true,
  list: [],
  idx: 0,
  score: 0,
  startedAt: null,
  timerInt: null,
  locked: true
};

function fmtTime(ms){
  const s = Math.max(0, Math.floor(ms/1000));
  const mm = String(Math.floor(s/60)).padStart(2,"0");
  const ss = String(s%60).padStart(2,"0");
  return `${mm}:${ss}`;
}

function startTimer(){
  $("timerWrap").classList.remove("hidden");
  state.startedAt = Date.now();
  if(state.timerInt) clearInterval(state.timerInt);
  state.timerInt = setInterval(() => {
    $("timer").textContent = fmtTime(Date.now() - state.startedAt);
  }, 250);
}

function stopTimer(){
  if(state.timerInt) clearInterval(state.timerInt);
  state.timerInt = null;
}

function getFilteredList(){
  const topic = state.topic;
  let list = [];

  if(state.mode === "escape"){
    list = [...escapeLocks];
  } else {
    list = questions.filter(q => topic === "all" ? true : q.topic === topic);
  }

  if(state.shuffle){
    list = list.map(x => ({x, r: Math.random()})).sort((a,b)=>a.r-b.r).map(o=>o.x);
  }
  return list;
}

function setHUD(){
  $("hud").classList.remove("hidden");
  $("progress").textContent = `${state.idx+1}/${state.list.length}`;
  $("score").textContent = `${state.score}`;
  const pct = ((state.idx) / Math.max(1, state.list.length)) * 100;
  $("barFill").style.width = `${pct}%`;
}

function renderQuestion(){
  $("done").classList.add("hidden");
  $("card").classList.remove("hidden");
  $("next").classList.add("hidden");
  $("feedback").classList.add("hidden");
  $("check").disabled = false;

  const q = state.list[state.idx];
  $("tag").textContent = q.tag || q.topic;
  $("title").textContent = q.title;
  $("prompt").textContent = q.prompt;

  const inputs = $("inputs");
  inputs.innerHTML = "";

  q.fields.forEach(f => {
    const wrap = document.createElement("div");
    wrap.className = "field";
    const label = document.createElement("label");
    label.textContent = `${f.label}${f.unit ? ` (${f.unit})` : ""}`;
    const input = document.createElement("input");
    input.type = "number";
    input.step = "any";
    input.id = `field_${f.key}`;
    input.placeholder = "Type your answer…";
    wrap.appendChild(label);
    wrap.appendChild(input);
    inputs.appendChild(wrap);
  });

  setHUD();
}

function nearlyEqual(a, b, tol){
  return Math.abs(a-b) <= tol;
}

function checkAnswer(){
  const q = state.list[state.idx];
  const fb = $("feedback");

  // collect answers
  const user = {};
  for(const f of q.fields){
    const v = parseFloat($(`field_${f.key}`).value);
    if(Number.isNaN(v)){
      fb.className = "feedback bad";
      fb.textContent = "Please answer all fields before checking.";
      fb.classList.remove("hidden");
      return;
    }
    user[f.key] = v;
  }

  // validate
  let allCorrect = true;
  for(const key of Object.keys(q.answers)){
    const expected = q.answers[key];
    const tol = (q.tolerance && q.tolerance[key] != null) ? q.tolerance[key] : 0;
    const got = user[key];
    if(!nearlyEqual(got, expected, tol)){
      allCorrect = false;
      break;
    }
  }

  if(allCorrect){
    state.score += (state.mode === "escape") ? 2 : 1;
    fb.className = "feedback ok";
    fb.innerHTML = `<strong>✅ Correct.</strong><br/><div class="muted">Solution: ${q.solution}</div>`;
    fb.classList.remove("hidden");
    $("check").disabled = true;
    $("next").classList.remove("hidden");
  } else {
    fb.className = "feedback bad";
    fb.innerHTML = `<strong>❌ Not quite.</strong><br/><div class="muted">${q.solution}</div>`;
    fb.classList.remove("hidden");
    // Escape room rule: must get it right to proceed
    if(state.mode !== "escape"){
      $("next").classList.remove("hidden");
    }
  }
}

function showHint(){
  const q = state.list[state.idx];
  const fb = $("feedback");
  fb.className = "feedback";
  fb.innerHTML = `<strong>Hint:</strong> <span class="muted">${q.hint || "Think step-by-step and track units."}</span>`;
  fb.classList.remove("hidden");
}

function next(){
  const isLast = state.idx >= state.list.length - 1;
  if(isLast){
    finish();
    return;
  }
  state.idx += 1;
  renderQuestion();
}

function finish(){
  stopTimer();
  $("card").classList.add("hidden");
  $("hud").classList.add("hidden");
  $("done").classList.remove("hidden");

  const title = (state.mode === "escape") ? "🎉 Patient Stabilized!" : "✅ Practice Complete!";
  $("doneTitle").textContent = title;

  let extra = "";
  if(state.mode === "escape" && state.startedAt){
    extra = ` Time: ${fmtTime(Date.now() - state.startedAt)}.`;
  }
  $("doneText").textContent = `Score: ${state.score}.${extra} You can restart anytime.`;
}

function start(){
  state.mode = $("mode").value;
  state.topic = $("topic").value;
  state.shuffle = $("shuffle").checked;
  state.list = getFilteredList();
  state.idx = 0;
  state.score = 0;

  $("hud").classList.remove("hidden");
  $("card").classList.remove("hidden");

  if(state.mode === "escape"){
    startTimer();
  } else {
    stopTimer();
    $("timerWrap").classList.add("hidden");
  }

  renderQuestion();
}

function reset(){
  stopTimer();
  state = { ...state, idx: 0, score: 0, list: [] };
  $("hud").classList.add("hidden");
  $("card").classList.add("hidden");
  $("done").classList.add("hidden");
}

$("start").addEventListener("click", start);
$("reset").addEventListener("click", reset);
$("restart").addEventListener("click", start);
$("check").addEventListener("click", checkAnswer);
$("hint").addEventListener("click", showHint);
$("next").addEventListener("click", next);
