import { getMesAno } from "./utils.js";

//////////////////////////////////////////////////////////////

export function filtrar(dados, proc, mes) {
  return dados.filter(d =>
    (proc === "TODOS" || d.procedimento === proc) &&
    (mes === "TODOS" || getMesAno(d.data) === mes)
  );
}

//////////////////////////////////////////////////////////////

export function calcular(dados) {

  let totalQtd = 0;
  let faturamento = 0;

  let porProc = {};
  let porTurma = {};
  let porClinica = {};
  let porData = {};
  let metaPorData = {};

  dados.forEach(d => {

    // 🔹 segurança de dados
    const qtd = d.quantidade || 0;
    const val = d.valor || 0;
    const meta = d.metaDia || 40;

    totalQtd += qtd;
    faturamento += val;

    // 🔹 agrupamento por procedimento (faturamento)
    porProc[d.procedimento] =
      (porProc[d.procedimento] || 0) + val;

    // 🔹 agrupamento por turma (quantidade)
    porTurma[d.turma] =
      (porTurma[d.turma] || 0) + qtd;

    // 🔹 agrupamento por clínica (quantidade)
    porClinica[d.clinica] =
      (porClinica[d.clinica] || 0) + qtd;

    // 🔹 agrupamento por data (quantidade)
    porData[d.data] =
      (porData[d.data] || 0) + qtd;

    // 🔥 CORREÇÃO CRÍTICA:
    // meta não pode somar várias vezes no mesmo dia
    if (!metaPorData[d.data]) {
      metaPorData[d.data] = meta;
    }
  });

  //////////////////////////////////////////////////////////

  const totalMeta = Object.values(metaPorData)
    .reduce((a, b) => a + b, 0);

  //////////////////////////////////////////////////////////

  return {
    totalQtd,
    faturamento,

    eficiencia: totalMeta
      ? Math.min((totalQtd / totalMeta) * 100, 999)
      : 0,

    porProc,
    porTurma,
    porClinica,
    porData,
    metaPorData
  };
}