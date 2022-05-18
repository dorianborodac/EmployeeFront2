import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { interval} from 'rxjs';
import {EmployeeDTO} from '../DTO/EmployeeDTO';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getEmployee(): Promise<EmployeeDTO[]> {
    return ((this.http.get<EmployeeDTO[]>(`${this.apiServerUrl}/`))).toPromise();
  }

  public addEmployee(employee: EmployeeDTO): Promise<EmployeeDTO> {
    return ((this.http.post<EmployeeDTO>(`${this.apiServerUrl}/`, employee))).toPromise();
  }

  public updateEmployee(employee: EmployeeDTO): Promise<EmployeeDTO> {
    console.log(employee);
    return ((this.http.put<EmployeeDTO>(`${this.apiServerUrl}/`, employee))).toPromise();
  }

  public deleteEmployee(employeeId: number): Promise<void> {
    return ((this.http.delete<void>(`${this.apiServerUrl}/delete/${employeeId}`))).toPromise();
  }
}
