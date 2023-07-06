import { Component } from '@angular/core';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'glasstop-multi-fields-modal',
  templateUrl: './multi-fields-modal.component.html',
  styleUrls: ['./multi-fields-modal.component.scss'],
})
export class MultiFieldsModalComponent {
  public modalType = '';
  public errorMessage = '';
  public title: string = '';
  public body: string =
    'Are you sure you want to discard changes made on the page?';
  isIframeVisible = false;
  public canvasRotation = 0;
  modalRef?: BsModalRef;
  public subject = new Subject<any>();
  public modalContent: any = {};
  public toast: any;

  constructor(public bsModalRef: BsModalRef, public options: ModalOptions) {
    this.modalContent = this.options.initialState;
  }

  // Closes the modal
  public close() {
    this.subject.next({ status: false });
    this.bsModalRef.hide();
  }

  /**
   * Sends an image and upload status to a subject and close a modal.
   */
  public submit() {
    this.subject.next({ status: true });
    this.bsModalRef.hide();
  }

  /**
   * Method to confirm action on the dialog box.
   */
  public confirm() {
    this.subject.next({ status: true });
    this.bsModalRef.hide();
  }

  dispose() {
    this.bsModalRef.hide();
  }
}
