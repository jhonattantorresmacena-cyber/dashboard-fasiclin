let charts = {};

export function renderCharts(m, modoMeta="diario") {

  Object.values(charts).forEach(c=>c.destroy());

  const datas = Object.keys(m.porData).sort((a,b)=>{
    const [d1,m1,y1] = a.split("/");
    const [d2,m2,y2] = b.split("/");
    return new Date(`${y1}-${m1}-${d1}`) - new Date(`${y2}-${m2}-${d2}`);
  });

  let labels, realizado, meta;

  if (modoMeta === "mensal") {
    labels = ["Mês"];
    realizado = [Object.values(m.porData).reduce((a,b)=>a+b,0)];
    meta = [Object.values(m.metaPorData).reduce((a,b)=>a+b,0)];
  } else {
    labels = datas;
    realizado = datas.map(d=>m.porData[d] || 0);
    meta = datas.map(d=>m.metaPorData[d] || 40);
  }

  charts.meta = new Chart(chartMeta,{
    type:'line',
    data:{
      labels,
      datasets:[
        { label:"Realizado", data:realizado, borderColor:"#299947" },
        { label:"Meta", data:meta, borderColor:"red", borderDash:[5,5] }
      ]
    },
    options:{
      scales:{
        y:{
          ticks:{
            callback:v=>Math.round(v)
          }
        }
      }
    }
  });

  const procOrdenado = Object.entries(m.porProc)
    .sort((a,b)=>b[1]-a[1]);

  charts.proc = new Chart(chartProcedimento,{
    type:'bar',
    data:{
      labels:procOrdenado.map(p=>p[0]),
      datasets:[{
        data:procOrdenado.map(p=>p[1]),
        backgroundColor:"#299947"
      }]
    },
    options:{ indexAxis:'y' }
  });

  charts.turma = new Chart(chartTurma,{
    type:'pie',
    data:{
      labels:Object.keys(m.porTurma),
      datasets:[{ data:Object.values(m.porTurma) }]
    }
  });

  charts.clinica = new Chart(chartClinica,{
    type:'doughnut',
    data:{
      labels:Object.keys(m.porClinica),
      datasets:[{ data:Object.values(m.porClinica) }]
    }
  });
}