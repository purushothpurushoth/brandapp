import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IApiAuthTokenRes } from '../interfaces/app.interface';
import { EmployerEntrolmentService } from './employer-enrolment/employer-entrolment.service';

export const apiAuthReslover: ResolveFn<IApiAuthTokenRes> = () => {
  const cs = inject(EmployerEntrolmentService);
  const authCred = {
    userName: 'Glassdoor2023',
    password: 'Glassdoor2023',
  };
  return cs.getApiAuthToken(authCred);
};
