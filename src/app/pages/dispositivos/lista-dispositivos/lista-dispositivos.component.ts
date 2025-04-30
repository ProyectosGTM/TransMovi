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

  listaDispositivos: any[] = [];
  filteredDispositivos: any[] = [];
  paginatedDispositivos: any[] = [];
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  pageSizeOptions = [10, 20, 50, 100];
  pageSize = 10;
  currentPage = 0;
  totalRecords = 0;
  totalPages = 0;
  isLoading: boolean = false;
  informacionTotalRecords = 0; 
  validarTotal = false; 

  constructor(private disposService: DispositivosService) {}

  ngOnInit(): void {
    this.obtenerDispositivos();
  }

  obtenerDispositivos() {
    this.isLoading = true;
    this.disposService.obtenerDispositivos().subscribe(
      (res: any) => {
        console.log("Dispositivos obtenidos del servicio:", res.dispositivos);
        if (Array.isArray(res.dispositivos)) {
          this.listaDispositivos = res.dispositivos;
          this.filteredDispositivos = [...this.listaDispositivos];  
          this.informacionTotalRecords = this.listaDispositivos.length; 
          this.updateTotalPages();
          this.validarTotal = this.listaDispositivos.length === 0;  
          this.filterDispositivos();  
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

  filterDispositivos() {
    console.log("Término de búsqueda:", this.searchTerm);
    console.log("Fecha de inicio:", this.startDate, "Fecha de fin:", this.endDate);
    this.filteredDispositivos = this.listaDispositivos.filter(dispositivo => {
        
        const marca = typeof dispositivo.Marca === 'string' ? dispositivo.Marca.toLowerCase() : '';
        const modelo = typeof dispositivo.Modelo === 'string' ? dispositivo.Modelo.toLowerCase() : '';
        const numeroSerie = typeof dispositivo.NumeroSerie === 'string' ? dispositivo.NumeroSerie.toLowerCase() : '';
        const estatus = typeof dispositivo.Estatus === 'string' ? dispositivo.Estatus.toLowerCase() : '';

        const searchMatch = marca.includes(this.searchTerm.toLowerCase()) || 
                            modelo.includes(this.searchTerm.toLowerCase()) ||
                            numeroSerie.includes(this.searchTerm.toLowerCase()) || 
                            estatus.includes(this.searchTerm.toLowerCase());
        const startDateMatch = !this.startDate || new Date(dispositivo.Fecha) >= new Date(this.startDate);
        const endDateMatch = !this.endDate || new Date(dispositivo.Fecha) <= new Date(this.endDate);

        return searchMatch && startDateMatch && endDateMatch;
    });
    console.log("Dispositivos filtrados:", this.filteredDispositivos);
    this.totalRecords = this.filteredDispositivos.length;
    this.updateTotalPages();
    this.updatePaginatedDispositivos();
  }


  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  updatePaginatedDispositivos(): void {
    const startIndex = this.startIndex;
    const endIndex = this.endIndex;
    this.paginatedDispositivos = this.filteredDispositivos.slice(startIndex, endIndex);
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
    this.updatePaginatedDispositivos();
  }

  onNextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalRecords) {
      this.currentPage++;
      this.updatePaginatedDispositivos();
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedDispositivos();
    }
  }

  showInfo(id: any): void {
    console.log('Mostrar información del dispositivo con ID:', id);
  }
}
