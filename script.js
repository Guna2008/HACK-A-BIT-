let flame = false;
let temperature = 30;
let hardwareInputs = { flame: false, t40: false, t60: false };
let mode = "simulation";

const $ = (id) => document.getElementById(id);

function setPill(id, value) {
  const element = $(id);
  element.textContent = value ? "1 — ON" : "0 — OFF";
  element.className = `pill ${value ? "on" : "off"}`;
}

function setSelected(buttonIds, selectedId) {
  buttonIds.forEach((id) => $(id).classList.toggle("selected", id === selectedId));
}

function setMode(nextMode) {
  mode = nextMode;
  const simulation = mode === "simulation";
  $("simulationInputs").classList.toggle("hidden", !simulation);
  $("hardwareInputs").classList.toggle("hidden", simulation);
  $("simulationMode").classList.toggle("selected", simulation);
  $("hardwareMode").classList.toggle("selected", !simulation);
  $("modeBadge").textContent = simulation ? "SIMULATION MODE" : "HARDWARE OBSERVATION";
  $("modeDescription").textContent = simulation
    ? "Change the flame state and temperature. The dashboard calculates the two comparator states."
    : "Manually enter the logic levels you observe at the physical sensor/comparator outputs.";
  update();
}

function update() {
  let f, t40, t60;

  if (mode === "simulation") {
    f = flame;
    t40 = temperature >= 40;
    t60 = temperature >= 60;
    $("tempValue").textContent = temperature;
  } else {
    f = hardwareInputs.flame;
    t40 = hardwareInputs.t40;
    t60 = hardwareInputs.t60;
  }

  const andOut = f && t40;
  const alarm = andOut || t60;

  setPill("fStatus", f);
  setPill("t40Status", t40);
  setPill("t60Status", t60);
  setPill("andStatus", andOut);
  setPill("andInput", andOut);
  setPill("orStatus", alarm);

  $("alarmBox").classList.toggle("alarm", alarm);
  $("alarmIcon").textContent = alarm ? "🚨" : "🔕";
  $("alarmTitle").textContent = alarm ? "FIRE ALERT!" : "SYSTEM NORMAL";
  $("alarmMessage").textContent = alarm
    ? "BUZZER ON — fire alert condition detected."
    : "Buzzer OFF — no fire alert condition detected.";
}

function setFlame(value) {
  flame = value;
  setSelected(["flameOff", "flameOn"], value ? "flameOn" : "flameOff");
  update();
}

function setHardwareInput(key, value) {
  hardwareInputs[key] = value;
  const ids = {
    flame: ["hwFlameOff", "hwFlameOn"],
    t40: ["hwT40Off", "hwT40On"],
    t60: ["hwT60Off", "hwT60On"]
  };
  const [offId, onId] = ids[key];
  setSelected([offId, onId], value ? onId : offId);
  update();
}

function resetInputs() {
  flame = false;
  temperature = 30;
  hardwareInputs = { flame: false, t40: false, t60: false };
  $("temperature").value = "30";
  setSelected(["flameOff", "flameOn"], "flameOff");
  setSelected(["hwFlameOff", "hwFlameOn"], "hwFlameOff");
  setSelected(["hwT40Off", "hwT40On"], "hwT40Off");
  setSelected(["hwT60Off", "hwT60On"], "hwT60Off");
  update();
}

$("simulationMode").addEventListener("click", () => setMode("simulation"));
$("hardwareMode").addEventListener("click", () => setMode("hardware"));
$("flameOff").addEventListener("click", () => setFlame(false));
$("flameOn").addEventListener("click", () => setFlame(true));
$("temperature").addEventListener("input", (event) => {
  temperature = Number(event.target.value);
  update();
});
$("hwFlameOff").addEventListener("click", () => setHardwareInput("flame", false));
$("hwFlameOn").addEventListener("click", () => setHardwareInput("flame", true));
$("hwT40Off").addEventListener("click", () => setHardwareInput("t40", false));
$("hwT40On").addEventListener("click", () => setHardwareInput("t40", true));
$("hwT60Off").addEventListener("click", () => setHardwareInput("t60", false));
$("hwT60On").addEventListener("click", () => setHardwareInput("t60", true));
$("resetButton").addEventListener("click", resetInputs);

update();
