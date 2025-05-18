import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxDateBoxComponent } from 'devextreme-angular';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { BlueVoxService } from 'src/app/shared/services/bluevox.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-bluevox',
  templateUrl: './lista-bluevox.component.html',
  styleUrl: './lista-bluevox.component.scss',
  animations: [fadeInUpAnimation],
})
export class ListaBluevoxComponent implements OnInit {
  isLoading: boolean = false;
  listaBluevox: any[] = [];
  public grid: boolean = false;
  public showFilterRow: boolean;
  public showHeaderFilter: boolean;
  public loadingVisible: boolean = false;
  public mensajeAgrupar: string =
    'Arrastre un encabezado de columna aquí para agrupar por esa columna';
  public loading: boolean;
  public loadingMessage: string = 'Cargando...';
  @ViewChild('gridContainer1', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dateBoxInicial') dateBoxInicial: DxDateBoxComponent;
  @ViewChild('dateBoxFinal') dateBoxFinal: DxDateBoxComponent;

  fechaInicial: Date;
  fechaFinal: Date;
  listaBlueVox: any[] = [];

  constructor(private serviceBlue: BlueVoxService) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;
  }

  ngOnInit(): void {
    this.obtenerBlueVox();
  }

  obtenerBlueVox() {
    this.serviceBlue.obtenerBlueVox().subscribe((response) => {
      this.listaBluevox = response;
    });
  }

  formatearFecha(fecha: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const yyyy = fecha.getFullYear();
    const MM = pad(fecha.getMonth() + 1);
    const dd = pad(fecha.getDate());
    const hh = pad(fecha.getHours());
    const mm = pad(fecha.getMinutes());
    const ss = pad(fecha.getSeconds());

    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
  }

  buscarBlueVox() {
    if (!this.fechaInicial || !this.fechaFinal) {
      Swal.fire({
        icon: 'warning',
        title: 'Fechas incompletas',
        text: 'Debes seleccionar ambas fechas para realizar la búsqueda.',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    const desde = this.formatearFecha(this.fechaInicial);
    const hasta = this.formatearFecha(this.fechaFinal);

    Swal.fire({
      title: 'Buscando...',
      text: 'Por favor espera mientras se consultan los datos.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.serviceBlue.obtenerBlueVoxFechas(desde, hasta).subscribe(
      (response) => {
        if (response.mensaje == 'No se encontraron registros.') {
          Swal.fire({
            icon: 'info',
            title: 'Sin resultados',
            text: 'No se encontraron registros para el rango de fechas seleccionado.',
            confirmButtonText: 'Entendido',
          });
          this.listaBluevox = [];
        } else {
          this.listaBluevox = response;
          Swal.close();
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al obtener los datos. Intenta de nuevo.',
        });
        console.error('❌ Error al obtener datos:', error);
      }
    );
  }

  limpiarCampos() {
    this.dateBoxInicial.instance.reset();
    this.dateBoxFinal.instance.reset();
    this.fechaInicial = null;
    this.fechaFinal = null;
    this.obtenerBlueVox();
    const grid = this.dataGrid.instance;
    grid.clearGrouping(); // Quitar agrupamientos
    grid.clearFilter(); // Limpiar filtros
    grid.clearSelection(); // Quitar selección
    grid.pageIndex(0); // Regresar a la primera página
    grid.refresh();
  }
}
