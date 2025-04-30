import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaOperadoresComponent } from './lista-operadores/lista-operadores.component';

const routes: Routes = [
  { path: 'lista-operadores',component:ListaOperadoresComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperadoresRoutingModule { }
