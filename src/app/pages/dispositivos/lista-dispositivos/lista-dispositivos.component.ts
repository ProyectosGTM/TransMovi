import { Component, OnInit } from '@angular/core';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { DispositivosService } from 'src/app/shared/services/dispositivos.service';

@Component({
  selector: 'app-lista-dispositivos',
  templateUrl: './lista-dispositivos.component.html',
  styleUrls: ['./lista-dispositivos.component.scss'],
  animations: [fadeInUpAnimation]
})
export class ListaDispositivosComponent implements OnInit {
  
  isLoading: boolean = false;
  listaDispositivos: any[] = [];
  public grid: boolean = false;
  public showFilterRow: boolean;
  public showHeaderFilter: boolean;
  public loadingVisible: boolean = false;
  public mensajeAgrupar: string = "Arrastre un encabezado de columna aquí para agrupar por esa columna";
  public loading: boolean;
  public loadingMessage: string = 'Cargando...';

  constructor(private disposService: DispositivosService) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;
  }

  ngOnInit(): void {
    this.obtenerDispositivos();
  }

  obtenerDispositivos() {
    this.loading = true;
    this.disposService.obtenerDispositivos().subscribe(
      (res: any) => {
        setTimeout(()=> {
          this.loading = false;
        },2000)
        if (Array.isArray(res.dispositivos)) {
          this.listaDispositivos = res.dispositivos;
        } else {
          console.error('El formato de datos recibido no es el esperado.');
        }
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener dispositivos:', error);
      }
    );
  }

  showInfo(id: any): void {
    console.log('Mostrar información del dispositivo con ID:', id);
  }
}