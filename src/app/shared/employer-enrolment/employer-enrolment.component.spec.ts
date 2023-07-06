import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerEnrolmentComponent } from './employer-enrolment.component';

describe('EmployerEnrolmentComponent', () => {
  let component: EmployerEnrolmentComponent;
  let fixture: ComponentFixture<EmployerEnrolmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerEnrolmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
