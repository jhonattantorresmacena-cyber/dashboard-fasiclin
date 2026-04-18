let charts = {};

export function renderCharts(m, modoMeta = "diario") {
  // Limpa instâncias anteriores
  Object.values(charts).forEach(c => c && c.destroy());

  const datas = Object.keys(m.porData).sort((a, b) => {
    const [d1, m1, y1] = a.split("/");
    const [d2, m2, y2] = b.split("/");
    return new Date(`${y1}-${m1}-${d1}`) - new Date(`${y2}-${m2}-${d2}`);
  });
  

  const isMensal = modoMeta === "mensal";

  // 1. Gráfico de Tendência (Meta vs Realizado)
  charts.meta = new Chart(document.getElementById("chartMeta"), {
    type: isMensal ? 'bar' : 'line',
    data: {
      labels: isMensal ? ["Total"] : datas,
      datasets: [
        { label: "Realizado", data: isMensal ? [m.totalQtd] : datas.map(d => m.porData[d]), backgroundColor: ' #5a9d4b8c ',  borderColor: [' #5a9d4b ', ' #c9ffb3 ']  },
        { label: "Meta", data: isMensal ? [Object.values(m.metaPorData).reduce((a,b)=>a+b,0)] : datas.map(d => m.metaPorData[d]), borderDash: [5, 5], type: 'line', backgroundColor:'#ff4d4d', borderColor: '#ff4d4d' }
      ]
    }
  });

  // 3. Produção Financeira por Turma
  charts.turmaVal = new Chart(document.getElementById("chartTurma"), {
    type: 'doughnut',
    data: {
      labels: Object.keys(m.porTurmaVal),
      datasets: [{ data: Object.values(m.porTurmaVal), backgroundColor: [' #357c29 ', ' #5a9d4b ', ' #7fbe6e ', ' #a4de90 ', ' #c9ffb3 '] }]
    }
  });

  // 4. Atendimento por Turma (Quantidade)
  charts.turmaQtd = new Chart(document.getElementById("chartTurmaQtd"), {
    type: 'doughnut',
    data: {
      labels: Object.keys(m.porTurmaQtd),
      datasets: [{ data: Object.values(m.porTurmaQtd), backgroundColor: [' #357c29 ', ' #5a9d4b ', ' #7fbe6e ', ' #a4de90 ', ' #c9ffb3 '] }]
    }
  });

    // 2. Ranking de Receita (Barras Horizontais)
  const procOrdenado = Object.entries(m.porProcVal).sort((a, b) => b[1] - a[1]);
  charts.proc = new Chart(document.getElementById("chartProcedimento"), {
    type: 'bar',
    data: {
      labels: procOrdenado.map(p => p[0]),
      datasets: [{ label: 'Receita R$', data: procOrdenado.map(p => p[1]), backgroundColor: [' #357c29 ', ' #5a9d4b ', ' #7fbe6e ', ' #a4de90 ', ' #c9ffb3 ']  }]
    },
    options: { indexAxis: 'y' }
  });

  // 5. Distribuição por Clínica
  charts.clinica = new Chart(document.getElementById("chartClinica"), {
    type: 'bar',
    data: {
      labels: Object.keys(m.porClinica),
      datasets: [{ data: Object.values(m.porClinica), label: 'Quantidade Atendimento', backgroundColor: [' #357c29 ', ' #5a9d4b ', ' #7fbe6e ', ' #a4de90 ', ' #c9ffb3 '] }]
    }
  });
}