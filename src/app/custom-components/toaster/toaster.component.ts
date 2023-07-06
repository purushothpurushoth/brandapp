import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastEvent } from 'src/app/interfaces/app.interface';
import { ToastService } from 'src/app/service/toast-service/toast.service';

@Component({
  selector: 'glasstop-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {
  currentToasts: ToastEvent[] = [];

  constructor(private toastService: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscribeToToasts();
  }

  /**
   * @description Method to subscribe toast events and push toasts into the list
   */
  subscribeToToasts() {
    this.toastService.toastEvents.subscribe((toasts) => {
      const currentToast: ToastEvent = {
        type: toasts.type,
        message: toasts.message,
      };
      this.currentToasts.push(currentToast);
      this.cdr.detectChanges();
    });
  }

  /**
   * @description Method to remove toast from the list
   * @param {number} index 
   */
  dispose(index: number) {
    this.currentToasts.splice(index, 1);
    this.cdr.detectChanges();
  }
}
