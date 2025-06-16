import { Component, OnInit } from '@angular/core';
import {
  transactions,
  lineColumAreaChart,
  revenueColumnChart,
  customerRadialBarChart,
  orderRadialBarChart,
  growthColumnChart,
} from './data';

import { ChartType } from './dashboard.model';
import { MonederosServices } from 'src/app/shared/services/monederos.service';
import { RutasService } from 'src/app/shared/services/rutas.service';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { fadeInRightAnimation } from 'src/app/core/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  animations: [fadeInRightAnimation, fadeInUpAnimation],
})
export class DefaultComponent implements OnInit {
  gastoDiario = 1540.75;
  gastoMensual = 45200.9;
  totalPasajero = 40;
  totalOperadores = 18;
  totalVehiculos = 25;

  resumenOriginal = [
    {
      key: 'recargas',
      valor: this.gastoDiario,
      icon: 'fas fa-coins',
      color: 'azul',
    },
    {
      key: 'debitos',
      valor: this.gastoMensual,
      icon: 'fas fa-wallet',
      color: 'morado',
    },
    {
      key: 'pasajeros',
      valor: this.totalPasajero,
      icon: 'fas fa-user-check',
      color: 'petroleo',
    },
    {
      key: 'dispositivos',
      valor: this.totalOperadores,
      icon: 'fas fa-tablet',
      color: 'verde',
    },
    {
      key: 'vehiculos',
      valor: this.totalVehiculos,
      icon: 'fas fa-truck',
      color: 'rojo',
    },
  ];

  resumen: any[] = [];

  resumenEntradasSalidas = [
    { tipo: 'Entradas', cantidad: 40 },
    { tipo: 'Salidas', cantidad: 25 },
  ];

  customizeLabel = (pointInfo: any) => {
    return `${pointInfo.argumentText}: ${pointInfo.value}`;
  };

  estadoDispositivos = [
    { estado: 'Conectados', cantidad: 15 },
    { estado: 'Desconectados', cantidad: 3 },
  ];

  customizeDispositivoLabel = (pointInfo: any) => {
    return `${pointInfo.argumentText}: ${pointInfo.value}`;
  };

  customPalette = ['#112cb3', '#9B51E0'];

  listaMonederos: any[] = [];
  public loadingVisible: boolean = false;
  public mensajeAgrupar: string =
    'Arrastre un encabezado de columna aquí para agrupar por esa columna';
  public showFilterRow: boolean;
  public showHeaderFilter: boolean;

  listaRutas: any[] = [];

  onAgregarMonedero(): void {
    this.route.navigateByUrl('/monederos/lista-monederos');
  }

  irRutas(): void {
    this.route.navigateByUrl('/rutas/lista-rutas');
  }

  gastosMensualesData = [
    { mes: 'Enero', gasto: 32000 },
    { mes: 'Febrero', gasto: 28000 },
    { mes: 'Marzo', gasto: 35000 },
    { mes: 'Abril', gasto: 30000 },
    { mes: 'Mayo', gasto: 40000 },
    { mes: 'Junio', gasto: 37000 },
  ];

