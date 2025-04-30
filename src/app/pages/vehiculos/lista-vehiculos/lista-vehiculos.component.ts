import { Component, OnInit } from '@angular/core';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { VehiculosService } from 'src/app/shared/services/vehiculos.service';

@Component({
  selector: 'app-lista-vehiculos',
  templateUrl: './lista-vehiculos.component.html',
  styleUrls: ['./lista-vehiculos.component.scss'],
  animations: [fadeInUpAnimation]
})
export class ListaVehiculosComponent implements OnInit {

  listaVehiculos: any[] = [];
  filteredVehiculos: any[] = [];
  paginatedVehiculos: any[] = [];
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  informacionPageSizeOptions = [10, 20, 50, 100];
  informacionPageSize = 10;
  informacionCurrentPage = 0;
  totalRecords = 0;
  totalPages = 0;
  isLoading: boolean = false;
  validarTotal: boolean = true;

  constructor(private vehiService: VehiculosService) { }

  ngOnInit(): void {
    this.obtenerVehiculos();
  }

  obtenerVehiculos() {
    this.isLoading = true;
    this.vehiService.obtenerVehiculos().subscribe(
      (res: any) => {
        if (Array.isArray(res.vehiculos)) {
          this.listaVehiculos = res.vehiculos;
          this.filteredVehiculos = [...this.listaVehiculos];
          this.totalRecords = this.listaVehiculos.length;
          this.updateTotalPages();
          this.validarTotal = this.listaVehiculos.length === 0;
          this.updatePaginatedVehiculos();
        } else {
          console.error('El formato de datos recibido no es el esperado.');
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener vehículos:', error);
        this.isLoading = false;
      }
    );
  }

  filterVehiculos() {
    console.log("Filtrando vehículos con término de búsqueda:", this.searchTerm);
    console.log("Fecha de inicio:", this.startDate, "Fecha de fin:", this.endDate);

    this.filteredVehiculos = this.listaVehiculos.filter(vehiculo => {
      const searchMatch = vehiculo.Marca.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          vehiculo.Modelo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          vehiculo.Placa.toLowerCase().includes(this.searchTerm.toLowerCase());

      const startDateMatch = !this.startDate || new Date(vehiculo.FechaActivacion) >= new Date(this.startDate);
      const endDateMatch = !this.endDate || new Date(vehiculo.FechaActivacion) <= new Date(this.endDate);

      return searchMatch && startDateMatch && endDateMatch;
    });

    this.totalRecords = this.filteredVehiculos.length;
    this.updateTotalPages();
    this.updatePaginatedVehiculos();
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.informacionPageSize);
  }

  updatePaginatedVehiculos(): void {
    const startIndex = this.startIndex;
    const endIndex = this.endIndex;
    this.paginatedVehiculos = this.filteredVehiculos.slice(startIndex, endIndex);
  }

  get startIndex(): number {
    return this.informacionCurrentPage * this.informacionPageSize;
  }

  get endIndex(): number {
    return Math.min((this.informacionCurrentPage + 1) * this.informacionPageSize, this.totalRecords);
  }

  onPageSizeChange(): void {
    this.informacionCurrentPage = 0;
    this.updateTotalPages();
    this.updatePaginatedVehiculos();
  }

  onNextPage(): void {
    if ((this.informacionCurrentPage + 1) * this.informacionPageSize < this.totalRecords) {
      this.informacionCurrentPage++;
      this.updatePaginatedVehiculos();
    }
  }

  onPreviousPage(): void {
    if (this.informacionCurrentPage > 0) {
      this.informacionCurrentPage--;
      this.updatePaginatedVehiculos();
    }
  }

  showInfo(id: any): void {
    console.log('Mostrar información del vehículo con ID:', id);
  }
}
