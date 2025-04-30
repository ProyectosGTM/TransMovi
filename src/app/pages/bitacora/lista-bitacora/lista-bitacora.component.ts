import { Component, OnInit } from '@angular/core';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { BitacoraService } from 'src/app/shared/services/bitacora.service';

@Component({
  selector: 'app-lista-bitacora',
  templateUrl: './lista-bitacora.component.html',
  styleUrls: ['./lista-bitacora.component.scss'],
  animations: [fadeInUpAnimation]
})
export class ListaBitacoraComponent implements OnInit {

  public bitacoraList: any[] = [];
  public filteredBitacora: any[] = [];
  public paginatedBitacora: any[] = [];
  public searchTerm: string = '';
  public startDate: string = '';
  public endDate: string = '';
  public pageSizeOptions: number[] = [10, 20, 50, 100];
  public pageSize: number = 10;
  public currentPage: number = 0;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public isLoading: boolean = false;

  constructor(private bitacoraService: BitacoraService) {}

  ngOnInit(): void {
    this.obtenerBitacora();
  }

  obtenerBitacora(): void {
    this.isLoading = true;
    this.bitacoraService.obtenerBitacora().subscribe(
      (res: any) => {
        this.bitacoraList = res.bitacora; // Ajusta esta línea según la estructura de tu respuesta
        this.filteredBitacora = [...this.bitacoraList]; // Hacemos una copia de la lista original
        this.totalRecords = this.bitacoraList.length; 
        this.updateTotalPages();
        this.updatePaginatedBitacora();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener bitácora:', error);
        this.isLoading = false;
      }
    );
  }

  getUserFromQuery(query: string): string {
    const match = query.match(/UserName='([^']+)'/); // Expresión regular para capturar el valor de UserName
    return match ? match[1] : 'Desconocido'; // Si encuentra el nombre de usuario, lo devuelve, de lo contrario, "Desconocido"
  }

  filterBitacora(): void {
    // Filtramos los datos de acuerdo al término de búsqueda y a las fechas seleccionadas
    this.filteredBitacora = this.bitacoraList.filter((item) => {
      const modulo = typeof item.Modulo === 'string' ? item.Modulo.toLowerCase() : '';
      const accion = typeof item.Accion === 'string' ? item.Accion.toLowerCase() : '';
      const descripcion = typeof item.Descripcion === 'string' ? item.Descripcion.toLowerCase() : '';
      const searchMatch = modulo.includes(this.searchTerm.toLowerCase()) || 
                          accion.includes(this.searchTerm.toLowerCase()) ||
                          descripcion.includes(this.searchTerm.toLowerCase());

      const startDateMatch = !this.startDate || new Date(item.Fecha) >= new Date(this.startDate);
      const endDateMatch = !this.endDate || new Date(item.Fecha) <= new Date(this.endDate);
      
      return searchMatch && startDateMatch && endDateMatch;
    });

    this.totalRecords = this.filteredBitacora.length;
    this.updateTotalPages();
    this.updatePaginatedBitacora();
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  updatePaginatedBitacora(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min((this.currentPage + 1) * this.pageSize, this.totalRecords);
    this.paginatedBitacora = this.filteredBitacora.slice(startIndex, endIndex);
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.updateTotalPages();
    this.updatePaginatedBitacora();
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePaginatedBitacora();
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedBitacora();
    }
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.filterBitacora();
  }
}
