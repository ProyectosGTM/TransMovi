import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { MonederosServices } from 'src/app/shared/services/monederos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-monederos',
  templateUrl: './lista-monederos.component.html',
  styleUrls: ['./lista-monederos.component.scss'],
  animations: [fadeInUpAnimation]
})
export class ListaMonederosComponent implements OnInit {

  listaMonederos: any[] = [];
  filteredMonederos: any[] = [];
  paginatedMonederos: any[] = [];
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  pageSizeOptions: number[] = [10, 20, 50, 100];
  pageSize: number = 10;
  currentPage: number = 0;
  totalRecords: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;
  public loading: boolean = false;
  public submitButton: string = 'Aceptar';
  public recargaForm: FormGroup;
  public debitoForm: FormGroup;
  public selectedTransactionId: number | null = null;
  public selectedSerie: any | null = null;
  private modalRef: NgbModalRef | null = null;

  constructor(private moneService: MonederosServices, private modalService: NgbModal, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.obtenerMonederos();
  }

  initForm() {
    this.recargaForm = this.fb.group({
      IdMonedero: [null],
      Monto: [null, [Validators.required]],
      TipoTransaccion: ['Recarga'],
      Latitud: [19.4326],
      Longitud: [-99.1332]
    });

    this.debitoForm = this.fb.group({
      IdMonedero: [null],
      Monto: [null, [Validators.required]],
      TipoTransaccion: ['Debito'],
      Latitud: [19.4326],
      Longitud: [-99.1332]
    });
  }

  obtenerMonederos() {
    this.isLoading = true;
    this.moneService.obtenerMonederos().subscribe(
      (res: any) => {
        this.listaMonederos = res.monederos;
        this.filteredMonederos = [...this.listaMonederos];
        this.totalRecords = this.listaMonederos.length;
        this.updateTotalPages();
        this.filterMonederos();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener monederos:', error);
        this.isLoading = false;
      }
    );
  }

  filterMonederos() {
    this.filteredMonederos = this.listaMonederos.filter(mon => {
      const searchMatch = mon.NumeroSerie.toLowerCase().includes(this.searchTerm.toLowerCase());
      const startDateMatch = !this.startDate || new Date(mon.FechaActivacion) >= new Date(this.startDate);
      const endDateMatch = !this.endDate || new Date(mon.FechaActivacion) <= new Date(this.endDate);
      return searchMatch && startDateMatch && endDateMatch;
    });
    this.totalRecords = this.filteredMonederos.length;
    this.updateTotalPages();
    this.updatePaginatedMonederos();
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  updatePaginatedMonederos(): void {
    const startIndex = this.startIndex;
    const endIndex = this.endIndex;
    this.paginatedMonederos = this.filteredMonederos.slice(startIndex, endIndex);
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
    this.filterMonederos();
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePaginatedMonederos();
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedMonederos();
    }
  }

  cerrarModalRecarga() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }

  cerrarModalDebito() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }

  centerModalRecarga(centerDataModalRecarga: any, id: number, numeroSerie: any) {
    this.selectedTransactionId = id;
    this.selectedSerie = numeroSerie;
    this.recargaForm.patchValue({
      IdMonedero: this.selectedTransactionId
    });
    this.modalRef = this.modalService.open(centerDataModalRecarga, { centered: true, windowClass: 'modal-holder' });
  }

  centerModalDebito(centerDataModalDebito: any, id: number, numeroSerie: any) {
    this.selectedTransactionId = id;
    this.selectedSerie = numeroSerie;
    this.debitoForm.patchValue({
      IdMonedero: this.selectedTransactionId
    });
    this.modalRef = this.modalService.open(centerDataModalDebito, { centered: true, windowClass: 'modal-holder' });
  }

  crearTransaccionRecarga() {
    const formValue = this.recargaForm.value;

    // Validación para no permitir monto igual a 0
    if (formValue.Monto <= 0) {
        Swal.fire({
            title: '¡Error!',
            text: 'El monto no puede ser 0 o vacío.',
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
        });
        return; // No continuar si el monto es 0 o vacío
    }

    this.loading = true;
    this.submitButton = 'Cargando...';

    this.moneService.crearTransaccion(formValue).subscribe(
      (response: any) => {
        this.loading = false;
        this.submitButton = 'Guardar';
        this.ngOnInit();
        if (response) {
          this.cerrarModalRecarga();
          Swal.fire({
            title: '¡Operación Exitosa!',
            text: 'Se realizó la recarga de manera correcta.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Confirmar',
          });
        } else {
          console.log('Respuesta inesperada:', response);
        }

      }, (error: string) => {
        this.loading = false;
        this.submitButton = 'Guardar';
        Swal.fire({
          title: '¡Ops!',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Confirmar',
        });
      });
}

crearTransaccionDebito() {
    const formValue = this.debitoForm.value;

    // Validación para no permitir monto igual a 0
    if (formValue.Monto <= 0) {
        Swal.fire({
            title: '¡Error!',
            text: 'El monto no puede ser 0 o vacío.',
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
        });
        return; // No continuar si el monto es 0 o vacío
    }

    this.loading = true;
    this.submitButton = 'Cargando...';

    this.moneService.crearTransaccion(formValue).subscribe(
      (response: any) => {
        this.loading = false;
        this.submitButton = 'Guardar';
        this.ngOnInit();
        if (response) {
          this.cerrarModalDebito();
          Swal.fire({
            title: '¡Operación Exitosa!',
            text: 'Se realizó el débito de manera correcta.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Confirmar',
          });
        } else {
          console.log('Respuesta inesperada:', response);
        }

      }, (error: string) => {
        this.loading = false;
        this.submitButton = 'Guardar';
        Swal.fire({
          title: '¡Ops!',
          text: error,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Confirmar',
        });
      });
}

}