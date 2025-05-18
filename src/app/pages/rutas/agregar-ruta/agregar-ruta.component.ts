import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  NgZone,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { RutasService } from 'src/app/shared/services/rutas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-ruta',
  templateUrl: './agregar-ruta.component.html',
  styleUrl: './agregar-ruta.component.scss',
  animations: [fadeInUpAnimation],
})
export class AgregarRutaComponent implements OnInit {
  public guardarRutaNueva: FormGroup;
  public configRuta: FormGroup;
  public idRutaEspecifica: any;
  public title: string = 'Planeación de Rutas';
  public subtitle: string = 'Define y registra el recorrido que seguirán.';
  public informacion: any;
  center = { lat: 19.2866, lng: -99.6557 };
  zoom = 13;
  map!: google.maps.Map;
  polyline!: google.maps.Polyline;
  path: google.maps.LatLngLiteral[] = [];
  startMarker!: google.maps.Marker;
  endMarker!: google.maps.Marker;

  geocoder!: google.maps.Geocoder;
  customPolyline!: google.maps.Polyline;
  hasStart = false;
  mostrarBotonDeshacer = false;

  public recorridoDeta: any;
  public distanciak: any;
  @ViewChild('largeDataModals', { static: false })
  largeDataModals!: TemplateRef<any>;
  @ViewChild('largeDataModalsConfig', { static: false })
  largeDataModalsConfig!: TemplateRef<any>;

  public nombreRuta: any;
  public tarifa: any;
  public distancia: any;
  public showId: boolean = false;

  rutaGuardada!: {
    puntoInicio: { coordenadas: google.maps.LatLngLiteral; direccion: string };
    puntoFin: { coordenadas: google.maps.LatLngLiteral; direccion: string };
    recorrido: google.maps.LatLngLiteral[];
  };

  constructor(
    private zone: NgZone,
    private route: Router,
    private http: HttpClient,
    private modalService: NgbModal,
    private rutaSe: RutasService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.activatedRoute.params.subscribe((params) => {
      this.idRutaEspecifica = params['idRutaEspecifica'];

      if (this.idRutaEspecifica) {
        this.title = 'Visualizar Ruta';
        this.subtitle = 'Revisa el camino por donde pasaran sus unidades.';
        this.obtenerRuta();
        this.showId = true;
      } else {
        this.showId = false;
      }

      this.loadGoogleMaps();
    });
  }

  initForm() {
    this.guardarRutaNueva = this.fb.group({
      nombreRuta: ['', Validators.required],
    });
    this.configRuta = this.fb.group({
      idRuta: [''],
      tarifaBase: ['', Validators.required],
      distanciaBaseKm: ['', Validators.required],
      incrementoCadaMetros: ['', Validators.required],
      costoAdicional: ['', Validators.required],
    });
  }

  obtenerRuta() {
    this.rutaSe .obtenerRuta(this.idRutaEspecifica) .subscribe((response: any) => {
      this.informacion = response;
      this.nombreRuta = response.nombre;
      this.tarifa = response.tarifa.tarifaBase;
      this.distancia = response.distanciaKm;
      if (
        response.puntoInicio &&
        response.puntoFin &&
        response.recorridoDetallado
      ) {
        const ruta = {
          puntoInicio: response.puntoInicio,
          puntoFin: response.puntoFin,
          recorrido: response.recorridoDetallado,
        };
        this.mostrarRutaGuardada(ruta);
      }
    });
  }

