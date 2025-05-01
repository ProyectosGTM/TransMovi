import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasajerosRoutingModule } from './pasajeros-routing.module';
import { ListaPasajerosComponent } from './lista-pasajeros/lista-pasajeros.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxDataGridModule } from 'devextreme-angular';


@NgModule({
  declarations: [ListaPasajerosComponent],
  imports: [
    CommonModule,
    PasajerosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DxDataGridModule
  ]
})
export class PasajerosModule { }
