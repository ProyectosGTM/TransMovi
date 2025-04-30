import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPasajerosComponent } from './lista-pasajeros/lista-pasajeros.component';

const routes: Routes = [
  { path: 'lista-pasajeros',component:ListaPasajerosComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasajerosRoutingModule { }
