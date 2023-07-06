import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { apiAuthReslover } from './service/app-resolver.service';

const routes: Routes = [
  {
    path: 'employer-enrolment',
    loadChildren: () =>
      import('./shared/employer-enrolment/employer-enrolment.module').then(
        (m) => m.EmployerEnrolmentModule
      ),
    resolve: { auth: apiAuthReslover },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
