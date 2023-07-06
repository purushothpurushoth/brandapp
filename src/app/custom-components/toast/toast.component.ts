import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Toast } from 'bootstrap';
import { fromEvent, take } from 'rxjs';
import { EVENT_TYPE } from 'src/app/app.constants';
import { TOASTER_TIMEOUT } from 'src/environments/environment';

@Component({
  selector: 'glasstop-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})

export class ToastComponent implements OnInit {
  public EVENT_TYPE = EVENT_TYPE;

  @Output() disposeEvent = new EventEmitter();

  @ViewChild('toastElement', { static: true })
  toastEl!: ElementRef;

  @Input()
  type!: string;

  @Input()
  isAutoHide: boolean = true;

  @Input()
  message!: string;

  toast!: Toast;

  ngOnInit() {
    this.show();
  }

  show() {
    this.toast = new Toast(this.toastEl.nativeElement, this.isAutoHide ? { delay: TOASTER_TIMEOUT } : { autohide: false });
    fromEvent(this.toastEl.nativeElement, 'hidden.bs.toast')
      .pipe(take(1))
      .subscribe(() => this.disposeEvent.emit());
    this.toast.show();
  }
}
