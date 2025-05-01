import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiculosRoutingModule } from './vehiculos-routing.module';
import { ListaVehiculosComponent } from './lista-vehiculos/lista-vehiculos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxDataGridModule } from 'devextreme-angular';


@NgModule({
  declarations: [ListaVehiculosComponent],
  imports: [
    CommonModule,
    VehiculosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DxDataGridModule
  ]
})
export class VehiculosModule { }