  detalleRuta() {
    if (this.path.length < 2) return;
    const puntoInicio = this.path[0];
    const puntoFin = this.path[this.path.length - 1];
    this.geocoder.geocode({ location: puntoInicio }, (resA, statusA) => {
      const direccionA =
        statusA === 'OK' && resA?.[0]
          ? resA[0].formatted_address
          : 'No encontrada';

      this.geocoder.geocode({ location: puntoFin }, (resB, statusB) => {
        const direccionB =
          statusB === 'OK' && resB?.[0]
            ? resB[0].formatted_address
            : 'No encontrada';

        this.rutaGuardada = {
          puntoInicio: {
            coordenadas: puntoInicio,
            direccion: direccionA,
          },
          puntoFin: {
            coordenadas: puntoFin,
            direccion: direccionB,
          },
          recorrido: [...this.path],
        };
        Swal.fire({
          title: 'Cargando...',
          text: 'Por favor espera un momento.',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.rutaSe.detallarRuta(this.rutaGuardada).subscribe(
          (response) => {
            Swal.close();
            this.recorridoDeta = response.recorridoDetallado;
            this.distanciak = response.distanciaKm;
            setTimeout(() => {
              this.largeModal(this.largeDataModals);
            }, 250);
            // Swal.fire({
            //   title: 'Nueva Ruta Generada!',
            //   text: 'El registro se ha completado correctamente!',
            //   icon: 'success',
            //   confirmButtonColor: '#3085d6',
            //   confirmButtonText: 'Entendido',
            //   showCancelButton: false,
            // }).then((result) => {
            //   if (result.value) {
            //     this.largeModal(this.largeDataModals);
            //   }
            // });
          },
          (error) => {
            Swal.close();
            Swal.fire({
              title: 'Ops!',
              text: error,
              icon: 'success',
            });
          }
        );
      });
    });
  }

  guardarRutaServi(modal: any) {
    if (this.guardarRutaNueva.invalid) {
    Swal.fire({
      title: 'Campos incompletos',
      text: 'Por favor llena todos los campos obligatorios antes de guardar.',
      icon: 'warning',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Entendido',
    });
    return;
    }
    modal.close();
    const datos = {
      nombreRuta: this.guardarRutaNueva.get('nombreRuta')?.value,
      puntoInicio: this.rutaGuardada.puntoInicio,
      puntoFin: this.rutaGuardada.puntoFin,
      recorridoDetallado: this.recorridoDeta,
      distanciaKm: this.distanciak,
    };
    console.log('📤 Datos a enviar a guardarRutas:', datos);
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera un momento.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.rutaSe.guardarRutas(datos).subscribe((response) => {
      modal.close();
      Swal.close();
      this.idRuta = response.idRuta;
      setTimeout(() => {
        this.largeModal(this.largeDataModalsConfig);
      }, 350);
      // Swal.fire({
      //   title: 'Ruta Guardada!',
      //   text: 'El registro se ha guardado correctamente!',
      //   icon: 'success',
      //   confirmButtonColor: '#3085d6',
      //   confirmButtonText: 'Entendido',
      //   showCancelButton: false,
      // }).then((result) => {
      //   if (result.value) {
      //     setTimeout(() => {
      //       this.largeModal(this.largeDataModalsConfig);
      //     }, 500);
      //     console.log(response);
      //   }
      // });
    }, error => {
      modal.close();
      Swal.close();
            Swal.fire({
              title: 'Ops!',
              text: error,
              icon: 'success',
            });
    });
  }

  modalRef!: NgbModalRef;
  largeModals(largeDataModal: any) {
    this.modalRef = this.modalService.open(largeDataModal, {
      size: 'lg',
      windowClass: 'modal-holder',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  public idRuta: any;
  configurarRuta(modal: any) {
    if (this.configRuta.invalid) {
    Swal.fire({
      title: 'Campos incompletos',
      text: 'Por favor llena todos los campos obligatorios antes de guardar.',
      icon: 'warning',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Entendido',
    });
    return;
  }

    const confg = {
      ...this.configRuta.value,
      idRuta: this.idRuta,
    };
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera un momento.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.rutaSe.configurarTarifa(confg).subscribe((response) => {
      Swal.close();
      modal.close();
      Swal.fire({
        title: '¡Ruta Guardada Con Éxito!',
        text: 'La configuración de la ruta se ha registrado correctamente.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido',
        showCancelButton: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.cancelar();
        }
      });
    }, error => {
      modal.close();
      Swal.close();
            Swal.fire({
              title: 'Ops!',
              text: error,
              icon: 'success',
            });
    });
  }

  cerrarModal(modal: any) {
    modal.close();
  }

  descargarJSON(nombreArchivo: string, data: any) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url);
  }

  cargarRutaDesdeArchivo() {
    this.http.get<any>('assets/ruta.json').subscribe(
      (data) => {
        this.mostrarRutaGuardada(data);
      },
      (err) => {
        console.error('Error al cargar ruta:', err);
      }
    );
  }

  mostrarRutaGuardada(ruta: {
    puntoInicio: { coordenadas: google.maps.LatLngLiteral; direccion: string };
    puntoFin: { coordenadas: google.maps.LatLngLiteral; direccion: string };
    recorrido: google.maps.LatLngLiteral[];
  }) {
    if (!ruta) return;

    this.map.setCenter(ruta.puntoInicio.coordenadas);
    this.map.setZoom(12);

    if (this.startMarker) this.startMarker.setMap(null);
    if (this.endMarker) this.endMarker.setMap(null);
    if (this.polyline) this.polyline.setMap(null);

    this.polyline = new google.maps.Polyline({
      path: ruta.recorrido,
      geodesic: true,
      strokeOpacity: 0,
      icons: [
        {
          icon: {
            path: 'M 0,-1 0,1',
            strokeColor: '#0000FF',
            strokeOpacity: 1,
            strokeWeight: 4,
          },
          offset: '0',
          repeat: '20px',
        },
      ],
      map: this.map,
    });

    this.startMarker = new google.maps.Marker({
      position: ruta.puntoInicio.coordenadas,
      map: this.map,
      label: 'A',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      },
    });

    const infoA = new google.maps.InfoWindow({
      content: `
        <div style="font-family: Arial; font-size: 14px; max-width: 250px; word-wrap: break-word;">
          <strong style="color: green;">Punto de Inicio</strong><br>
          <b>${ruta.puntoInicio.direccion}</b>
        </div>`,
    });
    this.startMarker.addListener('click', () =>
      infoA.open(this.map, this.startMarker)
    );
    infoA.open(this.map, this.startMarker);

    this.endMarker = new google.maps.Marker({
      position: ruta.puntoFin.coordenadas,
      map: this.map,
      label: 'B',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      },
    });

    const infoB = new google.maps.InfoWindow({
      content: `
        <div style="font-family: Arial; font-size: 14px; max-width: 250px; word-wrap: break-word;">
          <strong style="color: red;">Punto de Destino</strong><br>
          <b>${ruta.puntoFin.direccion}</b>
        </div>`,
    });
    this.endMarker.addListener('click', () =>
      infoB.open(this.map, this.endMarker)
    );
    infoB.open(this.map, this.endMarker);
  }

