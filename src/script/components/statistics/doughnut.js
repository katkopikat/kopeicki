/* eslint-disable no-param-reassign */

import { Chart } from 'chart.js';
import createElement from '../../utils/create';
import history from '../../helpers/history_transactions';

const today = new Date();
let typeTransaction = 'expense';
let period = 'mounth';
let summaryObj = null;
let doughnut = null;

function setBGColor() {
  return document.documentElement.hasAttribute('theme') ? 'rgba(234, 237, 241, 1)' : 'rgba(37, 40, 54, 1)';
}

function renderDoughnutHTML() {
  const doughnutWrapperDiv = createElement('div', 'wrapper-doughnut');
  const doughnutCanvas = createElement('canvas', 'doughnut-container');

  const doughnutTypeBtnsWrapper = createElement(
    'div',
    'btn-group btn-group-toggle',
    null,
    ['toggle', 'buttons'],
  );

  const doughnutPeriodBtnsWrapper = createElement(
    'div',
    'btn-group btn-group-toggle bar-years',
    null,
    ['toggle', 'buttons'],
  );

  const doughnutPeriodBtns = `
  <label class="btn btn-secondary active">
  <input type="radio" name="period" id="month" autocomplete="off" checked> Month
</label>
<label class="btn btn-secondary">
  <input type="radio" name="period" id="year" autocomplete="off"> Year
  </label>`;

  const doughnutTypeBtns = `
<label class="btn btn-secondary active">
<input type="radio" name="type" id="expense" autocomplete="off" checked> Expense
</label>
<label class="btn btn-secondary">
<input type="radio" name="type" id="income" autocomplete="off"> Income
  </label>`;

  document.querySelector('.charts-wrapper').append(doughnutWrapperDiv);
  doughnutWrapperDiv.append(doughnutCanvas);

  doughnutWrapperDiv.append(doughnutTypeBtnsWrapper);
  doughnutWrapperDiv.append(doughnutPeriodBtnsWrapper);

  doughnutPeriodBtnsWrapper.insertAdjacentHTML(
    'beforeend',
    `${doughnutPeriodBtns}`,
  );
  doughnutTypeBtnsWrapper.insertAdjacentHTML(
    'beforeend',
    `${doughnutTypeBtns}`,
  );
}

function filterTransaction() {
  const filtredHistory = history.filter((transaction) => {
    const trDate = new Date(transaction.date);
    if (period === 'year') {
      return trDate.getFullYear() === today.getFullYear() && transaction.type === typeTransaction;
    }
    return trDate.getMonth() === today.getMonth() && transaction.type === typeTransaction;
  });

  summaryObj = filtredHistory.reduce((summary, trans) => {
    if (Object.prototype.hasOwnProperty.call(summary, trans.category)) {
      summary[trans.category] += parseFloat(trans.amount);
    } else {
      summary[trans.category] = parseFloat(trans.amount);
    }
    return summary;
  },
  {});
}

function calculateTotalSum() {
  return Object.values(summaryObj).reduce((sum, it) => sum + it);
}

function generateChart(type, time) {
  const canvas = document.querySelector('.doughnut-container');
  doughnut = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: Object.keys(summaryObj),
      datasets: [{
        data: Object.values(summaryObj),
        backgroundColor: [
          'rgba(243, 94, 110, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(236, 178, 18, 1)',
          'rgba(52, 62, 176, 1)',
          'rgba(47, 186, 147, 1)',
          'rgba(0, 93, 236, 1)',
          'rgba(243, 94, 110, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(236, 178, 18, 1)',
          'rgba(52, 62, 176, 1)',
          'rgba(47, 186, 147, 1)',
          'rgba(0, 93, 236, 1)',
        ],
        borderColor: setBGColor(),
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      cutoutPercentage: 70,
      // elements: {
      //   center: {
      //     text: `Total ${type} for the ${time} ${calculateTotalSum()} rub. `,
      //     color: centerTextColor, // Default is #000000
      //     fontStyle: 'Segoe UI', // Default is Arial
      //     sidePadding: 20, // Default is 20 (as a percentage)
      //     minFontSize: 12, // Default is 20 (in px), set to false and text will not wrap.
      //     lineHeight: 24, // Default is 25 (in px), used for when text wraps
      //   },
      // },
      title: {
        display: true,
        position: 'bottom',
        text: `Total ${type} for the ${time} ${calculateTotalSum()} rub.`,
      },
      legend: {
        position: 'left',
      },
    },

  });
}

function buttonsListeners() {
  document.querySelectorAll('[name="period"]').forEach((btnPer) => {
    btnPer.addEventListener('click', () => {
      if (btnPer.checked === true) {
        period = btnPer.id;
        doughnut.destroy();
        filterTransaction();
        generateChart(typeTransaction, period);
      }
    });
  });

  document.querySelectorAll('[name="type"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.checked === true) {
        typeTransaction = btn.id;
        doughnut.destroy();
        filterTransaction();
        generateChart(typeTransaction, period);
      }
    });
  });
}

export default function generateDoughnutChart() {
  filterTransaction();
  renderDoughnutHTML();
  buttonsListeners();
  generateChart(typeTransaction, period);
}

Chart.pluginService.register({
  beforeDraw(chart) {
    if (chart.config.options.elements.center) {
      // Get ctx from string
      const { ctx } = chart.chart;

      // Get options from the center object in options
      const centerConfig = chart.config.options.elements.center;
      const fontStyle = centerConfig.fontStyle || 'Segoe UI';
      const txt = centerConfig.text;
      const color = centerConfig.color || '#000';
      const maxFontSize = centerConfig.maxFontSize || 20;
      const sidePadding = centerConfig.sidePadding || 20;
      const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
      // Start with a base font of 30px
      ctx.font = `14px ${fontStyle}`;

      /* Get the width of the string and also the width of the elementminus
      10 to give it 5px side padding */
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(30 * widthRatio);
      const elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      let fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
      let { minFontSize } = centerConfig;
      const lineHeight = centerConfig.lineHeight || 25;
      let wrapText = true;

      if (minFontSize === undefined) {
        minFontSize = 12;
      }

      if (minFontSize && fontSizeToUse < minFontSize) {
        fontSizeToUse = minFontSize;
        wrapText = true;
      }

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = `${fontSizeToUse}px ${fontStyle}`;
      ctx.fillStyle = color;

      if (!wrapText) {
        ctx.fillText(txt, centerX, centerY);
        return;
      }

      const words = txt.split(' ');
      let line = '';
      const lines = [];

      // Break words up into multiple lines if necessary
      for (let n = 0; n < words.length; n += 1) {
        const testLine = `${line + words[n]} `;
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > elementWidth && n > 0) {
          lines.push(line);
          line = `${words[n]} `;
        } else {
          line = testLine;
        }
      }

      // Move the center up depending on line height and number of lines
      centerY -= (lines.length / 2) * lineHeight;

      for (let n = 0; n < lines.length; n += 1) {
        ctx.fillText(lines[n], centerX, centerY);
        centerY += lineHeight;
      }
      // Draw text in center
      ctx.fillText(line, centerX, centerY);
    }
  },
});
