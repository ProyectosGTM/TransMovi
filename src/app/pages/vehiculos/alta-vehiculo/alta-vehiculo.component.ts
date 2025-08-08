import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUpAnimation } from 'src/app/core/animations/fade-in-up.animation';
import { DispositivosService } from 'src/app/shared/services/dispositivos.service';
import { OperadoresService } from 'src/app/shared/services/operadores.service';
import { VehiculosService } from 'src/app/shared/services/vehiculos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alta-vehiculo',
  templateUrl: './alta-vehiculo.component.html',
  styleUrl: './alta-vehiculo.component.scss',
  animations: [fadeInUpAnimation]
})
export class AltaVehiculoComponent implements OnInit {
  public submitButton: string = 'Guardar';
  public loading: boolean = false;
  public vehiculosForm: FormGroup;
  public idVehiculo: number;
  public title = 'Agregar Vehículo';
  selectedFileName: string = '';
  previewUrl: string | ArrayBuffer | null = null;
  public listaOperadores: any;
  listaDispositivos: any;
  public anios: number[] = [];

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private opService: OperadoresService,
    private vehiService: VehiculosService,
    private activatedRouted: ActivatedRoute,
    private disposService: DispositivosService,
  ) {

  }

  ngOnInit(): void {
    const anioActual = new Date().getFullYear();
    const anioMinimo = 1980;
    for (let y = anioActual; y >= anioMinimo; y--) {
      this.anios.push(y);
    }
    this.obtenerOperadores()
    this.obtenerDispositivos()
    this.initForm()
    this.activatedRouted.params.subscribe(
      (params) => {
        this.idVehiculo = params['idVehiculo'];
        if (this.idVehiculo) {
          this.title = 'Actualizar Vehículo';
          this.obtenerVehiculoID();
        }
      }
    )
  }

  obtenerDispositivos() {
    this.loading = true;
    this.disposService.obtenerDispositivos().subscribe(
      (res: any) => {
        setTimeout(() => {
          this.loading = false;
        }, 2000)
        if (Array.isArray(res.dispositivos)) {
          this.listaDispositivos = res.dispositivos.sort((a, b) => b.Id - a.Id);
        } else {
          console.error('El formato de datos recibido no es el esperado.');
        }
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener dispositivos:', error);
      }
    );
  }

  obtenerOperadores() {
    this.loading = true;
    this.opService.obtenerOperadores().subscribe(
      (res: any) => {
        setTimeout(() => {
          this.loading = false;
        }, 2000)
        this.listaOperadores = res.operadores
          .map(op => ({
            ...op,
            FechaNacimiento: op.FechaNacimiento
              ? op.FechaNacimiento.split('T')[0]
              : ''
          }))
          .sort((a, b) => b.Id - a.Id);
      },
      (error) => {
        console.error('Error al obtener operadores:', error);
        this.loading = false;
      }
    );
  }

  obtenerVehiculoID() {
    this.vehiService.obtenerVehiculo(this.idVehiculo).subscribe(
      (response: any) => {
        this.vehiculosForm.patchValue({
          Marca: response.vehiculo.Marca,
          Modelo: response.vehiculo.Modelo,
          Ano: response.vehiculo.Ano,
          Placa: response.vehiculo.Placa,
          NumeroEconomico: response.vehiculo.NumeroEconomico,
          IdOperador: response.vehiculo.IdOperador,
          IdDispositivo: response.vehiculo.IdDispositivo,
        });
      }
    );
  }

  initForm() {
    this.vehiculosForm = this.fb.group({
      Marca: ['', Validators.required],
      Modelo: ['', Validators.required],
      Ano: ['', Validators.required],
      Placa: ['', Validators.required],
      NumeroEconomico: ['', Validators.required],
      IdOperador: ['', Validators.required],
      IdDispositivo: ['', Validators.required],
      Estatus: [1, Validators.required],
    });
  }

  submit() {
    this.submitButton = 'Cargando...';
    this.loading = true;
    if (this.idVehiculo) {
      this.actualizar();
    } else {
      this.agregar();
    }
  }

  agregar() {
    this.submitButton = 'Cargando...';
    this.loading = true;
    if (this.vehiculosForm.invalid) {
      this.submitButton = 'Guardar';
      this.loading = false;
      const etiquetas: any =
      {
        Marca: 'Marca',
        Modelo: 'Modelo',
        Ano: 'Año',
        Placa: 'Placa',
        NumeroEconomico: 'Número Económico',
        IdOperador: 'Operador',
        idVehiculo: 'Dispositivo',
      };

      const camposFaltantes: string[] = [];
      Object.keys(this.vehiculosForm.controls).forEach(key => {
        const control = this.vehiculosForm.get(key);
        if (control?.invalid && control.errors?.['required']) {
          camposFaltantes.push(etiquetas[key] || key);
        }
      });

      const lista = camposFaltantes.map((campo, index) => `
          <div style="padding: 8px 12px; border-left: 4px solid #d9534f;
                      background: #caa8a8; text-align: center; margin-bottom: 8px;
                      border-radius: 4px;">
            <strong style="color: #b02a37;">${index + 1}. ${campo}</strong>
          </div>
        `).join('');

      Swal.fire({
        title: '¡Faltan campos obligatorios!',
        background: '#22252f',
        html: `
            <p style="text-align: center; font-size: 15px; margin-bottom: 16px; color: white">
              Los siguientes <strong>campos obligatorios</strong> están vacíos.<br>
              Por favor complétalos antes de continuar:
            </p>
            <div style="max-height: 350px; overflow-y: auto;">${lista}</div>
          `,
        icon: 'error',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'swal2-padding swal2-border'
        }
      });
      return;
    }
    this.vehiculosForm.removeControl('id');
    this.vehiService.agregarVehiculo(this.vehiculosForm.value).subscribe(
      (response) => {
        this.submitButton = 'Guardar';
        this.loading = false;
        Swal.fire({
          title: '¡Operación Exitosa!',
          background: '#22252f',
          text: `Se agregó un nuevo vehículo de manera exitosa.`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Confirmar',
        });
        this.regresar();
      },
      (error) => {
        this.submitButton = 'Guardar';
        this.loading = false;
        Swal.fire({
          title: '¡Ops!',
          background: '#22252f',
          text: `Ocurrió un error al agregar el vehículo.`,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Confirmar',
        });
      }
    );
  }

  actualizar() {
    this.submitButton = 'Cargando...';
    this.loading = true;
    if (this.vehiculosForm.invalid) {
      this.submitButton = 'Guardar';
      this.loading = false;
      const etiquetas: any =
      {
        Marca: 'Marca',
        Modelo: 'Modelo',
        Ano: 'Año',
        Placa: 'Placa',
        NumeroEconomico: 'Número Económico',
        IdOperador: 'Operador',
        idVehiculo: 'Dispositivo',
      };

      const camposFaltantes: string[] = [];
      Object.keys(this.vehiculosForm.controls).forEach(key => {
        const control = this.vehiculosForm.get(key);
        if (control?.invalid && control.errors?.['required']) {
          camposFaltantes.push(etiquetas[key] || key);
        }
      });

      const lista = camposFaltantes.map((campo, index) => `
          <div style="padding: 8px 12px; border-left: 4px solid #d9534f;
                      background: #caa8a8; text-align: center; margin-bottom: 8px;
                      border-radius: 4px;">
            <strong style="color: #b02a37;">${index + 1}. ${campo}</strong>
          </div>
        `).join('');

      Swal.fire({
        title: '¡Faltan campos obligatorios!',
        background: '#22252f',
        html: `
            <p style="text-align: center; font-size: 15px; margin-bottom: 16px; color: white">
              Los siguientes <strong>campos obligatorios</strong> están vacíos.<br>
              Por favor complétalos antes de continuar:
            </p>
            <div style="max-height: 350px; overflow-y: auto;">${lista}</div>
          `,
        icon: 'error',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'swal2-padding swal2-border'
        }
      });
    }
    this.vehiService.actualizarVehiculo(this.idVehiculo, this.vehiculosForm.value).subscribe(
      (response) => {
        this.submitButton = 'Actualizar';
        this.loading = false;
        Swal.fire({
          title: '¡Operación Exitosa!',
          background: '#22252f',
          text: `Los datos del vehículo se actualizaron correctamente.`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Confirmar',
        });
        this.regresar();
      },
      (error) => {
        this.submitButton = 'Actualizar';
        this.loading = false;
        Swal.fire({
          title: '¡Ops!',
          background: '#22252f',
          text: `Ocurrió un error al actualizar el vehículo.`,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Confirmar',
        });
      }
    );
  }

  regresar() {
    this.route.navigateByUrl('/vehiculos');
  }

}
