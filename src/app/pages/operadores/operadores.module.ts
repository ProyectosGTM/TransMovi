import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperadoresRoutingModule } from './operadores-routing.module';
import { ListaOperadoresComponent } from './lista-operadores/lista-operadores.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxDataGridModule, DxLoadPanelModule } from 'devextreme-angular';


@NgModule({
  declarations: [ListaOperadoresComponent],
  imports: [
    CommonModule,
    OperadoresRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DxDataGridModule,
    DxLoadPanelModule
  ]
})
export class OperadoresModule { }
