// This file should be handling the dataset you chose. It should clean the data and prepare it for use
// with the rendering library your coding agent will be filling in in render.js.
//
// The one thing that knows which mapping library you chose is render.js.
import { draw, legend } from "./render.js";


// change this to point to the dataset you would like to work with.
const DATASET = {
  file: "./data/unemployment-2016-county.csv",
  key: "fips",                       // column holding the 5-digit county FIPS
  value: "unemp",                    // column holding the number to map
  label: "Unemployment rate",
  format: (v) => `${v.toFixed(1)}%`,
};

async function load(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path} (HTTP ${res.status})`);
  return path.endsWith(".json") ? res.json() : res.text();
}

function parseCSV(text) {
  const [head, ...lines] = text.trim().split(/\r?\n/);
  const cols = head.split(",").map((c) => c.trim());
  return lines.map((line) =>
    Object.fromEntries(line.split(",").map((v, i) => [cols[i], v.trim()]))
  );
}

function normalize(rows) {
  const out = new Map();
  for (const row of rows) {
    const fips = String(row[DATASET.key]).trim().padStart(5, "0");
    const value = Number(row[DATASET.value]);
    if (/^\d{5}$/.test(fips) && Number.isFinite(value)) out.set(fips, value);
  }
  return out;
}

function join(topology, values) {
  const fc = topojson.feature(topology, topology.objects.counties);
  const matched = new Set();

  const features = fc.features.map((f) => {
    const fips = String(f.id);
    const value = values.has(fips) ? values.get(fips) : null;
    if (value !== null) matched.add(fips);
    return {
      ...f,
      properties: {
        ...f.properties,
        fips,
        state: STATES[fips.slice(0, 2)] ?? "",
        value,
      },
    };
  });

  return { type: "FeatureCollection", features };
}

let FEATURES = null;
async function main() {
  const [topology, csv] = await Promise.all([
    load("./data/counties-10m.json"),
    load(DATASET.file),
  ]);

  const values = normalize(parseCSV(csv));

  FEATURES = join(topology, values);
  
  document.querySelector("#source").textContent =
    `${DATASET.label} by county.`;
}

// State FIPS prefixes
const STATES = {
  "01":"AL","02":"AK","04":"AZ","05":"AR","06":"CA","08":"CO","09":"CT","10":"DE",
  "11":"DC","12":"FL","13":"GA","15":"HI","16":"ID","17":"IL","18":"IN","19":"IA",
  "20":"KS","21":"KY","22":"LA","23":"ME","24":"MD","25":"MA","26":"MI","27":"MN",
  "28":"MS","29":"MO","30":"MT","31":"NE","32":"NV","33":"NH","34":"NJ","35":"NM",
  "36":"NY","37":"NC","38":"ND","39":"OH","40":"OK","41":"OR","42":"PA","44":"RI",
  "45":"SC","46":"SD","47":"TN","48":"TX","49":"UT","50":"VT","51":"VA","53":"WA",
  "54":"WV","55":"WI","56":"WY","60":"AS","66":"GU","69":"MP","72":"PR","78":"VI",
};

main().catch((err) => {
  document.querySelector("#map").innerHTML = `<pre class="error">${err.message}</pre>`;
  throw err;
});
