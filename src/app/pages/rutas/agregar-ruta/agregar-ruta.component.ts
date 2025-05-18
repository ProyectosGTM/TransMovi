import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { RutasService } from 'src/app/shared/services/rutas.service';

@Component({
  selector: 'app-agregar-ruta',
  templateUrl: './agregar-ruta.component.html',
  styleUrl: './agregar-ruta.component.scss',
  animations: [fadeInUpAnimation]
})
export class AgregarRutaComponent implements OnInit {

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
  ) { }

  ngOnInit(): void {
    this.mostrarRutaGuardada(this.rutaGuardada);
    this.loadGoogleMaps();
  }

  guardarRuta() {
  if (this.path.length < 2) return;

  const puntoInicio = this.path[0];
  const puntoFin = this.path[this.path.length - 1];

  this.geocoder.geocode({ location: puntoInicio }, (resA, statusA) => {
    const direccionA = (statusA === 'OK' && resA?.[0]) ? resA[0].formatted_address : 'No encontrada';

    this.geocoder.geocode({ location: puntoFin }, (resB, statusB) => {
      const direccionB = (statusB === 'OK' && resB?.[0]) ? resB[0].formatted_address : 'No encontrada';

      this.rutaGuardada = {
        puntoInicio: {
          coordenadas: puntoInicio,
          direccion: direccionA
        },
        puntoFin: {
          coordenadas: puntoFin,
          direccion: direccionB
        },
        recorrido: [...this.path]
      };

      // Enviar al backend
      this.rutaSe.detallarRuta(this.rutaGuardada).subscribe({
        next: (resp) => {
          alert('✅ Ruta guardada exitosamente en el servidor');
          console.log('📤 Respuesta del servidor:', resp);
        },
        error: (err) => {
          console.error('❌ Error al guardar ruta:', err);
          alert('❌ Error al guardar la ruta');
        }
      });
    });
  });
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
    this.http.get<any>('assets/ruta.json').subscribe((data) => {
      this.mostrarRutaGuardada(data);
    }, (err) => {
      console.error('Error al cargar ruta:', err);
    });
  }

  mostrarRutaGuardada(ruta: {
    puntoInicio: { coordenadas: google.maps.LatLngLiteral; direccion: string };
    puntoFin: { coordenadas: google.maps.LatLngLiteral; direccion: string };
    recorrido: google.maps.LatLngLiteral[];
  }) {
    if (!ruta) return;

    // Centrar mapa
    this.map.setCenter(ruta.puntoInicio.coordenadas);
    this.map.setZoom(14);

    // Limpiar si ya había algo
    if (this.startMarker) this.startMarker.setMap(null);
    if (this.endMarker) this.endMarker.setMap(null);
    if (this.polyline) this.polyline.setMap(null);

    // Dibujar línea
    this.polyline = new google.maps.Polyline({
      path: ruta.recorrido,
      geodesic: true,
      strokeOpacity: 0,
      icons: [{
        icon: {
          path: 'M 0,-1 0,1',
          strokeColor: '#0000FF',
          strokeOpacity: 1,
          strokeWeight: 4
        },
        offset: '0',
        repeat: '20px'
      }],
      map: this.map
    });

    // Marker A
    this.startMarker = new google.maps.Marker({
      position: ruta.puntoInicio.coordenadas,
      map: this.map,
      label: 'A',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      }
    });

    const infoA = new google.maps.InfoWindow({
      content: `
        <div style="font-family: Arial; font-size: 14px; max-width: 250px; word-wrap: break-word;">
          <strong style="color: green;">Punto de Inicio</strong><br>
          <b>${ruta.puntoInicio.direccion}</b>
        </div>`
    });
    this.startMarker.addListener('click', () => infoA.open(this.map, this.startMarker));
    infoA.open(this.map, this.startMarker);

    // Marker B
    this.endMarker = new google.maps.Marker({
      position: ruta.puntoFin.coordenadas,
      map: this.map,
      label: 'B',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      }
    });

    const infoB = new google.maps.InfoWindow({
      content: `
        <div style="font-family: Arial; font-size: 14px; max-width: 250px; word-wrap: break-word;">
          <strong style="color: red;">Punto de Destino</strong><br>
          <b>${ruta.puntoFin.direccion}</b>
        </div>`
    });
    this.endMarker.addListener('click', () => infoB.open(this.map, this.endMarker));
    infoB.open(this.map, this.endMarker);
  }

  cancelar() {
    this.route.navigateByUrl('/rutas/lista-rutas')
  }

  loadGoogleMaps() {
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      this.initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCViGKafQxsHPmgGtlPsUDIaOdttLKJLk4';
    script.async = true;
    script.defer = true;
    script.onload = () => this.zone.run(() => this.initMap());
    document.head.appendChild(script);
  }


  initMap() {
    const mapElement = document.getElementById('map') as HTMLElement;

    this.map = new google.maps.Map(mapElement, {
      center: this.center,
      zoom: this.zoom
    });

    this.geocoder = new google.maps.Geocoder(); // <-- esta línea es obligatoria

    this.polyline = new google.maps.Polyline({
      path: this.path,
      geodesic: true,
      strokeOpacity: 0,
      icons: [{
        icon: {
          path: 'M 0,-1 0,1',
          strokeColor: '#0000FF',
          strokeOpacity: 1,
          strokeWeight: 4
        },
        offset: '0',
        repeat: '20px'
      }],
      map: this.map
    });

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

  addStartMarker(position: google.maps.LatLngLiteral) {
    this.mostrarBotonDeshacer = true;

    if (this.startMarker) this.startMarker.setMap(null);

    this.startMarker = new google.maps.Marker({
      position,
      map: this.map,
      label: 'A',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      }
    });

    this.geocoder.geocode({ location: position }, (results, status) => {
      const direccion = (status === 'OK' && results && results[0])
        ? results[0].formatted_address
        : 'Dirección no encontrada';

      const info = new google.maps.InfoWindow({
        content: `
            <div style="font-family: Arial; font-size: 14px; max-width: 250px; word-wrap: break-word;">
              <strong style="color: green;">Punto de Inicio</strong><br>
              <b>${direccion}</b><br>
            </div>
          `
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
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      }
    });

    this.geocoder.geocode({ location: position }, (results, status) => {
      const direccion = (status === 'OK' && results && results[0])
        ? results[0].formatted_address
        : 'Dirección no encontrada';

      const info = new google.maps.InfoWindow({
        content: `
            <div style="font-family: Arial; font-size: 14px; max-width: 250px; word-wrap: break-word;">
              <strong style="color: red;">Punto de Destino</strong><br>
              <b>${direccion}</b><br>
            </div>
          `
      });

      this.endMarker.addListener('click', () => {
        info.open(this.map, this.endMarker);
      });

      info.open(this.map, this.endMarker);
    });
  }

  eliminarUltimoPunto() {
    if (this.path.length <= 1) {
      // Eliminar punto A y limpiar todo
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

    // Hay más de 1 punto, eliminar el último
    this.path.pop();
    this.polyline.setPath(this.path);

    // Actualizar marker B al nuevo final
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
    this.modalService.open(largeDataModal, { size: 'lg',windowClass:'modal-holder', centered: true });
  }
}