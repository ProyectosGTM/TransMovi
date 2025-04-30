import { Component, OnInit } from '@angular/core';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { PasajerosService } from 'src/app/shared/services/pasajeros.service';

@Component({
  selector: 'app-lista-pasajeros',
  templateUrl: './lista-pasajeros.component.html',
  styleUrls: ['./lista-pasajeros.component.scss'],
  animations: [fadeInUpAnimation]
})
export class ListaPasajerosComponent implements OnInit {

  listaPasajeros: any[] = [];
  filteredPasajeros: any[] = [];
  paginatedPasajeros: any[] = [];
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  pageSizeOptions: number[] = [10, 20, 50, 100];
  pageSize: number = 10;
  currentPage: number = 0;
  totalRecords: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;

  constructor(private pasaService: PasajerosService) { }

  ngOnInit(): void {
    this.obtenerListaPasajeros();
  }

  obtenerListaPasajeros() {
    this.isLoading = true;
    this.pasaService.obtenerPasajeros().subscribe(
      (res: any) => {
        this.listaPasajeros = res.pasajeros;
        this.filteredPasajeros = [...this.listaPasajeros];
        this.totalRecords = this.listaPasajeros.length;
        this.updateTotalPages();
        this.filterPasajeros();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener pasajeros:', error);
        this.isLoading = false;
      }
    );
  }

  filterPasajeros() {
    this.filteredPasajeros = this.listaPasajeros.filter(pasajero => {
      const searchMatch = pasajero.Nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          pasajero.ApellidoPaterno.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          pasajero.ApellidoMaterno.toLowerCase().includes(this.searchTerm.toLowerCase());

      const startDateMatch = !this.startDate || new Date(pasajero.FechaNacimiento) >= new Date(this.startDate);
      const endDateMatch = !this.endDate || new Date(pasajero.FechaNacimiento) <= new Date(this.endDate);

      return searchMatch && startDateMatch && endDateMatch;
    });

    this.totalRecords = this.filteredPasajeros.length;
    this.updateTotalPages();
    this.updatePaginatedPasajeros();
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  updatePaginatedPasajeros(): void {
    const startIndex = this.startIndex;
    const endIndex = this.endIndex;
    this.paginatedPasajeros = this.filteredPasajeros.slice(startIndex, endIndex);
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
    this.filterPasajeros();
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePaginatedPasajeros();
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedPasajeros();
    }
  }

  showInfo(id: any): void {
    console.log('Mostrar información del pasajero con ID:', id);
  }
}
