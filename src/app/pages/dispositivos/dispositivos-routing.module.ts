import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaDispositivosComponent } from './lista-dispositivos/lista-dispositivos.component';

const routes: Routes = [
  { path: 'lista-dispositivos',component:ListaDispositivosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispositivosRoutingModule { }
