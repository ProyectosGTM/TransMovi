import { Component, OnInit } from '@angular/core';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { VehiculosService } from 'src/app/shared/services/vehiculos.service';

@Component({
  selector: 'app-lista-vehiculos',
  templateUrl: './lista-vehiculos.component.html',
  styleUrls: ['./lista-vehiculos.component.scss'],
  animations: [fadeInUpAnimation],
})
export class ListaVehiculosComponent implements OnInit {
  isLoading: boolean = false;
  listaVehiculos: any[] = [];
  public grid: boolean = false;
  public showFilterRow: boolean;
  public showHeaderFilter: boolean;
  public loadingVisible: boolean = false;
  public mensajeAgrupar: string =
    'Arrastre un encabezado de columna aquí para agrupar por esa columna';
  public loading: boolean;
  public loadingMessage: string = 'Cargando...';

  constructor(private vehiService: VehiculosService) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;
  }

  ngOnInit(): void {
    this.obtenerVehiculos();
  }

  obtenerVehiculos() {
    this.loading = true;
    this.vehiService.obtenerVehiculos().subscribe(
      (res: any) => {
        if (Array.isArray(res.vehiculos)) {
          this.listaVehiculos = res.vehiculos;
        } else {
          console.error('El formato de datos recibido no es el esperado.');
        }
        setTimeout(()=> {
          this.loading = false;
        },2000)
      },
      (error) => {
        console.error('Error al obtener vehículos:', error);
        this.loading = false;
      }
    );
  }

  showInfo(id: any): void {
    console.log('Mostrar información del vehículo con ID:', id);
  }
}
