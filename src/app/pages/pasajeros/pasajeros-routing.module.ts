import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPasajerosComponent } from './lista-pasajeros/lista-pasajeros.component';
import { AltaPasajeroComponent } from './alta-pasajero/alta-pasajero.component';

const routes: Routes = 
[
  { path: 'lista-pasajeros',component:ListaPasajerosComponent},
  { path: 'agregar-pasajero',component:AltaPasajeroComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasajerosRoutingModule { }
