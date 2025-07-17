import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

@Component({
  selector: 'ib-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSettingsComponent {
  readonly isMaintenanceMode = signal(false);
  readonly pageTitle = signal('Application cannot be created at this moment');
  readonly pageDescription = signal('Please try again later');
  
  // Computed signal to determine if application creation is enabled
  readonly isApplicationCreationEnabled = computed(() => !this.isMaintenanceMode());
  
  toggleMaintenanceMode() {
    this.isMaintenanceMode.set(!this.isMaintenanceMode());
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