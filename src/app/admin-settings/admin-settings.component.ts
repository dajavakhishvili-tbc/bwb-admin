import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ib-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule]
})
export class AdminSettingsComponent {
  readonly isMaintenanceMode = signal(false);
  readonly pageTitle = signal('Application cannot be created at this moment');
  readonly pageDescription = signal('Please try again later');
  readonly isApplicationCreationEnabled = computed(() => !this.isMaintenanceMode());
  readonly maintenanceDescription = computed(() => 
    this.isMaintenanceMode() 
      ? 'Maintenance mode enabled - Application creation disabled' 
      : 'Normal mode - Application creation enabled'
  );
}
