import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiFieldsModalComponent } from './multi-fields-modal.component';

describe('MultiFieldsModalComponent', () => {
  let component: MultiFieldsModalComponent;
  let fixture: ComponentFixture<MultiFieldsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiFieldsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiFieldsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
