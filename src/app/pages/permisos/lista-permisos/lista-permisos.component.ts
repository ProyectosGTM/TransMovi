import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { Permiso } from 'src/app/entities/Enums/permiso.enum';
import { PermisosService } from 'src/app/shared/services/permisos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-permisos',
  templateUrl: './lista-permisos.component.html',
  styleUrl: './lista-permisos.component.scss',
  animations: [fadeInUpAnimation]
})
export class ListaPermisosComponent implements OnInit {
  isLoading: boolean = false;
  listaPermisos: any[] = [];
  public grid: boolean = false;
  public showFilterRow: boolean;
  public showHeaderFilter: boolean;
  public loadingVisible: boolean = false;
  public mensajeAgrupar: string = 'Arrastre un encabezado de columna aquí para agrupar por esa columna';
  public loading: boolean;
  public loadingMessage: string = 'Cargando...';
  public permisoAgregarPermiso: string;

  constructor(private permService:PermisosService, private route: Router, private permissionsService: NgxPermissionsService,) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;
  }

  ngOnInit() {
    this.obtenerPermisos();
    // this.obtenerListaPermisos();
    this.obtenerPermmisos();
  }

  public get Permiso() {
    return Permiso;
  }

  obtenerPermmisos() {
    this.permisoAgregarPermiso = Permiso.CrearMonedero;
    const permisos = [
      this.permisoAgregarPermiso,
    ];
    this.permissionsService.loadPermissions(permisos);
  }

  hasPermission(permission: string): boolean {
    return this.permissionsService.getPermission(permission) !== undefined;
  }

  obtenerPermisos() {
    this.loading = true;
    this.permService.obtenerPermisos().subscribe(
      (res: any) => {
        if (Array.isArray(res.permisos)) {
          this.listaPermisos = res.permisos.sort((a, b) => b.Id - a.Id);;
        } else {
          console.error('El formato de datos recibido no es el esperado.');
        }
        setTimeout(() => {
          this.loading = false;
        }, 2000)
      },
      (error) => {
        console.error('Error al obtener permisos:', error);
        this.loading = false;
      }
    );
  }

  showInfo(id: any): void {
    console.log('Mostrar información del permiso con ID:', id);
  }

  agregarPermiso() {
    this.route.navigateByUrl('/permisos/agregar-permiso')
  }

  actualizarPermiso(idPermiso: number) {
    this.route.navigateByUrl('/permisos/editar-permiso/' + idPermiso);
  };

  eliminarPermiso(permiso: any) {
    Swal.fire({
      title: '¡Eliminar Permiso!',
      background: '#22252f',
      html: `¿Está seguro que desea eliminar el permiso: <br> ${permiso.Marca + ' ' + permiso.Modelo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.permService.eliminarPermiso(permiso.Id).subscribe(
          (response) => {
            Swal.fire({
              title: '¡Eliminado!',
              background: '#22252f',
              html: `El permiso ha sido eliminado de forma exitosa.`,
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Confirmar',
            })
            this.obtenerPermisos();
          },
          (error) => {
            Swal.fire({
              title: '¡Ops!',
              background: '#22252f',
              html: `Error al intentar eliminar el permiso.`,
              icon: 'error',
              showCancelButton: false,
            })
          }
        );
      }
    });
  }

  activar(rowData: any) {
    Swal.fire({
      title: 'Confirmar activación',
      text: `¿Desea activar el permiso: ${rowData.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.permService.updateEstatus(rowData.id).subscribe(
          (response) => {
            Swal.fire('¡Actualizado!', 'El permiso se ha activado correctamente.', 'success');
            this.obtenerPermisos();
          },
          (error) => {
            Swal.fire('¡Ops!', 'Error al intentar activar este permiso.', 'error');
          }
        );
      }
    });
  }

  desactivar(rowData: any) {
    Swal.fire({
      title: 'Confirmar desactivación',
      text: `¿Desea desactivar el permiso: ${rowData.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.permService.updateEstatus(rowData.id).subscribe(
          (response) => {
            Swal.fire('¡Actualizado!', 'El permiso se ha desactivado correctamente.', 'success');
            this.obtenerPermisos();
          },
          (error) => {
            Swal.fire('¡Ops!', 'Error al intentar desactivar este permiso.', 'error');
          }
        );
      }
    });
    // console.log('Desactivar:', rowData);
  }
}
