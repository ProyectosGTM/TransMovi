import { Component, OnInit } from '@angular/core';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { TransaccionesService } from 'src/app/shared/services/transacciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var google: any; // Declara google para usar la API de Google Maps

@Component({
  selector: 'app-lista-transacciones',
  templateUrl: './lista-transacciones.component.html',
  styleUrls: ['./lista-transacciones.component.scss'],
  animations: [fadeInUpAnimation]
})
export class ListaTransaccionesComponent implements OnInit {

  listaTransacciones: any[] = [];
  filteredTransacciones: any[] = [];
  paginatedTransacciones: any[] = [];
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  pageSizeOptions: number[] = [10, 20, 50, 100];
  pageSize: number = 10;
  currentPage: number = 0;
  totalRecords: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;

  public selectedTransactionId: number | null = null;
  public latSelect: string | null = null;
  public lngSelect: string | null = null;
  public selectedTransactionDate: string | null = null;
  public selectedTransactionAmount: number | null = null;
  public selectedTipoTransaccion: any | null = null;

  constructor(private tranService: TransaccionesService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.obtenerTransacciones();
  }

  obtenerTransacciones() {
    this.isLoading = true;
    this.tranService.obtenerTransacciones().subscribe(
      (res: any) => {
        this.listaTransacciones = res.transacciones;
        this.filteredTransacciones = [...this.listaTransacciones];
        this.totalRecords = this.listaTransacciones.length;
        this.updateTotalPages();
        this.filterTransacciones();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener transacciones:', error);
        this.isLoading = false;
      }
    );
  }

  filterTransacciones() {
    this.filteredTransacciones = this.listaTransacciones.filter(transaccion => {
      const searchMatch = transaccion.TipoTransaccion.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          transaccion.IdMonedero.toString().includes(this.searchTerm);

      const startDateMatch = !this.startDate || new Date(transaccion.FechaHora) >= new Date(this.startDate);
      const endDateMatch = !this.endDate || new Date(transaccion.FechaHora) <= new Date(this.endDate);

      return searchMatch && startDateMatch && endDateMatch;
    });

    this.totalRecords = this.filteredTransacciones.length;
    this.updateTotalPages();
    this.updatePaginatedTransacciones();
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  updatePaginatedTransacciones(): void {
    const startIndex = this.startIndex;
    const endIndex = this.endIndex;
    this.paginatedTransacciones = this.filteredTransacciones.slice(startIndex, endIndex);
  }

  get startIndex(): number {
    return this.currentPage * this.pageSize;
  }

  get endIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalRecords);
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.updateTotalPages();
    this.filterTransacciones();
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePaginatedTransacciones();
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedTransacciones();
    }
  }

  showInfo(id: any): void {
    console.log('Mostrar información de la transacción con ID:', id);
  }

  centerModal(centerDataModal: any, id: number, latitud: string, longitud: string, FechaHora: string, Monto: number, TipoTransaccion: any) {
    this.selectedTransactionId = id;
    this.latSelect = latitud;
    this.lngSelect = longitud;
    this.selectedTransactionDate = FechaHora;
    this.selectedTransactionAmount = Monto;
    this.selectedTipoTransaccion = TipoTransaccion;
    this.modalService.open(centerDataModal, { centered: true, windowClass: 'modal-holder' });

    // Inicializar Google Maps después de abrir el modal
    setTimeout(() => {
      this.initializeMap(latitud, longitud);
    }, 500);
}


  initializeMap(lat: string, lng: string) {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      const location = { lat: parseFloat(lat), lng: parseFloat(lng) };
      const map = new google.maps.Map(mapElement, {
        center: location,
        zoom: 15
      });

      // Agregar un marcador en la ubicación seleccionada
      new google.maps.Marker({
        position: location,
        map: map
      });
    }
  }

  cerrarModal(modal: any) {
    modal.close('Modal cerrado por nuevo método');
  }
}
