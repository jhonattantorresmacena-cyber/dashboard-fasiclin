export function parseCSV(text) {
  const linhas = text.trim().split("\n");

  return linhas.slice(1).map(l => {

    const col = l.split(",").map(c => c.replace(/"/g, "").trim());

    if (!col || col.length < 8) return null;

    return {
      data: col[0],
      procedimento: col[1],
      quantidade: Number(col[2]) || 0,
      valorUnitario: parseBRL(col[3]),
      valor: parseBRL(col[4]),
      clinica: col[5] || "N/A",
      turma: col[6] || "N/A",
      metaDia: Number(col[7]) || 40
    };

  }).filter(Boolean);
}

//////////////////////////////////////////////////////////////

export function parseBRL(v) {
  if (!v) return 0;

  return parseFloat(
    v.toString()
      .replace(/\./g, "")
      .replace(",", ".")
      .replace(/[^\d.]/g, "")
  ) || 0;
}

//////////////////////////////////////////////////////////////

export function getMesAno(data) {
  if (!data || typeof data !== "string") return "N/A";

  const partes = data.split("/");
  if (partes.length < 3) return "N/A";

  const mes = partes[1]?.padStart(2,"0");
  const ano = partes[2];

  return `${mes}/${ano}`;
}

//////////////////////////////////////////////////////////////

export function formatarMoeda(v) {
  return (v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}