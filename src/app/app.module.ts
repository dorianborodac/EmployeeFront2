import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DemoMaterialModule} from './material-module';
import {createCustomElement} from '@angular/elements';
import { EmployeeComponent } from './pages/employee/employee.component';
import { AddDialogComponent } from './pages/add-dialog/add-dialog.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {MatDialogModule} from '@angular/material/dialog';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    AddDialogComponent,

  ],
  imports: [
    FlexLayoutModule,
    FlexModule,
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    HttpClientModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    const employeePage = createCustomElement(EmployeeComponent, {injector: this.injector});
    customElements.define('employee-page', employeePage);
  }
}