  coloresBarras = [
    '#1e3a8a',
    '#7c3aed',
    '#059669',
    '#b91c1c',
    '#f59e0b',
    '#3b82f6',
  ];

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
    {
      nombre: 'Galerías - Centro',
      fecha: '2025-06-08',
      distancia: '7.8 km',
      operadores: 2,
    },
    {
      nombre: 'Terminal - Norte',
      fecha: '2025-06-07',
      distancia: '5.1 km',
      operadores: 1,
    },
    {
      nombre: 'Estadio - Centro',
      fecha: '2025-06-06',
      distancia: '4.8 km',
      operadores: 2,
    },
  ];

  distribucionPorHora = [
    { hora: '05:00', entradas: 6, salidas: 2 },
    { hora: '06:00', entradas: 12, salidas: 4 },
    { hora: '07:00', entradas: 20, salidas: 7 },
    { hora: '08:00', entradas: 28, salidas: 9 },
    { hora: '09:00', entradas: 24, salidas: 8 },
    { hora: '10:00', entradas: 18, salidas: 6 },
    { hora: '11:00', entradas: 15, salidas: 5 },
    { hora: '12:00', entradas: 10, salidas: 3 },
    { hora: '13:00', entradas: 14, salidas: 5 },
    { hora: '14:00', entradas: 17, salidas: 6 },
    { hora: '15:00', entradas: 22, salidas: 7 },
    { hora: '16:00', entradas: 19, salidas: 6 },
    { hora: '17:00', entradas: 21, salidas: 7 },
    { hora: '18:00', entradas: 16, salidas: 5 },
    { hora: '19:00', entradas: 10, salidas: 3 },
    { hora: '20:00', entradas: 6, salidas: 2 },
    { hora: '21:00', entradas: 2, salidas: 1 },
  ];

  internetLanguages = [
    { language: 'Recargas', percent: 1541 },
    { language: 'Débito', percent: 45201 },
  ];

  customizeTransaccionLabel = (info: any) => {
    const valueFormatted = `$${info.value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
    })}`;
    return `${info.argumentText}: ${valueFormatted}`;
  };

  customizeLabelText = (info: any) => {
    const isMoneda = ['Recargas', 'Débitos'].includes(info.seriesName);
    return isMoneda ? `$${info.value}` : `${info.value}`;
  };

  customizeTooltip = (info: any) => {
    const isMoneda = ['Recargas', 'Débitos'].includes(info.seriesName);
    const formatted = isMoneda ? `$${info.value}` : `${info.value}`;
    return {
      text: `${info.argumentText} - ${info.seriesName}: ${formatted}`,
    };
  };

  lineColumAreaChart: ChartType;
  revenueColumnChart: ChartType;
  orderRadialBarChart: ChartType;
  customerRadialBarChart: ChartType;
  growthColumnChart: ChartType;
  transactions;
  breadCrumbItems: Array<{}>;

  constructor(
    private moneService: MonederosServices,
    private rutaSe: RutasService,
    private route: Router
  ) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;
  }

  ngOnInit() {
    this.actualizarResumen();
    AOS.init();
    window.addEventListener('load', AOS.refresh);
    this.obtenerRutas();
    this.obtenerMonederos();
    /**
     * Fetches the data
     */
    this.fetchData();
    this.breadCrumbItems = [
      { label: 'TransMovi' },
      { label: 'Dashboard', active: true },
    ];
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
    const index = this.gastosMensualesData.findIndex(
      (item) => item.mes === point.argument
    );
    return {
      color: this.coloresBarras[index % this.coloresBarras.length],
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
      this.listaRutas = response
        .map((d) => {
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
        })
        .sort((a, b) => b.id - a.id)
        .slice(0, 9);
    });
  }

  periodo: 'dia' | 'semana' | 'mes' = 'dia';

  tituloRecargasDebitos: string = 'Resumen Diario de Recargas y Débitos';
  tituloEntradasSalidas: string = 'Entradas y Salidas del Día';
  tituloViajesHoy: string = 'Resumen de Viajes de Hoy';

  cambiarPeriodo(periodo: 'dia' | 'semana' | 'mes') {
    this.periodo = periodo;

    // Cambiar títulos de gráficos
    switch (periodo) {
      case 'dia':
        this.tituloRecargasDebitos = 'Resumen Diario de Recargas y Débitos';
        this.tituloEntradasSalidas = 'Entradas y Salidas del Día';
        this.tituloViajesHoy = 'Resumen de Viajes de Hoy';
        break;
      case 'semana':
        this.tituloRecargasDebitos = 'Resumen Semanal de Recargas y Débitos';
        this.tituloEntradasSalidas = 'Entradas y Salidas de la Semana';
        this.tituloViajesHoy = 'Resumen de Viajes de la Semana';
        break;
      case 'mes':
        this.tituloRecargasDebitos = 'Resumen Mensual de Recargas y Débitos';
        this.tituloEntradasSalidas = 'Entradas y Salidas del Mes';
        this.tituloViajesHoy = 'Resumen de Viajes del Mes';
        break;
    }

    this.actualizarResumen();
  }

  actualizarResumen() {
    this.resumen = this.resumenOriginal.map((card) => {
      let titulo = '';
      switch (card.key) {
        case 'recargas':
          titulo =
            this.periodo === 'dia'
              ? 'Recargas del Día'
              : this.periodo === 'semana'
              ? 'Recargas de la Semana'
              : 'Recargas del Mes';
          break;
        case 'debitos':
          titulo =
            this.periodo === 'dia'
              ? 'Débitos del Día'
              : this.periodo === 'semana'
              ? 'Débitos de la Semana'
              : 'Débitos del Mes';
          break;
        default:
          titulo = card.key.charAt(0).toUpperCase() + card.key.slice(1);
      }
      return { ...card, titulo };
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
