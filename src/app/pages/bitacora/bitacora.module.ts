import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BitacoraRoutingModule } from './bitacora-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxDataGridModule } from 'devextreme-angular';
import { ListaBitacoraComponent } from './lista-bitacora/lista-bitacora.component';


@NgModule({
  declarations: [ListaBitacoraComponent],
  imports: [
    CommonModule,
    BitacoraRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DxDataGridModule
  ]
})
export class BitacoraModule { }
