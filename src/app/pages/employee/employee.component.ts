import {Component, Inject, OnInit} from '@angular/core';
import {EmployeeService} from '../../@core/Service/employee.service';
import {EmployeeDTO} from '../../@core/DTO/EmployeeDTO';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddDialogComponent} from '../add-dialog/add-dialog.component';
import {catchError, filter} from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  public employees: EmployeeDTO[] = [];
  public form!: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getEmployees();
  }

  public async getEmployees(): Promise<void> {
    try {
      this.employees = await this.employeeService.getEmployee();
      console.log(this.employees);
    } catch (error) {
      console.log(error);
    }
  }

  // delete button + sweetalert2 module
  public async onDeleteEmployee(employeeId: number): Promise<void> {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.employeeService.deleteEmployee(employeeId);
          Swal.fire(
            'Deleted!',
            'Your card has been deleted.',
            'success'
          );
        } catch (error) {
          console.log(error);
        } finally {
          this.getEmployees();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your card is safe now. Be careful ^.^',
          'error'
        );
      }
    });
  }

  public async searchEmployees(key: string): Promise<void> {
    console.log(key);
    let results: EmployeeDTO[] = [];
    for (const employee of this.employees) {
        if (
          employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
          || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
          || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
          || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
          try {
            results.push(employee);
          } catch (error) {
            console.log(error);
          } finally {
            this.employees = results;
          }
        }
      }
    if (results.length === 0) {
      console.log(results);
      this.employees = [];
    }
    if (!key) {
      console.log(key);
      try {
        await this.getEmployees();
      } catch (error) {
        console.log(error);
      }
    }
    }

  async openDialog(employee?: EmployeeDTO): Promise<void> {
    this.dialog.open(AddDialogComponent, {data: employee}).afterClosed()
      .subscribe( async response => {
        console.log(response);
        this.employees = await this.employeeService.getEmployee();
      });
  }
}
