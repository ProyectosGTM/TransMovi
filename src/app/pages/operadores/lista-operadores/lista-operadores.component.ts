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
  filteredOperadores: any[] = [];
  paginatedOperadores: any[] = [];
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  pageSizeOptions = [10, 20, 50, 100];
  pageSize = 10;
  currentPage = 0;
  totalRecords = 0;
  totalPages = 0;
  isLoading: boolean = false;

  constructor(private opService: OperadoresService) { }

  ngOnInit(): void {
    this.obtenerOperadores();
  }

  obtenerOperadores() {
    this.isLoading = true;
    this.opService.obtenerOperadores().subscribe(
      (res: any) => {
        this.listaOperadores = res.operadores;
        this.filteredOperadores = [...this.listaOperadores];
        this.totalRecords = this.listaOperadores.length;
        this.updateTotalPages();
        this.filterOperadores();  // Aplicar filtro inicial
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener operadores:', error);
        this.isLoading = false;
      }
    );
  }

  filterOperadores() {
    this.filteredOperadores = this.listaOperadores.filter(operador => {
      const searchMatch = operador.Nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          operador.ApellidoPaterno.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          operador.ApellidoMaterno.toLowerCase().includes(this.searchTerm.toLowerCase());

      const startDateMatch = !this.startDate || new Date(operador.FechaNacimiento) >= new Date(this.startDate);
      const endDateMatch = !this.endDate || new Date(operador.FechaNacimiento) <= new Date(this.endDate);

      return searchMatch && startDateMatch && endDateMatch;
    });

    this.totalRecords = this.filteredOperadores.length;
    this.updateTotalPages();
    this.updatePaginatedOperadores();
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  updatePaginatedOperadores(): void {
    const startIndex = this.startIndex;
    const endIndex = this.endIndex;
    this.paginatedOperadores = this.filteredOperadores.slice(startIndex, endIndex);
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
    this.updatePaginatedOperadores();
  }

  onNextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalRecords) {
      this.currentPage++;
      this.updatePaginatedOperadores();
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedOperadores();
    }
  }
}
