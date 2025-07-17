import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'ib-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSettingsComponent {
  readonly isApplicationCreationEnabled = signal(false);
  readonly pageTitle = signal('Welcome to Our Platform');
  readonly pageDescription = signal('Manage your applications and settings here');
  
  toggleApplicationCreation() {
    this.isApplicationCreationEnabled.set(!this.isApplicationCreationEnabled());
  }
  
  updateTitle(event: Event) {
    const target = event.target as HTMLInputElement;
    this.pageTitle.set(target.value);
  }
  
  updateDescription(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.pageDescription.set(target.value);
  }
} 