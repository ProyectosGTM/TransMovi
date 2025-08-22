import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermisosRoutingModule } from './permisos-routing.module';
import { DxDataGridModule, DxLoadPanelModule } from 'devextreme-angular';
import { ListaPermisosComponent } from './lista-permisos/lista-permisos.component';
import { AltaPermisoComponent } from './alta-permiso/alta-permiso.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '../form/form.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ListaPermisosComponent, AltaPermisoComponent],
  imports: [
    CommonModule,
    PermisosRoutingModule,
    ReactiveFormsModule,
    FormModule,
    DxDataGridModule,
    DxLoadPanelModule,
    SharedModule 
  ]
})
export class PermisosModule { }
