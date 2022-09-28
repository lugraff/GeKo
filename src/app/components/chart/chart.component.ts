import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
})
export class ChartComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public pieChartData: ChartData<'pie'> = {
    labels: [
      'VK',
      'MATTLE',
      'SPÖ',
      'FPÖ',
      'GRÜNE',
      'FRITZ',
      'NEOS',
      'MFG',
      'KPÖ',
      'MACHMIT',
    ],
    datasets: [
      {
        data: [
          191772, 119167, 60009, 64683, 31598, 33990, 21589, 9539, 2312, 453,
        ],
        backgroundColor: [
          'rgba(255, 255, 255, 1)',
          'rgba(0, 0, 0, 1)',
          'rgba(255, 0, 0, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 255, 0, 1)',
          'rgba(200, 200, 200, 1)',
          'rgba(200, 0, 200, 1)',
          'rgba(0, 200, 200, 1)',
          'rgba(200, 200, 0, 1)',
          'rgba(100, 100, 100, 0)',
        ],
        borderColor: ['rgba(0, 0, 0, 1)'],
        borderWidth: 1,
      },
    ],
  };

  addSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.push(['Test']);
    }
    this.pieChartData.datasets[0].data.push(400);
    this.chart?.update();
  }

  removeSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.pop();
    }
    this.pieChartData.datasets[0].data.pop();
    this.chart?.update();
  }
}
