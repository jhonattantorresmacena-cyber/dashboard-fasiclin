import { fetchDados } from "./dataService.js";
import { filtrar, calcular } from "./dashboard.js";
import { renderCharts } from "./charts.js";
import { formatarMoeda, getMesAno } from "./utils.js";

let dados = [];
let mes = "TODOS";
let modoMeta = "diario";

async function init() {
  showLoading(true);

  try {
    dados = await fetchDados();
  } catch(e) {
    console.error(e);
    alert("Erro ao carregar dados");
    return;
  }

  montarFiltros();
  atualizar();

  showLoading(false);
}

function montarFiltros() {
  const select = document.getElementById("proc");
  const mesesDiv = document.getElementById("mesesDiv");

  const procs = [...new Set(dados.map(d=>d.procedimento))];
  select.innerHTML = `<option value="TODOS">Todos</option>`;
  procs.forEach(p=>select.innerHTML += `<option>${p}</option>`);

  const meses = [...new Set(dados.map(d=>getMesAno(d.data)))];

  mesesDiv.innerHTML = "";

  const btnTodos = document.createElement("button");
  btnTodos.innerText = "Todos";
  btnTodos.classList.add("active");
  btnTodos.onclick = ()=>setMes("TODOS", btnTodos);
  mesesDiv.appendChild(btnTodos);

  meses.forEach(m=>{
    const btn = document.createElement("button");

    const [mesNum, ano] = m.split("/");
    const data = new Date(`${ano}-${mesNum}-01`);

    btn.innerText = data.toLocaleString("pt-BR",{month:"long",year:"numeric"});
    btn.onclick = ()=>setMes(m, btn);

    mesesDiv.appendChild(btn);
  });

  select.onchange = atualizar;

  window.setMes = (m, btn)=>{
    mes = m;

    document.querySelectorAll("#mesesDiv button")
      .forEach(b=>b.classList.remove("active"));

    if(btn) btn.classList.add("active");

    atualizar();
  };

  document.getElementById("modoMeta").onchange = (e)=>{
    modoMeta = e.target.value;
    atualizar();
  };
}

function atualizar() {
  const select = document.getElementById("proc");

  const filtrados = filtrar(dados, select.value, mes);
  const m = calcular(filtrados);

  document.getElementById("total").innerText = m.totalQtd;
  document.getElementById("fat").innerText = formatarMoeda(m.faturamento);
  document.getElementById("meta").innerText = m.eficiencia.toFixed(0)+"%";

  renderCharts(m, modoMeta);
}

function showLoading(v){
  const el = document.getElementById("loading");
  if (!el) return;
  el.style.display = v ? "flex":"none";
}

window.exportPDF = async function(){

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const select = document.getElementById("proc");
  const m = calcular(filtrar(dados, select.value, mes));

  let y = 10;

  pdf.setFontSize(16);
  pdf.text("Relatório Executivo", 10, y);
  y+=10;

  pdf.setFontSize(10);
  pdf.text(new Date().toLocaleString(), 10, y);
  y+=10;

  pdf.text(`Total: ${m.totalQtd}`, 10, y); y+=8;
  pdf.text(`Faturamento: ${formatarMoeda(m.faturamento)}`, 10, y); y+=8;
  pdf.text(`Eficiência: ${m.eficiencia.toFixed(1)}%`, 10, y); y+=10;

  const el = document.querySelector(".container");
  if (!el) return;

  const canvas = await html2canvas(el,{scale:2});
  pdf.addImage(canvas.toDataURL(),"PNG",10,y,190,100);

  pdf.save("relatorio.pdf");
};

init();