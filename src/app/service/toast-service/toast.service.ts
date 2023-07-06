import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EVENT_TYPE } from 'src/app/app.constants';
import { ToastEvent } from 'src/app/interfaces/app.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toastEvents: Observable<ToastEvent>;
  private _toastEvents = new Subject<ToastEvent>();

  constructor() {
    this.toastEvents = this._toastEvents.asObservable();
  }

  /**
   * @description Method to show success toaster.
   * @param {string} message 
   */
  showSuccessToast(message: string) {
    this._toastEvents.next({
      message,
      type: EVENT_TYPE.SUCCESS,
    });
  }

  /**
   * @description Method to show error toaster.
   * @param {string} message 
   */
  showErrorToast(message: string) {
    this._toastEvents.next({
      message,
      type: EVENT_TYPE.ERROR,
    });
  }
}