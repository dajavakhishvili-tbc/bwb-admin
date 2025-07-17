import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  readonly isNavigationCollapsed = signal(false);

  toggleNavigation() {
    this.isNavigationCollapsed.update((collapsed) => !collapsed);
  }
}
