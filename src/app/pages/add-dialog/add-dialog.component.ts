import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {EmployeeDTO} from '../../@core/DTO/EmployeeDTO';
import {EmployeeService} from '../../@core/Service/employee.service';
import {HttpErrorResponse} from '@angular/common/http';
import Swal from 'sweetalert2';
import {empty} from 'rxjs/internal/Observer';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent implements OnInit {
  public form!: FormGroup;
  public employees: EmployeeDTO = new EmployeeDTO();
  public actionBtn = 'Save';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDialogComponent>
  ) { }

  ngOnInit(): void {
    this.initForm(this.data);

    if (this.data) {
      this.actionBtn = 'Update';
    }
  }

  initForm(data?: EmployeeDTO): void {
    this.form = this.formBuilder.group({
      name: [data && data.name ? data.name : '', [Validators.required, Validators.pattern('[A-Za-z]{1,10} [A-Za-z]{1,10}')]],
      email: [data && data.email ? data.email : '', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      jobTitle: [data && data.jobTitle ? data.jobTitle : '', [Validators.required]],
      phone: [data && data.phone ? data.phone : '', [Validators.required, Validators.pattern('[0-9]{2}-[0-9]{3}-[0-9]{3}')]],
      imageUrl: [data && data.imageUrl ? data.imageUrl : '', [Validators.required, Validators.pattern('https://.*')]]
    }, );
  }

  public async onAddEmployee(employee?): Promise<void> {
    this.employees.name = this.form.get('name')?.value;
    this.employees.jobTitle = this.form.get('jobTitle')?.value;
    this.employees.email = this.form.get('email')?.value;
    this.employees.phone = this.form.get('phone')?.value;
    this.employees.imageUrl = this.form.get('imageUrl')?.value;

    if (!this.data) {
      if (this.form.valid) {
        try {
          const data = await this.employeeService.addEmployee(this.employees);
          await Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Your card has been added',
            showConfirmButton: false,
            timer: 1500
          });
          this.dialogRef.close();
        } catch (error) {
          console.log(error);
        } finally {
          this.form.reset();
        }
      }
    } else {
      this.employees.id = this.data.id;
      await this.onUpdateEmployee(this.employees);
    }
  }

  public async onUpdateEmployee(employee?): Promise<void> {
    try {
      const data = await this.employeeService.updateEmployee(employee);
      await Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Your card has been updated',
        showConfirmButton: false,
        timer: 1500
      });
      this.dialogRef.close(data);
    } catch (error) {
      console.log(error);
    } finally {
      this.form.reset();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  getError(controlName: string): string{
    if (controlName === 'name'){
      return 'Please insert Firstname(10c)_Lastname(10c)';
    } else if (controlName === 'jobTitle') {
      return 'Please insert valid jobTitle';
    } else if (controlName === 'email'){
      return 'Please insert valid email';
    } else if (controlName === 'phone') {
      return 'Please insert valid phone(xx-xxx-xxx)';
    } else if (controlName === 'imageUrl') {
      return 'Please insert valid imageUrl';
    }
    return 'Please insert valid field';
  }
}
