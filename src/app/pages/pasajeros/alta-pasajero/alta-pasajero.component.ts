import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';

@Component({
  selector: 'app-alta-pasajero',
  templateUrl: './alta-pasajero.component.html',
  styleUrl: './alta-pasajero.component.scss',
  animations: [fadeInUpAnimation]
})
export class AltaPasajeroComponent implements OnInit {

  public title = 'Agregar Pasajero';

  constructor(private route: Router){}

  ngOnInit(): void {
      
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.keyCode ? event.keyCode : event.which;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  regresar(){
    this.route.navigateByUrl('/pasajeros/lista-pasajeros')
  }

}
