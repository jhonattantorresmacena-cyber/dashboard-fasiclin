export function parseCSV(text) {
  const linhas = text.trim().split("\n");
  return linhas
    .slice(1)
    .map((l) => {
      // Regex para lidar com vírgulas dentro de aspas (comum em valores R$ 20,00)
      const col = l
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((c) => c.replace(/Requested|"/g, "").trim());

      if (col.length < 8) return null;

      return {
        data: col[0],
        procedimento: col[1],
        quantidade: Number(col[2]) || 0,
        valor: parseBRL(col[4]), // Valor Total (Coluna E)
        clinica: col[5] || "N/A",
        turma: col[6] || "N/A",
        metaDia: Number(col[7]) || 0,
      };
    })
    .filter(Boolean);
}

export function parseBRL(v) {
  if (!v) return 0;
  return (
    parseFloat(
      v
        .replace(/\./g, "")
        .replace(",", ".")
        .replace(/[^\d.]/g, ""),
    ) || 0
  );
}

export function getMesAno(data) {
  if (!data || typeof data !== "string") return "N/A";
  const p = data.split("/");
  if (p.length < 3) return "N/A";

  // Cria um objeto Date (ajustando para o formato ISO YYYY-MM-DD para evitar bugs de fuso)
  const dataObj = new Date(`${p[2]}-${p[1]}-${p[0]}T12:00:00`);

  // Retorna o mês por extenso com a primeira letra maiúscula
  const mesExtenso = dataObj.toLocaleString("pt-BR", { month: "long" });
  return mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);
}

export function formatarMoeda(v) {
  return (v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
