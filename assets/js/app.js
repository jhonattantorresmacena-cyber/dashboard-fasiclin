import { fetchDados } from "./dataService.js";
import { filtrar, calcular } from "./dashboard.js";
import { renderCharts } from "./charts.js";
import { formatarMoeda, getMesAno } from "./utils.js";

let dadosGerais = [];
let filtroMes = "TODOS";
let modoMeta = "diario";

async function init() {
  showLoading(true);
  try {
    dadosGerais = await fetchDados();
    console.log("Dados carregados com sucesso:", dadosGerais.length, "linhas");
    
    if (dadosGerais.length === 0) {
        alert("A planilha parece estar vazia ou o link expirou.");
    }

    montarFiltros();
    atualizar();
  } catch (e) {
    console.error("Erro crítico na carga de dados:", e);
  } finally {
    showLoading(false);
  }
}

function montarFiltros() {
  const selectProc = document.getElementById("proc");
  const mesesDiv = document.getElementById("mesesDiv");

  const procs = [...new Set(dadosGerais.map(d => d.procedimento))];
  selectProc.innerHTML = `<option value="TODOS">Todos os Procedimentos</option>`;
  procs.forEach(p => selectProc.innerHTML += `<option value="${p}">${p}</option>`);
  selectProc.onchange = atualizar;

  const mesesUnicos = [...new Set(dadosGerais.map(d => getMesAno(d.data)))].filter(m => m !== "N/A");
  mesesDiv.innerHTML = "";
  
  const btnTodos = document.createElement("button");
  btnTodos.innerText = "Todos";
  btnTodos.className = "active";
  btnTodos.onclick = (e) => window.setMes("TODOS", e.target);
  mesesDiv.appendChild(btnTodos);

  mesesUnicos.forEach(m => {
    const btn = document.createElement("button");
    btn.innerText = m;
    btn.onclick = (e) => window.setMes(m, e.target);
    mesesDiv.appendChild(btn);
  });

  document.getElementById("modoMeta").onchange = (e) => {
    modoMeta = e.target.value;
    atualizar();
  };
}

window.setMes = (m, btn) => {
  filtroMes = m;
  
  // Remove classe ativa de todos e adiciona no clicado
  const botoes = document.querySelectorAll("#mesesDiv button");
  botoes.forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  
  atualizar(); 
};

function atualizar() {
  const proc = document.getElementById("proc").value;
  const filtrados = filtrar(dadosGerais, proc, filtroMes);
  const m = calcular(filtrados);

  // Atualiza KPIs
  document.getElementById("total").innerText = m.totalQtd;
  document.getElementById("fat").innerText = formatarMoeda(m.faturamento);
  document.getElementById("meta").innerText = m.eficiencia.toFixed(1) + "%";

  renderCharts(m, modoMeta);
}

function showLoading(v) {
  const loader = document.getElementById("loading");
  if (loader) loader.style.display = v ? "flex" : "none";
}

window.exportPDF = async function() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4'); // A4: 210mm x 297mm
  
  showLoading(true);

  try {
    // 1. Obter os dados atuais (necessário para a tabela)
    const proc = document.getElementById("proc").value;
    const filtrados = filtrar(dadosGerais, proc, filtroMes);
    const m = calcular(filtrados);

    // 2. Cabeçalho Principal
    pdf.setFontSize(18);
    pdf.setTextColor(41, 153, 71); // Verde Fasiclin
    pdf.text("Relatório de Gestão Clínica - Fasiclin", 15, 20);
    
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Filtro: ${proc} | Período: ${filtroMes} | Data: ${new Date().toLocaleDateString()}`, 15, 27);
    
    // Linha divisória sutil
    pdf.setDrawColor(220);
    pdf.line(15, 32, 195, 32);

    // 3. Lista de IDs dos Gráficos (certifique-se de que existem no seu index.html)
    const chartsToCapture = [
      { id: "chartMeta", title: "Tendência de Atendimento" },
      { id: "chartTurma", title: "Produção Financeira (Turma)" },
      { id: "chartTurmaQtd", title: "Volume de Atendimento (Turma)" },
      { id: "chartProcedimento", title: "Ranking de Receita (Procedimento)" },
      { id: "chartClinica", title: "Distribuição por Clínica" }
    ];

    let currentY = 40; // Posição vertical inicial

    // --- LOOP DE CAPTURA SEGURA COM QUEBRA DE PÁGINA ---
    for (const chart of chartsToCapture) {
      const el = document.getElementById(chart.id);
      
      if (!el) {
        console.warn(`Aviso: Elemento ${chart.id} não encontrado. Pulando...`);
        continue; // Ignora e passa para o próximo sem quebrar o código
      }

      // [SOLUÇÃO] Verificação de Espaço: Se o gráfico não couber, adiciona nova página
      // Uma folha A4 tem 297mm. Deixamos uma margem de segurança de ~50mm no fundo.
      if (currentY > 240) { 
        pdf.addPage();
        currentY = 20; // Reinicia o topo na nova página
      }

      // Título do Gráfico no PDF
      pdf.setFontSize(12);
      pdf.setTextColor(30); // Quase preto
      pdf.text(chart.title, 15, currentY);
      currentY += 6; // Espaço após o título

      // Captura segura com escala 2 para alta definição
      const canvas = await html2canvas(el, { 
        scale: 2, 
        logging: false, 
        useCORS: true 
      });
      
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      
      // Ajuste proporcional da imagem
      const pdfWidth = 180; // Largura fixa da imagem (180mm)
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; // Calcula altura proporcional
      
      pdf.addImage(imgData, 'PNG', 15, currentY, pdfWidth, pdfHeight);
      
      // Atualiza a posição vertical para o próximo elemento
      currentY += pdfHeight + 15; // Adiciona a altura da imagem + 15mm de margem
    }

    // --- 4. Tabela de Detalhamento em NOVA PÁGINA (Padrão) ---
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.setTextColor(41, 153, 71);
    pdf.text("Detalhamento por Procedimento", 15, 20);

    // Preparação dos dados para a tabela
    const rows = Object.entries(m.porProcVal)
      .sort((a, b) => b[1] - a[1]) // Ordena por faturamento descritivo
      .map(([nome, valor]) => [
        nome, 
        m.porProcQtd[nome] || 0, 
        formatarMoeda(valor)
      ]);

    // Tabela AutoTable (ela gerencia suas próprias quebras de página)
    pdf.autoTable({
      startY: 30,
      head: [['Procedimento', 'Quantidade', 'Faturamento Total']],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [41, 153, 71] }, // Verde Fasiclin
      styles: { fontSize: 9 },
      columnStyles: {
        1: { halign: 'center' }, // Centraliza Quantidade
        2: { halign: 'right' }   // Alinha Moeda à direita
      }
    });

    // 5. Salvar o arquivo finalizado
    pdf.save(`Relatorio_Fasiclin_${filtroMes.replace('/','-')}.pdf`);

  } catch (err) {
    console.error("Erro fatal na geração do PDF:", err);
    alert("Ocorreu um erro ao gerar o PDF. Verifique o console para detalhes.");
  } finally {
    showLoading(false);
  }
};

init();