  cancelar() {
    this.route.navigateByUrl('/rutas/lista-rutas');
  }

  loadGoogleMaps() {
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      this.initMap();
      return;
    }
    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyCViGKafQxsHPmgGtlPsUDIaOdttLKJLk4';
    script.async = true;
    script.defer = true;
    script.onload = () => this.zone.run(() => this.initMap());
    document.head.appendChild(script);
  }

  initMap() {
  const mapElement = document.getElementById('map') as HTMLElement;

  this.map = new google.maps.Map(mapElement, {
    center: this.center,
    zoom: this.zoom,
    // ✅ Siempre permite mover, hacer zoom y ver controles
    draggable: true,
    scrollwheel: true,
    disableDefaultUI: false,
  });

  this.geocoder = new google.maps.Geocoder();

  this.polyline = new google.maps.Polyline({
    path: this.path,
    geodesic: true,
    strokeOpacity: 0,
    icons: [
      {
        icon: {
          path: 'M 0,-1 0,1',
          strokeColor: '#0000FF',
          strokeOpacity: 1,
          strokeWeight: 4,
        },
        offset: '0',
        repeat: '20px',
      },
    ],
    map: this.map,
  });

  // ✅ Solo permite agregar puntos si NO es modo visualización
  if (!this.idRutaEspecifica) {
    this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const latLng = e.latLng.toJSON();
      this.path.push(latLng);
      this.polyline.setPath(this.path);
      if (this.path.length === 1) {
        this.addStartMarker(latLng);
      } else {
        this.addEndMarker(latLng);
      }
    });
  }
}


  addStartMarker(position: google.maps.LatLngLiteral) {
    this.mostrarBotonDeshacer = true;
    if (this.startMarker) this.startMarker.setMap(null);
    this.startMarker = new google.maps.Marker({
      position,
      map: this.map,
      label: 'A',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      },
    });

    this.geocoder.geocode({ location: position }, (results, status) => {
      const direccion =
        status === 'OK' && results && results[0]
          ? results[0].formatted_address
          : 'Dirección no encontrada';

      const info = new google.maps.InfoWindow({
        content: `
            <div style="font-family: Arial; font-size: 14px; max-width: 250px; word-wrap: break-word;">
              <strong style="color: green;">Punto de Inicio</strong><br>
              <b>${direccion}</b><br>
            </div>
          `,
      });
      this.startMarker.addListener('click', () => {
        info.open(this.map, this.startMarker);
      });
      info.open(this.map, this.startMarker);
    });
  }

  addEndMarker(position: google.maps.LatLngLiteral) {
    if (this.endMarker) this.endMarker.setMap(null);

    this.endMarker = new google.maps.Marker({
      position,
      map: this.map,
      label: 'B',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      },
    });

    this.geocoder.geocode({ location: position }, (results, status) => {
      const direccion =
        status === 'OK' && results && results[0]
          ? results[0].formatted_address
          : 'Dirección no encontrada';

      const info = new google.maps.InfoWindow({
        content: `
            <div style="font-family: Arial; font-size: 14px; max-width: 250px; word-wrap: break-word;">
              <strong style="color: red;">Punto de Destino</strong><br>
              <b>${direccion}</b><br>
            </div>
          `,
      });

      this.endMarker.addListener('click', () => {
        info.open(this.map, this.endMarker);
      });

      info.open(this.map, this.endMarker);
    });
  }

  eliminarUltimoPunto() {
    if (this.path.length <= 1) {
      if (this.startMarker) {
        this.startMarker.setMap(null);
        this.startMarker = undefined!;
      }

      if (this.endMarker) {
        this.endMarker.setMap(null);
        this.endMarker = undefined!;
      }

      this.path = [];
      this.polyline.setPath(this.path);
      this.mostrarBotonDeshacer = false;
      return;
    }

    this.path.pop();
    this.polyline.setPath(this.path);

    const nuevoFinal = this.path[this.path.length - 1];

    if (this.endMarker) {
      this.endMarker.setMap(null);
      this.endMarker = undefined!;
    }

    this.addEndMarker(nuevoFinal);
  }

  /**
   * Open Large modal
   * @param largeDataModal large modal data
   */
  largeModal(largeDataModal: any) {
    this.modalService.open(largeDataModal, {
      size: 'lg',
      windowClass: 'modal-holder',
      centered: true,
      backdrop: 'static', // ❗ evita cerrar al hacer clic fuera
      keyboard: false,
    });
  }
}
