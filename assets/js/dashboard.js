import { getMesAno } from "./utils.js";

export function filtrar(dados, proc, mes) {
  return dados.filter(d =>
    (proc === "TODOS" || d.procedimento === proc) &&
    (mes === "TODOS" || getMesAno(d.data) === mes)
  );
}

export function calcular(dados) {
  // Inicialização segura
  let metricas = {
    totalQtd: 0,
    faturamento: 0,
    porProcVal: {},
    porProcQtd: {},
    porTurmaVal: {},
    porTurmaQtd: {},
    porClinica: {},
    porData: {},
    metaPorData: {}
  };

  if (!dados || dados.length === 0) return metricas;


  dados.forEach(d => {
    const qtd = d.quantidade || 0;
    const valTotal = d.valor || 0; // Mapeado da Coluna E (valor total)
    const metaDia = d.metaDia || 0;

    metricas.totalQtd += qtd;
    metricas.faturamento += valTotal;

    // Agrupamentos por Procedimento
    metricas.porProcVal[d.procedimento] = (metricas.porProcVal[d.procedimento] || 0) + valTotal;
    metricas.porProcQtd[d.procedimento] = (metricas.porProcQtd[d.procedimento] || 0) + qtd;

    // Agrupamentos por Turma
    metricas.porTurmaVal[d.turma] = (metricas.porTurmaVal[d.turma] || 0) + valTotal;
    metricas.porTurmaQtd[d.turma] = (metricas.porTurmaQtd[d.turma] || 0) + qtd;

    // Outros Agrupamentos
    metricas.porClinica[d.clinica] = (metricas.porClinica[d.clinica] || 0) + qtd;
    metricas.porData[d.data] = (metricas.porData[d.data] || 0) + qtd;

    // REGRA DE META: Não somar a meta várias vezes no mesmo dia
    if (!metricas.metaPorData[d.data] || metaDia > metricas.metaPorData[d.data]) {
      metricas.metaPorData[d.data] = metaDia;
    }

    metricas.porData[d.data] = (metricas.porData[d.data] || 0) + qtd;
    metricas.metaPorData[d.data] = d.metaDia;
  });

 // CÁLCULO DA EFICIÊNCIA FINAL
  const totalRealizado = metricas.totalQtd;
  const totalMeta = Object.values(metricas.metaPorData).reduce((a, b) => a + b, 0);

  metricas.eficiencia = totalMeta > 0 ? (totalRealizado / totalMeta) * 100 : 0;

  return metricas;
}