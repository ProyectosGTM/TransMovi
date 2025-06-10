import { Component, OnInit } from '@angular/core';
import { transactions, lineColumAreaChart, revenueColumnChart, customerRadialBarChart, orderRadialBarChart, growthColumnChart} from './data';

import { ChartType } from './dashboard.model';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})

export class DefaultComponent implements OnInit {

  gastoDiario = 1540.75;
  gastoMensual = 45200.90;
  totalOperadores = 18;
  totalVehiculos = 25;

  chartData = [
    { dia: 'Lun', gasto: 1050 },
    { dia: 'Mar', gasto: 1125 },
    { dia: 'Mié', gasto: 980 },
    { dia: 'Jue', gasto: 1230 },
    { dia: 'Vie', gasto: 950 },
    { dia: 'Sáb', gasto: 0 },
    { dia: 'Dom', gasto: 0 },
  ];

  rutasRecientes = [
    { nombre: 'Galerías - Centro', fecha: '2025-06-08', distancia: '7.8 km', operadores: 2 },
    { nombre: 'Terminal - Norte', fecha: '2025-06-07', distancia: '5.1 km', operadores: 1 },
    { nombre: 'Estadio - Centro', fecha: '2025-06-06', distancia: '4.8 km', operadores: 2 },
  ];

  lineColumAreaChart: ChartType;
  revenueColumnChart: ChartType;
  orderRadialBarChart: ChartType;
  customerRadialBarChart: ChartType;
  growthColumnChart: ChartType;
  transactions;
  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit() {
    /**
     * Fetches the data
     */
    this.fetchData();
    this.breadCrumbItems = [{ label: 'Minible' }, { label: 'Dashboard', active: true }];
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    
    this.lineColumAreaChart = lineColumAreaChart;
    this.revenueColumnChart = revenueColumnChart;
    this.orderRadialBarChart = orderRadialBarChart;
    this.customerRadialBarChart = customerRadialBarChart;
    this.growthColumnChart = growthColumnChart;
    
    this.transactions = transactions;
  }

}

document.addEventListener('DOMContentLoaded', function() {
  const closeElement = document.querySelector('.close');
  if (closeElement) {
      closeElement.addEventListener('click', function() {
          const ulElement = document.querySelector('ul');
          if (ulElement) {
              ulElement.classList.toggle('active');
          }
      });
  }
});