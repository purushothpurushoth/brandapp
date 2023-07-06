import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTableComponent } from '../custom-components/data-table/data-table.component';
import { MultiFieldsModalComponent } from '../custom-components/multi-fields-modal/multi-fields-modal.component';
import { ToastComponent } from '../custom-components/toast/toast.component';
import { ToasterComponent } from '../custom-components/toaster/toaster.component';
import { CustomValidatorService } from '../service/custom-validator-service/custom-validator.service';

@NgModule({
  declarations: [
    MultiFieldsModalComponent,
    DataTableComponent,
    ToasterComponent,
    ToastComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  exports: [DataTableComponent, ToasterComponent],
  providers: [CustomValidatorService],
})
export class SharedModule {}
