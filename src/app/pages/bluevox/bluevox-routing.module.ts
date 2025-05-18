import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaBluevoxComponent } from './lista-bluevox/lista-bluevox.component';

const routes: Routes = [
  {
      path: 'lista-bluevox',
      component: ListaBluevoxComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BluevoxRoutingModule { }
