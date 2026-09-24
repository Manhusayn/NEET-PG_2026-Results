const form = document.getElementById("searchForm");
const rollInput = document.getElementById("roll");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const notFoundEl = document.getElementById("notFound");
const button = form.querySelector("button");

let index = null;
const cache = new Map();

async function loadIndex() {
  if (index) return index;
  const response = await fetch("data/index.json", { cache: "force-cache" });
  if (!response.ok) throw new Error("Could not load result index.");
  index = await response.json();

  document.getElementById("total").textContent =
    `${index.total.toLocaleString()} results indexed`;

  return index;
}

async function loadChunk(file) {
  if (cache.has(file)) return cache.get(file);

  const response = await fetch(`data/${file}`, { cache: "force-cache" });
  if (!response.ok) throw new Error("Could not load result data.");

  const data = await response.json();
  cache.set(file, data);
  return data;
}

function findChunk(roll) {
  const n = BigInt(roll);

  // Binary search over chunk ranges.
  let lo = 0;
  let hi = index.chunks.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const c = index.chunks[mid];
    const start = BigInt(c.start);
    const end = BigInt(c.end);

    if (n < start) hi = mid - 1;
    else if (n > end) lo = mid + 1;
    else return c;
  }
  return null;
}

async function search(roll) {
  await loadIndex();

  const chunk = findChunk(roll);
  if (!chunk) return null;

  const rows = await loadChunk(chunk.file);
  return rows.find(row => row.r === roll) || null;
}

function showResult(row) {
  resultEl.classList.remove("hidden");
  notFoundEl.classList.add("hidden");
  statusEl.textContent = "";

  document.getElementById("outRoll").textContent = row.r;
  document.getElementById("outApp").textContent = row.a;
  document.getElementById("outScore").textContent = `${row.score} / 720`;
  document.getElementById("outRank").textContent = row.rank.toLocaleString();
  document.getElementById("page").textContent = `S.No. ${row.s}`;
}

function showNotFound() {
  resultEl.classList.add("hidden");
  notFoundEl.classList.remove("hidden");
  statusEl.textContent = "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const roll = rollInput.value.trim();

  if (!/^\d+$/.test(roll)) {
    statusEl.textContent = "Please enter a valid numeric roll number.";
    resultEl.classList.add("hidden");
    notFoundEl.classList.add("hidden");
    return;
  }

  button.disabled = true;
  resultEl.classList.add("hidden");
  notFoundEl.classList.add("hidden");
  statusEl.textContent = "Searching...";

  try {
    const row = await search(roll);
    if (row) showResult(row);
    else showNotFound();
  } catch (error) {
    console.error(error);
    statusEl.textContent = "Something went wrong while loading the result.";
  } finally {
    button.disabled = false;
  }
});

rollInput.focus();
