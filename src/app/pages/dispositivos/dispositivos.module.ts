import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispositivosRoutingModule } from './dispositivos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListaDispositivosComponent } from './lista-dispositivos/lista-dispositivos.component';


@NgModule({
  declarations: [ListaDispositivosComponent],
  imports: [
    CommonModule,
    DispositivosRoutingModule,
    FormsModule,
    ReactiveFormsModule 
  ]
})
export class DispositivosModule { }
