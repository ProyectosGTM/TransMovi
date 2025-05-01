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
  public mensajeAgrupar: string = "Arrastre un encabezado de columna aquí para agrupar por esa columna"

  constructor(private disposService: DispositivosService) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;
  }

  ngOnInit(): void {
    this.obtenerDispositivos();
  }

  obtenerDispositivos() {
    setTimeout(() => {
      this.grid = true;
    }, 150)
    this.isLoading = true;
    this.disposService.obtenerDispositivos().subscribe(
      (res: any) => {
        if (Array.isArray(res.dispositivos)) {
          this.listaDispositivos = res.dispositivos;
        } else {
          console.error('El formato de datos recibido no es el esperado.');
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener dispositivos:', error);
        this.isLoading = false;
      }
    );
  }

  showInfo(id: any): void {
    console.log('Mostrar información del dispositivo con ID:', id);
  }
}