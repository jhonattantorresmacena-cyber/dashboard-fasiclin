# 📊 Dashboard Clínica — FASICLIN

Sistema web leve para análise de dados clínicos com base em planilha do Google Sheets, focado em visualização de indicadores, metas e apoio à tomada de decisão.

---

## 🚀 Visão Geral

Este projeto foi desenvolvido para:

* 📊 Monitorar atendimentos clínicos
* 💰 Acompanhar faturamento
* 🎯 Avaliar eficiência (meta vs realizado)
* 📈 Visualizar dados em gráficos interativos
* 📄 Gerar relatórios executivos em PDF

Tudo isso utilizando **JavaScript puro + Google Sheets como banco de dados**.

---

## 🧠 Funcionalidades

### 🔹 Indicadores (KPIs)

* Total de atendimentos
* Faturamento total
* Eficiência (%) baseada na meta diária

---

### 🔹 Filtros Dinâmicos

* Por procedimento
* Por mês/ano
* Combinação de filtros

---

### 🔹 Gráficos

* 📈 Tendência (Realizado vs Meta)

  * Meta diária
  * Meta mensal
* 🏆 Ranking de receita por procedimento
* 🎓 Produção por turma
* 🏥 Distribuição por clínica

---

### 🔹 Relatório Executivo

* Exportação em PDF
* Indicadores consolidados
* Visual do dashboard incluído

---

## 🏗️ Arquitetura do Projeto

```bash
/assets
  /css
    styles.css
  /js
    app.js            # Orquestração geral
    config.js         # Configurações globais
    dataService.js    # Consumo e cache dos dados
    dashboard.js      # Regras de negócio e cálculos
    charts.js         # Renderização dos gráficos
    utils.js          # Funções utilitárias

index.html
```

---

## ⚙️ Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (ES Modules)
* Chart.js
* Google Sheets (CSV)
* html2canvas
* jsPDF

---

## 🌐 Fonte de Dados

Os dados são consumidos diretamente de uma planilha pública do Google Sheets:

```js
CONFIG.URL
```

Formato esperado:

| Campo          | Descrição              |
| -------------- | ---------------------- |
| DATA           | Data do atendimento    |
| PROCEDIMENTO   | Nome do procedimento   |
| QUANTIDADE     | Quantidade realizada   |
| VALOR UNITÁRIO | Valor por procedimento |
| VALOR TOTAL    | Quantidade × valor     |
| CLINICA        | Nome da clínica        |
| TURMA          | Turma responsável      |
| META DIA       | Meta diária            |

---

## ⚡ Performance

* Cache local (localStorage)
* Atualização automática
* Redução de chamadas à API

---

## 🛡️ Tratamento de Erros

* Fallback para cache em caso de falha
* Validação de dados CSV
* Proteção contra dados inválidos

---

## 📦 Como Executar

1. Clone o repositório:

```bash
git clone <seu-repositorio>
```

2. Abra o projeto:

```bash
index.html
```

ou utilize uma extensão como **Live Server**.

---

## 🌍 Deploy

Recomendado:

* GitHub Pages
* Netlify

---

## 🧠 Nível do Projeto

Este sistema evoluiu de:

> 🧪 protótipo → 💼 sistema real de gestão + BI leve

---

## 🚀 Possíveis Evoluções

* 🔐 Sistema de login
* 📊 Histórico de relatórios
* 🏢 Multi-clínicas
* ☁️ Backend com API
* 📱 Versão mobile

---

## 👨‍💻 Autor

Desenvolvido por **Jheferson Torres**
Instrutor e desenvolvedor de sistemas

---

## 📄 Licença

Uso educacional e institucional.

---

## 💬 Considerações Finais

Este projeto demonstra como construir um sistema completo de análise de dados com:

* baixo custo
* alta eficiência
* arquitetura escalável

👉 Ideal para ambientes educacionais e clínicos.

---
