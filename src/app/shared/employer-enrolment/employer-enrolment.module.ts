import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerEnrolmentComponent } from './employer-enrolment.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';

const routes: Routes = [{ path: '', component: EmployerEnrolmentComponent }];

@NgModule({
  declarations: [EmployerEnrolmentComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class EmployerEnrolmentModule {}
