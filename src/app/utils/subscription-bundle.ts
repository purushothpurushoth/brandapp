import { Subscription } from 'rxjs';

export class SubscriptionBundle {
  private subscriptions: Subscription[] = [];
  constructor(..._subscriptions: Subscription[]) {
    this.subscriptions = _subscriptions;
  }
  public unsubscribe(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
    this.subscriptions = [];
  }
  public add(..._subscriptions: Subscription[]): void {
    _subscriptions.forEach((sub) => {
      this.subscriptions.push(sub);
    });
  }
}
