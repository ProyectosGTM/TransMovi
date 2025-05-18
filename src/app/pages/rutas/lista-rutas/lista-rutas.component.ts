import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { RutasService } from 'src/app/shared/services/rutas.service';

@Component({
  selector: 'app-lista-rutas',
  templateUrl: './lista-rutas.component.html',
  styleUrls: ['./lista-rutas.component.scss'],
  animations: [fadeInUpAnimation]
})
export class ListaRutasComponent implements OnInit {
  isLoading: boolean = false;
  listaRutas: any[] = [];
  public grid: boolean = false;
  public showFilterRow: boolean;
  public showHeaderFilter: boolean;
  public loadingVisible: boolean = false;
  public mensajeAgrupar: string = "Arrastre un encabezado de columna aquí para agrupar por esa columna";
  public loading: boolean;
  public loadingMessage: string = 'Cargando...';

  constructor(
    private rutaSe: RutasService,
    private zone: NgZone,
    private route: Router
  ) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;
  }

  ngOnInit(): void {
    this.obtenerRutas()
  }

  agregarRuta(){
    this.route.navigateByUrl('/rutas/agregar-ruta')
  }

  obtenerRutas(){
    this.rutaSe.obtenerRutas().subscribe((response)=> {
      this.listaRutas = response;
    })
  }
  
}