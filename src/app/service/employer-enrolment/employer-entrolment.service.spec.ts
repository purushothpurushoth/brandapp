import { TestBed } from '@angular/core/testing';

import { EmployerEntrolmentService } from './employer-entrolment.service';

describe('EmployerEntrolmentService', () => {
  let service: EmployerEntrolmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployerEntrolmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
