import { Component, OnInit } from '@angular/core';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { OperadoresService } from 'src/app/shared/services/operadores.service';

@Component({
  selector: 'app-lista-operadores',
  templateUrl: './lista-operadores.component.html',
  styleUrls: ['./lista-operadores.component.scss'],
  animations: [fadeInUpAnimation]
})
export class ListaOperadoresComponent implements OnInit {

  listaOperadores: any[] = [];
  isLoading: boolean = false;
  public grid: boolean = false;
  public showFilterRow: boolean;
  public showHeaderFilter: boolean;
  public loadingVisible: boolean = false;
  public mensajeAgrupar: string = "Arrastre un encabezado de columna aquí para agrupar por esa columna"

  constructor(private opService: OperadoresService) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;
  }

  ngOnInit(): void {
    this.obtenerOperadores();
  }

  obtenerOperadores() {
    setTimeout(() => {
      this.grid = true;
    }, 150)
    this.opService.obtenerOperadores().subscribe(
      (res: any) => {
        this.listaOperadores = res.operadores;
      },
      (error) => {
        console.error('Error al obtener operadores:', error);
        this.isLoading = false;
      }
    );
  }
}