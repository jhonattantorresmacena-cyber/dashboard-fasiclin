import { CONFIG } from "./config.js";
import { parseCSV } from "./utils.js";

export async function fetchDados() {
  const cache = localStorage.getItem(CONFIG.CACHE_KEY);

  if (cache) {
    const { data, time } = JSON.parse(cache);
    if (Date.now() - time < CONFIG.CACHE_TIME) return data;
  }

  const res = await fetch(CONFIG.URL);
  const text = await res.text();

  const dados = parseCSV(text);

  localStorage.setItem(
    CONFIG.CACHE_KEY,
    JSON.stringify({ data: dados, time: Date.now() }),
  );

  return dados;
}
