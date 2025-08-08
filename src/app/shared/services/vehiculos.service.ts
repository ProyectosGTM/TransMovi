import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  constructor(private http: HttpClient) { }

  obtenerVehiculos(): Observable<any> {
    return this.http.get<any>(`${environment.API_SECURITY}/api/vehiculos`);
  }

  agregarVehiculo(data: FormData) {
    return this.http.post(environment.API_SECURITY + '/api/vehiculos', data);
  }

  eliminarVehiculo(idVehiculo: Number) {
		return this.http.delete(environment.API_SECURITY + '/api/vehiculos/' + idVehiculo);
	}

  obtenerVehiculo(idVehiculo: number): Observable<any> {
		return this.http.get<any>(environment.API_SECURITY + '/api/vehiculos/' + idVehiculo);
	}

  actualizarVehiculo(idVehiculo: number, saveForm: any): Observable<any> {
    return this.http.put(`${environment.API_SECURITY}/api/vehiculos/` + idVehiculo, saveForm);
  }
  
}
