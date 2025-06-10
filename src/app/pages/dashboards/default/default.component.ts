import { Component, OnInit } from '@angular/core';
import { transactions, lineColumAreaChart, revenueColumnChart, customerRadialBarChart, orderRadialBarChart, growthColumnChart } from './data';

import { ChartType } from './dashboard.model';
import { MonederosServices } from 'src/app/shared/services/monederos.service';
import { RutasService } from 'src/app/shared/services/rutas.service';
import { Router } from '@angular/router';

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

  listaMonederos: any[] = [];
  public loadingVisible: boolean = false;
  public mensajeAgrupar: string = 'Arrastre un encabezado de columna aquí para agrupar por esa columna';
  public showFilterRow: boolean;
  public showHeaderFilter: boolean;

  listaRutas: any[] = [];

  onAgregarMonedero(): void {
    this.route.navigateByUrl('/monederos/lista-monederos');
  }

  irRutas(): void {
    this.route.navigateByUrl('/rutas/lista-rutas');
  }

  customizeTooltip(arg: any) {
    const valorFormateado = arg.value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    });

    return {
      text: `Gasto del mes: ${valorFormateado}`
    };
  }


  gastosMensualesData = [
    { mes: 'Enero', gasto: 32000 },
    { mes: 'Febrero', gasto: 28000 },
    { mes: 'Marzo', gasto: 35000 },
    { mes: 'Abril', gasto: 30000 },
    { mes: 'Mayo', gasto: 40000 },
    { mes: 'Junio', gasto: 37000 }
  ];

  coloresBarras = ['#1e3a8a', '#7c3aed', '#059669', '#b91c1c', '#f59e0b', '#3b82f6'];

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

  constructor(private moneService: MonederosServices, private rutaSe: RutasService, private route: Router) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;
  }

  ngOnInit() {
    this.obtenerRutas()
    this.obtenerMonederos()
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


  customizePoint = (point: any) => {
    const index = this.gastosMensualesData.findIndex(item => item.mes === point.argument);
    return {
      color: this.coloresBarras[index % this.coloresBarras.length]
    };
  };

  obtenerMonederos() {
    this.moneService.obtenerMonederos().subscribe(
      (res: any) => {
        this.listaMonederos = res.monederos
          .sort((a, b) => b.Id - a.Id)
          .slice(0, 10);
      },
      (error) => {
        console.error('Error al obtener monederos:', error);
      }
    );
  }

  obtenerRutas() {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    this.rutaSe.obtenerRutas().subscribe((response) => {
      this.listaRutas = response.map((d) => {
        return {
          id: d.id,
          nombre: d.nombre ?? 'Sin información',
          ciaKm:
            d.distanciaKm != null ? `${d.distanciaKm} km` : 'Sin información',
          tarifaBase:
            d.tarifa?.tarifaBase != null
              ? formatter.format(d.tarifa.tarifaBase)
              : 'Sin información',
          costoAdicional:
            d.tarifa?.costoAdicional != null
              ? formatter.format(d.tarifa.costoAdicional)
              : 'Sin información',
          distanciaBaseKm:
            d.tarifa?.distanciaBaseKm != null
              ? formatter.format(d.tarifa.distanciaBaseKm)
              : 'Sin información',
          puntoInicioDireccion: d.puntoInicio?.direccion ?? 'Sin información',
          puntoFinDireccion: d.puntoFin?.direccion ?? 'Sin información',
        };
      }).sort((a, b) => b.id - a.id).slice(0, 9);
    });
  }

}

document.addEventListener('DOMContentLoaded', function () {
  const closeElement = document.querySelector('.close');
  if (closeElement) {
    closeElement.addEventListener('click', function () {
      const ulElement = document.querySelector('ul');
      if (ulElement) {
        ulElement.classList.toggle('active');
      }
    });
  }
});